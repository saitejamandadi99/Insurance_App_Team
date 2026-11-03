import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomerProfileServices } from '../../../../services/CustomerProfile/customer-profile-services';
import { DashboardServices } from '../../../../services/Dashboard/dashboard-services';
import { CustomerDashboardResponseDto } from '../../../../DTO/CustomerDashboardResponseDto';

interface DashboardCard {
  icon: string;
  title: string;
  subtitle: string;
  route: string;
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger';
}

interface DashboardSection {
  heading: string;
  cards: DashboardCard[];
}

@Component({
  selector: 'app-customer-dashboard-component',
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    NgIf,
    RouterLink,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './customer-dashboard-component.html',
  styleUrl: './customer-dashboard-component.css',
})
export class CustomerDashboardComponent implements OnInit {

  hasProfile = false;

  isLoading = true;
  profileCheckFailed = false;

  dashboard: CustomerDashboardResponseDto | null = null;
  isDashboardLoading = false;
  dashboardErrorMessage = '';

  constructor(
    private cusService: CustomerProfileServices,
    private dashboardService: DashboardServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkCustomerProfile();
  }

  // Check whether the customer has created a profile.
  checkCustomerProfile(): void {
    this.isLoading = true;
    this.profileCheckFailed = false;

    this.cusService.getMyProfile().subscribe({
      next: () => {
        this.hasProfile = true;
        this.isLoading = false;

        this.loadCustomerDashboard();
        this.cdr.detectChanges();
      },

      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        if (err.status === 404) {
          // Customer profile does not exist.
          this.hasProfile = false;
          this.dashboard = null;
        } else {
          // Authorization, network, or server error.
          this.profileCheckFailed = true;
        }

        this.cdr.detectChanges();
      },
    });
  }

  // Load customer dashboard data.
  loadCustomerDashboard(): void {
    this.isDashboardLoading = true;
    this.dashboardErrorMessage = '';

    this.dashboardService.getCustomerDashboard().subscribe({
      next: (response) => {
        console.log('Customer Dashboard API Response:', response);

        this.dashboard = response.data ?? null;
        this.isDashboardLoading = false;

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to load customer dashboard:', error);

        this.dashboard = null;

        this.dashboardErrorMessage =
          error.status === 401
            ? 'Your session has expired. Please log in again.'
            : error.status === 403
              ? 'You do not have permission to access the customer dashboard.'
              : 'Unable to load dashboard data. Please try again.';

        this.isDashboardLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // Profile card changes based on profile availability.
  get profileCard(): DashboardCard {
    return this.hasProfile
      ? {
          icon: 'bi bi-person-circle',
          title: 'My Profile',
          subtitle: 'View your profile details',
          route: '/myprofile',
          color: 'primary',
        }
      : {
          icon: 'bi bi-person-plus',
          title: 'Create Profile',
          subtitle: 'Set up your customer profile',
          route: '/createprofile',
          color: 'warning',
        };
  }

  editProfileCard: DashboardCard = {
    icon: 'bi bi-pencil-square',
    title: 'Edit Profile',
    subtitle: 'Update your profile',
    route: '/editprofile',
    color: 'info',
  };

  sections: DashboardSection[] = [
    {
      heading: 'Insurance Products',
      cards: [
        {
          icon: 'bi bi-box-seam',
          title: 'View Products',
          subtitle: 'Browse insurance products',
          route: '/viewproducts',
          color: 'primary',
        },
      ],
    },
    {
      heading: 'Policy Plans',
      cards: [
        {
          icon: 'bi bi-journal-text',
          title: 'View Plans',
          subtitle: 'Browse policy plans',
          route: '/viewplans',
          color: 'primary',
        },
      ],
    },
    {
      heading: 'Policies',
      cards: [
        {
          icon: 'bi bi-bag-plus',
          title: 'Purchase Policy',
          subtitle: 'Buy a new insurance policy',
          route: '/purchasepolicy',
          color: 'success',
        },
        {
          icon: 'bi bi-shield-check',
          title: 'My Policies',
          subtitle: 'View your active policies',
          route: '/mypolicies',
          color: 'primary',
        },
      ],
    },
    {
      heading: 'Claims',
      cards: [
        {
          icon: 'bi bi-file-earmark-plus',
          title: 'Raise Claim',
          subtitle: 'Select a policy to file a claim',
          route: '/mypolicies',
          color: 'warning',
        },
        {
          icon: 'bi bi-file-earmark-medical',
          title: 'My Claims',
          subtitle: 'Track your submitted claims',
          route: '/myclaims',
          color: 'primary',
        },
      ],
    },
    {
      heading: 'Claim Documents',
      cards: [
        {
          icon: 'bi bi-cloud-upload',
          title: 'Upload Document',
          subtitle: 'Select a claim to add documents',
          route: '/adddocument',
          color: 'info',
        },
        {
          icon: 'bi bi-file-earmark-text',
          title: 'My Documents',
          subtitle: 'View your uploaded documents',
          route: '/mydocuments',
          color: 'primary',
        },
      ],
    },
    {
      heading: 'Claim Status History',
      cards: [
        {
          icon: 'bi bi-clock-history',
          title: 'My Status History',
          subtitle: 'Track your claim status changes',
          route: '/myclaimstatushistory',
          color: 'info',
        },
      ],
    },
    {
      heading: 'Payments',
      cards: [
        {
          icon: 'bi bi-credit-card',
          title: 'Make Payment',
          subtitle: 'Select a policy to pay premium',
          route: '/mypolicies',
          color: 'success',
        },
        {
          icon: 'bi bi-cash-stack',
          title: 'My Payments',
          subtitle: 'View your payment history',
          route: '/mypayments',
          color: 'primary',
        },
      ],
    },
  ];
}