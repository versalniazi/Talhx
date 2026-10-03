/**
 * Official company information for TALHX LIMITED.
 * Source: Companies House record supplied by the company. Do not alter or embellish.
 */
export const COMPANY = {
  legalName: "TALHX LIMITED",
  brand: "TALHX",
  tagline: "Digital Marketing & SEO",
  companyNumber: "17475450",
  companyStatus: "Active",
  companyType: "Private Limited Company",
  incorporationDate: "2026-09-23",
  incorporationDateLabel: "23 September 2026",
  registeredIn: "England and Wales",
  address: {
    street: "101 Hammersmith Grove",
    locality: "London",
    region: "England",
    postalCode: "W6 0NQ",
    country: "United Kingdom",
    countryCode: "GB",
  },
  sicCodes: [
    { code: "58290", label: "Other software publishing" },
    { code: "62012", label: "Business and domestic software development" },
  ],
  /**
   * Public contact email / phone. Intentionally left empty until real details are supplied —
   * the site falls back to the contact form. Set a value here to display it site-wide.
   */
  email: "" as string,
  phone: "" as string,
} as const;

export const addressLines = [
  COMPANY.address.street,
  COMPANY.address.locality,
  COMPANY.address.region,
  COMPANY.address.postalCode,
  COMPANY.address.country,
];

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.talhx.com").replace(/\/$/, "");

export const SITE = {
  name: "TALHX",
  url: SITE_URL,
  defaultTitle: "TALHX — Digital Marketing & SEO Services UK",
  titleTemplate: "%s | TALHX",
  defaultDescription:
    "Clearly priced digital marketing and SEO services for UK businesses. SEO audits, local SEO, content, social media, Google Ads and website optimisation — order online from £15.",
  locale: "en_GB",
};

export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
] as const;

export const LEGAL_LAST_UPDATED = "3 October 2026";
