import { CurrencyPipe, DatePipe, NgIf, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';

import { PremiumPaymentServices } from '../../../../services/PremiumPayment/premium-payment-services';
import { PaymentResponseDto } from '../../../../DTO/PaymentResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { ToastService } from '../../../../services/Toast/toast-service';
@Component({
selector: 'app-view-my-payments-component',
standalone: true,
imports: [
NgIf,
NgFor,
CurrencyPipe,
DatePipe,
PageHeader,
LoadingSpinner,
EmptyState,
StatusBadge
],
templateUrl: './view-my-payments.html',
styleUrl: './view-my-payments.css',
})
export class ViewMyPaymentsComponent implements OnInit {

constructor(
private paymentService: PremiumPaymentServices,
private cdr: ChangeDetectorRef,
private toastServices: ToastService
) {}

isLoading = false;

payments: PaymentResponseDto[] = [];

currentPage = 1;
pageSize = 10;
totalRecords = 0;
totalPages = 0;
isLastPage = true;

loadPayments(): void {
this.isLoading = true;
this.paymentService.getMyPayments(
  this.currentPage,
  this.pageSize,
  'paymentDate',
  'desc'
).subscribe({
  next: (response) => {
    const result = response.data;

    // Support the paginated response returned by the backend.
    this.payments = result?.records ?? [];

    this.currentPage = result?.currentPage ?? this.currentPage;
    this.pageSize = result?.pageSize ?? this.pageSize;
    this.totalRecords = result?.totalRecords ?? 0;
    this.totalPages = result?.totalPages ?? 0;
    this.isLastPage = result?.isLastPage ?? true;

    this.isLoading = false;
    this.cdr.detectChanges();
  },
  error: (err: HttpErrorResponse) => {
    this.isLoading = false;

    const apiError = err.error as ErrorResponseDto;

    this.toastServices.error(
      apiError?.message ?? 'Unable to load your payment history.'
    );

    this.cdr.detectChanges();
  }
});
}

ngOnInit(): void {
this.loadPayments();
}

goToPreviousPage(): void {
if (this.currentPage > 1) {
this.currentPage--;
this.loadPayments();
}
}

goToNextPage(): void {
if (!this.isLastPage && this.currentPage < this.totalPages) {
this.currentPage++;
this.loadPayments();
}
}

trackByPaymentId(
index: number,
payment: PaymentResponseDto
): number {
return payment.paymentId;
}

formatPaymentMode(mode: string | number): string {
if (typeof mode === 'number') {
return ['Cash', 'Card', 'UPI', 'Net Banking'][mode] ?? 'Other';
}
return mode || 'N/A';

}

formatPaymentStatus(status: string | number): string {
if (typeof status === 'number') {
const statuses = ['Pending', 'Successful', 'Failed'];
return statuses[status] ?? 'Unknown';
}
return status
  ? status.replace(/([a-z])([A-Z])/g, '$1 $2')
  : 'Unknown';

}
}
