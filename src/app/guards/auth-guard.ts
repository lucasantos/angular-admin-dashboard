import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.log(`Is user authenticated: ${authService.isAuthenticated()}.`);
    return true;
  }

  console.log(`Is user authenticated: ${authService.isAuthenticated()}.`);
  router.navigate(['/login']);
  return false;
};
