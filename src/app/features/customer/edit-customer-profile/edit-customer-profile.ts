
import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { CustomerProfileServices } from '../../../services/CustomerProfile/customer-profile-services';
import { CustomerResponseDto } from '../../../DTO/CustomerResponseDto';
import { SuccessResponseDto } from '../../../DTO/SuccessResponseDto';
import { ErrorResponseDto } from '../../../DTO/ErrorResponseDto';

import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ToastService } from '../../../services/Toast/toast-service';

@Component({
  selector: 'app-edit-customer',
  imports: [
    ReactiveFormsModule,
    NgIf,
    PageHeader
  ],
  standalone: true,
  templateUrl: './edit-customer-profile.html',
  styleUrl: './edit-customer-profile.css'
})
export class EditCustomer implements OnInit, OnDestroy {

  customerId!: number;

  isLoading = false;
  isSubmitting = false;

  existingImageUrl: string | null = null;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  customerForm = new FormGroup({
    dateOfBirth: new FormControl('', Validators.required),

    address: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(150)
    ]),

    city: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30)
    ]),

    state: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30)
    ]),

    pincode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{6}$/)
    ]),

    nomineeName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]),

    nomineeRelationship: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ])
  });

  get dateOfBirth(): FormControl {
    return this.customerForm.get('dateOfBirth') as FormControl;
  }

  get pincode(): FormControl {
    return this.customerForm.get('pincode') as FormControl;
  }

  get state(): FormControl {
    return this.customerForm.get('state') as FormControl;
  }

  get city(): FormControl {
    return this.customerForm.get('city') as FormControl;
  }

  get address(): FormControl {
    return this.customerForm.get('address') as FormControl;
  }

  get nomineeName(): FormControl {
    return this.customerForm.get('nomineeName') as FormControl;
  }

  get nomineeRelationship(): FormControl {
    return this.customerForm.get('nomineeRelationship') as FormControl;
  }

  constructor(
    private customerProfileService: CustomerProfileServices,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomerProfile();
  }

  loadCustomerProfile(): void {

    this.isLoading = true;

    this.customerProfileService.getMyProfile().subscribe({

      next: (response: SuccessResponseDto<CustomerResponseDto>) => {

        const customer = response.data;

        if (!customer) {
          this.isLoading = false;
          this.toastService.error('Customer profile not found.');
          this.cdr.detectChanges();
          return;
        }

        this.customerId = customer.customerId;

        this.customerForm.patchValue({
          dateOfBirth: customer.dateOfBirth
            ? new Date(customer.dateOfBirth).toISOString().split('T')[0]
            : '',
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          nomineeName: customer.nomineeName,
          nomineeRelationship: customer.nomineeRelationship
        });

        this.existingImageUrl = customer.profileImageUrl ?? null;

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (err: HttpErrorResponse) => {

        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to load customer profile.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.toastService.error('Please select an image file.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastService.error('Image size must not exceed 5 MB.');
      input.value = '';
      return;
    }

    this.selectedImage = file;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = URL.createObjectURL(file);
  }

  updateCustomerProfile(): void {

    if (this.customerForm.invalid || this.isSubmitting) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const formValue = this.customerForm.getRawValue();
    const formData = new FormData();

    formData.append('DateOfBirth', formValue.dateOfBirth ?? '');
    formData.append('Address', (formValue.address ?? '').trim());
    formData.append('City', (formValue.city ?? '').trim());
    formData.append('State', (formValue.state ?? '').trim());
    formData.append('Pincode', formValue.pincode ?? '');
    formData.append('NomineeName', (formValue.nomineeName ?? '').trim());
    formData.append(
      'NomineeRelationship',
      (formValue.nomineeRelationship ?? '').trim()
    );

    if (this.selectedImage) {
      formData.append(
        'ProfileImage',
        this.selectedImage,
        this.selectedImage.name
      );
    }

    this.isSubmitting = true;

    this.customerProfileService
      .updateCustomerProfile(this.customerId, formData)
      .subscribe({

        next: (response) => {

          this.isSubmitting = false;

          this.toastService.info(response.message);

          this.cdr.detectChanges();

          this.router.navigate(['/myprofile']);
        },

        error: (err: HttpErrorResponse) => {

          this.isSubmitting = false;

          const apiError = err.error as ErrorResponseDto;

          this.toastService.error(
            apiError?.message ?? 'Unable to update customer profile.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/myprofile']);
  }

  ngOnDestroy(): void {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }
}
