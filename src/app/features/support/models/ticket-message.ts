export interface TicketMessage {
  id: string;
  sender: '../../user/models/user' | "agent";
  text: string;
  timestamp: Date;
}
