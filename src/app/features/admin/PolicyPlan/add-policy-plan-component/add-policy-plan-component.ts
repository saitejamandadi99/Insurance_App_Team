import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule,Validators,AbstractControl,ValidationErrors,ValidatorFn,} from '@angular/forms';
import { PolicyPlanServices } from '../../../../services/PolicyPlan/policy-plan-services';
import { Product } from '../../../../services/Product/product';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { PolicyPlanRequestDto } from '../../../../DTO/PolicyPlanRequestDto';
import { ProductResponseDto } from '../../../../DTO/ProductResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { PremiumType } from '../../../../Enums/PremiumType';

// Coverage amount must be greater than premium amount.
const coverageGreaterThanPremiumValidator: ValidatorFn = (
control: AbstractControl
): ValidationErrors | null => {
const coverageAmount = Number(control.get('coverageAmount')?.value);
const premiumAmount = Number(control.get('premiumAmount')?.value);

if (
control.get('coverageAmount')?.value === null ||
control.get('coverageAmount')?.value === '' ||
control.get('premiumAmount')?.value === null ||
control.get('premiumAmount')?.value === ''
) {
return null;
}
return coverageAmount > premiumAmount
? null
: { coverageMustExceedPremium: true };
};

@Component({
imports: [ReactiveFormsModule, NgIf],
standalone: true,
selector: 'app-add-plan-component',
styleUrl: './add-Policy-plan-component.css',
templateUrl: './add-policy-plan-component.html',})
export class AddPlanComponent implements OnInit {

isLoading = false;
products: ProductResponseDto[] = [];
PremiumType = PremiumType;
premiumTypes = Object.values(PremiumType).filter(
(value) => typeof value === 'string'
);

planForm: FormGroup = new FormGroup(
{
productId: new FormControl('', [
Validators.required,
Validators.min(1),
]),
  planName: new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
  ]),

  coverageAmount: new FormControl(1000, [
    Validators.required,
    Validators.min(1000),
  ]),

  premiumAmount: new FormControl(1000, [
    Validators.required,
    Validators.min(1000),
  ]),

  premiumType: new FormControl('', [
    Validators.required,
  ]),

  duration: new FormControl(1, [
    Validators.required,
    Validators.min(1),
    Validators.max(100),
  ]),

  termsAndConditions: new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(300),
  ]),
},
{
  validators: coverageGreaterThanPremiumValidator,
});
constructor(
private planService: PolicyPlanServices,
private productService: Product,
private router: Router,
private toastService: ToastService
) {}

ngOnInit(): void {
this.loadProducts();
}
// Load insurance products.
loadProducts(): void {
this.isLoading = true;
this.productService
  .listProducts(1, 99, 'productName', 'asc', '')
  .subscribe({
    next: (response) => {
      this.products = response.data?.records ?? [];
      this.isLoading = false;
    },

    error: (err: HttpErrorResponse) => {
      this.isLoading = false;

      const apiError = err.error as ErrorResponseDto;

      this.toastService.error(
        apiError?.message ?? 'Unable to load insurance products.'
      );
    },
  });
}

// Add policy plan.
addPlan(): void {
if (this.planForm.invalid || this.isLoading) {
  this.planForm.markAllAsTouched();

  if (this.planForm.hasError('coverageMustExceedPremium')) {
    this.toastService.error(
      'Coverage amount must be greater than premium amount.'
    );
  }

  return;
}

this.isLoading = true;

const request: PolicyPlanRequestDto = {
  productId: Number(this.productId().value),
  planName: String(this.planName().value).trim(),
  coverageAmount: Number(this.coverageAmount().value),
  premiumAmount: Number(this.premiumAmount().value),
  premiumType: this.premiumType().value,
  duration: Number(this.duration().value),
  termsAndConditions: String(
    this.termsAndConditions().value
  ).trim(),
};

this.planService.addPolicyPlan(request).subscribe({
  next: (response) => {
    this.isLoading = false;

    this.toastService.info(response.message);

    this.router.navigate(['/viewplans']);
  },

  error: (err: HttpErrorResponse) => {
    this.isLoading = false;

    const apiError = err.error as ErrorResponseDto;

    this.toastService.error(
      apiError?.message ?? 'Unable to add policy plan. Please try again.'
    );
  },
});
}

// Navigate to policy plans.
navigateToPlans(): void {
this.router.navigate(['/viewplans']);
}

// Form controls.
productId(): FormControl {
return this.planForm.get('productId') as FormControl;
}

planName(): FormControl {
return this.planForm.get('planName') as FormControl;
}

coverageAmount(): FormControl {
return this.planForm.get('coverageAmount') as FormControl;
}

premiumAmount(): FormControl {
return this.planForm.get('premiumAmount') as FormControl;
}

premiumType(): FormControl {
return this.planForm.get('premiumType') as FormControl;
}

duration(): FormControl {
return this.planForm.get('duration') as FormControl;
}

termsAndConditions(): FormControl {
return this.planForm.get('termsAndConditions') as FormControl;
}
}
