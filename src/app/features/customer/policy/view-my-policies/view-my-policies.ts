
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
    private toastServices: ToastService
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
