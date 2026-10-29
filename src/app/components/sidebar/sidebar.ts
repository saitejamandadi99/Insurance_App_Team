import { NgFor, NgIf, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Role } from '../../Enums/Role';
import { Auth } from '../../services/Auth/auth';

interface SidebarLink {
  icon: string;
  label: string;
  route: string;
}

interface SidebarSection {
  heading: string;
  links: SidebarLink[];
}

@Component({
  selector: 'app-sidebar-component',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent implements OnInit {

  role: string = localStorage.getItem('role') ?? '';
  fullName: string = localStorage.getItem('fullName') ?? '';

  Role = Role;

  isOpen = true;
  hasProfile = false;

  dashboardRoute = '';
  sections: SidebarSection[] = [];

  constructor(
    private authService: Auth,
    private customerService: Customer,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildSections();

    if (this.role === Role.Customer) {
      this.customerService.getMyProfile().subscribe({
        next: () => {
          this.hasProfile = true;
          this.buildSections();
          this.cdr.detectChanges();
        },
        error: () => {
          this.hasProfile = false;
          this.buildSections();
          this.cdr.detectChanges();
        }
      });
    }
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  closeSidebar(): void {
    this.isOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private buildSections(): void {
    if (this.role === Role.Admin) {
      this.dashboardRoute = '/admindashboard';

      this.sections = [
        {
          heading: 'User Management',
          links: [
            { icon: 'bi bi-people', label: 'View Users', route: '/viewusers' },
            { icon: 'bi bi-person-plus', label: 'Add User', route: '/adduser' }
          ]
        },
        {
          heading: 'Customer Management',
          links: [
            { icon: 'bi bi-person-lines-fill', label: 'View Customers', route: '/viewcustomers' }
          ]
        },
        {
          heading: 'Insurance Products',
          links: [
            { icon: 'bi bi-box-seam', label: 'View Products', route: '/viewproducts' },
            { icon: 'bi bi-plus-square', label: 'Add Product', route: '/addproduct' }
          ]
        },
        {
          heading: 'Policy Plans',
          links: [
            { icon: 'bi bi-journal-text', label: 'View Plans', route: '/viewplans' },
            { icon: 'bi bi-journal-plus', label: 'Add Plan', route: '/addplan' }
          ]
        },
        {
          heading: 'Policies',
          links: [
            { icon: 'bi bi-shield-check', label: 'View Policies', route: '/viewpolicies' },
            { icon: 'bi bi-shield-plus', label: 'Issue Policy', route: '/issuepolicy' }
          ]
        },
        {
          heading: 'Claims',
          links: [
            { icon: 'bi bi-file-earmark-medical', label: 'View Claims', route: '/viewclaims' }
          ]
        },
        {
          heading: 'Claim Status History',
          links: [
            { icon: 'bi bi-clock-history', label: 'Status History', route: '/claimstatushistory' }
          ]
        },
        {
          heading: 'Claim Documents',
          links: [
            { icon: 'bi bi-file-earmark-text', label: 'View Documents', route: '/viewdocuments' }
          ]
        },
        {
          heading: 'Payments',
          links: [
            { icon: 'bi bi-cash-stack', label: 'View Payments', route: '/viewpayments' }
          ]
        }
      ];
    }

    else if (this.role === Role.Officer) {
      this.dashboardRoute = '/officerdashboard';

      this.sections = [
        {
          heading: 'Customer Management',
          links: [
            { icon: 'bi bi-person-lines-fill', label: 'View Customers', route: '/viewcustomers' }
          ]
        },
        {
          heading: 'Insurance Products',
          links: [
            { icon: 'bi bi-box-seam', label: 'View Products', route: '/viewproducts' }
          ]
        },
        {
          heading: 'Policy Plans',
          links: [
            { icon: 'bi bi-journal-text', label: 'View Plans', route: '/viewplans' }
          ]
        },
        {
          heading: 'Policies',
          links: [
            { icon: 'bi bi-shield-check', label: 'View Policies', route: '/viewpolicies' },
            { icon: 'bi bi-shield-plus', label: 'Issue Policy', route: '/issuepolicy' }
          ]
        },
        {
          heading: 'Claims',
          links: [
            { icon: 'bi bi-file-earmark-medical', label: 'Review Claims', route: '/viewclaims' }
          ]
        },
        {
          heading: 'Claim Status History',
          links: [
            { icon: 'bi bi-clock-history', label: 'Status History', route: '/claimstatushistory' }
          ]
        },
        {
          heading: 'Claim Documents',
          links: [
            { icon: 'bi bi-file-earmark-text', label: 'View Documents', route: '/viewdocuments' }
          ]
        },
        {
          heading: 'Payments',
          links: [
            { icon: 'bi bi-cash-stack', label: 'View Payments', route: '/viewpayments' }
          ]
        }
      ];
    }

    else if (this.role === Role.Customer) {
      this.dashboardRoute = '/customerdashboard';

      this.sections = [
        {
          heading: 'Profile',
          links: this.hasProfile
            ? [
                { icon: 'bi bi-person-circle', label: 'My Profile', route: '/myprofile' },
                { icon: 'bi bi-pencil-square', label: 'Edit Profile', route: '/editprofile' }
              ]
            : [
                { icon: 'bi bi-person-plus', label: 'Create Profile', route: '/createprofile' }
              ]
        },
        {
          heading: 'Insurance Products',
          links: [
            { icon: 'bi bi-box-seam', label: 'View Products', route: '/viewproducts' }
          ]
        },
        {
          heading: 'Policy Plans',
          links: [
            { icon: 'bi bi-journal-text', label: 'View Plans', route: '/viewplans' }
          ]
        },
        {
          heading: 'Policies',
          links: [
            { icon: 'bi bi-bag-plus', label: 'Purchase Policy', route: '/purchasepolicy' },
            { icon: 'bi bi-shield-check', label: 'My Policies', route: '/mypolicies' }
          ]
        },
        {
          heading: 'Claims',
          links: [
            { icon: 'bi bi-file-earmark-plus', label: 'Raise Claim', route: '/mypolicies' },
            { icon: 'bi bi-file-earmark-medical', label: 'My Claims', route: '/myclaims' }
          ]
        },
        {
          heading: 'Claim Documents',
          links: [
            { icon: 'bi bi-cloud-upload', label: 'Upload Document', route: '/adddocument' },
            { icon: 'bi bi-file-earmark-text', label: 'My Documents', route: '/mydocuments' }
          ]
        },
        {
          heading: 'Claim Status History',
          links: [
            { icon: 'bi bi-clock-history', label: 'My Status History', route: '/myclaimstatushistory' }
          ]
        },
        {
          heading: 'Payments',
          links: [
            { icon: 'bi bi-credit-card', label: 'Make Payment', route: '/mypolicies' },
            { icon: 'bi bi-cash-stack', label: 'My Payments', route: '/mypayments' }
          ]
        }
      ];
    }

    else {
      this.dashboardRoute = '';
      this.sections = [];
    }
  }
}