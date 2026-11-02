
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimResponseDto } from '../../../../DTO/ClaimResponseDto';
import { Claim } from '../../../../services/Claim/claim';
import { ToastService } from '../../../../services/Toast/toast-service';
import { ClaimDocument } from '../../../../services/ClaimDocument/claim-document';
import { ClaimDocumentResponseDto } from '../../../../DTO/ClaimDocumentResponseDto';
import { CurrencyPipe, DatePipe } from '@angular/common';
@Component({
  imports: [CurrencyPipe, DatePipe],
  standalone: true,
  selector: 'app-view-claim-details-component',
  styleUrl: './view-claim-details-component.css',
  templateUrl: './view-claim-details-component.html',
})
export class ViewClaimDetailsComponent implements OnInit {

  claimId!: number;
  claim!: ClaimResponseDto;

  lstClaimDocuments: ClaimDocumentResponseDto[] = [];

  isLoading = false;
  isDocumentsLoading = false;

  constructor(
    private claimService: Claim,
    private claimDocumentService: ClaimDocument,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const claimIdParam =
      this.activatedRoute.snapshot.paramMap.get('claimId');

    this.claimId = Number(claimIdParam);

    if (
      !claimIdParam ||
      !Number.isInteger(this.claimId) ||
      this.claimId <= 0
    ) {
      this.router.navigate(['/myclaims']);
      return;
    }

    this.loadClaim();
  }

  loadClaim(): void {
    this.isLoading = true;

    this.claimService.getClaimById(this.claimId).subscribe({
      next: (response) => {
        this.claim = response.data;
        this.isLoading = false;

        // Load documents after successfully loading claim details
        this.loadClaimDocuments();

        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to load claim details.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  loadClaimDocuments(): void {
    this.isDocumentsLoading = true;

    this.claimDocumentService
      .getClaimDocumentsByClaimId(this.claimId)
      .subscribe({
        next: (response) => {
          this.lstClaimDocuments = response.data ?? [];
          this.isDocumentsLoading = false;
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          this.isDocumentsLoading = false;

          this.lstClaimDocuments = [];

          const apiError = err.error as ErrorResponseDto;

          this.toastService.error(
            apiError?.message ?? 'Unable to load claim documents.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  navigateToMyClaims(): void {
    this.router.navigate(['/myclaims']);
  }

  downloadDocument(doc: ClaimDocumentResponseDto): void {
  const link = window.document.createElement('a');
  link.href = doc.documentReference;
  link.download = doc.documentName;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
}
}
