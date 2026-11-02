import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
FormControl,
FormGroup,
ReactiveFormsModule,
Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

paymentModes = Object.values(PaymentMode);

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
bankName: new FormControl('')
});

constructor(
private readonly route: ActivatedRoute,
private readonly router: Router,
private readonly paymentService: PremiumPaymentServices,
private readonly policyService: Policy,
private readonly toastService: ToastService,
private readonly cdr: ChangeDetectorRef
) {}

// Initialize Component
ngOnInit(): void {
const role = localStorage.getItem('role');

if (role !== Role.Customer.toString()) {

  this.toastService.error(
    'Only customers are allowed to make payments.'
  );

  this.router.navigate(['/unauthorized']);
  return;
}

const id = Number(
  this.route.snapshot.paramMap.get('policyId')
);

if (!Number.isInteger(id) || id <= 0) {

  this.errorMessage = 'Invalid policy ID.';
  return;
}

this.policyId = id;

this.paymentMode.valueChanges.subscribe(mode => {
  this.updatePaymentValidators(mode);
});

this.loadPolicy();
}

// Payment Mode Getter
get paymentMode(): FormControl<PaymentMode | null> {
return this.paymentForm.controls.paymentMode;
}

// Load Policy Details
loadPolicy(): void {
this.loading = true;
this.errorMessage = '';

this.policyService.getPolicyById(this.policyId).subscribe({

  next: (response: SuccessResponseDto<PolicyResponseDto>) => {

    this.policy = response.data;
    this.loading = false;

    this.cdr.detectChanges();
  },

  error: (error: HttpErrorResponse) => {

    this.loading = false;

    this.errorMessage =
      error.error?.message ??
      'Unable to load policy details.';

    this.cdr.detectChanges();
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

// Reset previous payment details
controls.upiId.reset('', { emitEvent: false });
controls.upiApp.reset('', { emitEvent: false });

controls.cardHolderName.reset('', { emitEvent: false });
controls.cardNumber.reset('', { emitEvent: false });
controls.expiryDate.reset('', { emitEvent: false });
controls.cvv.reset('', { emitEvent: false });

controls.bankName.reset('', { emitEvent: false });

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
}

// Refresh validation
Object.values(controls).forEach(control => {

  control.updateValueAndValidity({
    emitEvent: false
  });
});

this.cdr.detectChanges();
}

// Make Payment - Customer Only
makePayment(): void {

this.errorMessage = '';
this.successMessage = '';

const role = localStorage.getItem('role');

if (role !== Role.Customer.toString()) {

  this.toastService.error(
    'Only customers can make payments.'
  );

  return;
}

if (this.paymentForm.invalid) {

  this.paymentForm.markAllAsTouched();
  return;
}

if (!this.policy) {

  this.errorMessage =
    'Policy details are not available.';

  return;
}

const selectedMode = this.paymentMode.value;

if (!selectedMode) {

  this.errorMessage =
    'Please select a payment method.';

  return;
}

const request: PaymentRequestDto = {

  policyId: this.policyId,
  paymentMode: selectedMode

};

this.submitting = true;

this.paymentService.makeMyPayment(request).subscribe({

  next: (response: SuccessResponseDto<PaymentResponseDto>) => {

    this.submitting = false;

    this.successMessage =
      response.message ??
      'Payment completed successfully.';

    this.toastService.success(this.successMessage);

    this.cdr.detectChanges();

    this.router.navigate(['/mypayments']);
  },

  error: (error: HttpErrorResponse) => {

    this.submitting = false;

    this.errorMessage =
      error.error?.message ??
      'Payment failed. Please try again.';

    this.toastService.error(this.errorMessage);

    this.cdr.detectChanges();
  }
});
}

// Go Back
goBack(): void {
this.router.navigate(['/mypolicies']);


}
}
