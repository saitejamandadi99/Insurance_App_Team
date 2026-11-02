import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { ClaimStatusHistoryResponseDto } from '../../../../DTO/ClaimStatusHistoryResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';

import { ClaimStatusHistoryServices } from '../../../../services/ClaimStatusHistory/claim-status-history';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { FilterCard } from '../../../../shared/ui/filter-card/filter-card';
import { SearchBox } from '../../../../shared/ui/search-box/search-box';
import { Pagination } from '../../../../shared/ui/pagination/pagination';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { ToastService } from '../../../../services/Toast/toast-service';

@Component({
selector: 'app-view-claim-status-history-component',
standalone: true,
imports: [
ReactiveFormsModule,
DatePipe,
PageHeader,
FilterCard,
SearchBox,
Pagination,
LoadingSpinner,
EmptyState,
StatusBadge
],
templateUrl: './view-claim-status-history-component.html',
styleUrl: './view-claim-status-history-component.css',
})
export class ViewClaimStatusHistoryComponent implements OnInit {

histories!: PaginationResponseDto<ClaimStatusHistoryResponseDto>;

isLoading = false;

filterForm: FormGroup = new FormGroup({
search: new FormControl(''),
sortBy: new FormControl('updatedDate'),
sortDirection: new FormControl('desc'),
pageNumber: new FormControl(1),
pageSize: new FormControl(10)
});

constructor(
private historyService: ClaimStatusHistoryServices,
private cdr: ChangeDetectorRef,
private toastServices: ToastService
) {}

ngOnInit(): void {
this.loadHistories();
}

loadHistories(): void {
this.isLoading = true;
const filters = this.filterForm.value;

this.historyService.getAllHistory(
  filters.pageNumber ?? 1,
  filters.pageSize ?? 10,
  filters.sortBy ?? 'updatedDate',
  filters.sortDirection ?? 'desc',
  filters.search ?? ''
).subscribe({
  next: (response) => {
    this.histories = response.data;
    this.isLoading = false;
    this.cdr.detectChanges();
  },
  error: (err: HttpErrorResponse) => {
    this.isLoading = false;

    const apiError = err.error as ErrorResponseDto;

    this.toastServices.error(
      apiError?.message ?? 'Unable to load claim status history.'
    );

    this.cdr.detectChanges();
  }
});
}
searchHistories(): void {
this.filterForm.patchValue({ pageNumber: 1 });
this.loadHistories();
}

clearSearch(): void {
this.filterForm.patchValue({
search: '',
pageNumber: 1
});
this.loadHistories();
}

resetFilters(): void {
this.filterForm.reset({
search: '',
sortBy: 'updatedDate',
sortDirection: 'desc',
pageNumber: 1,
pageSize: 10
});
this.loadHistories();
}

previousPage(): void {
if (this.histories && this.histories.currentPage > 1) {
this.filterForm.patchValue({
pageNumber: this.histories.currentPage - 1
});
  this.loadHistories();
}
}

nextPage(): void {
if (this.histories && !this.histories.isLastPage) {
this.filterForm.patchValue({
pageNumber: this.histories.currentPage + 1
});

  this.loadHistories();
}
}

get searchControl(): FormControl {
return this.filterForm.get('search') as FormControl;
}
}
