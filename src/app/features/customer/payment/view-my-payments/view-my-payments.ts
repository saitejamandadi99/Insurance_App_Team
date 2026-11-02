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

import { PaymentMode } from '../../../../Enums/PaymentMode';
import { PaymentStatus } from '../../../../Enums/PaymentStatus';

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
  styleUrl: './view-my-payments.css'
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

  ngOnInit(): void {
    this.loadPayments();
  }

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

  formatPaymentMode(mode: PaymentMode): string {
    const modes: Record<PaymentMode, string> = {
      [PaymentMode.UPI]: 'UPI',
      [PaymentMode.Card]: 'Card',
      [PaymentMode.Net_Banking]: 'Net Banking',
      [PaymentMode.Cash]: 'Cash'
    };

    return modes[mode] ?? 'Other';
  }

  formatPaymentStatus(status: PaymentStatus): string {
    const statuses: Record<PaymentStatus, string> = {
      [PaymentStatus.Pending]: 'Pending',
      [PaymentStatus.Success]: 'Successful',
      [PaymentStatus.Failed]: 'Failed'
    };

    return statuses[status] ?? 'Unknown';
  }
}
