/** Live chat domain model (client-safe). */

export type ConversationStatus = "bot" | "waiting" | "open" | "closed";
export type Sender = "visitor" | "bot" | "agent" | "system";

export const STATUS_LABELS: Record<ConversationStatus, string> = {
  bot: "With assistant",
  waiting: "Waiting for team",
  open: "In progress",
  closed: "Closed",
};

export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  isImage: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  from: Sender;
  agentName?: string;
  text: string;
  links?: ChatLink[];
  suggestions?: string[];
  attachment?: ChatAttachment;
  createdAt: string;
}

export interface Conversation {
  id: string;
  /** SHA-256 of the visitor's secret token. Never sent to the browser. */
  tokenHash: string;
  name: string;
  email: string;
  status: ConversationStatus;
  assignedTo?: string;
  page?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  /** Visitor messages not yet seen by an agent. */
  unreadForAgent: number;
  messageCount: number;
}

export type PublicConversation = Omit<Conversation, "tokenHash">;

export const toPublicConversation = ({ tokenHash: _t, ...rest }: Conversation): PublicConversation => rest;

export const CHAT_MESSAGE_MAX = 1000;
export const CHAT_MAX_MESSAGES = 400;

/** Attachments: max size and allowed types (shared by browser and server). */
export const ATTACHMENT_MAX_BYTES = 4 * 1024 * 1024; // Vercel limits request bodies to 4.5 MB
export const ATTACHMENT_TYPES: Record<string, string> = {
  "image/png": "PNG image",
  "image/jpeg": "JPG image",
  "image/webp": "WebP image",
  "image/gif": "GIF image",
  "application/pdf": "PDF",
  "application/msword": "Word document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word document",
  "application/vnd.ms-excel": "Excel spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel spreadsheet",
  "text/csv": "CSV file",
  "text/plain": "Text file",
};
export const ATTACHMENT_ACCEPT = ".png,.jpg,.jpeg,.webp,.gif,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt";

export const formatBytes = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);
