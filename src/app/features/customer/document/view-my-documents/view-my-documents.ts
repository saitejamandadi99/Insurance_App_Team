import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClaimDocumentResponseDto } from '../../../../DTO/ClaimDocumentResponseDto';
import { FormControl } from '@angular/forms';
import { ClaimDocument } from '../../../../services/ClaimDocument/claim-document';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-view-my-documents',
  styleUrl: './view-my-documents.css',
  templateUrl: './view-my-documents.html',
})
export class ViewMyDocuments implements OnInit {
  documents: ClaimDocumentResponseDto[] = [];
  filteredDocuments: ClaimDocumentResponseDto[] = [];

  isLoading = false;
  searchControl = new FormControl('');

  constructor(
    private documentServices: ClaimDocument,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastServices: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();

    this.searchControl.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  loadDocuments(): void {
    this.isLoading = true;

    this.documentServices.getMyClaimDocuments().subscribe({
      next: (response) => {
        this.documents = response.data;
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastServices.error(
          apiError?.message ?? 'Unable to load your documents.'
        );

        this.cdr.detectChanges();
      },
    });
  }

  applyFilter(): void {
    const term = (this.searchControl.value ?? '').trim().toLowerCase();

    this.filteredDocuments = !term
      ? this.documents
      : this.documents.filter(
          (doc) =>
            doc.documentName.toLowerCase().includes(term) ||
            doc.documentType.toLowerCase().includes(term) ||
            (doc.claimNumber ?? '').toLowerCase().includes(term)
        );
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  onDocAction(action: string, documentId: number): void {
    if (action === 'view') {
      const document = this.documents.find(
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
    } else if (action === 'delete') {
      this.deleteDocument(documentId);
    }
  }

  deleteDocument(documentId: number): void {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    this.documentServices.deleteClaimDocumentById(documentId).subscribe({
      next: (response) => {
        this.toastServices.info(response.message);
        this.loadDocuments();
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ErrorResponseDto;

        this.toastServices.error(
          apiError?.message ?? 'Unable to delete the document.'
        );
      },
    });
  }

  navigateToAddDocument(): void {
    this.router.navigate(['/adddocument']);
  }
}
