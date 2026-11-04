import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/Auth/auth';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/Toast/toast-service';
import { LoginRequestDto } from '../../DTO/LoginRequestDto';
import { Role } from '../../Enums/Role';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../DTO/ErrorResponseDto';
import { ChangeDetectorRef } from '@angular/core';
import { ForgotPasswordRequestDTO } from '../../DTO/ForgotPasswordRequestDTO';
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  standalone:true,
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  isLoading:boolean = false;
  showPassword: boolean = false;
  isForgotPasswordLoading: boolean = false;
  loginForm : FormGroup = new FormGroup({
    email:new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService:Auth, private router:Router, private toastService:ToastService, private cdr:ChangeDetectorRef ){}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loginUser(){
    if(this.loginForm.invalid || this.isLoading 
    ) return;
    this.isLoading = true;
    const request : LoginRequestDto = this.loginForm.value;

    this.authService.loginUser(request).subscribe({
      next:(response)=>{
        this.isLoading = false;
        this.authService.saveToken(response)
        const role = this.authService.getRole();
        switch(role){
          case Role.Admin:
            this.router.navigate(['/admindashboard']);
            break;
          case Role.Officer:
            this.router.navigate(['/officerdashboard']);
            break;
          case Role.Customer:
            this.router.navigate(['/customerdashboard']);
            break;
          default:
            this.router.navigate(['/not-found']);
            break;
        }
      }, error:(err:HttpErrorResponse) =>{
        this.isLoading = false;
        console.log('Login error:', err.error);
  console.log('Calling toast service');
        const apiError = err.error as ErrorResponseDto
        this.toastService.error(apiError.message);
        this.cdr.detectChanges();
      },
    })
  }

  forgotPassword(): void {

  const emailControl = this.loginForm.get('email');

  if (!emailControl || emailControl.invalid) {
    emailControl?.markAsTouched();
    this.toastService.error('Please enter a valid email address');
    return;
  }

  if (this.isForgotPasswordLoading) return;

  this.isForgotPasswordLoading = true;

  const request: ForgotPasswordRequestDTO = {
    email: emailControl.value
  };

  this.authService.forgotPassword(request).subscribe({

    next: (response) => {
      this.isForgotPasswordLoading = false;

      this.toastService.success(response.message);

      this.router.navigate(['/reset-password'], {
        state: { email: request.email } //state is used to pass data to the next route without exposing it in the URL
      });
    },

    error: (err: HttpErrorResponse) => {
      this.isForgotPasswordLoading = false;

      const apiError = err.error as ErrorResponseDto;

      this.toastService.error(apiError.message);
      this.cdr.detectChanges();
    }

  });
}
}


