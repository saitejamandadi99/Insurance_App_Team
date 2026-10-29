import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { PaginationResponseDto } from '../../DTO/PaginationResponseDto';
import { ProductResponseDto } from '../../DTO/ProductResponseDto';
import { environment } from '../../Environments/environment';
import { ProductRequestDto } from '../../DTO/ProductRequestDto';

@Injectable({
    providedIn:'root'
})
export class Product {
    constructor(private httpClient:HttpClient){}

    listProducts(pageNumber:number, pageSize:number, sortBy:string, sortDirection:string, search:string):Observable<SuccessResponseDto<PaginationResponseDto<ProductResponseDto>>>{
        const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize).set('sortBy', sortBy).set('sortDirection', sortDirection).set('search', search)

        return this.httpClient.get<SuccessResponseDto<PaginationResponseDto<ProductResponseDto>>>(`${environment.apiUrl}/Product`, {params});
    }


    addProduct(productRequest: ProductRequestDto):Observable<SuccessResponseDto<ProductResponseDto>>{
        return this.httpClient.post<SuccessResponseDto<ProductResponseDto>>(`${environment.apiUrl}/Product`, productRequest);
    }

    getProductById(id:number):Observable<SuccessResponseDto<ProductResponseDto>>{
        return this.httpClient.get<SuccessResponseDto<ProductResponseDto>>(`${environment.apiUrl}/Product/${id}`);
    }

    updateProduct(id:number, productRequest:ProductRequestDto):Observable<SuccessResponseDto<ProductResponseDto>>{
        return this.httpClient.put<SuccessResponseDto<ProductResponseDto>>(`${environment.apiUrl}/Product/${id}`, productRequest);
    }

    activateProduct(id:number):Observable<SuccessResponseDto<ProductResponseDto>>{
        return this.httpClient.put<SuccessResponseDto<ProductResponseDto>>(`${environment.apiUrl}/Product/activate/${id}`, {})
    }
    
    deactivateProduct(id:number):Observable<SuccessResponseDto<ProductResponseDto>>{
        return this.httpClient.put<SuccessResponseDto<ProductResponseDto>>(`${environment.apiUrl}/Product/deactivate/${id}`, {})
    }


}
