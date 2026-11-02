import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { PaginationResponseDto } from '../../../DTO/PaginationResponseDto';
import { CustomerResponseDto } from '../../../DTO/CustomerResponseDto';
import { CustomerProfileServices } from '../../../services/CustomerProfile/customer-profile-services';
import { ToastService } from '../../../services/Toast/toast-service';

@Component({
imports: [ReactiveFormsModule, DatePipe, NgIf, NgFor],
standalone: true,
selector: 'app-view-customer',
styleUrl: './view-customer-profile.css',
templateUrl: './view-customer-profile.html',
})
export class ViewCustomer implements OnInit {

customers!: PaginationResponseDto<CustomerResponseDto>;

isLoading = false;

filterForm: FormGroup = new FormGroup({
search: new FormControl(''),
sortBy: new FormControl('createdDate'),
sortDirection: new FormControl('desc'),
pageNumber: new FormControl(1),
pageSize: new FormControl(10),
});

constructor(
private customerProfileService: CustomerProfileServices,
private toastService: ToastService,
private router: Router,
private cdr: ChangeDetectorRef
) {}

loadCustomers(): void {
this.isLoading = true;

const filters = this.filterForm.value;

this.customerProfileService.listCustomerProfiles(
  filters.pageNumber ?? 1,
  filters.pageSize ?? 10,
  filters.sortBy ?? 'createdDate',
  filters.sortDirection ?? 'desc',
  filters.search ?? ''
).subscribe({

  next: (response) => {
    this.customers = response.data;
    this.isLoading = false;

    this.toastService.info(response.message);
    this.cdr.detectChanges();
  },

  error: (err: HttpErrorResponse) => {
    this.isLoading = false;

    const apiError = err.error;
    this.toastService.error(
      apiError?.message ?? 'Unable to load customer profiles.'
    );

    this.cdr.detectChanges();
  }

});

}

ngOnInit(): void {
this.loadCustomers();
}

resetFilters(): void {
this.filterForm.reset({
search: '',
sortBy: 'createdDate',
sortDirection: 'desc',
pageNumber: 1,
pageSize: 10
});

this.loadCustomers();

}

searchCustomers(): void {
this.filterForm.patchValue({
pageNumber: 1
});

this.loadCustomers();

}

clearSearch(): void {
this.filterForm.patchValue({
search: '',
pageNumber: 1
});

this.loadCustomers();

}

previousPage(): void {
if (this.customers && this.customers.currentPage > 1) {
this.filterForm.patchValue({
pageNumber: this.customers.currentPage - 1
});

  this.loadCustomers();
}

}

nextPage(): void {
if (this.customers && !this.customers.isLastPage) {
this.filterForm.patchValue({
pageNumber: this.customers.currentPage + 1
});

  this.loadCustomers();
}

}

viewCustomerProfile(id: number): void {
this.router.navigate(['/customer-profile/view', id]);
}

navigateToAddCustomer(): void {
this.router.navigate(['/customer-profile/add']);
}

get searchControl(): FormControl {
return this.filterForm.get('search') as FormControl;
}

}
