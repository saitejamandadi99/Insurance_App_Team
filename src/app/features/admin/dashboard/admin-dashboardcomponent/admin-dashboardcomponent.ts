import { NgClass, NgFor, NgIf, CurrencyPipe,DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { DashboardServices } from '../../../../services/Dashboard/dashboard-services';
import { AdminDashboardResponseDto } from '../../../../DTO/AdminDashboardResponseDto';

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
  selector: 'app-admin-dashboard-component',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, NgClass, CurrencyPipe, DatePipe],
  templateUrl: './admin-dashboardcomponent.html',
  styleUrl: './admin-dashboardcomponent.css',
})
export class AdminDashboardComponent implements OnInit {
  dashboard: AdminDashboardResponseDto | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private dashboardService: DashboardServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.dashboardService.getAdminDashboard().subscribe({
      next: (response) => {
        console.log('Admin Dashboard API Response:', response);

        this.dashboard = response.data ?? null;
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to load admin dashboard:', error);

        this.dashboard = null;

        this.errorMessage =
          error.status === 401
            ? 'Your session has expired. Please log in again.'
            : error.status === 403
              ? 'You do not have permission to access the admin dashboard.'
              : 'Unable to load dashboard data. Please try again.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  sections: DashboardSection[] = [
    {
      heading: 'User Management',
      cards: [
        {
          icon: 'bi bi-people',
          title: 'View Users',
          subtitle: 'Manage system users',
          route: '/viewusers',
          color: 'primary',
        },
        {
          icon: 'bi bi-person-plus',
          title: 'Add User',
          subtitle: 'Create a new user',
          route: '/adduser',
          color: 'success',
        },
      ],
    },
    {
      heading: 'Customer Management',
      cards: [
        {
          icon: 'bi bi-person-lines-fill',
          title: 'View Customers',
          subtitle: 'Browse customer records',
          route: '/viewcustomers',
          color: 'info',
        },
      ],
    },
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
        {
          icon: 'bi bi-plus-square',
          title: 'Add Product',
          subtitle: 'Create a new product',
          route: '/addproduct',
          color: 'success',
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
        {
          icon: 'bi bi-journal-plus',
          title: 'Add Plan',
          subtitle: 'Create a new plan',
          route: '/addplan',
          color: 'success',
        },
      ],
    },
    {
      heading: 'Policies',
      cards: [
        {
          icon: 'bi bi-shield-check',
          title: 'View Policies',
          subtitle: 'Browse issued policies',
          route: '/viewpolicies',
          color: 'primary',
        },
        {
          icon: 'bi bi-shield-plus',
          title: 'Issue Policy',
          subtitle: 'Issue a new policy',
          route: '/issuepolicy',
          color: 'success',
        },
      ],
    },
    {
      heading: 'Claims',
      cards: [
        {
          icon: 'bi bi-file-earmark-medical',
          title: 'View Claims',
          subtitle: 'Browse all claims',
          route: '/viewclaims',
          color: 'primary',
        },
        {
          icon: 'bi bi-check2-square',
          title: 'Review Claims',
          subtitle: 'Approve or reject claims',
          route: '/viewclaims',
          color: 'warning',
        },
      ],
    },
    {
      heading: 'Claim Status History',
      cards: [
        {
          icon: 'bi bi-clock-history',
          title: 'View Status History',
          subtitle: 'Track claim status changes',
          route: '/claimstatushistory',
          color: 'info',
        },
      ],
    },
    {
      heading: 'Claim Documents',
      cards: [
        {
          icon: 'bi bi-file-earmark-text',
          title: 'View Documents',
          subtitle: 'Browse claim documents',
          route: '/viewdocuments',
          color: 'primary',
        },
      ],
    },
    {
      heading: 'Payments',
      cards: [
        {
          icon: 'bi bi-cash-stack',
          title: 'View Payments',
          subtitle: 'Browse all payments',
          route: '/viewpayments',
          color: 'success',
        },
      ],
    },
  ];
}