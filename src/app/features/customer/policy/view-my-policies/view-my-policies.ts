
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { PolicyStatus } from '../../../../Enums/PolicyStatus';
import { PolicyResponseDto } from '../../../../DTO/PolicyResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { ToastService } from '../../../../services/Toast/toast-service';
import { Policy } from '../../../../services/Policy/policy';
import { Auth } from '../../../../services/Auth/auth';

@Component({
  imports: [DatePipe, CurrencyPipe, NgClass, FormsModule],
  standalone: true,
  selector: 'app-view-my-policies',
  styleUrl: './view-my-policies.css',
  templateUrl: './view-my-policies.html',
})
export class ViewMyPolicies implements OnInit {

  lstMyPolicies: PolicyResponseDto[] = [];
  isLoading = false;

  searchTerm = '';
  selectedStatus: string = 'All';

  currentPage = 1;
  pageSize = 5;

  PolicyStatus = PolicyStatus;

  constructor(
    private policyService: Policy,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastServices: ToastService,
    private auth: Auth

  ) {}

  ngOnInit(): void {
    this.loadMyPolicies();
  }

  // Load Customer Policies

  loadMyPolicies(): void {
    this.isLoading = true;

    this.policyService.getMyPolicies().subscribe({
      next: (response) => {
        this.lstMyPolicies = response.data ?? [];
        this.isLoading = false;
        this.currentPage = 1;

        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastServices.error(
          apiError?.message ?? 'Unable to load your policies.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Search and Status Filtering

  get filteredPolicies(): PolicyResponseDto[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.lstMyPolicies.filter(policy => {

      const matchesSearch =
        !search ||
        policy.policyNumber?.toLowerCase().includes(search) ||
        policy.planName?.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        policy.policyStatus === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  // Pagination

  get totalPages(): number {
    return Math.ceil(this.filteredPolicies.length / this.pageSize);
  }

  get paginatedPolicies(): PolicyResponseDto[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredPolicies.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  get startRecord(): number {
    return this.filteredPolicies.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredPolicies.length
    );
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'All';
    this.currentPage = 1;
  }

  // Status Badge Styling

  getStatusClass(status: PolicyStatus | string): string {
    switch (status) {
      case PolicyStatus.Active:
        return 'status-active';

      case PolicyStatus.PendingPayment:
        return 'status-pending';

      case PolicyStatus.Expired:
        return 'status-expired';

      case PolicyStatus.Cancelled:
        return 'status-cancelled';

      default:
        return 'status-default';
    }
  }

  // Payment Eligibility

  canMakePayment(policy: PolicyResponseDto): boolean {

    // Initial payment for a newly purchased policy.
    // The backend must still validate the payment deadline.
    if (policy.policyStatus === PolicyStatus.PendingPayment) {
      return true;
    }

    // Do not allow payments for expired or cancelled policies.
    if (
      policy.policyStatus === PolicyStatus.Expired ||
      policy.policyStatus === PolicyStatus.Cancelled
    ) {
      return false;
    }

    // Recurring payments are allowed only for active policies.
    if (
      policy.policyStatus !== PolicyStatus.Active ||
      !policy.dueDate
    ) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(policy.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const paymentWindowStart = new Date(dueDate);
    paymentWindowStart.setDate(paymentWindowStart.getDate() - 5);

    return today >= paymentWindowStart && today <= dueDate;
  }
// Download Policy Receipt

downloadPolicy(policy: PolicyResponseDto): void {

  const customerName = this.auth.getFullName() || 'Customer';

  const receiptWindow = window.open('', '_blank');

  if (!receiptWindow) {
    this.toastServices.error(
      'Unable to open policy document. Please allow pop-ups.'
    );
    return;
  }

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount ?? 0);
  };

  const escapeHtml = (value: unknown): string => {
    return String(value ?? 'N/A').replace(/[&<>"']/g, char => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };

      return entities[char];
    });
  };

  const receiptHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Policy Document - ${escapeHtml(policy.policyNumber)}</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f4f7fb;
          padding: 30px;
          color: #333;
        }

        .receipt {
          max-width: 750px;
          margin: auto;
          background: white;
          padding: 35px;
          border: 1px solid #ddd;
          border-radius: 10px;
        }

        .header {
          text-align: center;
          border-bottom: 3px solid #198754;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }

        .header h1 {
          color: #198754;
          margin-bottom: 5px;
        }

        .header p {
          color: #666;
        }

        h2 {
          text-align: center;
          margin-bottom: 25px;
        }

        .details {
          width: 100%;
          border-collapse: collapse;
        }

        .details td {
          padding: 13px;
          border-bottom: 1px solid #eee;
        }

        .details td:first-child {
          font-weight: bold;
          width: 40%;
          color: #555;
        }

        .status {
          color: #198754;
          font-weight: bold;
        }

        .footer {
          text-align: center;
          margin-top: 35px;
          color: #777;
          font-size: 12px;
        }

        .print-button {
          display: block;
          margin: 25px auto 0;
          padding: 12px 25px;
          background: #198754;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
        }

        @media print {
          body {
            background: white;
            padding: 0;
          }

          .receipt {
            border: none;
            box-shadow: none;
          }

          .print-button {
            display: none;
          }
        }
      </style>
    </head>

    <body>

      <div class="receipt">

        <div class="header">
          <h1>InsuPro</h1>
          <p>Insurance Management System</p>
        </div>

        <h2>INSURANCE POLICY DOCUMENT</h2>

        <table class="details">

          <tr>
            <td>Customer Name</td>
            <td>${escapeHtml(customerName)}</td>
          </tr>

          <tr>
            <td>Policy Number</td>
            <td>${escapeHtml(policy.policyNumber)}</td>
          </tr>

          <tr>
            <td>Policy ID</td>
            <td>${escapeHtml(policy.policyId)}</td>
          </tr>

          <tr>
            <td>Plan Name</td>
            <td>${escapeHtml(policy.planName)}</td>
          </tr>

          <tr>
            <td>Policy Status</td>
            <td class="status">${escapeHtml(policy.policyStatus)}</td>
          </tr>

          <tr>
            <td>Premium Amount</td>
            <td>${formatAmount(policy.premiumAmount)}</td>
          </tr>

          <tr>
            <td>Coverage Amount</td>
            <td>${formatAmount(policy.coverageAmount)}</td>
          </tr>

          <tr>
            <td>Total Premium Paid</td>
            <td>${formatAmount(policy.totalPremiumPaid)}</td>
          </tr>

          <tr>
            <td>Policy Start Date</td>
            <td>${formatDate(policy.startDate)}</td>
          </tr>

          <tr>
            <td>Policy End Date</td>
            <td>${formatDate(policy.endDate)}</td>
          </tr>

          <tr>
            <td>Next Premium Due Date</td>
            <td>${formatDate(policy.dueDate)}</td>
          </tr>

        </table>

        <div class="footer">
          <p>This document contains your insurance policy details.</p>
          <p>Generated by InsuPro Insurance Management System.</p>
        </div>

        <button class="print-button" onclick="window.print()">
          Download / Save as PDF
        </button>

      </div>

    </body>
    </html>
  `;

  receiptWindow.document.open();
  receiptWindow.document.write(receiptHtml);
  receiptWindow.document.close();
}
  // Navigation

  navigateToPurchasePolicy(): void {
    this.router.navigate(['/viewplans']);
  }

  navigateToMakePayment(policyId: number): void {
    this.router.navigate(['/makepayment', policyId]);
  }

  navigateToRaiseClaim(policyId: number): void {
    this.router.navigate(['/raiseclaim', policyId]);
  }
}
