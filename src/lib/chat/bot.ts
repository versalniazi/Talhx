import { PACKAGES, PACKAGES_BY_PRICE, getPackagesByCategory, type PackageCategory } from "@/data/packages";
import type { ChatLink } from "./types";

/**
 * Rule-based website assistant. It only answers from the site's own data
 * (packages, prices, process and policies) so it can never invent facts.
 * Anything it can't answer is handed to the team.
 */

export interface BotReply {
  text: string;
  links?: ChatLink[];
  suggestions?: string[];
  handoff?: boolean;
}

export const HUMAN_REQUEST = "Talk to a person";

export const DEFAULT_SUGGESTIONS = ["See pricing", "How do I pay?", "How long does delivery take?", HUMAN_REQUEST];

export const GREETING: BotReply = {
  text:
    "Hi 👋 I'm the TALHX assistant. I can help with our services, prices, ordering and payment. You can also ask to talk to a person on our team at any time.",
  suggestions: ["What services do you offer?", "See pricing", "How do I pay?", HUMAN_REQUEST],
};

const price = (n: number) => `£${n}`;

const has = (text: string, ...words: string[]) => words.some((w) => new RegExp(`\\b${w}`, "i").test(text));

function categoryReply(cat: PackageCategory, intro: string, servicePath: string): BotReply {
  const items = getPackagesByCategory(cat).sort((a, b) => a.price - b.price);
  const list = items.map((p) => `• ${p.name} — ${price(p.price)}${p.billing === "monthly" ? "/month" : ""}`).join("\n");
  return {
    text: `${intro}\n\n${list}`,
    links: [
      { label: "View these packages", href: `/pricing?category=${cat}` },
      { label: "About this service", href: servicePath },
    ],
    suggestions: ["How do I pay?", "Can I get a custom quote?", HUMAN_REQUEST],
  };
}

/** Find a package mentioned by name (e.g. "google business profile optimization"). */
function matchPackage(text: string) {
  const norm = (s: string) => s.toLowerCase().replace(/optimisation/g, "optimization").replace(/[^a-z0-9 ]/g, " ");
  const t = ` ${norm(text)} `;
  let best: { score: number; pkg: (typeof PACKAGES)[number] } | null = null;
  for (const pkg of PACKAGES) {
    const words = norm(pkg.name).split(/\s+/).filter((w) => w.length > 2);
    const hits = words.filter((w) => t.includes(` ${w} `)).length;
    const score = hits / words.length;
    if (hits >= 2 && score >= 0.75 && (!best || score > best.score)) best = { score, pkg };
  }
  return best?.pkg;
}

