import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../services/User/user';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { RegisterRequestDto } from '../../../../DTO/RegisterRequestDto';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  standalone:true,
  selector: 'app-add-user',
  styleUrl: './add-user.css',
  templateUrl: './add-user.html',
})
export class AddUser {
  isLoading = false;
  userForm :FormGroup= new FormGroup({
    fullName:new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email:new FormControl('',[Validators.required, Validators.email]),
     password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$!]).{8,20}$')]),

    mobileNumber: new FormControl('', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")])
  });

  constructor(private userService:User, private router:Router, private toastService:ToastService){}

  addOfficer(){
    if(this.userForm.invalid || this.isLoading ){
      this.userForm.markAsTouched();
      return;
    }

    this.isLoading =true;
    const request: RegisterRequestDto = this.userForm.value;
    this.userService.addUser(request).subscribe({
      next:(response)=>{
        this.isLoading = false;
        this.toastService.info(response.message);
        this.router.navigate(['/viewusers']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;
        this.toastService.error(
          apiError?.message ?? 'Unable to add user. Please try again.'
        );
      }
    })
  }

  navigateToUsers(){
    this.router.navigate(['/viewusers']);
  }
  getfullName():FormControl{
    return this.userForm.get('fullName') as FormControl;
  }

  
  getemail():FormControl{
    return this.userForm.get('email') as FormControl;
  }

  
  getpassword():FormControl{
    return this.userForm.get('password') as FormControl;
  }

  
  getmobileNumber():FormControl{
    return this.userForm.get('mobileNumber') as FormControl;
  }

}
