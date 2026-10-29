import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Role } from '../../../../Enums/Role';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../services/Toast/toast-service';
import { Auth } from '../../../../services/Auth/auth';
import { Router } from '@angular/router';
import { Claim } from '../../../../services/Claim/claim';
import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { ClaimResponseDto } from '../../../../DTO/ClaimResponseDto';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-view-claims-component',
  styleUrl: './view-claims-component.css',
  templateUrl: './view-claims-component.html',
})
export class ViewClaimsComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({
    search: new FormControl(''),
    sortBy: new FormControl('incidentDate'),
    sortDirection: new FormControl('desc'),
    pageNumber: new FormControl(1),
    pageSize: new FormControl(10)
  });

  claims!: PaginationResponseDto<ClaimResponseDto>;
  isLoading = false;
  role = '';

  constructor(
    private claimService: Claim,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: Auth,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole() ?? '';
    this.loadClaims();
  }

  loadClaims(): void {
    this.isLoading = true;

    const filters = this.filterForm.value;

    this.claimService.listClaims(
      filters.pageNumber ?? 1,
      filters.pageSize ?? 10,
      filters.sortBy ?? 'incidentDate',
      filters.sortDirection ?? 'desc',
      filters.search ?? ''
    ).subscribe({
      next: (response) => {
        this.claims = response.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;
        this.toast.error(apiError?.message ?? 'Unable to load claims.');

        this.cdr.detectChanges();
      }
    });
  }

  searchClaims(): void {
    this.filterForm.patchValue({ pageNumber: 1 });
    this.loadClaims();
  }

  previousPage(): void {
    if (this.claims && this.claims.currentPage > 1) {
      this.filterForm.patchValue({
        pageNumber: this.claims.currentPage - 1
      });
      this.loadClaims();
    }
  }

  nextPage(): void {
    if (this.claims && !this.claims.isLastPage) {
      this.filterForm.patchValue({
        pageNumber: this.claims.currentPage + 1
      });
      this.loadClaims();
    }
  }

  navigateToReview(claimId: number): void {
    if (this.role === Role.Officer) {
      this.router.navigate(['/officerreview', claimId]);
    } else if (this.role === Role.Admin) {
      this.router.navigate(['/adminreview', claimId]);
    } else {
      this.toast.error('You are not authorized to review claims.');
    }
  }

  get searchControl(): FormControl {
    return this.filterForm.get('search') as FormControl;
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      sortBy: 'incidentDate',
      sortDirection: 'desc',
      pageNumber: 1,
      pageSize: 10
    });

    this.loadClaims();
  }

  clearSearch(): void {
    this.filterForm.patchValue({
      search: '',
      pageNumber: 1
    });

    this.loadClaims();
  }
}
