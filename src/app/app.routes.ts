
import { Routes } from '@angular/router';


import { Role } from './Enums/Role';
import { ViewUsers } from './features/admin/user/view-users/view-users';
import { authGuard } from './guard/auth-guard';
import { AddUser } from './features/admin/user/add-user/add-user';
import { ViewProducts } from './features/shared/product/view-products/view-products';
import { AddProduct } from './features/admin/product/add-product/add-product';
import { EditProduct } from './features/admin/product/edit-product/edit-product';
import { ViewPolicies } from './features/adminOfficerShared/policy/view-policies/view-policies';
import { IssuePolicy } from './features/adminOfficerShared/policy/issue-policy/issue-policy';
import { ViewMyPolicies } from './features/customer/policy/view-my-policies/view-my-policies';
import { RaiseClaimComponent } from './features/customer/claim/raise-claim-component/raise-claim-component';
import { ViewMyClaimsComponent } from './features/customer/claim/view-my-claims-component/view-my-claims-component';
import { ViewClaimDetailsComponent } from './features/customer/claim/view-claim-details-component/view-claim-details-component';
import { ViewClaimsComponent } from './features/adminOfficerShared/claim/view-claims-component/view-claims-component';
import { OfficerClaimReviewComponent } from './features/officer/claim/officer-claim-review-component/officer-claim-review-component';
import { AdminClaimReviewComponent } from './features/admin/claim/admin-claim-review-component/admin-claim-review-component';
import { AddDocument } from './features/customer/document/add-document/add-document';
import { ViewMyDocuments } from './features/customer/document/view-my-documents/view-my-documents';
import { ViewDocuments } from './features/adminOfficerShared/document/view-documents/view-documents';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Error } from './components/error/error';

export const routes: Routes = [

  // Public routes
  {
    path: '',redirectTo: 'login',pathMatch: 'full'
  },
  {
    path: 'login',component: Login
  },
  {
    path: 'register',component: Register
  },

  // Unauthorized
  {
    path: 'unauthorized', component: Error
  },

  
  // Admin - Users
  {
    path: 'viewusers',component: ViewUsers,canActivate: [authGuard([Role.Admin])]
  },
  {
    path: 'adduser', component: AddUser, canActivate: [authGuard([Role.Admin])]
  },

  
  

  // Shared - Products
  {
    path: 'viewproducts',component: ViewProducts, canActivate: [authGuard([Role.Admin, Role.Officer, Role.Customer])]
  },
  {
    path: 'addproduct',component: AddProduct, canActivate: [authGuard([Role.Admin])]
  },
  {
    path: 'editproduct/:id',component: EditProduct,canActivate: [authGuard([Role.Admin])]
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


  // Invalid routes
  {
    path: '**',
    component: Error
  }
];
