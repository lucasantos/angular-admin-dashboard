import { Injectable, signal } from '@angular/core';
import { SupportTicket } from '../models/support-ticket';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  // Signal-based state
  readonly tickets = signal<SupportTicket[]>([
    {
      id: 'TK-742',
      subject: 'Issue with dashboard loading',
      category: 'Technical',
      priority: 'high',
      description: '<p>The main charts are not rendering on Safari.</p>',
      status: 'open',
      attachments: ['error_log.txt'],
      createdAt: new Date(),
      messages: [
        {
          id: '1',
          sender: 'agent',
          text: 'We are looking into the Safari rendering issue.',
          timestamp: new Date(),
        },
      ],
    },
    {
      id: 'TK-741',
      subject: 'Feature request: Dark mode',
      category: 'Feature Request',
      priority: 'medium',
      description: '<p>It would be great to have a dark mode for the dashboard.</p>',
      status: 'pending',
      attachments: [],
      createdAt: new Date(),
      messages: [
        {
          id: '1',
          sender: 'agent',
          text: 'Thank you for the suggestion! We have forwarded it to our product team.',
          timestamp: new Date(),
        },
      ],
    },
    {
      id: 'TK-740',
      subject: 'Billing discrepancy in last invoice',
      category: 'Billing',
      priority: 'high',
      description: '<p>My last invoice shows an incorrect amount.</p>',
      status: 'closed',
      attachments: ['invoice.pdf'],
      createdAt: new Date(),
      messages: [
        {
          id: '1',
          sender: 'agent',
          text: 'We have corrected the billing issue and updated your invoice.',
          timestamp: new Date(),
        },
      ],
    },
    {
      id: 'TK-739',
      subject: 'Unable to export data',
      category: 'Technical',
      priority: 'low',
      description: '<p>The export button does not respond when clicked.</p>',
      status: 'open',
      attachments: [],
      createdAt: new Date(),
      messages: [
        {
          id: '1',
          sender: 'agent',
          text: 'We are investigating the export functionality issue.',
          timestamp: new Date(),
        },
      ],
    },
    {
      id: 'TK-738',
      subject: 'Request for API access',
      category: 'Feature Request',
      priority: 'medium',
      description: '<p>Is there an API available for accessing dashboard data?</p>',
      status: 'pending',
      attachments: [],
      createdAt: new Date(),
      messages: [
        {
          id: '1',
          sender: 'agent',
          text: 'We are currently working on an API and will update you once it is available.',
          timestamp: new Date(),
        },
      ],
    },
  ]);

  createTicket(data: any, fileNames: string[]) {
    const newTicket: SupportTicket = {
      ...data,
      id: `TK-${Math.floor(Math.random() * 900 + 100)}`,
      status: 'open',
      attachments: fileNames,
      createdAt: new Date(),
      messages: [],
    };
    this.tickets.update((t) => [newTicket, ...t]);
  }

  addReply(ticketId: string, text: string) {
    this.tickets.update((list) =>
      list.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: Date.now().toString(), sender: 'user', text, timestamp: new Date() },
              ],
            }
          : t,
      ),
    );
  }
}
