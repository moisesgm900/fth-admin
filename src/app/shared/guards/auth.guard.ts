import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
JwtHelperService
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtHelper = new JwtHelperService();

  const token = localStorage.getItem('token');

  if (token && !jwtHelper.isTokenExpired(token)) {
    return true;
  } else {
    router.navigate(['/public/login']);
    return false;
  }
};
