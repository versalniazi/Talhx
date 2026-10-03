/**
 * Business bank transfer details for TALHX LIMITED.
 * Only imported by the payment-stage components so these details are shown
 * during checkout/payment rather than across the public site.
 */
export const BANK_DETAILS = {
  accountName: "TALHX LIMITED",
  sortCode: "040605",
  sortCodeDisplay: "04-06-05",
  accountNumber: "33904919",
  bank: "Tide",
  currency: "GBP (£)",
} as const;
