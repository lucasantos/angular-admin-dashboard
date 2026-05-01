import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly router = inject(Router);

  // Mock initial user state
  readonly currentUser = signal<User | null>({
    id: '999',
    name: 'John Doe',
    email: 'john.doe@techcorp.com',
    avatarUrl: '/assets/images/avatars/avatar-placeholder.png',
    // avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date(),
  });

  // Computed helper to get initials if avatar fails
  readonly initials = computed(() => {
    const name = this.currentUser()?.name || '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  });

  logout() {
    console.log('Logging out...');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // Mocked Database
  private readonly mockUsers: User[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Admin',
      status: 'Active',
      avatarUrl: '',
      lastLogin: undefined,
    },
    {
      id: '123',
      name: 'John Doe',
      email: 'john.doe@techcorp.com',
      role: 'Editor',
      status: 'Active',
      avatarUrl: '',
      lastLogin: undefined,
    },
    {
      id: '456',
      name: 'Jane Smith',
      email: 'jane.smith@design.io',
      role: 'Viewer',
      status: 'Inactive',
      avatarUrl: '',
      lastLogin: undefined,
    },
  ];

  // Signal for the "Currently Viewed User" - great for UI binding elsewhere
  // readonly currentUser = signal<User | null>(null);

  /**
   * Fetches a user by ID.
   * Includes a 1.5s delay to simulate API latency for testing Breadcrumb Skeletons.
   */
  getUserById(id: string): Observable<User | undefined> {
    const user = this.mockUsers.find((u) => u.id === id);

    return of(user).pipe(
      delay(1500), // Simulate network lag
      tap((foundUser) => {
        if (foundUser) this.currentUser.set(foundUser);
      }),
    );
  }

  /**
   * Returns all users for a list view
   */
  getUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(800));
  }
}
