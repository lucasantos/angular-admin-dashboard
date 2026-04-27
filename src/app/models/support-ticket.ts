import { TicketMessage } from "./ticket-message";

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  attachments: string[]; // List of filenames/URLs
  status: 'open' | 'closed' | 'pending';
  createdAt: Date;
  messages: TicketMessage[];
}
