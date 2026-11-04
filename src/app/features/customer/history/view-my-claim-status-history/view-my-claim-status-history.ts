import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';

import { ClaimStatusHistoryServices } from '../../../../services/ClaimStatusHistory/claim-status-history';
import { ClaimStatusHistoryResponseDto } from '../../../../DTO/ClaimStatusHistoryResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { ToastService } from '../../../../services/Toast/toast-service';

@Component({
selector: 'app-view-my-claim-status-history',
standalone: true,
imports: [
NgIf,
NgFor,
DatePipe,
PageHeader,
LoadingSpinner,
EmptyState,
StatusBadge
],
templateUrl: './view-my-claim-status-history.html',
styleUrl: './view-my-claim-status-history.css',
})
export class ViewMyClaimStatusHistoryComponent implements OnInit {

constructor(
private historyService: ClaimStatusHistoryServices,
private cdr: ChangeDetectorRef,
private toastServices: ToastService
) {}

isLoading = false;

histories: ClaimStatusHistoryResponseDto[] = [];

currentPage = 1;
pageSize = 10;
totalRecords = 0;
totalPages = 0;
isLastPage = true;

loadMyHistory(): void {
this.isLoading = true;

this.historyService.getMyHistory(
  this.currentPage,
  this.pageSize,
  'updatedDate',
  'desc',
  ''
).subscribe({
  next: (response) => {
    const result = response.data;

    this.histories = result?.records ?? [];
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
      apiError?.message ?? 'Unable to load claim status history.'
    );

    this.cdr.detectChanges();
  }
});

}

ngOnInit(): void {
this.loadMyHistory();
}

goToPreviousPage(): void {
if (this.currentPage > 1) {
this.currentPage--;
this.loadMyHistory();
}
}

goToNextPage(): void {
if (!this.isLastPage && this.currentPage < this.totalPages) {
this.currentPage++;
this.loadMyHistory();
}
}

formatStatus(status: string): string {
return status
? status.replace(/([a-z])([A-Z])/g, '$1 $2')
: 'N/A';
}

getStatusVariant(status: string): string {
switch (status?.toLowerCase()) {
case 'submitted':
return 'info';
  case 'underreview':
    return 'warning';

  case 'recommendedforapproval':
  case 'approved':
    return 'success';

  case 'recommendedforrejection':
  case 'rejected':
    return 'danger';

  default:
    return 'secondary';
}
}

trackByHistoryId(
index: number,
history: ClaimStatusHistoryResponseDto
): number {
return history.historyId;
}
}
