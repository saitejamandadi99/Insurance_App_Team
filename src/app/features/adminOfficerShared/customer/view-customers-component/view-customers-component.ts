import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { CustomerResponseDto } from '../../../../DTO/CustomerResponseDto';
import { CustomerProfileServices } from '../../../../services/CustomerProfile/customer-profile-services';
import { ToastService } from '../../../../services/Toast/toast-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
imports: [ReactiveFormsModule],
standalone: true,
selector: 'app-view-customer',
styleUrl: './view-customers-component.css',
templateUrl: './view-customers-component.html',
})
export class ViewCustomerComponent implements OnInit {

customers!: PaginationResponseDto<CustomerResponseDto>;

isLoading = false;

filterForm: FormGroup = new FormGroup({
search: new FormControl(''),
sortBy: new FormControl('fullName'),
sortDirection: new FormControl('asc'),
pageNumber: new FormControl(1),
pageSize: new FormControl(10),
});

constructor(
private customerService: CustomerProfileServices,
private toastService: ToastService,
private router: Router,
private cdr: ChangeDetectorRef
) {}
loadCustomers(): void {
this.isLoading = true;
const filters = this.filterForm.value;

this.customerService.listCustomerProfiles(
    filters.pageNumber ?? 1,
  filters.pageSize ?? 10,
  filters.sortBy ?? 'fullName',
  filters.sortDirection ?? 'asc',
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
      apiError?.message ?? 'Unable to load customers.'
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
sortBy: 'fullName',
sortDirection: 'asc',
pageNumber: 1,
pageSize: 10
});
this.loadCustomers();
}

searchCustomers(): void {
this.filterForm.patchValue({ pageNumber: 1 });
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
viewCustomer(customerId: number): void {
this.router.navigate(['/customer-details', customerId]);
}
get searchControl(): FormControl {
return this.filterForm.get('search') as FormControl;
}
}