export function botReply(input: string): BotReply {
  const text = input.trim();

  if (has(text, "human", "person", "agent", "someone", "real person", "talk to", "speak to", "speak with", "customer service", "support team")) {
    return { text: "Of course — I'll connect you with our team.", handoff: true };
  }

  if (/\bORD-\d{6}-[A-Z0-9]{4}\b/i.test(text) || has(text, "my order", "order status", "existing order", "paid already", "i paid", "i have paid")) {
    return {
      text:
        "For questions about an existing order, our team can help directly. Have your order number (e.g. ORD-261003-7K3Q) and payment reference ready.",
      handoff: true,
    };
  }

  const pkg = matchPackage(text);
  if (pkg) {
    return {
      text: `${pkg.name} is ${price(pkg.price)}${pkg.billing === "monthly" ? " per month (monthly service)" : " (one-time service)"}.\n\n${pkg.summary}\n\nEstimated delivery: ${pkg.delivery}.`,
      links: [
        { label: "Full details", href: `/pricing/${pkg.slug}` },
        { label: "Purchase", href: `/checkout?package=${pkg.slug}` },
      ],
      suggestions: ["How do I pay?", "What happens after payment?", HUMAN_REQUEST],
    };
  }

  if (/^(hi|hello|hey|hiya|good (morning|afternoon|evening))\b/i.test(text)) {
    return { text: "Hello! How can I help today?", suggestions: GREETING.suggestions };
  }

  if (has(text, "thank", "thanks", "cheers")) {
    return { text: "You're welcome! Is there anything else I can help with?", suggestions: DEFAULT_SUGGESTIONS };
  }

  if (has(text, "guarantee", "rank", "first page", "page one", "number one", "#1")) {
    return {
      text:
        "We don't guarantee rankings, traffic or sales — search engines and ad platforms control those, so no one can honestly promise them. What we do guarantee is to deliver the work described in your package, carefully and with clear reporting.",
      links: [{ label: "SEO services", href: "/services/seo" }],
      suggestions: ["See pricing", HUMAN_REQUEST],
    };
  }

  if (has(text, "refund", "cancel", "money back")) {
    return {
      text:
        "If we haven't started work, you can cancel for a full refund. Once work has started, refunds are considered in line with our Refund Policy — for example, a fair deduction for work already done.",
      links: [{ label: "Refund Policy", href: "/refund-policy" }],
      suggestions: [HUMAN_REQUEST],
    };
  }

  if (has(text, "pay", "payment", "bank", "transfer", "card", "paypal", "invoice")) {
    return {
      text:
        "We currently accept UK bank transfer in GBP. After checkout you'll see our bank details and a unique payment reference. Once you've paid, click \"I've Made the Payment\" and submit the short form. We verify every payment manually before starting work.",
      links: [{ label: "How it works", href: "/faq#ordering-payment" }],
      suggestions: ["What happens after payment?", "See pricing", HUMAN_REQUEST],
    };
  }

  if (has(text, "after payment", "verify", "verification", "what happens")) {
    return {
      text:
        "After you submit your payment confirmation, your order shows as \"Awaiting Payment Verification\" while we check our bank account. Once verified, we email you and start work.",
      suggestions: ["How long does delivery take?", HUMAN_REQUEST],
    };
  }

  if (has(text, "how long", "delivery", "turnaround", "when will", "timeframe", "days")) {
    return {
      text:
        "Each package shows an estimated delivery time — most one-time packages take between 1 and 10 business days, counted from payment verification and receiving the details we need. Monthly services run on a monthly cycle.",
      links: [{ label: "See packages", href: "/pricing" }],
      suggestions: ["How do I pay?", HUMAN_REQUEST],
    };
  }

  if (has(text, "custom", "quote", "bespoke", "tailor")) {
    return {
      text: "Happy to help with something custom. You can send a quick request through our contact form, or ask our team here.",
      links: [{ label: "Request a custom quote", href: "/contact?service=Custom%20quote" }],
      suggestions: [HUMAN_REQUEST],
    };
  }

  if (has(text, "local", "google business", "gbp", "maps", "citation")) {
    return categoryReply("local-seo", "Our local SEO packages:", "/services/local-seo");
  }
  if (has(text, "ads", "advert", "ppc", "google ads", "meta ads", "facebook ads", "instagram ads", "campaign")) {
    return categoryReply("advertising", "Our advertising setup packages (ad spend is paid directly to the platform):", "/services/paid-advertising");
  }
  if (has(text, "blog", "article", "content", "writing", "copy")) {
    return categoryReply("content", "Our content packages:", "/services/content-marketing");
  }
  if (has(text, "social", "instagram post", "facebook post", "posts")) {
    return categoryReply("social", "Our social media packages:", "/services/social-media");
  }
  if (has(text, "speed", "slow", "website", "web design", "develop", "monthly")) {
    return categoryReply("growth", "Our website and growth packages:", "/services/web-development");
  }
  if (has(text, "seo", "keyword", "audit", "meta", "backlink", "technical", "on-page", "search")) {
    return categoryReply("seo", "Our SEO packages:", "/services/seo");
  }

  if (has(text, "price", "pricing", "cost", "how much", "cheap", "package", "packages")) {
    const cheapest = PACKAGES_BY_PRICE[0];
    return {
      text: `We have 30 fixed-price packages, starting from ${price(cheapest.price)} (${cheapest.name}) up to ${price(150)}. Every package lists its deliverables and estimated delivery time.`,
      links: [{ label: "View all pricing", href: "/pricing" }],
      suggestions: ["SEO packages", "Local SEO packages", "Social media packages", HUMAN_REQUEST],
    };
  }

  if (has(text, "service", "offer", "what do you do", "help with")) {
    return {
      text:
        "TALHX LIMITED offers SEO, local SEO (including Google Business Profile), content marketing, social media marketing, Google and Meta ads setup, and website speed and digital solutions.",
      links: [{ label: "Explore services", href: "/services" }],
      suggestions: ["SEO packages", "Local SEO packages", "See pricing", HUMAN_REQUEST],
    };
  }

  if (has(text, "where", "address", "located", "london", "company number", "registered")) {
    return {
      text:
        "TALHX LIMITED is registered in England and Wales (company number 17475450). Our registered office is 101 Hammersmith Grove, London, W6 0NQ. Our services are delivered online across the UK.",
      links: [{ label: "About us", href: "/about" }],
    };
  }

  return {
    text: "I'm not sure I can answer that one properly. Would you like me to pass it to our team?",
    suggestions: [HUMAN_REQUEST, "See pricing", "How do I pay?"],
  };
}
