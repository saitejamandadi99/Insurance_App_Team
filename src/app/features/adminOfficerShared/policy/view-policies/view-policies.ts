import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { PolicyResponseDto } from '../../../../DTO/PolicyResponseDto';
import { PolicyStatus } from '../../../../Enums/PolicyStatus';
import { Policy } from '../../../../services/Policy/policy';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-view-policies',
  styleUrl: './view-policies.css',
  templateUrl: './view-policies.html',
})
export class ViewPolicies implements OnInit {

  lstPolicies!: PaginationResponseDto<PolicyResponseDto>;

  isLoading = false;
  isCancelling = false;

  PolicyStatus = PolicyStatus;

  filterForm: FormGroup = new FormGroup({
    search: new FormControl(''),
    sortBy: new FormControl('planName'),
    sortDirection: new FormControl('asc'),
    pageNumber: new FormControl(1),
    pageSize: new FormControl(10)
  });

  constructor(
    private policyService: Policy,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.isLoading = true;

    const filters = this.filterForm.value;

    this.policyService.listPolicies(
      filters.pageNumber ?? 1,
      filters.pageSize ?? 10,
      filters.sortBy ?? 'planName',
      filters.sortDirection ?? 'asc',
      filters.search ?? ''
    ).subscribe({
      next: (response) => {
        this.lstPolicies = response.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to load policies.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  searchPolicies(): void {
    this.filterForm.patchValue({ pageNumber: 1 });
    this.loadPolicies();
  }

  clearSearch(): void {
    this.filterForm.patchValue({
      search: '',
      pageNumber: 1
    });

    this.loadPolicies();
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      sortBy: 'planName',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 10
    });

    this.loadPolicies();
  }

  previousPage(): void {
    if (this.lstPolicies && this.lstPolicies.currentPage > 1) {
      this.filterForm.patchValue({
        pageNumber: this.lstPolicies.currentPage - 1
      });

      this.loadPolicies();
    }
  }

  nextPage(): void {
    if (this.lstPolicies && !this.lstPolicies.isLastPage) {
      this.filterForm.patchValue({
        pageNumber: this.lstPolicies.currentPage + 1
      });

      this.loadPolicies();
    }
  }

  get searchControl(): FormControl {
    return this.filterForm.get('search') as FormControl;
  }

  navigateToIssuePolicy(): void {
    this.router.navigate(['/issuepolicy']);
  }

  cancelPolicy(policyId: number): void {
    if (this.isCancelling || this.isLoading) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to cancel this policy?'
    );

    if (!confirmed) {
      return;
    }

    this.isCancelling = true;

    this.policyService.cancelPolicy(policyId).subscribe({
      next: (response) => {
        this.isCancelling = false;
        this.toastService.info(response.message);
        this.cdr.detectChanges();
        this.loadPolicies();
      },
      error: (err: HttpErrorResponse) => {
        this.isCancelling = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to cancel policy.'
        );

        this.cdr.detectChanges();
      }
    });
  }
}
