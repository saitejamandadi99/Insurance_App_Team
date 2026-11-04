import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { OfficerRemarkRequestDto } from '../../../../DTO/OfficerRemarkRequestDto';
import { ToastService } from '../../../../services/Toast/toast-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Claim } from '../../../../services/Claim/claim';
import { ClaimStatus } from '../../../../Enums/ClaimStatus';
import { ClaimResponseDto } from '../../../../DTO/ClaimResponseDto';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { ClaimDocument } from '../../../../services/ClaimDocument/claim-document';
import { ClaimDocumentResponseDto } from '../../../../DTO/ClaimDocumentResponseDto';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe],
  standalone: true,
  selector: 'app-officer-claim-review-component',
  styleUrl: './officer-claim-review-component.css',
  templateUrl: './officer-claim-review-component.html',
})
export class OfficerClaimReviewComponent implements OnInit {

  claimId!: number;
  claim!: ClaimResponseDto;

  isLoading = false;

  // Claim Documents
  lstClaimDocuments: ClaimDocumentResponseDto[] = [];
  isDocumentsLoading = false;

  officerClaimStatuses: ClaimStatus[] = [
    ClaimStatus.RecommendedForApproval,
    ClaimStatus.RecommendedForRejection
  ];

  reviewForm: FormGroup = new FormGroup({
    claimStatus: new FormControl('', [Validators.required]),
    officerRemarks: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(300)
    ])
  });

  constructor(
    private claimService: Claim,
    private claimDocumentService: ClaimDocument,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private httpClient: HttpClient

  ) {}

  ngOnInit(): void {
    const claimIdParam =
      this.activatedRoute.snapshot.paramMap.get('claimId');

    this.claimId = Number(claimIdParam);

    if (!claimIdParam || !Number.isInteger(this.claimId) || this.claimId <= 0) {
      this.router.navigate(['/viewclaims']);
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

        // Load documents after successfully loading the claim
        this.loadClaimDocuments();

        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;
        this.toast.error(
          apiError?.message ?? 'Unable to load claim details.'
        );

        this.cdr.detectChanges();
        this.router.navigate(['/viewclaims']);
      }
    });
  }

  // Load documents belonging to this claim
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

          this.toast.error(
            apiError?.message ?? 'Unable to load claim documents.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  // View document in a new browser tab
  viewDocument(document: ClaimDocumentResponseDto): void {
    if (!document.documentReference) {
      this.toast.error('Document URL is not available.');
      return;
    }

    window.open(
      document.documentReference,
      '_blank',
      'noopener,noreferrer'
    );
  }

  // Download document
  downloadDocument(document: ClaimDocumentResponseDto): void {
  if (!document.documentReference) {
    this.toast.error('Document URL is not available.');
    return;
  }

  this.httpClient.get(document.documentReference, {
    responseType: 'blob'
  }).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);

      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.documentName || 'claim-document';

      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    },
    error: () => {
      this.toast.error('Unable to download the document.');
    }
  });
}

  // Existing officer review functionality
  reviewClaim(): void {
    if (this.reviewForm.invalid || this.isLoading) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const request: OfficerRemarkRequestDto = this.reviewForm.value;

    this.claimService.officerReviewByClaimId(this.claimId, request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toast.info(response.message);
        this.cdr.detectChanges();
        this.router.navigate(['/viewclaims']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;
        this.toast.error(
          apiError?.message ?? 'Unable to review claim.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  navigateToClaims(): void {
    this.router.navigate(['/viewclaims']);
  }

  get claimStatusControl(): FormControl {
    return this.reviewForm.get('claimStatus') as FormControl;
  }

  get officerRemarks(): FormControl {
    return this.reviewForm.get('officerRemarks') as FormControl;
  }
}