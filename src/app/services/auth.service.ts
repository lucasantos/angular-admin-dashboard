import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  // The Signal that drives the UI state
  readonly currentUser = signal<User | null>(this.getInitialUser());
  readonly isAuthenticated = signal<boolean>(!!this.getInitialUser());

  private getInitialUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('system_user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  }

  login(email: string, password: string) {
    // Mocking an API call
    const mockUser: User = {
      id: 'USR-001',
      name: 'Lucas Santos',
      email: 'lucas@lucasantos.com',
      password: 'abc123',
      phone: '+55 11 91234-5678',
      avatarUrl: 'assets/images/avatars/avatar-placeholder.png',
      bio: 'Passionate about technology and design. Always eager to learn new things and take on challenges.',
      role: 'Admin',
      status: 'Active',
      lastLogin: new Date(),
    };

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('system_user', JSON.stringify(mockUser));
    }

    localStorage.setItem('isAuthenticated', 'true');

    this.currentUser.set(mockUser);
    this.isAuthenticated.set(true);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('system_user');
    }
    localStorage.setItem('isAuthenticated', 'false');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
