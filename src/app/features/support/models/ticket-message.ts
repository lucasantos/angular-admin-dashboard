export interface TicketMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
}
