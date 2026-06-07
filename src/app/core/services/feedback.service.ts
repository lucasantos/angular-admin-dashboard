import { Injectable, signal } from '@angular/core';
import { FeedbackEntry } from '../../models/feedback-entry';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  readonly feedbackHistory = signal<FeedbackEntry[]>([
    {
      id: 'FB-001',
      category: 'ui_ux',
      section: 'Dark Mode',
      subject: 'Contrast in Tables',
      message: 'The text in the support table is a bit hard to read in dark mode.',
      rating: 4,
      timestamp: new Date(2026, 3, 15),
      status: 'Implemented',
    },
    {
      id: 'FB-002',
      category: 'feature_request',
      section: 'Analytics',
      subject: 'Export to CSV',
      message: 'It would be great to have an option to export analytics data to CSV.',
      rating: 5,
      timestamp: new Date(2026, 3, 20),
      status: 'Reviewed',
    },
    {
      id: 'FB-003',
      category: 'bug_report',
      section: 'Notifications',
      subject: 'Delayed Notifications',
      message: 'Notifications are sometimes delayed by a few minutes.',
      rating: 2,
      timestamp: new Date(2026, 3, 22),
      status: 'Received',
    },
    {
      id: 'FB-004',
      category: 'other',
      section: 'General',
      subject: 'Great Dashboard!',
      message: 'Loving the new dashboard design and features. Keep up the good work!',
      rating: 5,
      timestamp: new Date(2026, 3, 25),
      status: 'Reviewed',
    },
    {
      id: 'FB-005',
      category: 'ui_ux',
      section: 'Navigation',
      subject: 'Menu Overlap on Mobile',
      message: 'The side menu overlaps content on smaller screens.',
      rating: 3,
      timestamp: new Date(2026, 3, 28),
      status: 'Received',
    },
    {
      id: 'FB-006',
      category: 'feature_request',
      section: 'User Management',
      subject: 'Bulk User Actions',
      message: 'Please add bulk actions for user management (e.g., delete, activate).',
      rating: 4,
      timestamp: new Date(2026, 3, 30),
      status: 'Reviewed',
    },
    {
      id: 'FB-007',
      category: 'bug_report',
      section: 'Reports',
      subject: 'Incorrect Data in Sales Report',
      message: 'The sales report is showing incorrect totals for the last month.',
      rating: 1,
      timestamp: new Date(2026, 4, 2),
      status: 'Received',
    },
    {
      id: 'FB-008',
      category: 'other',
      section: 'General',
      subject: 'Feedback on Support',
      message: 'The support team was very helpful and responsive. Thanks!',
      rating: 5,
      timestamp: new Date(2026, 4, 5),
      status: 'Implemented',
    }
  ]);

  submitFeedback(entry: Omit<FeedbackEntry, 'id' | 'timestamp' | 'status'>) {
    const newFeedback: FeedbackEntry = {
      ...entry,
      id: `FB-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
      status: 'Received',
    };
    this.feedbackHistory.update((list) => [newFeedback, ...list]);
  }
}
