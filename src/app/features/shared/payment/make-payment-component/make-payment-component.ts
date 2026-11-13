
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';

import { ToastService } from '../../../../services/Toast/toast-service';
import { PremiumPaymentServices } from '../../../../services/PremiumPayment/premium-payment-services';
import { Policy } from '../../../../services/Policy/policy';

import { PaymentRequestDto } from '../../../../DTO/PaymentRequestDto';
import { SuccessResponseDto } from '../../../../DTO/SuccessResponseDto';
import { PaymentResponseDto } from '../../../../DTO/PaymentResponseDto';
import { PolicyResponseDto } from '../../../../DTO/PolicyResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';

import { PaymentMode } from '../../../../Enums/PaymentMode';
import { Role } from '../../../../Enums/Role';

@Component({
  selector: 'app-make-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    PageHeader,
    LoadingSpinner,
    StatusBadge
  ],
  templateUrl: './make-payment-component.html',
  styleUrl: './make-payment-component.css'
})
export class MakePaymentComponent implements OnInit {

  PaymentMode = PaymentMode;

  policyId = 0;
  policy: PolicyResponseDto | null = null;

  loading = false;
  submitting = false;

  errorMessage = '';
  successMessage = '';

  paymentForm = new FormGroup({

    paymentMode: new FormControl<PaymentMode | null>(
      null,
      Validators.required
    ),

    // UPI
    upiId: new FormControl('', [
      Validators.pattern(/^[\w.-]{2,256}@[a-zA-Z]{2,64}$/)
    ]),

    upiApp: new FormControl(''),

    // Card
    cardHolderName: new FormControl('', [
      Validators.pattern(/^[a-zA-Z ]+$/)
    ]),

    cardNumber: new FormControl('', [
      Validators.pattern(/^[0-9 ]{13,23}$/)
    ]),

    expiryDate: new FormControl('', [
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
    ]),

    cvv: new FormControl('', [
      Validators.pattern(/^\d{3,4}$/)
    ]),

    // Net Banking
    bankName: new FormControl(''),
    accountHolderName: new FormControl(''),
    accountNumber: new FormControl(''),
    confirmAccountNumber: new FormControl(''),
    ifscCode: new FormControl('')
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly paymentService: PremiumPaymentServices,
    private readonly policyService: Policy,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('policyId');
    const id = Number(idParam);

    if (
      !idParam ||
      !Number.isInteger(id) ||
      id <= 0
    ) {
      this.errorMessage = 'Invalid policy ID.';
      return;
    }

    this.policyId = id;

    this.paymentMode.valueChanges.subscribe(mode => {
      this.updatePaymentValidators(mode);
    });

    this.paymentForm.controls.bankName.valueChanges.subscribe(bankName => {
      this.updateBankAccountValidators(bankName);
    });

    this.loadPolicy();
  }

  // Payment Mode Getter
  get paymentMode(): FormControl<PaymentMode | null> {
    return this.paymentForm.controls.paymentMode;
  }

  // Check whether account numbers match
  get accountNumbersDoNotMatch(): boolean {

    const controls = this.paymentForm.controls;

    const accountNumber = controls.accountNumber.value;
    const confirmAccountNumber = controls.confirmAccountNumber.value;

    return !!accountNumber &&
      !!confirmAccountNumber &&
      accountNumber !== confirmAccountNumber;
  }

  // Load Policy Details
  loadPolicy(): void {

    this.loading = true;
    this.errorMessage = '';

    this.policyService.getPolicyById(this.policyId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: (response: SuccessResponseDto<PolicyResponseDto>) => {
          this.policy = response.data;
        },

        error: (error: HttpErrorResponse) => {

          const apiError = error.error as ErrorResponseDto;

          this.errorMessage =
            apiError?.message ??
            'Unable to load policy details.';

          this.toastService.error(this.errorMessage);
        }
      });
  }

