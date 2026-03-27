import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Mocked Database
  private readonly mockUsers: User[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: '123', name: 'John Doe', email: 'john.doe@techcorp.com', role: 'Editor', status: 'Active' },
    { id: '456', name: 'Jane Smith', email: 'jane.smith@design.io', role: 'Viewer', status: 'Inactive' },
  ];

  // Signal for the "Currently Viewed User" - great for UI binding elsewhere
  readonly currentUser = signal<User | null>(null);


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
      })
    );
  }

  /**
   * Returns all users for a list view
   */
  getUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(800));
  }
}
