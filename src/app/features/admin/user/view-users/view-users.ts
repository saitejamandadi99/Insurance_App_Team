import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { UserResponseDto } from '../../../../DTO/UserResponseDto';
import { User } from '../../../../services/User/user';
import { ToastService } from '../../../../services/Toast/toast-service';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule, DatePipe],
  standalone:true,
  selector: 'app-view-users',
  styleUrl: './view-users.css',
  templateUrl: './view-users.html',
})
export class ViewUsers implements OnInit {
  users!:PaginationResponseDto<UserResponseDto>;
  isLoading=false;
  isUpdatingStatus = false;

  filterForm:FormGroup = new FormGroup({
    search : new FormControl(''),
    sortBy:new FormControl('fullName'),
    sortDirection: new FormControl('asc'),
    pageNumber: new FormControl(1),
    pageSize:new FormControl(10),
  });

  constructor(private userService:User, private toastService:ToastService, private router:Router, private cdr:ChangeDetectorRef){}

  loadUsers(){
    this.isLoading = true;
    const filters = this.filterForm.value;
    this.userService.listUsers(
      filters.pageNumber ?? 1,filters.pageSize ?? 10, filters.sortBy ?? 'fullName', filters.sortDirection ?? 'asc', filters.search ?? ''
    ).subscribe({
      next:(response)=>{
        this.users = response.data;
        this.isLoading = false;
        this.toastService.info(response.message);
        this.cdr.detectChanges();
      },

      error:(err:HttpErrorResponse)=>{
        this.isLoading = false;
        const apiError = err.error as HttpErrorResponse;
        this.toastService.error(apiError.message);
      }
    })
  }

  ngOnInit(): void {
    this.loadUsers();    
  }

  resetFilters(){
    this.filterForm.reset({
      search:'',
      sortBy:'fullName',
      sortDirection:'asc',
      pageNumber:1,
      pageSize:10
    });

    this.loadUsers();
  }

  searchUsers(): void {
    this.filterForm.patchValue({
      pageNumber: 1
    });

    this.loadUsers();
  }

  // Clear search
  clearSearch(): void {
    this.filterForm.patchValue({
      search: '',
      pageNumber: 1
    });

    this.loadUsers();
  }

  previousPage(): void {
    if (this.users && this.users.currentPage > 1) {
      this.filterForm.patchValue({
        pageNumber: this.users.currentPage - 1
      });

      this.loadUsers();
    }
  }

  // Navigate to the next page
  nextPage(): void {
    if (this.users && !this.users.isLastPage) {
      this.filterForm.patchValue({
        pageNumber: this.users.currentPage + 1
      });

      this.loadUsers();
    }
  }

  activateUser(id:number){
    if(this.isUpdatingStatus) return;

    this.isUpdatingStatus = true;

    this.userService.activateUser(id).subscribe({
      next:(response)=>{
        this.isUpdatingStatus = false;
        this.toastService.info(response.message);
        this.cdr.detectChanges();
        this.loadUsers();
      },
      error:(err:HttpErrorResponse)=>{
        this.isUpdatingStatus = false;
        const apiError = err.error as HttpErrorResponse;
        this.toastService.error(apiError.message);
      }
    })
  }

  deactivateUser(id:number){
    if(this.isUpdatingStatus) return;

    this.isUpdatingStatus = true;

    this.userService.deactivateUser(id).subscribe({
      next:(response)=>{
        this.isUpdatingStatus = false;
        this.toastService.info(response.message);
        this.cdr.detectChanges();
        this.loadUsers();

      },
      error:(err:HttpErrorResponse)=>{
        this.isUpdatingStatus = false;
        const apiError = err.error as HttpErrorResponse;
        this.toastService.error(apiError.message);
      }
    })
  }

navigateToAddUser(): void {
    this.router.navigate(['/adduser']);
  }

  // Search form control
  get searchControl(): FormControl {
    return this.filterForm.get('search') as FormControl;
  }


}
