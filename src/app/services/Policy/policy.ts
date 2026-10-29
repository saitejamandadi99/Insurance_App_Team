import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { PurchasePolicyRequestDto } from '../../DTO/PurchasePolicyRequestDto';
import { Observable } from 'rxjs';
import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { PolicyResponseDto } from '../../DTO/PolicyResponseDto';
import { environment } from '../../Environments/environment';
import { IssuePolicyRequestDto } from '../../DTO/IssuePolicyRequestDto';
import { PaginationResponseDto } from '../../DTO/PaginationResponseDto';

@Injectable({
    providedIn:'root'
})
export class Policy {
    constructor(private httpClient:HttpClient){}


    purchasePolicy(policyRequest:PurchasePolicyRequestDto):Observable<SuccessResponseDto<PolicyResponseDto>>{
        return this.httpClient.post<SuccessResponseDto<PolicyResponseDto>>(`${environment.apiUrl}/Policy/purchase`, policyRequest)
    }

    issuePolicy(policyRequest:IssuePolicyRequestDto):Observable<SuccessResponseDto<PolicyResponseDto>>{
        return this.httpClient.post<SuccessResponseDto<PolicyResponseDto>>(`${environment.apiUrl}/Policy/issue`, policyRequest)
    }

    listPolicies(pageNumber:number, pageSize:number, sortBy:string, sortDirection:string, search:string):Observable<SuccessResponseDto<PaginationResponseDto<PolicyResponseDto>>>{
        const params = new HttpParams().set('pageNumber',pageNumber)
                    .set('pageSize',pageSize)
                    .set('sortBy',sortBy)
                    .set('sortDirection',sortDirection)
                    .set('search',search)

        return this.httpClient.get<SuccessResponseDto<PaginationResponseDto<PolicyResponseDto>>>(`${environment.apiUrl}/Policy`,{params});
    }

    getPolicyById(id:number):Observable<SuccessResponseDto<PolicyResponseDto>>{
        return this.httpClient.get<SuccessResponseDto<PolicyResponseDto>>(`${environment.apiUrl}/Policy/${id}`);
    }

    getPoliciesByCustomerId(customerId:number):Observable<SuccessResponseDto<PolicyResponseDto[]>>{
        return this.httpClient.get<SuccessResponseDto<PolicyResponseDto[]>>(`${environment.apiUrl}/Policy/customer/${customerId}`);
    }

    getPoliciesByPlanId(planId:number):Observable<SuccessResponseDto<PolicyResponseDto[]>>{
        return this.httpClient.get<SuccessResponseDto<PolicyResponseDto[]>>(`${environment.apiUrl}/Policy/plan/${planId}`);
    }

    cancelPolicy(id:number):Observable<SuccessResponseDto<PolicyResponseDto>>{
        return this.httpClient.put<SuccessResponseDto<PolicyResponseDto>>(`${environment.apiUrl}/Policy/cancel/${id}`, {});
    }

     getMyPolicies():Observable<SuccessResponseDto<PolicyResponseDto[]>>{
        return this.httpClient.get<SuccessResponseDto<PolicyResponseDto[]>>(`${environment.apiUrl}/Policy/my-policies`);
    }
}
