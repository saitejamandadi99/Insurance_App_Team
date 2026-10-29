import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { PaginationResponseDto } from '../../DTO/PaginationResponseDto';
import { ClaimDocumentResponseDto } from '../../DTO/ClaimDocumentResponseDto';
import { environment } from '../../Environments/environment';

@Injectable({
    providedIn:'root'
})
export class ClaimDocument {
    constructor(private httpClient:HttpClient){}

    listClaimDocuments(pageNumber:number, pageSize:number, sortBy:string, sortDirection:string, search:string):Observable<SuccessResponseDto<PaginationResponseDto<ClaimDocumentResponseDto>>>{
        const params = new HttpParams().set('pageNumber', pageNumber)
        .set('pageSize', pageSize)
        .set('sortBy', sortBy)
        .set('sortDirection', sortDirection)
        .set('search', search)
        return this.httpClient.get<SuccessResponseDto<PaginationResponseDto<ClaimDocumentResponseDto>>>(`${environment.apiUrl}/ClaimDocument`, {params})
    }

     addClaimDocument(formData:FormData):Observable<SuccessResponseDto<ClaimDocumentResponseDto>>{
        return this.httpClient.post<SuccessResponseDto<ClaimDocumentResponseDto>>(`${environment.apiUrl}/ClaimDocument`, formData);
    }

     getClaimDocumentById(id:number):Observable<SuccessResponseDto<ClaimDocumentResponseDto>>{
        return this.httpClient.get<SuccessResponseDto<ClaimDocumentResponseDto>>(`${environment.apiUrl}/ClaimDocument/${id}`)
    }

    deleteClaimDocumentById(id:number):Observable<SuccessResponseDto<void>>{
        return this.httpClient.delete<SuccessResponseDto<void>>(`${environment.apiUrl}/ClaimDocument/${id}`)
    }

    getClaimDocumentsByClaimId(claimId:number):Observable<SuccessResponseDto<ClaimDocumentResponseDto[]>>{
        return this.httpClient.get<SuccessResponseDto<ClaimDocumentResponseDto[]>>(`${environment.apiUrl}/ClaimDocument/claim/${claimId}`)
    }

    getClaimDocumentsByCustomerId(customerId:number):Observable<SuccessResponseDto<ClaimDocumentResponseDto[]>>{
        return this.httpClient.get<SuccessResponseDto<ClaimDocumentResponseDto[]>>(`${environment.apiUrl}/ClaimDocument/customer/${customerId}`)
    }

    getMyClaimDocuments():Observable<SuccessResponseDto<ClaimDocumentResponseDto[]>>{
        return this.httpClient.get<SuccessResponseDto<ClaimDocumentResponseDto[]>>(`${environment.apiUrl}/ClaimDocument/my-documents`)
    }

}
