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

export interface ChatMessage {
  id: string;
  conversationId: string;
  from: Sender;
  agentName?: string;
  text: string;
  links?: ChatLink[];
  suggestions?: string[];
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
