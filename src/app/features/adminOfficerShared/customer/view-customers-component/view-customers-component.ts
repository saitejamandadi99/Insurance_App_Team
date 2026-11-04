import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { CustomerResponseDto } from '../../../../DTO/CustomerResponseDto';

import { CustomerProfileServices } from '../../../../services/CustomerProfile/customer-profile-services';
import { ToastService } from '../../../../services/Toast/toast-service';

import { Pagination } from '../../../../shared/ui/pagination/pagination';
import { FilterCard } from '../../../../shared/ui/filter-card/filter-card';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { SearchBox } from '../../../../shared/ui/search-box/search-box';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';
import { ActionButtons } from '../../../../shared/ui/action-buttons/action-buttons';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-view-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Pagination,
    FilterCard,
    PageHeader,
    SearchBox,
    LoadingSpinner,
    ActionButtons,
    EmptyState
  ],
  templateUrl: './view-customers-component.html',
  styleUrl: './view-customers-component.css'
})
export class ViewCustomerComponent implements OnInit {

  customers!: PaginationResponseDto<CustomerResponseDto>;

  isLoading = false;

  filterForm: FormGroup = new FormGroup({
    search: new FormControl(''),
    sortBy: new FormControl('fullName'),
    sortDirection: new FormControl('asc'),
    pageNumber: new FormControl(1),
    pageSize: new FormControl(10)
  });

  constructor(
    private customerService: CustomerProfileServices,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Load customers
  loadCustomers(): void {

    this.isLoading = true;

    const filters = this.filterForm.value;

    this.customerService.listCustomerProfiles(
      filters.pageNumber ?? 1,
      filters.pageSize ?? 10,
      filters.sortBy ?? 'fullName',
      filters.sortDirection ?? 'asc',
      filters.search ?? ''
    ).subscribe({

      next: (response) => {

        this.customers = response.data;
        this.isLoading = false;

        this.toastService.info(response.message);
        this.cdr.detectChanges();

      },

      error: (err: HttpErrorResponse) => {

        this.isLoading = false;

        const apiError = err.error;

        this.toastService.error(
          apiError?.message ?? 'Unable to load customers.'
        );

        this.cdr.detectChanges();

      }

    });

  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Reset filters
  resetFilters(): void {

    this.filterForm.reset({
      search: '',
      sortBy: 'fullName',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 10
    });

    this.loadCustomers();

  }

  // Search customers
  searchCustomers(): void {

    this.filterForm.patchValue({
      pageNumber: 1
    });

    this.loadCustomers();

  }

  // Clear search
  clearSearch(): void {

    this.filterForm.patchValue({
      search: '',
      pageNumber: 1
    });

    this.loadCustomers();

  }

  // Previous page
  previousPage(): void {

    if (this.customers && this.customers.currentPage > 1) {

      this.filterForm.patchValue({
        pageNumber: this.customers.currentPage - 1
      });

      this.loadCustomers();

    }

  }

  // Next page
  nextPage(): void {

    if (this.customers && !this.customers.isLastPage) {

      this.filterForm.patchValue({
        pageNumber: this.customers.currentPage + 1
      });

      this.loadCustomers();

    }

  }

  // View customer
  viewCustomer(customerId: number): void {

    this.router.navigate(['/customer-details', customerId]);

  }

  // Edit customer
  editCustomer(customerId: number): void {

    this.router.navigate(['/customer-profile/edit', customerId]);

  }

  // Navigate to add customer
  navigateToAddCustomer(): void {

    this.router.navigate(['/customer-profile/add']);

  }

  // Search control
  get searchControl(): FormControl {

    return this.filterForm.get('search') as FormControl;

  }

}