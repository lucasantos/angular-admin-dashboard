import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TenantService } from '../services/tenant.service';

export const securityInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tenantService = inject(TenantService);

  const token = authService.getToken();
  const tenantId = tenantService.currentTenantId();

  // Mandatory X-Tenant-ID injection for data isolation in the backend.
  // If tenantId is null, we set it to 'default' to avoid breaking requests, but ideally this should never happen in a properly configured environment.
  let headers = req.headers.set('X-Tenant-ID', tenantId || 'default');

  // Injection of the Token if available
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const secureReq = req.clone({ headers });
  return next(secureReq);
};
