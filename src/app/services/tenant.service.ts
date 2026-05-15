import { DOCUMENT, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private readonly document = inject(DOCUMENT);

  // Signal that stores the current tenant ID.
  readonly currentTenantId = signal<string | null>(this.discoverTenant());

  private discoverTenant(): string | null {
    const host = this.document.location.hostname; // E.g., client1.domain.com
    const path = this.document.location.pathname; // E.g., domain.com/client1

    // Priority 1: Subdomain as tenant (e.g., client1.domain.com)
    const subdomain = host.split('.')[0];
    if (subdomain && !['localhost', 'www', 'app'].includes(subdomain)) {
      return subdomain;
    }

    // Fallback: The first segment of the URL (e.g., localhost:4200/client1)
    const firstSegment = path.split('/')[1];
    if (firstSegment && !['admin', 'dashboard', 'login', ''].includes(firstSegment)) {
      return firstSegment;
    }

    // Development environment: Verification via Query Param (e.g., localhost:4200?tenant=tenant-a)
    const params = new URLSearchParams(this.document.location.search);
    const queryTenant = params.get('tenant');
    if (queryTenant) return queryTenant;

    return 'default'; // Standard tenant or central system
  }
}
