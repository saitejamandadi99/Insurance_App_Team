import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule,Validators}from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { ToastService } from '../../../../services/Toast/toast-service';
import { PremiumPaymentServices } from '../../../../services/PremiumPayment/premium-payment-services';
import { PolicyServices } from '../../../../services/Policy/policy';
import { PaymentRequestDto } from '../../../../DTO/PaymentRequestDto';
import { SuccessResponseDto } from '../../../../DTO/SuccessResponseDto';
import { PaymentResponseDto } from '../../../../DTO/PaymentResponseDto';
import { PolicyResponseDto } from '../../../../DTO/PolicyResponseDto';
import { PaymentMode } from '../../../../Enums/PaymentMode';
import { Role } from '../../../../Enums/Role';

@Component({
selector: 'app-make-payment',
standalone: true,
imports: [CommonModule,ReactiveFormsModule,CurrencyPipe,DatePipe,PageHeader,LoadingSpinner,StatusBadge],
templateUrl: './make-payment-component.html',
styleUrl: './make-payment-component.css'
})
export class MakePaymentComponent implements OnInit {
policyId = 0;
policy: PolicyResponseDto | null = null;

loading = false;
submitting = false;
errorMessage = '';
successMessage = '';

paymentModes = Object.values(PaymentMode).filter(
(value): value is PaymentMode =>
typeof value === 'number'
);

paymentForm = new FormGroup({
paymentMode: new FormControl<PaymentMode | null>(
null,
Validators.required
)
});

constructor(
private readonly route: ActivatedRoute,
private readonly router: Router,
private readonly paymentService: PremiumPaymentServices,
private readonly policyService: PolicyServices,
private readonly toastService: ToastService,
private readonly cdr: ChangeDetectorRef
) {}

ngOnInit(): void {
const id = Number(this.route.snapshot.paramMap.get('policyId'));

if (!Number.isInteger(id) || id <= 0) {
  this.errorMessage = 'Invalid policy ID.';
  return;
}

this.policyId = id;
this.loadPolicy();
}

get paymentMode(): FormControl<PaymentMode | null> {
return this.paymentForm.controls.paymentMode;
}

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
      error.error?.message ?? 'Unable to load policy details.';
    this.cdr.detectChanges();
  }
});
}

makePayment(): void {
this.errorMessage = '';
this.successMessage = '';
if (this.paymentForm.invalid) {
  this.paymentForm.markAllAsTouched();
  return;
}

if (!this.policy) {
  this.errorMessage = 'Policy details are not available.';
  return;
}

const request: PaymentRequestDto = {
  policyId: this.policyId,
  paymentMode: this.paymentMode.value!
};

this.submitting = true;

const role = localStorage.getItem('role');

const paymentRequest$ =
  role === Role.Customer.toString()
    ? this.paymentService.makeMyPayment(request)
    : role === Role.Admin.toString() ||
        role === Role.Officer.toString()
      ? this.paymentService.makeOfficerPayment(request)
      : null;

if (!paymentRequest$) {
  this.submitting = false;
  this.errorMessage = 'You are not authorized to make a payment.';
  return;
}

paymentRequest$.subscribe({
  next: (response: SuccessResponseDto<PaymentResponseDto>) => {
    this.submitting = false;
    this.successMessage =
      response.message ?? 'Payment completed successfully.';

    this.toastService.success(this.successMessage);
    this.cdr.detectChanges();

    if (role === Role.Customer.toString()) {
      this.router.navigate(['/mypayments']);
    } else {
      this.router.navigate(['/viewpayments']);
    }
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

goBack(): void {
this.router.navigate(['/mypolicies']);
}
}
