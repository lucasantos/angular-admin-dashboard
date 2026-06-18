import { AppNotification } from '../core/notifications/models/app-notification';

export const MOCK_NOTIFICATIONS: Omit<AppNotification, 'id' | 'isRead' | 'timestamp'>[] = [
  {
    category: 'system',
    priority: 'high',
    title: 'Security Update Required',
    message:
      "Your account was accessed from a new device in **São Paulo, BR**. If this wasn't you, please update your credentials immediately.",
    action: {
      route: '/settings/security',
      label: 'Secure Account',
    },
  },
  {
    category: 'support',
    priority: 'medium',
    title: 'Ticket #TK-991 Resolved',
    message:
      'Our technical team has fixed the issue with your dashboard export. Please verify the fix.',
    action: {
      route: '/support',
      params: { id: 'TK-736' },
      label: 'View Ticket',
    },
  },
  {
    category: 'feature',
    priority: 'low',
    title: 'Nano Banana 2 is here!',
    message:
      'Our AI image generation tool just got an upgrade. You can now **edit existing images** with natural language commands.',
    action: {
      route: '/tools/image-gen',
      label: 'Explore Features',
    },
  },
  {
    category: 'payments',
    priority: 'high',
    title: 'Subscription Renewal Failed',
    message:
      "We couldn't process the payment for your **Pro Plan**. Please update your payment method to avoid service interruption.",
    action: {
      route: '/settings/billing',
      label: 'Update Payment',
    },
  },
  {
    category: 'feedback',
    priority: 'low',
    title: 'Help us improve!',
    message:
      "How are you liking the new **Dark Mode**? We'd love to hear your thoughts on the color contrast.",
    action: {
      route: '/feedback/survey-2026',
      label: 'Take 1-min Survey',
    },
  },
];
