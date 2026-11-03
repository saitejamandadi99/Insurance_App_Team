import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/Auth/auth';
import { ToastService } from '../../services/Toast/toast-service';
import { VerifyEmailRequestDTO } from '../../DTO/VerifyEmailRequestDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../DTO/ErrorResponseDto';
import { ResendVerificationRequestDTO } from '../../DTO/ResendVerificationRequestDTO';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  standalone:true,
  selector: 'app-verify-email',
  styleUrl: './verify-email.css',
  templateUrl: './verify-email.html',
})
export class VerifyEmail {
  isVerifying: boolean = false;
  isResending: boolean = false;

  // Get registered email from localStorage
  registeredEmail: string = localStorage.getItem('registeredEmail') || '';
  verifyForm : FormGroup = new FormGroup({
    email:new FormControl(this.registeredEmail,[Validators.required, Validators.email]),
    otp:new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)])
  });

  constructor(private authService:Auth, private router:Router, private toastService:ToastService, private cdr: ChangeDetectorRef){}

  verifyEmail(){
    if (this.verifyForm.invalid || this.isVerifying) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.isVerifying = true;

    const request: VerifyEmailRequestDTO = this.verifyForm.value;

    this.authService.verifyEmail(request).subscribe({

      next: (response) => {
        this.isVerifying = false;
        this.toastService.success(response.message);
        localStorage.removeItem('registeredEmail');
        this.router.navigate(['/login']);
      },

      error: (err: HttpErrorResponse) => {
        this.isVerifying = false;
        const apiError = err.error as ErrorResponseDto;
        this.toastService.error(apiError?.message || 'Email verification failed.'
        );
        this.cdr.detectChanges();
      }
    });
  }

  resendOtp(){
      if (this.isResending) {
      return;
    }
    const emailControl = this.verifyForm.get('email');
    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      return;
    }
    this.isResending = true;
    const request: ResendVerificationRequestDTO = {email: emailControl.value.trim()};

    this.authService.resendOtp(request).subscribe({
      next: (response) => {
        this.isResending = false;
        // Update stored email in case the user edited it
        localStorage.setItem( 'registeredEmail', request.email);
        this.toastService.success(response.message);
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isResending = false;
        const apiError = err.error as ErrorResponseDto;
        this.toastService.error(apiError?.message || 'Unable to resend OTP.'
        );
      }
    });
  }
}
