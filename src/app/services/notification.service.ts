import { Injectable, signal, computed, inject } from '@angular/core';
import { AppNotification, NotificationAction } from '../models/app-notification';
import { Router } from '@angular/router';
import { MOCK_NOTIFICATIONS } from '../mocks/notifications.mock';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly router = inject(Router);
  readonly notifications = signal<AppNotification[]>([]);

  constructor() {
    // Populate the signal with our mock data on initialization
    const initialData = MOCK_NOTIFICATIONS.map((n, index) => ({
      ...n,
      id: `mock-id-${index}`,
      isRead: false,
      timestamp: new Date(Date.now() - index * 3600000), // Spaced out by hours
    }));

    this.notifications.set(initialData);
  }

  // Computed signal for the badge count (only unread)
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  /**
   * Any service (Support, Billing, System) calls this to push an alert.
   */
  dispatch(notification: Omit<AppNotification, 'id' | 'isRead' | 'timestamp'>) {
    const newEntry: AppNotification = {
      ...notification,
      id: crypto.randomUUID(),
      isRead: false,
      timestamp: new Date(),
    };
    this.notifications.update((list) => [newEntry, ...list]);
  }

  /**
   * Centralized logic to handle the "Action" button click
   */
  handleAction(action: NotificationAction) {
    this.router.navigate([action.route], {
      queryParams: action.params,
      queryParamsHandling: 'merge',
    });
  }

  markAsRead(id: string) {
    this.notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  markAllAsRead() {
    this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
  }

  remove(id: string) {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  clearAll() {
    this.notifications.set([]);
  }
}
