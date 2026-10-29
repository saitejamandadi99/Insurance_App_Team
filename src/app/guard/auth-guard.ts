import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../Enums/Role';
import { inject } from '@angular/core';
import { Auth } from '../services/Auth/auth';

export const authGuard=(allowedRoles: Role[]): CanActivateFn => {
  return () =>{
    const authService = inject(Auth);
    const router = inject(Router);

    if(!authService.isLoggedIn()){
      return router.createUrlTree(['/login']);
    }
    const userRole = authService.getRole();
    if(userRole && allowedRoles.includes(userRole)){
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  }
};
