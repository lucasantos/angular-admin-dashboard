export type NotificationCategory = 'support' | 'system' | 'feedback' | 'feature' | 'payments';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface NotificationAction {
  route: string;
  params?: Record<string, string | null>;
  label: string;
}

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  // type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  action?: NotificationAction;
}
