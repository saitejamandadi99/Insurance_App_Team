import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PolicyStatus } from '../../../../Enums/PolicyStatus';
import { PolicyResponseDto } from '../../../../DTO/PolicyResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../services/Toast/toast-service';
import { Router } from '@angular/router';
import { Policy } from '../../../../services/Policy/policy';

@Component({
  imports: [],
  selector: 'app-view-my-policies',
  styleUrl: './view-my-policies.css',
  templateUrl: './view-my-policies.html',
})
export class ViewMyPolicies implements OnInit {

  constructor(
    private policyService: Policy,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastServices: ToastService
  ) {}

  lstMyPolicies: PolicyResponseDto[] = [];
  isLoading = false;

  PolicyStatus = PolicyStatus;

  ngOnInit(): void {
    this.loadMyPolicies();
  }

  loadMyPolicies(): void {
    this.isLoading = true;

    this.policyService.getMyPolicies().subscribe({
      next: (response) => {
        this.lstMyPolicies = response.data ?? [];
        this.isLoading = false;

        this.toastServices.success(response.message);
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastServices.error(
          apiError?.message ?? 'Unable to load your policies.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  canMakePayment(policy: PolicyResponseDto): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(policy.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    // Do not allow payment for expired or cancelled policies.
    if (
      policy.policyStatus === PolicyStatus.Expired ||
      policy.policyStatus === PolicyStatus.Cancelled
    ) {
      return false;
    }

    // The initial payment must be completed before the policy's
    // activation deadline. This method cannot independently verify
    // that deadline because it is not included in this DTO.
    if (!policy.startDate || !policy.dueDate) {
      return false;
    }

    // Allow payment only during the final five days before the due date.
    const paymentWindowStart = new Date(dueDate);
    paymentWindowStart.setDate(paymentWindowStart.getDate() - 5);

    return today >= paymentWindowStart && today <= dueDate;
  }

  navigateToPurchasePolicy(): void {
    this.router.navigate(['/purchasepolicy']);
  }

  navigateToMakePayment(policyId: number): void {
    this.router.navigate(['/makepayment', policyId]);
  }

  navigateToRaiseClaim(policyId: number): void {
    this.router.navigate(['/raiseclaim', policyId]);
  }
}
