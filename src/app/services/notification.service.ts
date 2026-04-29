import { Injectable, signal, computed } from '@angular/core';
import { AppNotification } from '../models/app-notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Mock initial data
  private readonly initialNotifications: AppNotification[] = [
    {
      id: '1',
      ticketId: 'TK-742',
      title: 'New Ticket Reply',
      message: 'Support agent replied to your ticket TK-742.',
      type: 'info',
      timestamp: new Date(),
      isRead: false,
    },
    {
      id: '2',
      ticketId: 'TK-741',
      title: 'System Update',
      message: 'The dashboard will undergo maintenance tonight at 00:00.',
      type: 'warning',
      timestamp: new Date(Date.now() - 3600000),
      isRead: false,
    },
    {
      id: '3',
      ticketId: 'TK-740',
      title: 'New Feature Released',
      message: 'Check out the new analytics dashboard in your account.',
      type: 'success',
      timestamp: new Date(Date.now() - 7200000),
      isRead: true,
    },
    {
      id: '4',
      ticketId: 'TK-739',
      title: 'Password Expiring Soon',
      message: 'Your password will expire in 5 days. Please update it.',
      type: 'error',
      timestamp: new Date(Date.now() - 10800000),
      isRead: true,
    },
    {
      id: '5',
      ticketId: 'TK-738',
      title: 'New Comment on Ticket',
      message: 'A customer commented on ticket TK-738.',
      type: 'info',
      timestamp: new Date(Date.now() - 14400000),
      isRead: false,
    },
    {
      id: '6',
      ticketId: 'TK-737',
      title: 'Scheduled Downtime',
      message: 'The dashboard will be unavailable on Saturday from 1 AM to 3 AM.',
      type: 'warning',
      timestamp: new Date(Date.now() - 18000000),
      isRead: false,
    },
    {
      id: '7',
      ticketId: 'TK-736',
      title: 'New Integration Available',
      message: 'Integrate with Slack to receive notifications directly in your channels.',
      type: 'success',
      timestamp: new Date(Date.now() - 21600000),
      isRead: true,
    },
    {
      id: '8',
      ticketId: 'TK-735',
      title: 'Security Alert',
      message: 'Unusual login activity detected on your account.',
      type: 'error',
      timestamp: new Date(Date.now() - 25200000),
      isRead: true,
    },
    {
      id: '9',
      ticketId: 'TK-734',
      title: 'New Ticket Assigned',
      message: 'You have been assigned to ticket TK-734.',
      type: 'info',
      timestamp: new Date(Date.now() - 28800000),
      isRead: false,
    },
    {
      id: '10',
      ticketId: 'TK-733',
      title: 'Feature Deprecation Notice',
      message: 'The old reporting module will be deprecated next month.',
      type: 'warning',
      timestamp: new Date(Date.now() - 32400000),
      isRead: false,
    },
  ];

  readonly notifications = signal<AppNotification[]>(this.initialNotifications);

  // Computed signal for the badge count (only unread)
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

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
