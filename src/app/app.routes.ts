import { Routes } from '@angular/router';

import { Role } from './Enums/Role';
import { authGuard } from './guard/auth-guard';

// Authentication
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Error } from './components/error/error';
import { VerifyEmail } from './components/verify-email/verify-email';
import { ResetPassword } from './components/reset-password/reset-password';
// Admin - Users
import { ViewUsers } from './features/admin/user/view-users/view-users';
import { AddUser } from './features/admin/user/add-user/add-user';

// Admin - Dashboard
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboardcomponent/admin-dashboardcomponent';

// Admin - Products
import { AddProduct } from './features/admin/product/add-product/add-product';
import { EditProduct } from './features/admin/product/edit-product/edit-product';

// Shared - Products
import { ViewProducts } from './features/shared/product/view-products/view-products';

// Admin / Shared - Policy Plans
import { AddPlanComponent } from './features/admin/PolicyPlan/add-policy-plan-component/add-policy-plan-component';
import { EditPolicyPlan } from './features/admin/PolicyPlan/edit-policy-plan-component/edit-policy-plan-component';
import { ViewPlansComponent } from './features/shared/PolicyPlan/view-policy-plan-component/view-policy-plan-component';

// Admin / Officer - Customers
import { ViewCustomerComponent } from './features/adminOfficerShared/customer/view-customers-component/view-customers-component';
import { CustomerDetailsComponent } from './features/adminOfficerShared/customer/customer-details-component/customer-details-component';

// Customer - Profile
import { AddCustomer } from './features/customer/add-customer-profile/add-customer-profile';
import { EditCustomer } from './features/customer/edit-customer-profile/edit-customer-profile';
import { ViewMyProfileComponent } from './features/customer/view-customer-profile/view-customer-profile';
// Admin / Officer - Dashboard
import { CustomerDashboardComponent } from './features/customer/dashboard/customer-dashboard-component/customer-dashboard-component';
import { OfficerDashboardComponent } from './features/officer/dashboard/officer-dashboard-component/officer-dashboard-component';

// Policies
import { ViewPolicies } from './features/adminOfficerShared/policy/view-policies/view-policies';
import { IssuePolicy } from './features/adminOfficerShared/policy/issue-policy/issue-policy';
import { ViewMyPolicies } from './features/customer/policy/view-my-policies/view-my-policies';

// Claims
import { RaiseClaimComponent } from './features/customer/claim/raise-claim-component/raise-claim-component';
import { ViewMyClaimsComponent } from './features/customer/claim/view-my-claims-component/view-my-claims-component';
import { ViewClaimDetailsComponent } from './features/customer/claim/view-claim-details-component/view-claim-details-component';
import { ViewClaimsComponent } from './features/adminOfficerShared/claim/view-claims-component/view-claims-component';
import { OfficerClaimReviewComponent } from './features/officer/claim/officer-claim-review-component/officer-claim-review-component';
import { AdminClaimReviewComponent } from './features/admin/claim/admin-claim-review-component/admin-claim-review-component';

// Documents
import { AddDocument } from './features/customer/document/add-document/add-document';
import { ViewMyDocuments } from './features/customer/document/view-my-documents/view-my-documents';
import { ViewDocuments } from './features/adminOfficerShared/document/view-documents/view-documents';

// Claim Status History
import { ViewClaimStatusHistoryComponent } from './features/adminOfficerShared/history/view-claim-status-history-component/view-claim-status-history-component';
import { ViewMyClaimStatusHistoryComponent } from './features/customer/history/view-my-claim-status-history/view-my-claim-status-history';

// Payments
import { MakePaymentComponent } from './features/shared/payment/make-payment-component/make-payment-component';
import { PaymentDetailsComponent } from './features/shared/payment/payment-details-component/payment-details-component';
import { ViewPaymentComponent } from './features/adminOfficerShared/payment/view-premium-payment-component/view-premium-payment-component';
import { ViewMyPaymentsComponent } from './features/customer/payment/view-my-payments/view-my-payments';


