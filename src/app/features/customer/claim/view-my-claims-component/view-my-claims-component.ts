import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { Claim } from '../../../../services/Claim/claim';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { ClaimResponseDto } from '../../../../DTO/ClaimResponseDto';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-view-my-claims-component',
  styleUrl: './view-my-claims-component.css',
  templateUrl: './view-my-claims-component.html',
})
export class ViewMyClaimsComponent implements OnInit {
  lstMyClaims: ClaimResponseDto[] = [];
  isLoading = false;

  constructor(
    private claimService: Claim,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMyClaims();
  }

  loadMyClaims(): void {
    this.isLoading = true;

    this.claimService.getMyClaims().subscribe({
      next: (response) => {
        this.lstMyClaims = response.data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to load your claims.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  navigateToRaiseClaims(): void {
    this.router.navigate(['/raiseclaim']);
  }

  navigateToViewClaimDetails(claimId: number): void {
    this.router.navigate(['/viewclaimdetails', claimId]);
  }
}
