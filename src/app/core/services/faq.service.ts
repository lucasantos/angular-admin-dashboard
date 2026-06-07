import { Injectable, signal } from '@angular/core';
import { FaqItem } from '../../shared/models/faq-item';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private readonly faqData: FaqItem[] = [
    { id: 1, category: 'General', question: 'How do I change my password?', answer: 'Navigate to the Account Settings menu and select the Security tab.' },
    { id: 2, category: 'Billing', question: 'Where can I find my invoices?', answer: 'Invoices are available under the Billing section of your profile.' },
    { id: 3, category: 'Technical', question: 'Does this dashboard support SSR?', answer: 'Yes, it is built with Angular 21 and full Server-Side Rendering support.' },
    { id: 4, category: 'General', question: 'How do I contact support?', answer: 'You can submit a support ticket through the Help menu or email us at support@example.com.' },
    { id: 5, category: 'Technical', question: 'What browsers are supported?', answer: 'Our dashboard supports the latest versions of Chrome, Firefox, Safari, and Edge.' },
    { id: 6, category: 'Billing', question: 'Can I change my subscription plan?', answer: 'Yes, you can upgrade or downgrade your subscription from the Billing section.' },
    { id: 7, category: 'General', question: 'Is there a mobile app available?', answer: 'Currently, we do not have a mobile app, but our dashboard is responsive and works well on mobile browsers.' },
    { id: 8, category: 'Technical', question: 'How do I report a bug?', answer: 'Please submit a bug report through the Feedback page or contact support directly.' },
    { id: 9, category: 'Billing', question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers.' },
    { id: 10, category: 'General', question: 'Can I have multiple users on one account?', answer: 'Yes, you can add team members to your account from the Users section.' },
  ];

  readonly faqs = signal<FaqItem[]>(this.faqData);
}
