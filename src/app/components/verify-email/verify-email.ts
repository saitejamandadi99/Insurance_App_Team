import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/Auth/auth';
import { ToastService } from '../../services/Toast/toast-service';
import { VerifyEmailRequestDTO } from '../../DTO/VerifyEmailRequestDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../DTO/ErrorResponseDto';
import { ResendVerificationRequestDTO } from '../../DTO/ResendVerificationRequestDTO';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  standalone:true,
  selector: 'app-verify-email',
  styleUrl: './verify-email.css',
  templateUrl: './verify-email.html',
})
export class VerifyEmail {
  isLoading:boolean = false;
  verifyForm : FormGroup = new FormGroup({
    email:new FormControl('',[Validators.required, Validators.email]),
    otp:new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)])
  });

  constructor(private authService:Auth, private router:Router, private toastService:ToastService){}

  verifyEmail(){
    if(this.verifyForm.invalid || this.isLoading) return;
    this.isLoading = true;
    const request : VerifyEmailRequestDTO = this.verifyForm.value;

    this.authService.verifyEmail(request).subscribe({
      next:(response)=>{
        this.isLoading = false;
        this.toastService.success(response.message);
        this.router.navigate(['/login']);
      },
      error:(err:HttpErrorResponse)=>{
        this.isLoading = false;
        const apiError = err.error as ErrorResponseDto;
        this.toastService.error(apiError.message);
      }
    })
  }

  resendOtp(){
      if (this.isLoading) return;
      const emailControl = this.verifyForm.get('email');

      if (!emailControl || emailControl.invalid) {
        emailControl?.markAsTouched();
        return;
      }

      this.isLoading = true;

      const request: ResendVerificationRequestDTO = {
        email: emailControl.value
      };

    this.authService.resendOtp(request).subscribe({
      next:(response)=>{
        this.isLoading = false;
        this.toastService.success(response.message);
      },
       error:(err:HttpErrorResponse)=>{
        this.isLoading = false;
        const apiError = err.error as ErrorResponseDto;
        this.toastService.error(apiError.message);
      }
    })
  }
}
