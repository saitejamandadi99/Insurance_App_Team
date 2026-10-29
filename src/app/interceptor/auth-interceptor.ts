import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/Auth/auth';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(Auth);
  const token = service.getToken();

  if(token){
    const cloned = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  
  return next(req);
};
