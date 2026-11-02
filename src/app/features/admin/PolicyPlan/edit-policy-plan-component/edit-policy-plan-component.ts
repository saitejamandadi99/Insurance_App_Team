import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import {
FormControl,
FormGroup,
ReactiveFormsModule,
Validators,
AbstractControl,
ValidationErrors,
ValidatorFn
} from '@angular/forms';
import { PolicyPlanServices } from '../../../../services/PolicyPlan/policy-plan-services';
import { Product } from '../../../../services/Product/product';
import { PremiumType } from '../../../../Enums/PremiumType';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { PolicyPlanRequestDto } from '../../../../DTO/PolicyPlanRequestDto';
import { ProductResponseDto } from '../../../../DTO/ProductResponseDto';

const coverageGreaterThanPremiumValidator: ValidatorFn = (
control: AbstractControl
): ValidationErrors | null => {

const coverageAmount = control.get('coverageAmount')?.value;
const premiumAmount = control.get('premiumAmount')?.value;

if (
coverageAmount === null ||
coverageAmount === '' ||
premiumAmount === null ||
premiumAmount === ''
) {
return null;
}

return Number(coverageAmount) > Number(premiumAmount)
? null
: { coverageMustExceedPremium: true };
};

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  selector: 'app-edit-policy-plan',
  styleUrl: './edit-policy-plan-component.css',
  templateUrl: './edit-policy-plan-component.html',
})

export class EditPolicyPlan implements OnInit {

planForm: FormGroup = new FormGroup({
productId: new FormControl('', [
  Validators.required,
  Validators.min(1)
]),

planName: new FormControl('', [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(100)
]),

coverageAmount: new FormControl(1000, [
  Validators.required,
  Validators.min(1000)
]),

premiumAmount: new FormControl(1000, [
  Validators.required,
  Validators.min(1000)
]),

premiumType: new FormControl('', [
  Validators.required
]),

duration: new FormControl(1, [
  Validators.required,
  Validators.min(1),
  Validators.max(100)
]),

termsAndConditions: new FormControl('', [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(300)
])

}, {
validators: coverageGreaterThanPremiumValidator
});

PremiumType = PremiumType;

premiumTypes = Object.values(PremiumType).filter(
value => typeof value === 'string'
);

products: ProductResponseDto[] = [];

isLoading = false;

id!: number;

constructor(
private planService: PolicyPlanServices,

private productService: Product,

private router: Router,

private activatedRoute: ActivatedRoute,

private cdr: ChangeDetectorRef,

private toastService: ToastService
) {}

ngOnInit(): void {
const idParam = this.activatedRoute.snapshot.paramMap.get('id');

const planId = Number(idParam);

if (!idParam || !Number.isInteger(planId) || planId <= 0) {

  this.toastService.error('Invalid policy plan ID.');

  this.router.navigate(['/viewplans']);

  return;

}

this.id = planId;

this.loadProducts();

this.loadPolicyPlan();
}

// Load active insurance products for the dropdown.
loadProducts(): void {

this.productService.listProducts(
  1,
  99,
  'productName',
  'asc',
  ''
).subscribe({

  next: (response) => {
  this.products = response.data?.records ?? [];
  this.cdr.detectChanges();
  },

  error: (err: HttpErrorResponse) => {

    const apiError = err.error as ErrorResponseDto;

    this.toastService.error(
      apiError?.message ?? 'Unable to load insurance products.'
    );

    this.cdr.detectChanges();

  }
});
}

// Load existing policy plan details.
loadPolicyPlan(): void {

this.isLoading = true;
this.planService.getPolicyPlanById(this.id).subscribe({
  next: (response) => {
    if (!response.data) {
      this.isLoading = false;
      this.toastService.error('Policy plan not found.');
      this.router.navigate(['/viewplans']);
      this.cdr.detectChanges();
      return;
    }
    this.planForm.patchValue({
      productId: response.data.productId,
      planName: response.data.planName,
      coverageAmount: response.data.coverageAmount,
      premiumAmount: response.data.premiumAmount,
      premiumType: response.data.premiumType,
      duration: response.data.duration,
      termsAndConditions: response.data.termsAndConditions
    });
    this.isLoading = false;

    this.cdr.detectChanges();
  },
  error: (err: HttpErrorResponse) => {

    this.isLoading = false;

    const apiError = err.error as ErrorResponseDto;

    this.toastService.error(
      apiError?.message ?? 'Unable to load policy plan details.'
    );
    this.cdr.detectChanges();
  }
});
}
// Update policy plan.
editPolicyPlan(): void {
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
  productId: Number(this.productId.value),
  planName: String(this.planName.value).trim(),
  coverageAmount: Number(this.coverageAmount.value),
  premiumAmount: Number(this.premiumAmount.value),
  premiumType: this.premiumType.value,
  duration: Number(this.duration.value),
  termsAndConditions: String(
    this.termsAndConditions.value
  ).trim()

};

this.planService.updatePolicyPlan(this.id, request).subscribe({

  next: (response) => {

    this.isLoading = false;

    this.toastService.success(response.message);

    this.cdr.detectChanges();

    this.router.navigate(['/viewplans']);

  },

  error: (err: HttpErrorResponse) => {

    this.isLoading = false;

    const apiError = err.error as ErrorResponseDto;

    this.toastService.error(
      apiError?.message ?? 'Unable to update policy plan. Please try again.'
    );
    this.cdr.detectChanges();
  }

});
}
// Navigate to policy plans.
navigateToPlans(): void {
this.router.navigate(['/viewplans']);
}
// Form control getters.
get productId(): FormControl {
return this.planForm.get('productId') as FormControl;
}
get planName(): FormControl {
return this.planForm.get('planName') as FormControl;
}
get coverageAmount(): FormControl {
return this.planForm.get('coverageAmount') as FormControl;
}

get premiumAmount(): FormControl {
return this.planForm.get('premiumAmount') as FormControl;
}

get premiumType(): FormControl {
return this.planForm.get('premiumType') as FormControl;
}

get duration(): FormControl {
return this.planForm.get('duration') as FormControl;
}

get termsAndConditions(): FormControl {
return this.planForm.get('termsAndConditions') as FormControl;
}
}
