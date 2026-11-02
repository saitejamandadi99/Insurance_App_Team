import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PremiumPaymentServices } from '../../../../services/PremiumPayment/premium-payment-services';
import { PaymentResponseDto } from '../../../../DTO/PaymentResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { ToastService } from '../../../../services/Toast/toast-service';

@Component({
selector: 'app-payment-details-component',
standalone: true,
imports: [
NgIf,
DatePipe,
CurrencyPipe,
PageHeader,
LoadingSpinner,
StatusBadge
],
templateUrl: './payment-details-component.html',
styleUrl: './payment-details-component.css'
})
export class PaymentDetailsComponent implements OnInit {

paymentId!: number;
payment: PaymentResponseDto | null = null;
isLoading = false;
errorMessage = '';

constructor(
private readonly paymentService: PremiumPaymentServices,
private readonly activatedRoute: ActivatedRoute,
private readonly router: Router,
private readonly cdr: ChangeDetectorRef,
private readonly toastService: ToastService
) {}

ngOnInit(): void {
const id = Number(
this.activatedRoute.snapshot.paramMap.get('paymentId')
);
if (!Number.isInteger(id) || id <= 0) {
  this.toastService.error('Invalid payment ID.');
  this.navigateBack();
  return;
}

this.paymentId = id;
this.loadPayment();
}

loadPayment(): void {
this.isLoading = true;
this.errorMessage = '';
this.paymentService.getPaymentById(this.paymentId).subscribe({
  next: (response) => {
    this.payment = response.data;
    this.isLoading = false;
    this.cdr.detectChanges();
  },

  error: (err: HttpErrorResponse) => {
    this.isLoading = false;

    const apiError = err.error as ErrorResponseDto;

    this.errorMessage =
      apiError?.message ??
      err.message ??
      'Unable to load payment details.';

    this.toastService.error(this.errorMessage);
    this.cdr.detectChanges();
  }
});
}
navigateBack(): void {
this.router.navigate(['/viewpayments']);
}
}
