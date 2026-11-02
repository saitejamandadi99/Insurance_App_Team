import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { PaymentResponseDto } from '../../../../DTO/PaymentResponseDto';

import { PremiumPaymentServices } from '../../../../services/PremiumPayment/premium-payment-services';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { FilterCard } from '../../../../shared/ui/filter-card/filter-card';
import { SearchBox } from '../../../../shared/ui/search-box/search-box';
import { Pagination } from '../../../../shared/ui/pagination/pagination';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { ToastService } from '../../../../services/Toast/toast-service';

@Component({
  selector: 'app-view-payment-component',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    PageHeader,
    FilterCard,
    SearchBox,
    Pagination,
    LoadingSpinner,
    EmptyState,
    StatusBadge
  ],
    templateUrl: './view-premium-payment-component.html',
  styleUrl: './view-premium-payment-component.css'

})
export class ViewPaymentComponent implements OnInit {

  payments!: PaginationResponseDto<PaymentResponseDto>;

  isLoading = false;

  filterForm: FormGroup = new FormGroup({
    search: new FormControl(''),
    sortBy: new FormControl('paymentDate'),
    sortDirection: new FormControl('desc'),
    pageNumber: new FormControl(1),
    pageSize: new FormControl(10)
  });

  constructor(
    private paymentService: PremiumPaymentServices,
    private cdr: ChangeDetectorRef,
    private toastServices: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;

    const filters = this.filterForm.value;

    this.paymentService.listPayments(
      filters.pageNumber!,
      filters.pageSize!,
      filters.sortBy!,
      filters.sortDirection!,
      filters.search!
    ).subscribe({
      next: (response: { data: PaginationResponseDto<PaymentResponseDto>; }) => {
        this.payments = response.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastServices.error(
          apiError?.message || 'Failed to retrieve payments.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  searchPayments(): void {
    this.filterForm.patchValue({
      pageNumber: 1
    });

    this.loadPayments();
  }

  clearSearch(): void {
    this.filterForm.patchValue({
      search: '',
      pageNumber: 1
    });

    this.loadPayments();
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      sortBy: 'paymentDate',
      sortDirection: 'desc',
      pageNumber: 1,
      pageSize: 10
    });

    this.loadPayments();
  }

  previousPage(): void {
    if (this.payments && this.payments.currentPage > 1) {
      this.filterForm.patchValue({
        pageNumber: this.payments.currentPage - 1
      });

      this.loadPayments();
    }
  }

  nextPage(): void {
    if (this.payments && !this.payments.isLastPage) {
      this.filterForm.patchValue({
        pageNumber: this.payments.currentPage + 1
      });

      this.loadPayments();
    }
  }

  get searchControl(): FormControl {
    return this.filterForm.get('search') as FormControl;
  }
}