import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { PackageDetails } from "@/components/pricing/PackageDetails";
import { PackageCard, BillingLabel } from "@/components/pricing/PackageCard";
import { CustomQuote } from "@/components/layout/CustomQuote";
import { CATEGORY_LABELS, COMMON_PACKAGE_FAQS, PACKAGES, getPackageBySlug } from "@/data/packages";
import { SITE_URL } from "@/data/site";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { formatGBP } from "@/lib/format";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return PACKAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const pkg = getPackageBySlug((await params).slug);
  if (!pkg) return {};
  return pageMetadata({
    title: `${pkg.name} — ${formatGBP(pkg.price)}${pkg.billing === "monthly" ? "/month" : ""}`,
    description: `${pkg.summary} Fixed price ${formatGBP(pkg.price)}${pkg.billing === "monthly" ? " per month" : ""}. Estimated delivery: ${pkg.delivery}.`,
    path: `/pricing/${pkg.slug}`,
  });
}

export default async function PackagePage({ params }: { params: Promise<Params> }) {
  const pkg = getPackageBySlug((await params).slug);
  if (!pkg) notFound();

  const similar = PACKAGES.filter((p) => p.category === pkg.category && p.slug !== pkg.slug).slice(0, 3);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pkg.name,
    description: pkg.overview,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    offers: {
      "@type": "Offer",
      price: pkg.price.toFixed(2),
      priceCurrency: "GBP",
      url: `${SITE_URL}/pricing/${pkg.slug}`,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <PageHero
        compact
        breadcrumbs={[
          { name: "Pricing", path: "/pricing" },
          { name: pkg.name, path: `/pricing/${pkg.slug}` },
        ]}
        eyebrow={`${CATEGORY_LABELS[pkg.category]} package`}
        title={pkg.name}
        description={pkg.summary}
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <p className="text-4xl font-semibold tracking-tight">
            {formatGBP(pkg.price)}
            {pkg.billing === "monthly" && <span className="text-lg font-normal text-white/60"> /month</span>}
          </p>
          <BillingLabel billing={pkg.billing} className="!bg-white/10 !text-white/85" />
          {pkg.popular && (
            <span className="rounded-full bg-accent-gradient px-3 py-1 text-xs font-semibold uppercase tracking-wider">Popular</span>
          )}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={`/checkout?package=${pkg.slug}`} className="btn-gradient !min-h-[52px] px-7">
            Purchase Package
          </Link>
          <Link href="/pricing" className="btn-ghost-dark !min-h-[52px]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All packages
          </Link>
        </div>
      </PageHero>

      <section className="bg-white py-16 sm:py-20">
        <div className="container max-w-4xl">
          <PackageDetails pkg={pkg} />
        </div>
      </section>

      {similar.length > 0 && (
        <section className="bg-mist py-16 sm:py-20" aria-labelledby="similar-heading">
          <div className="container">
            <h2 id="similar-heading" className="text-3xl text-ink-900">
              Similar packages
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <li key={p.slug}>
                  <PackageCard pkg={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CustomQuote />
      <JsonLd data={[productSchema, faqJsonLd([...pkg.faqs, ...COMMON_PACKAGE_FAQS])]} />
    </>
  );
}
