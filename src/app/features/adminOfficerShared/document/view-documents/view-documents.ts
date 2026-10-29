import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../services/Toast/toast-service';
import { Router } from '@angular/router';
import { ClaimDocument } from '../../../../services/ClaimDocument/claim-document';
import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { ClaimDocumentResponseDto } from '../../../../DTO/ClaimDocumentResponseDto';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-view-documents',
  styleUrl: './view-documents.css',
  templateUrl: './view-documents.html',
})
export class ViewDocuments implements OnInit {
  documents!: PaginationResponseDto<ClaimDocumentResponseDto>;
  isLoading = false;

  filterForm: FormGroup = new FormGroup({
    search: new FormControl(''),
    sortBy: new FormControl('uploadeddate'),
    sortDirection: new FormControl('desc'),
    pageNumber: new FormControl(1),
    pageSize: new FormControl(10),
  });

  constructor(
    private documentServices: ClaimDocument,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastServices: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading = true;

    const filters = this.filterForm.value;

    this.documentServices.listClaimDocuments(
      filters.pageNumber ?? 1,
      filters.pageSize ?? 10,
      filters.sortBy ?? 'uploadeddate',
      filters.sortDirection ?? 'desc',
      filters.search ?? ''
    ).subscribe({
      next: (response) => {
        this.documents = response.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastServices.error(
          apiError?.message ?? 'Unable to load documents.'
        );

        this.cdr.detectChanges();
      },
    });
  }

  searchDocuments(): void {
    this.filterForm.patchValue({ pageNumber: 1 });
    this.loadDocuments();
  }

  clearSearch(): void {
    this.filterForm.patchValue({
      search: '',
      pageNumber: 1
    });

    this.loadDocuments();
  }

  previousPage(): void {
    if (this.documents && this.documents.currentPage > 1) {
      this.filterForm.patchValue({
        pageNumber: this.documents.currentPage - 1
      });

      this.loadDocuments();
    }
  }

  nextPage(): void {
    if (this.documents && !this.documents.isLastPage) {
      this.filterForm.patchValue({
        pageNumber: this.documents.currentPage + 1
      });

      this.loadDocuments();
    }
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      sortBy: 'uploadeddate',
      sortDirection: 'desc',
      pageNumber: 1,
      pageSize: 10,
    });

    this.loadDocuments();
  }

  get searchControl(): FormControl {
    return this.filterForm.get('search') as FormControl;
  }

  navigateToView(documentId: number): void {
    const document = this.documents?.records.find(
      (doc) => doc.documentId === documentId
    );

    if (!document?.documentReference) {
      this.toastServices.error('Document URL is not available.');
      return;
    }

    window.open(
      document.documentReference,
      '_blank',
      'noopener,noreferrer'
    );
  }
}
