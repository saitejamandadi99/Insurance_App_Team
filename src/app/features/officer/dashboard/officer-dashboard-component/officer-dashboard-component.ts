import { NgFor, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
selector: 'app-officer-dashboard-component',
standalone: true,
imports: [
NgFor,
NgClass,
RouterLink
],
templateUrl: './officer-dashboard-component.html',
styleUrl: './officer-dashboard-component.css'
})
export class OfficerDashboardComponent {

sections: DashboardSection[] = [
{
heading: 'Customer Management',
cards: [
{
icon: 'bi bi-person-lines-fill',
title: 'View Customers',
subtitle: 'Browse customer records',
route: '/viewcustomers',
color: 'info'
}
]
},
{
heading: 'Insurance Products',
cards: [
{
icon: 'bi bi-box-seam',
title: 'View Products',
subtitle: 'Browse insurance products',
route: '/viewproducts',
color: 'primary'
}
]
},
{
heading: 'Policy Plans',
cards: [
{
icon: 'bi bi-journal-text',
title: 'View Plans',
subtitle: 'Browse policy plans',
route: '/viewplans',
color: 'primary'
}
]
},
{
heading: 'Policies',
cards: [
{
icon: 'bi bi-shield-check',
title: 'View Policies',
subtitle: 'Browse issued policies',
route: '/viewpolicies',
color: 'primary'
},
{
icon: 'bi bi-shield-plus',
title: 'Issue Policy',
subtitle: 'Issue a new policy',
route: '/issuepolicy',
color: 'success'
}
]
},
{
heading: 'Claims',
cards: [
{
icon: 'bi bi-file-earmark-medical',
title: 'View Claims',
subtitle: 'Browse all claims',
route: '/viewclaims',
color: 'primary'
},
{
icon: 'bi bi-check2-square',
title: 'Review Claims',
subtitle: 'Recommend approval or rejection',
route: '/viewclaims',
color: 'warning'
}
]
},
{
heading: 'Claim Status History',
cards: [
{
icon: 'bi bi-clock-history',
title: 'View Status History',
subtitle: 'Track claim status changes',
route: '/claimstatushistory',
color: 'info'
}
]
},
{
heading: 'Claim Documents',
cards: [
{
icon: 'bi bi-file-earmark-text',
title: 'View Documents',
subtitle: 'Browse claim documents',
route: '/viewdocuments',
color: 'primary'
}
]
},
{
heading: 'Payments',
cards: [
{
icon: 'bi bi-cash-stack',
title: 'View Payments',
subtitle: 'Browse all payments',
route: '/viewpayments',
color: 'success'
}
]
}
];

}
