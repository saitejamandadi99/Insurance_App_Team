import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { PaginationResponseDto } from '../../DTO/PaginationResponseDto';
import { UserResponseDto } from '../../DTO/UserResponseDto';
import { environment } from '../../Environments/environment';
import { RegisterRequestDto } from '../../DTO/RegisterRequestDto';

@Injectable({
    providedIn:'root'
})
export class User {
    constructor(private httpClient : HttpClient){}

    listUsers(pageNumber:number, pageSize:number,sortBy:string, sortDirection:string, search:string):Observable<SuccessResponseDto<PaginationResponseDto<UserResponseDto>>>{
        const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize).set('sortBy', sortBy).set('sortDirection', sortDirection).set('search', search)

        return this.httpClient.get<SuccessResponseDto<PaginationResponseDto<UserResponseDto>>>(`${environment.apiUrl}/User`, {params});
    }
    

    addUser(userRequest:RegisterRequestDto):Observable<SuccessResponseDto<UserResponseDto>>{
        return this.httpClient.post<SuccessResponseDto<UserResponseDto>>(`${environment.apiUrl}/User`, userRequest);
    }

    getUserById(id:number):Observable<SuccessResponseDto<UserResponseDto>>{
        return this.httpClient.get<SuccessResponseDto<UserResponseDto>>(`${environment.apiUrl}/User/${id}`)
    }

    activateUser(id:number):Observable<SuccessResponseDto<UserResponseDto>>{
        return this.httpClient.put<SuccessResponseDto<UserResponseDto>>(`${environment.apiUrl}/User/activate/${id}`, {})
    }

    deactivateUser(id:number):Observable<SuccessResponseDto<UserResponseDto>>{
        return this.httpClient.put<SuccessResponseDto<UserResponseDto>>(`${environment.apiUrl}/User/deactivate/${id}`, {})
    }

}
