import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { PaginationResponseDto } from '../../DTO/PaginationResponseDto';
import { CustomerResponseDto } from '../../DTO/CustomerResponseDto';

import { environment } from '../../Environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomerProfileServices {

    constructor(private http: HttpClient) { }

    // GET: api/CustomerProfile
    listCustomerProfiles(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        search: string
    ): Observable<SuccessResponseDto<PaginationResponseDto<CustomerResponseDto>>> {

        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize)
            .set('sortBy', sortBy)
            .set('sortDirection', sortDirection)
            .set('search', search);

        return this.http.get<
            SuccessResponseDto<PaginationResponseDto<CustomerResponseDto>>
        >(`${environment.apiUrl}/CustomerProfile`, { params });
    }

    // POST: api/CustomerProfile
    addCustomerProfile(
        formData: FormData
    ): Observable<SuccessResponseDto<CustomerResponseDto>> {

        return this.http.post<SuccessResponseDto<CustomerResponseDto>>(
            `${environment.apiUrl}/CustomerProfile`,
            formData
        );
    }

    // PUT: api/CustomerProfile?id={id}
    updateCustomerProfile(
        id: number,
        formData: FormData
    ): Observable<SuccessResponseDto<CustomerResponseDto>> {

        const params = new HttpParams().set('id', id);

        return this.http.put<SuccessResponseDto<CustomerResponseDto>>(
            `${environment.apiUrl}/CustomerProfile`,
            formData,
            { params }
        );
    }

    // GET: api/CustomerProfile/my-profile
    getMyProfile(): Observable<SuccessResponseDto<CustomerResponseDto>> {

        return this.http.get<SuccessResponseDto<CustomerResponseDto>>(
            `${environment.apiUrl}/CustomerProfile/my-profile`
        );
    }

    // GET: api/CustomerProfile/{id}
    getCustomerDetailsById(
        id: number
    ): Observable<SuccessResponseDto<CustomerResponseDto>> {

        return this.http.get<SuccessResponseDto<CustomerResponseDto>>(
            `${environment.apiUrl}/CustomerProfile/${id}`
        );
    }

    // GET: api/CustomerProfile/user/{userId}
    getCustomerDetailsByUserId(
        userId: number
    ): Observable<SuccessResponseDto<CustomerResponseDto>> {

        return this.http.get<SuccessResponseDto<CustomerResponseDto>>(
            `${environment.apiUrl}/CustomerProfile/user/${userId}`
        );
    }
}