import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Claim } from '../../../../services/Claim/claim';
import { ActivatedRoute, Router } from '@angular/router';
import { Policy } from '../../../../services/Policy/policy';
import { ToastService } from '../../../../services/Toast/toast-service';
import { PolicyResponseDto } from '../../../../DTO/PolicyResponseDto';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-raise-claim-component',
  styleUrl: './raise-claim-component.css',
  templateUrl: './raise-claim-component.html',
})
export class RaiseClaimComponent implements OnInit {
  raiseClaimForm: FormGroup = new FormGroup({
    claimAmount: new FormControl('', [
      Validators.required,
      Validators.min(1)
    ]),
    claimReason: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(300)
    ]),
    incidentDate: new FormControl('', [
      Validators.required,
      this.validateIncidentDate()
    ]),
  });

  isLoading = false;
  policyId!: number;
  today!: string;
  policy!: PolicyResponseDto;

  selectedFiles: File[] = [];
  filesTouched = false;

  constructor(
    private claimServices: Claim,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private policyService: Policy,
    private toastService: ToastService
  ) {}

  validateIncidentDate(minDate?: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const selectedDate = new Date(control.value);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        return { futureDate: true };
      }

      if (minDate) {
        const start = new Date(minDate);
        start.setHours(0, 0, 0, 0);

        if (selectedDate < start) {
          return { beforePolicyStart: true };
        }
      }

      return null;
    };
  }

  ngOnInit(): void {
    const policyIdParam =
      this.activatedRoute.snapshot.paramMap.get('policyId');

    this.policyId = Number(policyIdParam);

    if (!policyIdParam || !Number.isInteger(this.policyId) || this.policyId <= 0) {
      this.router.navigate(['/mypolicies']);
      return;
    }

    this.today = this.formatDateForInput(new Date());
    this.isLoading = true;

    this.policyService.getPolicyById(this.policyId).subscribe({
      next: (response) => {
        this.policy = response.data;

        const incidentDateControl =
          this.raiseClaimForm.get('incidentDate');

        incidentDateControl?.setValidators([
          Validators.required,
          this.validateIncidentDate(new Date(this.policy.startDate))
        ]);

        incidentDateControl?.updateValueAndValidity();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to load policy details.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onFilesSelected(event: Event): void {
    this.filesTouched = true;

    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.selectedFiles = [
        ...this.selectedFiles,
        ...Array.from(input.files)
      ];
    }

    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  raiseClaim(): void {
    this.filesTouched = true;

    if (this.raiseClaimForm.invalid || this.selectedFiles.length === 0 || this.isLoading) {
      this.raiseClaimForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.raiseClaimForm.value;
    const formData = new FormData();

    formData.append('policyId', this.policyId.toString());
    formData.append('claimAmount', formValue.claimAmount);
    formData.append('claimReason', formValue.claimReason);
    formData.append('IncidentDate', formValue.incidentDate);

    this.selectedFiles.forEach((file) => {
      formData.append('Files', file, file.name);
    });

    this.claimServices.raiseClaim(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.success(response.message);
        this.cdr.detectChanges();
        this.router.navigate(['/myclaims']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to raise claim.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  navigateToMyPolicies(): void {
    this.router.navigate(['/mypolicies']);
  }
}
