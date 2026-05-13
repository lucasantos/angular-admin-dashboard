import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  const userRole = authService.currentUser()?.role;

  // If the route requires specific roles and the user does not have them, redirect to dashboard or an 'Access Denied' page
  if (requiredRoles && !requiredRoles.includes(userRole!)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
