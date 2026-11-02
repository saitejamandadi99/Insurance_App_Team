import { CurrencyPipe, DatePipe, NgIf, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { PolicyPlanServices } from '../../../../services/PolicyPlan/policy-plan-services';
import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { PolicyPlanResponseDto } from '../../../../DTO/PolicyPlanResponseDto';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { FilterCard } from '../../../../shared/ui/filter-card/filter-card';
import { SearchBox } from '../../../../shared/ui/search-box/search-box';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { ActionButtons } from '../../../../shared/ui/action-buttons/action-buttons';
import { Pagination } from '../../../../shared/ui/pagination/pagination';
import { LoadingSpinner } from '../../../../shared/ui/loading-spinner/loading-spinner';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';

import { Role } from '../../../../Enums/Role';
import { ActiveStatus } from '../../../../Enums/ActiveStatus';
import { ToastService } from '../../../../services/Toast/toast-service';

@Component({
selector: 'app-view-plans-component',
standalone: true,
imports: [
ReactiveFormsModule,
NgIf,
NgFor,
CurrencyPipe,
DatePipe,
PageHeader,
FilterCard,
SearchBox,
StatusBadge,
ActionButtons,
Pagination,
LoadingSpinner,
EmptyState
],
templateUrl: './view-policy-plan-component.html',
styleUrl: './view-policy-plan-component.css'

})
export class ViewPlansComponent implements OnInit {

isLoading = false;

lstPlans!: PaginationResponseDto<PolicyPlanResponseDto>;

role: string = localStorage.getItem('role') ?? '';
isAdmin: boolean = this.role === Role.Admin.toString();

filterForm = new FormGroup({
search: new FormControl(''),
sortBy: new FormControl('planName'),
sortDirection: new FormControl('asc'),
pageNumber: new FormControl(1),
pageSize: new FormControl(10)
});

constructor(
private readonly planService: PolicyPlanServices,
private readonly router: Router,
private readonly cdr: ChangeDetectorRef,
private readonly toastService: ToastService
) {}

ngOnInit(): void {
this.loadPlans();
}

loadPlans(): void {
this.isLoading = true;
const filters = this.filterForm.getRawValue();

this.planService.listPolicyPlans(
  filters.pageNumber ?? 1,
  filters.pageSize ?? 10,
  filters.sortBy ?? 'planName',
  filters.sortDirection ?? 'asc',
  filters.search ?? ''
).subscribe({
  next: (response) => {
    const plans = response.data;

    if (this.isAdmin) {
      this.lstPlans = plans;
    } else {
      this.lstPlans = {
        ...plans,
        records: plans.records.filter(
          plan => plan.activeStatus === ActiveStatus.Active
        )
      };
    }

    this.isLoading = false;
    this.cdr.detectChanges();
  },

  error: (err: HttpErrorResponse) => {
    this.isLoading = false;

    const apiError = err.error as ErrorResponseDto;

    this.toastService.error(
      apiError?.message ?? 'Unable to retrieve policy plans.'
    );

    this.cdr.detectChanges();
  }
});
}

searchPlans(): void {
this.filterForm.patchValue({ pageNumber: 1 });
this.loadPlans();
}

resetFilters(): void {
this.filterForm.reset({
search: '',
sortBy: 'planName',
sortDirection: 'asc',
pageNumber: 1,
pageSize: 10
});
this.loadPlans();
}

clearSearch(): void {
this.filterForm.patchValue({
search: '',
pageNumber: 1
});
this.loadPlans();
}

previousPage(): void {
if (this.lstPlans && this.lstPlans.currentPage > 1) {
this.filterForm.patchValue({
pageNumber: this.lstPlans.currentPage - 1
});
  this.loadPlans();
}
}

nextPage(): void {
if (this.lstPlans && !this.lstPlans.isLastPage) {
this.filterForm.patchValue({
pageNumber: this.lstPlans.currentPage + 1
});
  this.loadPlans();
}
}

activatePlan(id: number): void {
this.planService.activatePolicyPlan(id).subscribe({
next: (response) => {
this.toastService.info(response.message);
this.loadPlans();
},
  error: (err: HttpErrorResponse) => {
    const apiError = err.error as ErrorResponseDto;

    this.toastService.error(
      apiError?.message ?? 'Unable to activate the plan.'
    );
  }
});
}

deactivatePlan(id: number): void {
this.planService.deactivatePolicyPlan(id).subscribe({
next: (response) => {
this.toastService.info(response.message);
this.loadPlans();
},

  error: (err: HttpErrorResponse) => {
    const apiError = err.error as ErrorResponseDto;

    this.toastService.error(
      apiError?.message ?? 'Unable to deactivate the plan.'
    );
  }
});
}

editPlan(id: number): void {
this.router.navigate(['/editplan', id]);
}

navigateToAddPlan(): void {
this.router.navigate(['/addplan']);
}

get searchControl(): FormControl {
return this.filterForm.get('search') as FormControl;
}
}
