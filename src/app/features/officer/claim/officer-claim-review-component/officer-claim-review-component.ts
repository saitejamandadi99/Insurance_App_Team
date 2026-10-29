import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { OfficerRemarkRequestDto } from '../../../../DTO/OfficerRemarkRequestDto';
import { ToastService } from '../../../../services/Toast/toast-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Claim } from '../../../../services/Claim/claim';
import { ClaimStatus } from '../../../../Enums/ClaimStatus';
import { ClaimResponseDto } from '../../../../DTO/ClaimResponseDto';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-officer-claim-review-component',
  styleUrl: './officer-claim-review-component.css',
  templateUrl: './officer-claim-review-component.html',
})
export class OfficerClaimReviewComponent implements OnInit {
  claimId!: number;
  claim!: ClaimResponseDto;
  isLoading = false;
  claimStatus = ClaimStatus;

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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
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
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;
        this.toast.error(apiError?.message ?? 'Unable to load claim details.');

        this.cdr.detectChanges();
      }
    });
  }

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
        this.toast.error(apiError?.message ?? 'Unable to review claim.');

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
