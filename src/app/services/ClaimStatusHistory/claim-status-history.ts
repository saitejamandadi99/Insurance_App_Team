import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { PaginationResponseDto } from '../../DTO/PaginationResponseDto';
import { ClaimStatusHistoryResponseDto } from '../../DTO/ClaimStatusHistoryResponseDto';
import { environment } from '../../Environments/environment';
@Injectable({
providedIn: 'root'
})
export class ClaimStatusHistoryServices {


private readonly apiUrl =
    `${environment.apiUrl}/ClaimStatusHistory`;

constructor(private http: HttpClient) { }

// GET: api/ClaimStatusHistory
// Admin and Officer: Retrieve all claim status histories.
getAllHistory(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    search: string
): Observable<SuccessResponseDto<PaginationResponseDto<ClaimStatusHistoryResponseDto>>> {

    const params = new HttpParams()
        .set('pageNumber', pageNumber)
        .set('pageSize', pageSize)
        .set('sortBy', sortBy)
        .set('sortDirection', sortDirection)
        .set('search', search);

    return this.http.get<
        SuccessResponseDto<PaginationResponseDto<ClaimStatusHistoryResponseDto>>
    >(this.apiUrl, { params });
}

// GET: api/ClaimStatusHistory/{id}
// Admin and Officer: Retrieve history by HistoryId.
getHistoryById(
    id: number
): Observable<SuccessResponseDto<ClaimStatusHistoryResponseDto>> {

    return this.http.get<SuccessResponseDto<ClaimStatusHistoryResponseDto>>(
        `${this.apiUrl}/${id}`
    );
}

// GET: api/ClaimStatusHistory/claim/{claimId}
// Admin and Officer: Retrieve history for a particular claim.
getHistoryByClaimId(
    claimId: number,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    search: string
): Observable<SuccessResponseDto<PaginationResponseDto<ClaimStatusHistoryResponseDto>>> {

    const params = new HttpParams()
        .set('pageNumber', pageNumber)
        .set('pageSize', pageSize)
        .set('sortBy', sortBy)
        .set('sortDirection', sortDirection)
        .set('search', search);

    return this.http.get<
        SuccessResponseDto<PaginationResponseDto<ClaimStatusHistoryResponseDto>>
    >(`${this.apiUrl}/claim/${claimId}`, { params });
}

// GET: api/ClaimStatusHistory/my-history
// Customer: Retrieve their own claim status histories.
getMyHistory(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    search: string
): Observable<SuccessResponseDto<PaginationResponseDto<ClaimStatusHistoryResponseDto>>> {

    const params = new HttpParams()
        .set('pageNumber', pageNumber)
        .set('pageSize', pageSize)
        .set('sortBy', sortBy)
        .set('sortDirection', sortDirection)
        .set('search', search);

    return this.http.get<
        SuccessResponseDto<PaginationResponseDto<ClaimStatusHistoryResponseDto>>
    >(`${this.apiUrl}/my-history`, { params });
}
}