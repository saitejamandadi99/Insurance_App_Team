import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequestDto } from '../../DTO/LoginRequestDto';
import { Observable } from 'rxjs';
import { LoginResponseDto } from '../../DTO/LoginResponseDto';
import { environment } from '../../Environments/environment';
import { RegisterRequestDto } from '../../DTO/RegisterRequestDto';
import { RegisterResponseDto } from '../../DTO/RegisterResponseDto';
import { Role } from '../../Enums/Role';
import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { VerifyEmailRequestDTO } from '../../DTO/VerifyEmailRequestDTO';
import { ResendVerificationRequestDTO } from '../../DTO/ResendVerificationRequestDTO';

@Injectable({
    providedIn:'root'
})
export class Auth {

    constructor(private httpClient:HttpClient){}

    loginUser(loginUser:LoginRequestDto):Observable<LoginResponseDto>{
        return this.httpClient.post<LoginResponseDto>(`${environment.apiUrl}/Auth/login`, loginUser);
    }

    registerUser(registerUser:RegisterRequestDto):Observable<RegisterResponseDto>{
        return this.httpClient.post<RegisterResponseDto>(`${environment.apiUrl}/Auth/register`, registerUser);
    }

    verifyEmail(verifyEmail:VerifyEmailRequestDTO):Observable<SuccessResponseDto<string>> {
         return this.httpClient.post<SuccessResponseDto<string>>( `${environment.apiUrl}/Auth/verify-email`,  verifyEmail);

    }

    resendOtp(resendOtp:ResendVerificationRequestDTO):Observable<SuccessResponseDto<string>>{
        return this.httpClient.post<SuccessResponseDto<string>>(`${environment.apiUrl}/Auth/resend-verification`, resendOtp);
    }



    saveToken(response:LoginResponseDto){
        localStorage.setItem("token", response.jwtToken);
        localStorage.setItem("role",response.userRole);
        localStorage.setItem("email", response.userEmail);
        const payloadBase64 = response.jwtToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64)) //converts the base64 into json 
        localStorage.setItem("fullName", decodedPayload["fullName"]);
        localStorage.setItem("userId", decodedPayload["userId"]);
    }

    getFullName():string | null{
        return localStorage.getItem("fullName");
    };

    getUserEmail():string | null{
        return localStorage.getItem("email");
    }

    getUserId():number{
        return Number(localStorage.getItem("userId"));
    }

    getToken():string|null{
        return localStorage.getItem("token");
    }

    getRole():Role|null{
        return localStorage.getItem("role") as Role | null;
    }

    isLoggedIn():boolean{
        var token = localStorage.getItem("token");
        return token !== null;
    }

    logout(){
        localStorage.removeItem('fullName');
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
    }
}
