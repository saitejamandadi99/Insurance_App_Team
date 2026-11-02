import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessResponseDto } from '../../DTO/SuccessResponseDto';
import { AdminDashboardResponseDto } from '../../DTO/AdminDashboardResponseDto';
import { OfficerDashboardResponseDto } from '../../DTO/OfficerDashboardResponseDto';
import { CustomerDashboardResponseDto } from '../../DTO/CustomerDashboardResponseDto';
import { environment } from '../../Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardServices {

  private readonly apiUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) {}

  // Admin Dashboard
  getAdminDashboard(): Observable<SuccessResponseDto<AdminDashboardResponseDto>> {
    return this.http.get<SuccessResponseDto<AdminDashboardResponseDto>>(
      `${this.apiUrl}/admin`
    );
  }

  // Officer Dashboard
  getOfficerDashboard(): Observable<SuccessResponseDto<OfficerDashboardResponseDto>> {
    return this.http.get<SuccessResponseDto<OfficerDashboardResponseDto>>(
      `${this.apiUrl}/officer`
    );
  }

  // Customer Dashboard
  getCustomerDashboard(): Observable<SuccessResponseDto<CustomerDashboardResponseDto>> {
    return this.http.get<SuccessResponseDto<CustomerDashboardResponseDto>>(
      `${this.apiUrl}/customer`
    );
  }
}