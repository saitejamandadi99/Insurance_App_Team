import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { IssuePolicyRequestDto } from '../../../../DTO/IssuePolicyRequestDto';
import { ActiveStatus } from '../../../../Enums/ActiveStatus';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { Policy } from '../../../../services/Policy/policy';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-issue-policy',
  styleUrl: './issue-policy.css',
  templateUrl: './issue-policy.html',
})
export class IssuePolicy implements OnInit {

  issuePolicyForm: FormGroup = new FormGroup({
    customerId: new FormControl('', [
      Validators.required
    ]),
    planId: new FormControl('', [
      Validators.required
    ])
  });

  lstCustomers: CustomerResponseDto[] = [];
  lstPlans: PolicyPlanResponseDto[] = [];

  isLoading = false;
  isSubmitting = false;

  customersLoaded = false;
  plansLoaded = false;

  constructor(
    private policyService: Policy,
    private policyPlanService: PolicyPlan,
    private customerService: Customer,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.loadCustomers();
    this.loadPlans();
  }

  loadCustomers(): void {
    this.customerService
      .listCustomers(1, 99, 'email', 'asc', '')
      .subscribe({
        next: (response) => {
          this.lstCustomers = response.data?.records ?? [];

          this.customersLoaded = true;
          this.updateInitialLoading();
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ErrorResponseDto;

          this.toastService.error(
            apiError?.message ?? 'Unable to load customers.'
          );

          this.customersLoaded = true;
          this.updateInitialLoading();
        }
      });
  }

  loadPlans(): void {
    this.policyPlanService
      .listPolicyPlans(1, 99, 'planName', 'asc', '')
      .subscribe({
        next: (response) => {
          this.lstPlans = (response.data?.records ?? []).filter(
            plan => plan.activeStatus === ActiveStatus.Active
          );

          this.plansLoaded = true;
          this.updateInitialLoading();
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ErrorResponseDto;

          this.toastService.error(
            apiError?.message ?? 'Unable to load policy plans.'
          );

          this.plansLoaded = true;
          this.updateInitialLoading();
        }
      });
  }

  private updateInitialLoading(): void {
    if (this.customersLoaded && this.plansLoaded) {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  get selectedPlan(): PolicyPlanResponseDto | undefined {
    const selectedPlanId = Number(
      this.issuePolicyForm.get('planId')?.value
    );

    return this.lstPlans.find(
      plan => plan.planId === selectedPlanId
    );
  }

  issuePolicy(): void {
    if (
      this.issuePolicyForm.invalid ||
      this.isLoading ||
      this.isSubmitting
    ) {
      this.issuePolicyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const request: IssuePolicyRequestDto =
      this.issuePolicyForm.value;

    this.policyService.issuePolicy(request).subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.cdr.detectChanges();
        this.router.navigate(['/viewpolicies']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to issue policy.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  navigateToViewPolicies(): void {
    this.router.navigate(['/viewpolicies']);
  }
}
