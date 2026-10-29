import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/Auth/auth';
import { Router, RouterLink } from '@angular/router';
import { Toast } from '../../Enums/Toast';
import { RegisterRequestDto } from '../../DTO/RegisterRequestDto';
import { ToastService } from '../../services/Toast/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../DTO/ErrorResponseDto';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  standalone: true,
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  isLoading:boolean = false;
  registerForm :FormGroup = new FormGroup({
    fullName:new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),

    email:new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$!]).{8,20}$')]),

    mobileNumber: new FormControl('', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")])
  }); 

  constructor(private authService: Auth, private router:Router, private toastServcie:ToastService){}

  registerUser(){
    if(this.registerForm.invalid ||  this.isLoading) return;

    this.isLoading = true;
    const request:RegisterRequestDto = this.registerForm.value;

    this.authService.registerUser(request).subscribe({
      next:(response)=>{
        this.isLoading = false;
        this.toastServcie.success(response.message);
        this.router.navigate(['/verify-email']);
      }, 
      error:(err:HttpErrorResponse)=>{
        this.isLoading = false;
        const apiError = err.error as ErrorResponseDto;
        this.toastServcie.error(apiError.message);
      }
    })
  }


}
