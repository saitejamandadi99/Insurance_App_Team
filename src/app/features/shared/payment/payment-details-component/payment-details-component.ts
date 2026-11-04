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
import { Role } from '../../../../Enums/Role';

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

paymentId = 0;

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
// Only Admin and Officer can access this generic payment details API.
const role = localStorage.getItem('role');

if (
  role !== Role.Admin.toString() &&
  role !== Role.Officer.toString()
) {
  this.toastService.error(
    'You are not authorized to view these payment details.'
  );

  this.router.navigate(['/unauthorized']);
  return;
}

// Read payment ID from route
const id = Number(
  this.activatedRoute.snapshot.paramMap.get('paymentId')
);

if (!Number.isInteger(id) || id <= 0) {

  this.errorMessage = 'Invalid payment ID.';

  this.toastService.error(this.errorMessage);

  this.navigateBack();
  return;
}

this.paymentId = id;

this.loadPayment();
}

// Load Payment Details
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

// Navigate Back
navigateBack(): void {
const role = localStorage.getItem('role');

if (role === Role.Admin.toString() ||
    role === Role.Officer.toString()) {

  this.router.navigate(['/viewpayments']);

} else {

  this.router.navigate(['/unauthorized']);
}
}
}