export const routes: Routes = [

  // Public routes
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'verify-email', component: VerifyEmail },
  {
  path: 'reset-password',
  component: ResetPassword
},

  // Unauthorized
  { path: 'unauthorized', component: Error },

  // Dashboards
  {
    path: 'admindashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard([Role.Admin])]
  },
  {
    path: 'officerdashboard',
    component: OfficerDashboardComponent,
    canActivate: [authGuard([Role.Officer])]
  },
  {
    path: 'customerdashboard',
    component: CustomerDashboardComponent,
    canActivate: [authGuard([Role.Customer])]
  },

  // Admin - Users
  {
    path: 'viewusers',
    component: ViewUsers,
    canActivate: [authGuard([Role.Admin])]
  },
  {
    path: 'adduser',
    component: AddUser,
    canActivate: [authGuard([Role.Admin])]
  },

  // Admin / Officer - Customers
  {
    path: 'viewcustomers',
    component: ViewCustomerComponent,
    canActivate: [authGuard([Role.Admin, Role.Officer])]
  },
  {
    path: 'customerdetails/:customerId',
    component: CustomerDetailsComponent,
    canActivate: [authGuard([Role.Admin, Role.Officer])]
  },

  // Customer - Profile
  {
    path: 'myprofile',
    component: ViewMyProfileComponent,
    canActivate: [authGuard([Role.Customer])]
  },
  {
    path: 'createprofile',
    component: AddCustomer,
    canActivate: [authGuard([Role.Customer])]
  },
  {
    path: 'editprofile',
    component: EditCustomer,
    canActivate: [authGuard([Role.Customer])]
  },

  // Products
  {
    path: 'viewproducts',
    component: ViewProducts,
    canActivate: [authGuard([Role.Admin, Role.Officer, Role.Customer])]
  },
  {
    path: 'addproduct',
    component: AddProduct,
    canActivate: [authGuard([Role.Admin])]
  },
  {
    path: 'editproduct/:id',
    component: EditProduct,
    canActivate: [authGuard([Role.Admin])]
  },

  // Policy Plans
  {
    path: 'viewplans',
    component: ViewPlansComponent,
    canActivate: [authGuard([Role.Admin, Role.Officer, Role.Customer])]
  },
  {
    path: 'addplan',
    component: AddPlanComponent,
    canActivate: [authGuard([Role.Admin])]
  },
  {
    path: 'editplan/:id',
    component: EditPolicyPlan,
    canActivate: [authGuard([Role.Admin])]
  },

  // Policies
  {
    path: 'viewpolicies',
    component: ViewPolicies,
    canActivate: [authGuard([Role.Admin, Role.Officer])]
  },
  {
    path: 'issuepolicy',
    component: IssuePolicy,
    canActivate: [authGuard([Role.Admin, Role.Officer])]
  },
  {
    path: 'mypolicies',
    component: ViewMyPolicies,
    canActivate: [authGuard([Role.Customer])]
  },

  // Claims
  {
    path: 'raiseclaim/:policyId',
    component: RaiseClaimComponent,
    canActivate: [authGuard([Role.Customer])]
  },
  {
    path: 'myclaims',
    component: ViewMyClaimsComponent,
    canActivate: [authGuard([Role.Customer])]
  },
  {
    path: 'viewclaimdetails/:claimId',
    component: ViewClaimDetailsComponent,
    canActivate: [authGuard([Role.Customer])]
  },
  {
    path: 'viewclaims',
    component: ViewClaimsComponent,
    canActivate: [authGuard([Role.Admin, Role.Officer])]
  },
  {
    path: 'officerreview/:claimId',
    component: OfficerClaimReviewComponent,
    canActivate: [authGuard([Role.Officer])]
  },
  {
    path: 'adminreview/:claimId',
    component: AdminClaimReviewComponent,
    canActivate: [authGuard([Role.Admin])]
  },

  // Documents
  {
    path: 'adddocument',
    component: AddDocument,
    canActivate: [authGuard([Role.Customer])]
  },
  {
    path: 'mydocuments',
    component: ViewMyDocuments,
    canActivate: [authGuard([Role.Customer])]
  },
  {
    path: 'viewdocuments',
    component: ViewDocuments,
    canActivate: [authGuard([Role.Admin, Role.Officer])]
  },

  // Claim Status History
  {
    path: 'claimstatushistory',
    component: ViewClaimStatusHistoryComponent,
    canActivate: [authGuard([Role.Admin, Role.Officer])]
  },
  {
    path: 'myclaimstatushistory',
    component: ViewMyClaimStatusHistoryComponent,
    canActivate: [authGuard([Role.Customer])]
  },

  // Payments
  {
    path: 'makepayment/:policyId',
    component: MakePaymentComponent,
    canActivate: [authGuard([Role.Customer,Role.Admin, Role.Officer])]
  },
  {
    path: 'mypayments',
    component: ViewMyPaymentsComponent,
    canActivate: [authGuard([Role.Customer])]
  },
  {
    path: 'viewpayments',
    component: ViewPaymentComponent,
    canActivate: [authGuard([Role.Admin, Role.Officer])]
  },
  {
    path: 'paymentdetails/:paymentId',
    component: PaymentDetailsComponent,
    canActivate: [authGuard([Role.Admin, Role.Officer])]
  },

  // Invalid routes
  { path: '**', component: Error }
];