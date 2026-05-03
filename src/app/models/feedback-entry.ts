export interface FeedbackEntry {
  id: string;
  category: "ui_ux" | "feature_request" | "bug_report" | "other";
  section: string;
  subject: string;
  message: string;
  rating: number;
  timestamp: Date;
  status: "Received" | "Reviewed" | "Implemented";
}
