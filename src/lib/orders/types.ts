/**
 * Order domain model. Shared by API routes and client components.
 * Designed to map cleanly onto a database table/collection when a backend is connected.
 */

export const PAYMENT_STATUSES = ["pending", "confirmation_submitted", "verified", "rejected", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ORDER_STATUSES = ["new", "awaiting_payment", "payment_review", "in_progress", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  confirmation_submitted: "Confirmation Submitted",
  verified: "Verified",
  rejected: "Rejected",
  refunded: "Refunded",
};

/** Customer-facing wording for each payment status. */
export const PAYMENT_STATUS_CUSTOMER_LABELS: Record<PaymentStatus, string> = {
  pending: "Awaiting Payment",
  confirmation_submitted: "Awaiting Payment Verification",
  verified: "Payment Verified",
  rejected: "Payment Not Verified",
  refunded: "Refunded",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  awaiting_payment: "Awaiting Payment",
  payment_review: "Payment Review",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  location: string;
  requirements: string;
}

export interface PaymentConfirmation {
  customerName: string;
  email: string;
  orderId: string;
  paymentReference: string;
  paymentDate: string; // YYYY-MM-DD
  amountPaid: number;
  notes?: string;
  screenshot?: { fileName: string; mimeType: string; sizeBytes: number; storedAs?: string };
  submittedAt: string;
  /** False when the order could not be found in the current data store (manual review needed). */
  matchedOrder: boolean;
}

export interface Order {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  location: string;
  serviceSlug: string;
  serviceName: string;
  billing: "one-time" | "monthly";
  price: number;
  currency: "GBP";
  paymentReference: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  requirements: string;
  paymentConfirmation?: PaymentConfirmation;
}

/** The subset of an order that is safe to return to the browser. */
export interface PublicOrder {
  orderId: string;
  customerName: string;
  email: string;
  businessName: string;
  serviceSlug: string;
  serviceName: string;
  billing: "one-time" | "monthly";
  price: number;
  currency: "GBP";
  paymentReference: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
}

export const toPublicOrder = (o: Order): PublicOrder => ({
  orderId: o.orderId,
  customerName: o.customerName,
  email: o.email,
  businessName: o.businessName,
  serviceSlug: o.serviceSlug,
  serviceName: o.serviceName,
  billing: o.billing,
  price: o.price,
  currency: o.currency,
  paymentReference: o.paymentReference,
  paymentStatus: o.paymentStatus,
  orderStatus: o.orderStatus,
  createdAt: o.createdAt,
});
