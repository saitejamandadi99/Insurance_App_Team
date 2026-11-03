
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { SuccessResponseDto } from '../../../DTO/SuccessResponseDto';
import { CustomerResponseDto } from '../../../DTO/CustomerResponseDto';
import { ErrorResponseDto } from '../../../DTO/ErrorResponseDto';

import { CustomerProfileServices } from '../../../services/CustomerProfile/customer-profile-services';
import { ToastService } from '../../../services/Toast/toast-service';

import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { LoadingSpinner } from '../../../shared/ui/loading-spinner/loading-spinner';

@Component({
  selector: 'app-view-my-profile',
  standalone: true,
  imports: [
    DatePipe,
    PageHeader,
    LoadingSpinner
  ],
  templateUrl: './view-customer-profile.html',
  styleUrl: './view-customer-profile.css'
})
export class ViewMyProfileComponent implements OnInit {

  profileDetails: SuccessResponseDto<CustomerResponseDto> | null = null;

  isLoading = true;

  constructor(
    private customerProfileService: CustomerProfileServices,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyProfile();
  }

  loadMyProfile(): void {

    this.isLoading = true;

    this.customerProfileService.getMyProfile().subscribe({

      next: (response: SuccessResponseDto<CustomerResponseDto>) => {

        this.profileDetails = response;
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (err: HttpErrorResponse) => {

        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to load your profile.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/editprofile']);
  }

  createProfile(): void {
    this.router.navigate(['/createprofile']);
  }
}
