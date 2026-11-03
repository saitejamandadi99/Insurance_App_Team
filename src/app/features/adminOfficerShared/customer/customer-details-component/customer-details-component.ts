import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { SuccessResponseDto } from '../../../../DTO/SuccessResponseDto';
import { CustomerResponseDto } from '../../../../DTO/CustomerResponseDto';

import { CustomerProfileServices } from '../../../../services/CustomerProfile/customer-profile-services';

import { ActivatedRoute } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';

import { DatePipe, NgIf } from '@angular/common';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';

import { ToastService } from '../../../../services/Toast/toast-service';

@Component({
selector: 'app-customer-details-component',
standalone: true,
imports: [DatePipe, PageHeader, LoadingSpinner, NgIf],
templateUrl: './customer-details-component.html',
styleUrl: './customer-details-component.css',
})
export class CustomerDetailsComponent implements OnInit {

id!: number;

profileDetails!: SuccessResponseDto<CustomerResponseDto>;

isLoading = true;

constructor(
private cusService: CustomerProfileServices,
private activedRoute: ActivatedRoute,
private cdr: ChangeDetectorRef,
private toastService: ToastService
) {}

ngOnInit(): void {
const idParam = this.activedRoute.snapshot.paramMap.get('customerId');

this.id = Number(idParam);

if (!idParam || !Number.isInteger(this.id) || this.id <= 0) {
  this.isLoading = false;

  this.toastService.error('Invalid customer ID.');

  this.cdr.detectChanges();

  return;
}

this.cusService.getCustomerDetailsById(this.id).subscribe({

  next: (response: SuccessResponseDto<CustomerResponseDto>) => {

    this.profileDetails = response;

    this.isLoading = false;

    this.cdr.detectChanges();

    this.toastService.info('Customer profile fetched successfully.');

  },

  error: (err: HttpErrorResponse) => {

    this.isLoading = false;

    const apiError = err.error as ErrorResponseDto;

    this.toastService.error(
      apiError?.message ?? 'Unable to fetch customer details.'
    );

    this.cdr.detectChanges();
  }
});
}

}
