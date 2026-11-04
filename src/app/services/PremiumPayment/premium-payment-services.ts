import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { PaginationResponseDto } from '../../DTO/PaginationResponseDto';
import { PaymentRequestDto } from '../../DTO/PaymentRequestDto';
import { PaymentResponseDto } from '../../DTO/PaymentResponseDto';
import { environment } from '../../Environments/environment';

@Injectable({
providedIn: 'root'
})
export class PremiumPaymentServices {

private readonly apiUrl = `${environment.apiUrl}/PremiumPayment`;
  listPayments: any;

constructor(private http: HttpClient) { }

// GET: api/payment/listOfPayments
// Admin and Officer: Retrieve all payments.
getAllPayments(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    search: string
): Observable<SuccessResponseDto<PaginationResponseDto<PaymentResponseDto>>> {

    const params = new HttpParams()
        .set('pageNumber', pageNumber)
        .set('pageSize', pageSize)
        .set('sortBy', sortBy)
        .set('sortDirection', sortDirection)
        .set('search', search);

    return this.http.get<
        SuccessResponseDto<PaginationResponseDto<PaymentResponseDto>>
    >(`${this.apiUrl}/listOfPayments`, { params });
}

// GET: api/payment/{paymentId}
// Admin and Officer: Retrieve a payment by ID.
getPaymentById(
    paymentId: number
): Observable<SuccessResponseDto<PaymentResponseDto>> {

    return this.http.get<SuccessResponseDto<PaymentResponseDto>>(
        `${this.apiUrl}/${paymentId}`
    );
}

// GET: api/payment/customer/{customerId}
// Admin and Officer: Retrieve payments by customer user ID.
getPaymentsByCustomerId(
    customerId: number,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    search: string
): Observable<SuccessResponseDto<PaginationResponseDto<PaymentResponseDto>>> {

    const params = new HttpParams()
        .set('pageNumber', pageNumber)
        .set('pageSize', pageSize)
        .set('sortBy', sortBy)
        .set('sortDirection', sortDirection)
        .set('search', search);

    return this.http.get<
        SuccessResponseDto<PaginationResponseDto<PaymentResponseDto>>
    >(`${this.apiUrl}/customer/${customerId}`, { params });
}

// GET: api/payment/policy/{policyId}
// Admin and Officer: Retrieve payments by policy ID.
getPaymentsByPolicyId(
    policyId: number,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    search: string
): Observable<SuccessResponseDto<PaginationResponseDto<PaymentResponseDto>>> {

    const params = new HttpParams()
        .set('pageNumber', pageNumber)
        .set('pageSize', pageSize)
        .set('sortBy', sortBy)
        .set('sortDirection', sortDirection)
        .set('search', search);

    return this.http.get<
        SuccessResponseDto<PaginationResponseDto<PaymentResponseDto>>
    >(`${this.apiUrl}/policy/${policyId}`, { params });
}

// POST: api/payment/officer-payment
// Admin and Officer: Record a payment.
makeOfficerPayment(
    request: PaymentRequestDto
): Observable<SuccessResponseDto<PaymentResponseDto>> {

    return this.http.post<SuccessResponseDto<PaymentResponseDto>>(
        `${this.apiUrl}/officer-payment`,
        request
    );
}

// POST: api/payment/my-payment
// Customer: Record their own payment.
makeMyPayment(
    request: PaymentRequestDto
): Observable<SuccessResponseDto<PaymentResponseDto>> {

    return this.http.post<SuccessResponseDto<PaymentResponseDto>>(
        `${this.apiUrl}/my-payment`,
        request
    );
}

// GET: api/payment/mypaymentsList
// Customer: Retrieve their own payment history.
getMyPayments(
  pageNumber: number = 1,
  pageSize: number = 10,
  sortBy: string = 'paymentDate',
  sortDirection: string = 'desc'
): Observable<SuccessResponseDto<PaginationResponseDto<PaymentResponseDto>>> {

  const params = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize)
    .set('sortBy', sortBy)
    .set('sortDirection', sortDirection);

  return this.http.get<
    SuccessResponseDto<PaginationResponseDto<PaymentResponseDto>>
  >(`${this.apiUrl}/mypaymentsList`, { params });
}
}