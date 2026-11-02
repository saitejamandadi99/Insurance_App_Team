import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  registerForm :FormGroup = new FormGroup({
    fullName:new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),

    email:new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$!]).{8,20}$')]),

    mobileNumber: new FormControl('', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]),

    confirmPassword: new FormControl('', [
      Validators.required
    ])

  }, {
    validators: this.passwordMatchValidator
  }); 

  constructor(private authService: Auth, private router:Router, private toastServcie:ToastService){}

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!confirmPassword) {
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

  registerUser(){
    if(this.registerForm.invalid ||  this.isLoading)  {
      this.registerForm.markAllAsTouched();
    return;
    }
    this.isLoading = true;
    const { confirmPassword, ...registrationData } =
      this.registerForm.getRawValue();
    const request:RegisterRequestDto = registrationData;

    this.authService.registerUser(request).subscribe({
      next:(response)=>{
        this.isLoading = false;
        localStorage.setItem('registeredEmail', request.email);
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