  // Dynamic Payment Validation
  updatePaymentValidators(mode: PaymentMode | null): void {

    const controls = this.paymentForm.controls;

    // Clear existing validators
    controls.upiId.clearValidators();
    controls.upiApp.clearValidators();

    controls.cardHolderName.clearValidators();
    controls.cardNumber.clearValidators();
    controls.expiryDate.clearValidators();
    controls.cvv.clearValidators();

    controls.bankName.clearValidators();

    controls.accountHolderName.clearValidators();
    controls.accountNumber.clearValidators();
    controls.confirmAccountNumber.clearValidators();
    controls.ifscCode.clearValidators();

    // Clear previous payment details
    controls.upiId.reset('', { emitEvent: false });
    controls.upiApp.reset('', { emitEvent: false });

    controls.cardHolderName.reset('', { emitEvent: false });
    controls.cardNumber.reset('', { emitEvent: false });
    controls.expiryDate.reset('', { emitEvent: false });
    controls.cvv.reset('', { emitEvent: false });

    controls.bankName.reset('', { emitEvent: false });

    controls.accountHolderName.reset('', { emitEvent: false });
    controls.accountNumber.reset('', { emitEvent: false });
    controls.confirmAccountNumber.reset('', { emitEvent: false });
    controls.ifscCode.reset('', { emitEvent: false });

    // UPI
    if (mode === PaymentMode.UPI) {

      controls.upiId.setValidators([
        Validators.required,
        Validators.pattern(/^[\w.-]{2,256}@[a-zA-Z]{2,64}$/)
      ]);

      controls.upiApp.setValidators([
        Validators.required
      ]);
    }

    // Card
    else if (mode === PaymentMode.Card) {

      controls.cardHolderName.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/)
      ]);

      controls.cardNumber.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9 ]{13,23}$/)
      ]);

      controls.expiryDate.setValidators([
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
      ]);

      controls.cvv.setValidators([
        Validators.required,
        Validators.pattern(/^\d{3,4}$/)
      ]);
    }

    // Net Banking
    else if (mode === PaymentMode.Net_Banking) {

      controls.bankName.setValidators([
        Validators.required
      ]);

      this.updateBankAccountValidators(controls.bankName.value);
    }

    // Refresh validation
    Object.values(controls).forEach(control => {
      control.updateValueAndValidity({
        emitEvent: false
      });
    });

    this.cdr.detectChanges();
  }

  // Validate bank account details after bank selection
  updateBankAccountValidators(bankName: string | null): void {

    const controls = this.paymentForm.controls;

    if (bankName) {

      controls.accountHolderName.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/)
      ]);

      controls.accountNumber.setValidators([
        Validators.required,
        Validators.pattern(/^\d{9,18}$/)
      ]);

      controls.confirmAccountNumber.setValidators([
        Validators.required,
        Validators.pattern(/^\d{9,18}$/)
      ]);

      controls.ifscCode.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/i)
      ]);

    } else {

      controls.accountHolderName.clearValidators();
      controls.accountNumber.clearValidators();
      controls.confirmAccountNumber.clearValidators();
      controls.ifscCode.clearValidators();

      controls.accountHolderName.reset('', { emitEvent: false });
      controls.accountNumber.reset('', { emitEvent: false });
      controls.confirmAccountNumber.reset('', { emitEvent: false });
      controls.ifscCode.reset('', { emitEvent: false });
    }

    controls.accountHolderName.updateValueAndValidity({ emitEvent: false });
    controls.accountNumber.updateValueAndValidity({ emitEvent: false });
    controls.confirmAccountNumber.updateValueAndValidity({ emitEvent: false });
    controls.ifscCode.updateValueAndValidity({ emitEvent: false });

    this.cdr.detectChanges();
  }

  // Make Payment
  makePayment(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.submitting) {
      return;
    }

    // Identify logged-in role
    const role = localStorage.getItem('role');

    const isCustomer = role === Role.Customer.toString();
    const isAdmin = role === Role.Admin.toString();
    const isOfficer = role === Role.Officer.toString();

    if (!isCustomer && !isAdmin && !isOfficer) {

      this.toastService.error(
        'You are not authorized to make payments.'
      );

      return;
    }

    if (!this.policy) {

      this.errorMessage = 'Policy details are not available.';
      return;
    }

    if (this.paymentForm.invalid) {

      this.paymentForm.markAllAsTouched();

      this.errorMessage =
        'Please select a payment method and enter the required details.';

      this.toastService.error(this.errorMessage);

      return;
    }

    const selectedMode = this.paymentMode.value;

    if (!selectedMode) {

      this.errorMessage = 'Please select a payment method.';
      return;
    }

    // Validate matching account numbers
    if (
      selectedMode === PaymentMode.Net_Banking &&
      this.accountNumbersDoNotMatch
    ) {

      this.paymentForm.controls.confirmAccountNumber.markAsTouched();

      this.errorMessage = 'Account numbers do not match.';

      this.toastService.error(this.errorMessage);

      return;
    }

    // Existing backend DTO contract
    const request: PaymentRequestDto = {
      policyId: this.policyId,
      paymentMode: selectedMode
    };

    // Select endpoint according to logged-in role
    const paymentRequest$ = isCustomer
      ? this.paymentService.makeMyPayment(request)
      : this.paymentService.makeOfficerPayment(request);

    this.submitting = true;

    paymentRequest$
      .pipe(
        finalize(() => {
          this.submitting = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: (response: SuccessResponseDto<PaymentResponseDto>) => {

          this.successMessage =
            response.message ??
            'Payment completed successfully.';

          this.toastService.success(this.successMessage);

          if (isCustomer) {
            this.router.navigate(['/mypayments']);
          } else {
            this.router.navigate(['/viewpayments']);
          }
        },

        error: (error: HttpErrorResponse) => {

          const apiError = error.error as ErrorResponseDto;

          this.errorMessage =
            apiError?.message ??
            'Payment failed. Please try again.';

          this.toastService.error(this.errorMessage);
        }
      });
  }

  // Go Back
  goBack(): void {
    this.router.navigate(['/mypolicies']);
  }
}
