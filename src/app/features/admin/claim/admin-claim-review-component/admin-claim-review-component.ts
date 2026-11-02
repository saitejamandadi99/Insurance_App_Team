import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminRemarkRequestDto } from '../../../../DTO/AdminRemarkRequestDto';
import { ToastService } from '../../../../services/Toast/toast-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Claim } from '../../../../services/Claim/claim';
import { ClaimStatus } from '../../../../Enums/ClaimStatus';
import { ClaimResponseDto } from '../../../../DTO/ClaimResponseDto';
import { CurrencyPipe, DatePipe } from '@angular/common';

// New imports for claim documents
import { ClaimDocument } from '../../../../services/ClaimDocument/claim-document';
import { ClaimDocumentResponseDto } from '../../../../DTO/ClaimDocumentResponseDto';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  standalone: true,
  selector: 'app-admin-claim-review-component',
  styleUrl: './admin-claim-review-component.css',
  templateUrl: './admin-claim-review-component.html',
})
export class AdminClaimReviewComponent implements OnInit {
  claimId!: number;
  claim!: ClaimResponseDto;

  isLoading = false;

  // Claim documents
  lstClaimDocuments: ClaimDocumentResponseDto[] = [];
  isDocumentsLoading = false;

  adminClaimStatuses: ClaimStatus[] = [
    ClaimStatus.Approved,
    ClaimStatus.Rejected
  ];

  reviewForm: FormGroup = new FormGroup({
    claimStatus: new FormControl('', [Validators.required]),
    adminRemarks: new FormControl('', [
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
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const claimIdParam = this.activatedRoute.snapshot.paramMap.get('claimId');
    this.claimId = Number(claimIdParam);

    if (
      !claimIdParam ||
      !Number.isInteger(this.claimId) ||
      this.claimId <= 0
    ) {
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

        // Load documents after successfully retrieving the claim
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

  downloadDocument(document: ClaimDocumentResponseDto): void {
    if (!document.documentReference) {
      this.toast.error('Document URL is not available.');
      return;
    }

    const link = window.document.createElement('a');

    link.href = document.documentReference;
    link.download = document.documentName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    link.click();
  }

  reviewClaim(): void {
    if (this.reviewForm.invalid || this.isLoading) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const request: AdminRemarkRequestDto = this.reviewForm.value;

    this.claimService
      .adminReviewByClaimId(this.claimId, request)
      .subscribe({
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

  get adminRemarks(): FormControl {
    return this.reviewForm.get('adminRemarks') as FormControl;
  }
}