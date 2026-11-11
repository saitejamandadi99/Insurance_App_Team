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
import { Auth } from '../../../../services/Auth/auth';

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
    private toastServices: ToastService,
    private auth: Auth

  ) {}

  isLoading = false;
  PaymentStatus = PaymentStatus;
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
downloadPaymentReceipt(payment: PaymentResponseDto): void {

  // Allow only successful payments
  if (payment.paymentStatus !== PaymentStatus.Success) {
    this.toastServices.error(
      'Only successful payments can be downloaded.'
    );
    return;
  }

  const receiptWindow = window.open('', '_blank');

  if (!receiptWindow) {
    this.toastServices.error(
      'Please allow pop-ups to download the receipt.'
    );
    return;
  }

  // Get logged-in customer name
  const customerName = this.auth.getFullName() || 'Customer';

  // Prevent HTML injection
  const escapeHtml = (value: string | null | undefined): string =>
    String(value ?? 'N/A').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]!);

  const receiptDate = new Date().toLocaleDateString('en-IN');

  const receiptHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>InsuPro Payment Receipt</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f4f6f9;
          padding: 30px;
        }

        .receipt {
          max-width: 650px;
          margin: auto;
          padding: 30px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 10px;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #173b68;
          padding-bottom: 15px;
        }

        .header h1 {
          color: #173b68;
          margin-bottom: 5px;
        }

        .header p {
          color: #777;
        }

        h3 {
          text-align: center;
          margin: 25px 0;
        }

        .row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
          gap: 15px;
        }

        .amount {
          font-size: 20px;
          font-weight: bold;
          color: #173b68;
        }

        .success {
          color: green;
          font-weight: bold;
        }

        .footer {
          text-align: center;
          margin-top: 30px;
          color: #777;
        }

        button {
          display: block;
          margin: 25px auto 0;
          padding: 12px 25px;
          background: #173b68;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        @media print {
          body {
            background: white;
          }

          button {
            display: none;
          }

          .receipt {
            border: none;
          }
        }
      </style>
    </head>

    <body>

      <div class="receipt">

        <div class="header">
          <h1>InsuPro</h1>
          <p>Insurance Management System</p>
          <h2>Payment Receipt</h2>
        </div>

        <h3>Payment Information</h3>

        <div class="row">
          <strong>Customer Name</strong>
          <span>${escapeHtml(customerName)}</span>
        </div>

        <div class="row">
          <strong>Payment ID</strong>
          <span>${payment.paymentId}</span>
        </div>

        <div class="row">
          <strong>Policy Number</strong>
          <span>${escapeHtml(payment.policyNumber)}</span>
        </div>

        <div class="row">
          <strong>Transaction Reference</strong>
          <span>${escapeHtml(payment.transactionReference)}</span>
        </div>

        <div class="row">
          <strong>Payment Date</strong>
          <span>
            ${new Date(payment.paymentDate).toLocaleDateString('en-IN')}
          </span>
        </div>

        <div class="row">
          <strong>Payment Mode</strong>
          <span>${escapeHtml(this.formatPaymentMode(payment.paymentMode))}</span>
        </div>

        <div class="row">
          <strong>Amount Paid</strong>
          <span class="amount">
            ${payment.amount.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR'
            })}
          </span>
        </div>

        <div class="row">
          <strong>Payment Status</strong>
          <span class="success">Successful</span>
        </div>

        <div class="row">
          <strong>Receipt Generated On</strong>
          <span>${receiptDate}</span>
        </div>

        <div class="footer">
          <h4>Thank you for choosing InsuPro!</h4>
          <p>This is a computer-generated payment receipt.</p>
        </div>

        <button onclick="window.print()">
          Download / Save as PDF
        </button>

      </div>

    </body>
    </html>
  `;

  receiptWindow.document.write(receiptHtml);
  receiptWindow.document.close();
}
 

    
        
}
