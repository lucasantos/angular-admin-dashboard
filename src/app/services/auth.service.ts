import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { TenantService } from './tenant.service';
import { environment } from '../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tenantService = inject(TenantService);
  private readonly API_URL = environment.mockAPI + '/users'; // Mock API db.json
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    // It attempts to restore the session as soon as the service is instantiated.
    this.restoreSession();
  }

  // Authentication Method
  authenticate(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.API_URL}?email=${email}&password=${password}`).pipe(
      map((users) => {
        const user = users[0];
        if (!user) throw new Error('Invalid credentials');

        const currentTenant = this.tenantService.currentTenantId();

        // Debug log to verify tenant matching logic
        console.log(`[Auth] User Tenant: ${user.tenantId} | URL Tenant: ${currentTenant}`);

        if (user.tenantId !== currentTenant && currentTenant !== 'default') {
          throw new Error(`Access denied: This user belongs to tenant ${user.tenantId}.`);
        }

        return user;
      }),
      tap((user) => this.establishSession(user, user.token || 'mock-jwt-token')),
    );
  }

  // Session Method (State Management and LocalStorage)
  private establishSession(user: User, token: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_profile', JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  // Method to restore session on refresh or app initialization
  restoreSession(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('auth_token');
      const userJson = localStorage.getItem('user_profile');

      if (token && userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          return true;
        } catch (error) {
          console.error('Failed to restore session from localStorage:', error);
          this.logout(); // If the JSON is corrupted, clear everything.
          return false;
        }
      }
    }
    return false;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
