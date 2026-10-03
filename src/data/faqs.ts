import type { FaqItem } from "./packages";

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Services",
    items: [
      {
        q: "What services does TALHX LIMITED provide?",
        a: "TALHX LIMITED provides SEO, local SEO, content marketing, social media marketing, paid advertising setup, and website and digital solutions such as speed optimisation and website development. Each service is offered as a clearly priced package with defined deliverables.",
      },
      {
        q: "Can I request a custom package?",
        a: "Yes. If none of the packages fit exactly, use the contact form to request a custom quote. Tell us what you are trying to achieve and we will help you identify the right service.",
      },
      {
        q: "Do you guarantee rankings, traffic or sales?",
        a: "No. Search engines and advertising platforms control rankings and results, so no one can honestly guarantee them. We guarantee to deliver the work described in your package, carried out with care.",
      },
      {
        q: "Do you work with businesses outside London?",
        a: "Yes. Our registered office is in London, but our services are delivered online, so we can work with businesses throughout the UK.",
      },
    ],
  },
  {
    title: "Ordering & Payment",
    items: [
      {
        q: "How do I purchase a package?",
        a: "Choose a package on the Pricing page and click Purchase. At checkout you confirm the package, enter your details and project information, review your order summary and continue to payment.",
      },
      {
        q: "How do I pay?",
        a: "Payment is made by UK bank transfer in GBP. After checkout you will see our bank details and a unique payment reference for your order.",
      },
      {
        q: "Do you accept bank transfers?",
        a: "Yes — bank transfer is currently our payment method. Please transfer the exact amount shown and use your unique payment reference so we can match your payment to your order.",
      },
      {
        q: "What happens after payment?",
        a: "After making the transfer, click \"I've Made the Payment\" and submit the payment confirmation form. Your order will show as Awaiting Payment Verification while we check that the payment has arrived. Once verified, we will contact you by email and begin work.",
      },
      {
        q: "Is my payment confirmed automatically?",
        a: "No. Every payment is checked manually against our bank account before an order is started. Submitting the confirmation form tells us to look for your payment; it does not confirm that the payment has been received.",
      },
      {
        q: "Do you charge VAT?",
        a: "Prices are shown in GBP as the total amount payable. If our VAT status changes, this will be clearly shown on the website before you order.",
      },
    ],
  },
  {
    title: "Delivery & Support",
    items: [
      {
        q: "How long does delivery take?",
        a: "Each package shows an estimated delivery time in business days. The estimate starts once your payment is verified and we have the information we need. Monthly services follow a monthly cycle.",
      },
      {
        q: "How do I submit my website details?",
        a: "You can add your website URL, location and requirements during checkout. If we need anything else — such as access to Google Search Console or your CMS — we will contact you by email. Please never send passwords through website forms.",
      },
      {
        q: "Can I contact support?",
        a: "Yes. Use the contact form and include your order number if your question is about an existing order. We will reply by email as soon as we can.",
      },
      {
        q: "What is your refund policy?",
        a: "If we have not started work on your order, you can cancel for a full refund. Once work has started, refunds are considered in line with our Refund Policy. Please read the Refund Policy for full details.",
      },
    ],
  },
];

/** A shorter selection used on the homepage. */
export const HOME_FAQS: FaqItem[] = [
  FAQ_GROUPS[0].items[0],
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[1].items[1],
  FAQ_GROUPS[2].items[0],
  FAQ_GROUPS[1].items[3],
  FAQ_GROUPS[0].items[1],
];
