
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { Claim } from '../../../../services/Claim/claim';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { ClaimResponseDto } from '../../../../DTO/ClaimResponseDto';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CurrencyPipe, DatePipe, NgClass, FormsModule],
  standalone: true,
  selector: 'app-view-my-claims-component',
  styleUrl: './view-my-claims-component.css',
  templateUrl: './view-my-claims-component.html',
})
export class ViewMyClaimsComponent implements OnInit {

  lstMyClaims: ClaimResponseDto[] = [];
  isLoading = false;

  searchTerm = '';
  selectedStatus = 'All';

  currentPage = 1;
  pageSize = 5;

  constructor(
    private claimService: Claim,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMyClaims();
  }

  loadMyClaims(): void {
    this.isLoading = true;

    this.claimService.getMyClaims().subscribe({
      next: (response) => {
        this.lstMyClaims = response.data ?? [];
        this.isLoading = false;
        this.currentPage = 1;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to load your claims.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Summary Cards
  get totalClaims(): number {
    return this.lstMyClaims.length;
  }

  get pendingClaims(): number {
    return this.lstMyClaims.filter(
      claim => claim.claimStatus === 'Pending'
    ).length;
  }

  get approvedClaims(): number {
    return this.lstMyClaims.filter(
      claim => claim.claimStatus === 'Approved'
    ).length;
  }

  get recommendedForApprovalClaims(): number {
    return this.lstMyClaims.filter(
      claim => claim.claimStatus === 'RecommendedForApproval'
    ).length;
  }

  get recommendedForRejectionClaims(): number {
    return this.lstMyClaims.filter(
      claim => claim.claimStatus === 'RecommendedForRejection'
    ).length;
  }

  get rejectedClaims(): number {
    return this.lstMyClaims.filter(
      claim => claim.claimStatus === 'Rejected'
    ).length;
  }

  // Search and Status Filtering
  get filteredClaims(): ClaimResponseDto[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.lstMyClaims.filter(claim => {

      const matchesSearch =
        !search ||
        claim.claimNumber?.toLowerCase().includes(search) ||
        claim.policyNumber?.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        claim.claimStatus === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredClaims.length / this.pageSize);
  }

  get paginatedClaims(): ClaimResponseDto[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredClaims.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  get startRecord(): number {
    return this.filteredClaims.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredClaims.length
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

  // Status Badge Styling
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';

      case 'RecommendedForApproval':
        return 'status-recommended-approval';

      case 'RecommendedForRejection':
        return 'status-recommended-rejection';

      case 'Approved':
        return 'status-approved';

      case 'Rejected':
        return 'status-rejected';

      default:
        return 'status-default';
    }
  }

  navigateToRaiseClaims(): void {
    this.router.navigate(['/raiseclaim']);
  }

  navigateToViewClaimDetails(claimId: number): void {
    this.router.navigate(['/viewclaimdetails', claimId]);
  }
}
