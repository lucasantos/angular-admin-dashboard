import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { TenantService } from './tenant.service';
import { environment } from '../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tenantService = inject(TenantService);
  private readonly API_URL = environment.mockAPI + '/users';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translocoService = inject(TranslocoService);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    this.restoreSession();
  }

  authenticate(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.API_URL}?email=${email}&password=${password}`).pipe(
      map((users) => {
        const user = users[0];
        if (!user) throw new Error(this.translocoService.translate('auth.login.invalidCredentials'));

        const currentTenant = this.tenantService.currentTenantId();

        console.log(
          `${this.translocoService.translate('auth.login.userTenant')}: ${user.tenantId} | ${this.translocoService.translate('auth.login.urlTenant')}: ${currentTenant}`,
        );

        if (user.tenantId !== currentTenant && currentTenant !== 'default') {
          throw new Error(
            `${this.translocoService.translate('auth.login.accessDenied')} ${user.tenantId}.`,
          );
        }

        return user;
      }),
      tap((user) => this.establishSession(user, user.token || 'mock-jwt-token')),
    );
  }

  private establishSession(user: User, token: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_profile', JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

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
          console.error(this.translocoService.translate('auth.login.sessionFailed'), error);
          this.logout();
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
