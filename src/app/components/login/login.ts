import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/Auth/auth';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/Toast/toast-service';
import { LoginRequestDto } from '../../DTO/LoginRequestDto';
import { Role } from '../../Enums/Role';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../DTO/ErrorResponseDto';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  standalone:true,
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  isLoading:boolean = false;
  loginForm : FormGroup = new FormGroup({
    email:new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService:Auth, private router:Router, private toastService:ToastService ){}

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
        const apiError = err.error as ErrorResponseDto
        this.toastService.error(apiError.message);
          
      },
    })
  }
}
