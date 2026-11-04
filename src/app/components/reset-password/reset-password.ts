import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Auth } from '../../services/Auth/auth';
import { ToastService } from '../../services/Toast/toast-service';
import { ResetPasswordRequestDTO } from '../../DTO/ResetPasswordRequestDTO';
import { ErrorResponseDto } from '../../DTO/ErrorResponseDto';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

  isLoading: boolean = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  resetPasswordForm: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    otp: new FormControl('', [
      Validators.required
    ]),

    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$!]).{8,20}$')
    ]),

    confirmPassword: new FormControl('', [
      Validators.required
    ])

  }, {
    validators: this.passwordMatchValidator
  });

  constructor(
    private authService: Auth,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const email = history.state?.email || '';

    // if (!email) {
    //   this.toastService.error('Please initiate the forgot password process again.');
    //   this.router.navigate(['/login']);
    //   return;
    // }

    this.resetPasswordForm.patchValue({
      email: email
    });

  }

  // Check whether new password and confirm password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {

    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPassword(): void {

    if (this.resetPasswordForm.invalid || this.isLoading) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const request: ResetPasswordRequestDTO =
      this.resetPasswordForm.getRawValue();

    this.authService.resetPassword(request).subscribe({

      next: (response) => {

        this.isLoading = false;

        this.toastService.success(response.message);

        this.router.navigate(['/login']);

      },

      error: (err: HttpErrorResponse) => {

        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(apiError.message);

        this.cdr.detectChanges();

      }

    });

  }

}