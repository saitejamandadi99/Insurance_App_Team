import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { PaginationResponseDto } from '../../DTO/PaginationResponseDto';
import { PolicyPlanRequestDto } from '../../DTO/PolicyPlanRequestDto';
import { PolicyPlanResponseDto } from '../../DTO/PolicyPlanResponseDto';
import { environment } from '../../Environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PolicyPlanServices {

    private readonly apiUrl = `${environment.apiUrl}/plan`;

    constructor(private http: HttpClient) { }

    // GET: api/plan/getAllPlans
    listPolicyPlans(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        search: string
    ): Observable<SuccessResponseDto<PaginationResponseDto<PolicyPlanResponseDto>>> {

        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize)
            .set('sortBy', sortBy)
            .set('sortDirection', sortDirection)
            .set('search', search);

        return this.http.get<
            SuccessResponseDto<PaginationResponseDto<PolicyPlanResponseDto>>
        >(`${this.apiUrl}/getAllPlans`, { params });
    }

    // GET: api/plan/{planId}
    getPolicyPlanById(
        planId: number
    ): Observable<SuccessResponseDto<PolicyPlanResponseDto>> {

        return this.http.get<SuccessResponseDto<PolicyPlanResponseDto>>(
            `${this.apiUrl}/${planId}`
        );
    }

    // GET: api/plan/product/{productId}
    getPlansByProductId(
        productId: number,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        search: string
    ): Observable<SuccessResponseDto<PaginationResponseDto<PolicyPlanResponseDto>>> {

        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize)
            .set('sortBy', sortBy)
            .set('sortDirection', sortDirection)
            .set('search', search);

        return this.http.get<
            SuccessResponseDto<PaginationResponseDto<PolicyPlanResponseDto>>
        >(`${this.apiUrl}/product/${productId}`, { params });
    }

    // POST: api/plan/createPlan
    addPolicyPlan(
        request: PolicyPlanRequestDto
    ): Observable<SuccessResponseDto<PolicyPlanResponseDto>> {

        return this.http.post<SuccessResponseDto<PolicyPlanResponseDto>>(
            `${this.apiUrl}/createPlan`,
            request
        );
    }

    // PUT: api/plan/{planId}
    updatePolicyPlan(
        planId: number,
        request: PolicyPlanRequestDto
    ): Observable<SuccessResponseDto<PolicyPlanResponseDto>> {

        return this.http.put<SuccessResponseDto<PolicyPlanResponseDto>>(
            `${this.apiUrl}/${planId}`,
            request
        );
    }

    // PUT: api/plan/activate/{planId}
    activatePolicyPlan(
        planId: number
    ): Observable<SuccessResponseDto<PolicyPlanResponseDto>> {

        return this.http.put<SuccessResponseDto<PolicyPlanResponseDto>>(
            `${this.apiUrl}/activate/${planId}`,
            {}
        );
    }

    // PUT: api/plan/deactivate/{planId}
    deactivatePolicyPlan(
        planId: number
    ): Observable<SuccessResponseDto<PolicyPlanResponseDto>> {

        return this.http.put<SuccessResponseDto<PolicyPlanResponseDto>>(
            `${this.apiUrl}/deactivate/${planId}`,
            {}
        );
    }
}