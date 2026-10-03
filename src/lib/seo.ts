import type { Metadata } from "next";
import { COMPANY, SITE, SITE_URL, addressLines } from "@/data/site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Use an absolute title (no "| TALHX" suffix). */
  absoluteTitle?: boolean;
  noIndex?: boolean;
  type?: "website" | "article";
}

export function pageMetadata({ title, description, path, absoluteTitle, noIndex, type = "website" }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: absoluteTitle ? title : `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
    },
    twitter: { card: "summary_large_image", title, description },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: COMPANY.brand,
  legalName: COMPANY.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: SITE.defaultDescription,
  foundingDate: COMPANY.incorporationDate,
  identifier: { "@type": "PropertyValue", propertyID: "Companies House company number", value: COMPANY.companyNumber },
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.locality,
    addressRegion: COMPANY.address.region,
    postalCode: COMPANY.address.postalCode,
    addressCountry: COMPANY.address.countryCode,
  },
  areaServed: { "@type": "Country", name: "United Kingdom" },
  ...(COMPANY.email ? { email: COMPANY.email } : {}),
  ...(COMPANY.phone ? { telephone: COMPANY.phone } : {}),
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE.name,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-GB",
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path === "/" ? "" : it.path}`,
  })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const addressText = addressLines.join(", ");
