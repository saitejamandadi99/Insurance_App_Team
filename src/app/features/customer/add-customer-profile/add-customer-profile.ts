import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { CustomerProfileServices } from '../../../services/CustomerProfile/customer-profile-services';
import { ErrorResponseDto } from '../../../DTO/ErrorResponseDto';
import { ToastService } from '../../../services/Toast/toast-service';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  standalone: true,
  selector: 'app-add-customer',
  styleUrl: './add-customer-profile.css',
templateUrl: './add-customer-profile.html'
})
export class AddCustomer implements OnDestroy {

  isLoading = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  customerForm: FormGroup = new FormGroup({
    dateOfBirth: new FormControl('', [
      Validators.required
    ]),

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
      Validators.pattern(/^[0-9]{6}$/)
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

  constructor(
    private customerProfileService: CustomerProfileServices,
    private router: Router,
    private toastService: ToastService
  ) {}

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.toastService.error('Please select a valid image file.');
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

  addCustomerProfile(): void {
    if (this.customerForm.invalid || this.isLoading) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

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

    this.customerProfileService.addCustomerProfile(formData).subscribe({
      next: (response) => {
        this.isLoading = false;

        this.toastService.info(response.message);
        this.router.navigate(['/customer-profile/view']);
      },

      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ??
          'Unable to create customer profile. Please try again.'
        );
      }
    });
  }

  navigateToCustomers(): void {
    this.router.navigate(['/customer-profile/view']);
  }

  getdateOfBirth(): FormControl {
    return this.customerForm.get('dateOfBirth') as FormControl;
  }

  getaddress(): FormControl {
    return this.customerForm.get('address') as FormControl;
  }

  getcity(): FormControl {
    return this.customerForm.get('city') as FormControl;
  }

  getstate(): FormControl {
    return this.customerForm.get('state') as FormControl;
  }

  getpincode(): FormControl {
    return this.customerForm.get('pincode') as FormControl;
  }

  getnomineeName(): FormControl {
    return this.customerForm.get('nomineeName') as FormControl;
  }

  getnomineeRelationship(): FormControl {
    return this.customerForm.get('nomineeRelationship') as FormControl;
  }

  ngOnDestroy(): void {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }
}