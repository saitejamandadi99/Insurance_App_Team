import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimResponseDto } from '../../../../DTO/ClaimResponseDto';
import { Claim } from '../../../../services/Claim/claim';
import { ToastService } from '../../../../services/Toast/toast-service';
@Component({
  imports: [],
  standalone:true,
  selector: 'app-view-claim-details-component',
  styleUrl: './view-claim-details-component.css',
  templateUrl: './view-claim-details-component.html',
})
export class ViewClaimDetailsComponent implements OnInit {
  claimId!: number;
  claim!: ClaimResponseDto;
  isLoading = false;

  constructor(
    private claimService: Claim,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const claimIdParam =
      this.activatedRoute.snapshot.paramMap.get('claimId');

    this.claimId = Number(claimIdParam);

    if (!claimIdParam || !Number.isInteger(this.claimId) || this.claimId <= 0) {
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

  navigateToMyClaims(): void {
    this.router.navigate(['/myclaims']);
  }
}
