import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { Observable } from 'rxjs';
import { PaginationResponseDto } from '../../DTO/PaginationResponseDto';
import { ClaimResponseDto } from '../../DTO/ClaimResponseDto';
import { environment } from '../../Environments/environment';
import { OfficerRemarkRequestDto } from '../../DTO/OfficerRemarkRequestDto';
import { AdminRemarkRequestDto } from '../../DTO/AdminRemarkRequestDto';

@Injectable({
    providedIn:'root'
})
export class Claim {
    constructor(private httpClient:HttpClient){}

    listClaims(pageNumber:number, pageSize:number, sortBy:string, sortDirection:string, search:string):Observable<SuccessResponseDto<PaginationResponseDto<ClaimResponseDto>>>{
        const params = new HttpParams().set('pageNumber',pageNumber)
        .set('pageSize',pageSize)
        .set('sortBy',sortBy)
        .set('sortDirection',sortDirection)
        .set('search',search)
        return this.httpClient.get<SuccessResponseDto<PaginationResponseDto<ClaimResponseDto>>>(`${environment.apiUrl}/Claim`, {params});
    }

    getClaimById(claimId:number):Observable<SuccessResponseDto<ClaimResponseDto>>{
        return this.httpClient.get<SuccessResponseDto<ClaimResponseDto>>(`${environment.apiUrl}/Claim/${claimId}`);
    }

    getClaimsByCustomerId(customerId:number):Observable<SuccessResponseDto<ClaimResponseDto[]>>{
        return this.httpClient.get<SuccessResponseDto<ClaimResponseDto[]>>(`${environment.apiUrl}/Claim/customer/${customerId}`);
    }

    getClaimsByPolicyId(policyId:number):Observable<SuccessResponseDto<ClaimResponseDto[]>>{
        return this.httpClient.get<SuccessResponseDto<ClaimResponseDto[]>>(`${environment.apiUrl}/Claim/policy/${policyId}`);
    }

    getMyClaims():Observable<SuccessResponseDto<ClaimResponseDto[]>>{
        return this.httpClient.get<SuccessResponseDto<ClaimResponseDto[]>>(`${environment.apiUrl}/Claim/my-claims`);
    }

    raiseClaim(formData:FormData):Observable<SuccessResponseDto<ClaimResponseDto>>{
        return this.httpClient.post<SuccessResponseDto<ClaimResponseDto>>(`${environment.apiUrl}/Claim/raise`,formData);
    }

    officerReviewByClaimId(claimId:number, remarks:OfficerRemarkRequestDto):Observable<SuccessResponseDto<ClaimResponseDto>>{
        return this.httpClient.put<SuccessResponseDto<ClaimResponseDto>>(`${environment.apiUrl}/Claim/officer-review/${claimId}`, remarks)
    }

    adminReviewByClaimId(claimId:number, remarks:AdminRemarkRequestDto):Observable<SuccessResponseDto<ClaimResponseDto>>{
        return this.httpClient.put<SuccessResponseDto<ClaimResponseDto>>(`${environment.apiUrl}/Claim/admin-review/${claimId}`, remarks)
    }
}
