import { normalizeUrl } from "./sanitize";

export type FieldErrors<K extends string = string> = Partial<Record<K, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// UK and international numbers: digits, spaces, +, (, ), - ; 7–15 digits.
const PHONE_CHARS_RE = /^[+()\-\s\d]+$/;

export const v = {
  required(value: string, label: string): string | undefined {
    return value.trim() ? undefined : `${label} is required.`;
  },
  name(value: string, label = "Name"): string | undefined {
    const t = value.trim();
    if (!t) return `${label} is required.`;
    if (t.length < 2) return `${label} must be at least 2 characters.`;
    if (t.length > 100) return `${label} must be 100 characters or fewer.`;
    return undefined;
  },
  email(value: string): string | undefined {
    const t = value.trim();
    if (!t) return "Email address is required.";
    if (t.length > 254 || !EMAIL_RE.test(t)) return "Enter a valid email address, like name@example.co.uk.";
    return undefined;
  },
  phone(value: string, required = true): string | undefined {
    const t = value.trim();
    if (!t) return required ? "Phone number is required." : undefined;
    const digits = t.replace(/\D/g, "");
    if (!PHONE_CHARS_RE.test(t) || digits.length < 7 || digits.length > 15) return "Enter a valid phone number, like 07123 456789.";
    return undefined;
  },
  url(value: string, required = false): string | undefined {
    const t = value.trim();
    if (!t) return required ? "Website URL is required." : undefined;
    try {
      const u = new URL(normalizeUrl(t));
      if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".")) throw new Error();
      return undefined;
    } catch {
      return "Enter a valid website address, like www.example.co.uk.";
    }
  },
  maxLength(value: string, max: number, label: string): string | undefined {
    return value.length > max ? `${label} must be ${max} characters or fewer.` : undefined;
  },
};

/* ---------- Checkout ---------- */

export type CheckoutField = "fullName" | "email" | "phone" | "businessName" | "website" | "location" | "requirements";
export type CheckoutInput = Record<CheckoutField, string>;

export function validateCheckout(input: CheckoutInput): FieldErrors<CheckoutField> {
  const e: FieldErrors<CheckoutField> = {
    fullName: v.name(input.fullName, "Full name"),
    email: v.email(input.email),
    phone: v.phone(input.phone),
    businessName: v.required(input.businessName, "Business name") ?? v.maxLength(input.businessName, 120, "Business name"),
    website: v.url(input.website),
    location: v.required(input.location, "Business location") ?? v.maxLength(input.location, 120, "Business location"),
    requirements: v.maxLength(input.requirements, 3000, "Additional requirements"),
  };
  return compact(e);
}

/* ---------- Payment confirmation ---------- */

export type PaymentField = "customerName" | "email" | "orderId" | "paymentReference" | "paymentDate" | "amountPaid" | "screenshot";
export type PaymentInput = Record<Exclude<PaymentField, "screenshot">, string>;

export const SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024;
export const SCREENSHOT_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

export function validatePayment(
  input: PaymentInput,
  file?: { size: number; type: string } | null,
  today = new Date(),
): FieldErrors<PaymentField> {
  const e: FieldErrors<PaymentField> = {
    customerName: v.name(input.customerName, "Name"),
    email: v.email(input.email),
    orderId: /^ORD-\d{6}-[A-HJ-NP-Z2-9]{4}$/.test(input.orderId.trim().toUpperCase())
      ? undefined
      : "Enter your order number, like ORD-261003-7K3Q.",
    paymentReference: /^TALHX-\d{6}$/.test(input.paymentReference.trim().toUpperCase())
      ? undefined
      : "Enter your payment reference, like TALHX-104826.",
    paymentDate: validatePaymentDate(input.paymentDate, today),
    amountPaid: validateAmount(input.amountPaid),
  };
  if (file && file.size > 0) {
    if (!SCREENSHOT_TYPES.includes(file.type)) e.screenshot = "Upload a PNG, JPG, WebP or PDF file.";
    else if (file.size > SCREENSHOT_MAX_BYTES) e.screenshot = "The file must be 5 MB or smaller.";
  }
  return compact(e);
}

function validatePaymentDate(value: string, today: Date): string | undefined {
  if (!value) return "Payment date is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Enter a valid date.";
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "Enter a valid date.";
  const tomorrow = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1);
  if (d.getTime() > tomorrow) return "Payment date cannot be in the future.";
  if (d.getTime() < tomorrow - 1000 * 60 * 60 * 24 * 120) return "Payment date looks too far in the past. Please contact us.";
  return undefined;
}

function validateAmount(value: string): string | undefined {
  const t = value.trim().replace(/^£/, "");
  if (!t) return "Amount paid is required.";
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(t)) return "Enter the amount in pounds, like 59 or 59.00.";
  if (Number(t) <= 0) return "Amount must be greater than £0.";
  return undefined;
}

/* ---------- Contact ---------- */

export type ContactField = "name" | "email" | "phone" | "company" | "website" | "service" | "budget" | "message";
export type ContactInput = Record<ContactField, string>;

export function validateContact(input: ContactInput): FieldErrors<ContactField> {
  const msg = input.message.trim();
  const e: FieldErrors<ContactField> = {
    name: v.name(input.name),
    email: v.email(input.email),
    phone: v.phone(input.phone, false),
    company: v.maxLength(input.company, 120, "Company"),
    website: v.url(input.website),
    service: input.service.trim() ? undefined : "Please choose a service, or select \"Not sure yet\".",
    budget: v.maxLength(input.budget, 60, "Budget"),
    message: !msg
      ? "Message is required."
      : msg.length < 10
        ? "Please tell us a little more (at least 10 characters)."
        : v.maxLength(msg, 3000, "Message"),
  };
  return compact(e);
}

function compact<K extends string>(e: FieldErrors<K>): FieldErrors<K> {
  const out: FieldErrors<K> = {};
  for (const k in e) if (e[k]) out[k] = e[k];
  return out;
}

export const hasErrors = (e: object) => Object.keys(e).length > 0;
