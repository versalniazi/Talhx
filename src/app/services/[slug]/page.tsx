import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { PackageCard } from "@/components/pricing/PackageCard";
import { CustomQuote } from "@/components/layout/CustomQuote";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { SERVICES, getServiceBySlug } from "@/data/services";
import { getPackageBySlug, type ServicePackage } from "@/data/packages";
import { SITE_URL } from "@/data/site";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { formatGBP } from "@/lib/format";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const service = getServiceBySlug((await params).slug);
  if (!service) return {};
  return pageMetadata({ title: service.metaTitle, description: service.metaDescription, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const service = getServiceBySlug((await params).slug);
  if (!service) notFound();

  const packages = service.relatedPackageSlugs.map(getPackageBySlug).filter(Boolean) as ServicePackage[];
  const fromPrice = packages.length ? Math.min(...packages.map((p) => p.price)) : null;
  const related = service.relatedServices.map((s) => getServiceBySlug(s)!).filter(Boolean);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name} packages`,
      itemListElement: packages.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.price.toFixed(2),
        priceCurrency: "GBP",
        url: `${SITE_URL}/pricing/${p.slug}`,
      })),
    },
  };

  return (
    <>
      <PageHero
        breadcrumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        eyebrow={service.eyebrow}
        title={service.h1}
        description={service.intro}
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#packages" className="btn-gradient">
            View {service.shortName} Packages <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <Link href={`/contact?service=${encodeURIComponent(service.name)}`} className="btn-ghost-dark">
            Request a Custom Quote
          </Link>
          {fromPrice !== null && <p className="text-sm text-white/55 sm:ml-3">Packages from {formatGBP(fromPrice)}</p>}
        </div>
      </PageHero>

      <section className="bg-white py-20 sm:py-24" aria-labelledby="included-heading">
        <div className="container">
          <SectionHeading eyebrow="What we offer" title={<span id="included-heading">What&apos;s included in {service.name}</span>} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.items.map((item) => (
              <li key={item.name} className="rounded-3xl border border-ink-900/[0.08] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-volt-50 text-volt-600">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg text-ink-900">{item.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="packages" className="bg-mist py-20 sm:py-24" aria-labelledby="packages-heading">
        <div className="container">
          <SectionHeading
            eyebrow="Packages"
            title={<span id="packages-heading">{service.shortName} packages and pricing</span>}
            description="Fixed prices in GBP. Select a package to view full details or purchase online."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((p) => (
              <li key={p.slug}>
                <PackageCard pkg={p} />
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-ink-600">
            Looking for something else?{" "}
            <Link href="/pricing" className="font-medium text-volt-600 hover:underline">
              Browse all 30 packages
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24" aria-labelledby="approach-heading">
        <div className="container grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="Our approach" title={<span id="approach-heading">Our {service.shortName} approach</span>} />
            <ol className="mt-10 space-y-6">
              {service.approach.map((a, i) => (
                <li key={a.title} className="flex gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-900/10 font-mono text-sm text-ink-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg text-ink-900">{a.title}</h3>
                    <p className="mt-1 text-ink-600">{a.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="self-start rounded-3xl bg-ink-900 p-8 text-white sm:p-10">
            <h2 className="text-2xl">Who it&apos;s a good fit for</h2>
            <ul className="mt-6 space-y-3.5">
              {service.goodFitFor.map((g) => (
                <li key={g} className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-volt-300" aria-hidden="true" />
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-relaxed text-white/55">
              We don&apos;t guarantee specific rankings, traffic or sales. We deliver the agreed work carefully and explain what we&apos;ve done.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-24" aria-labelledby="service-faq-heading">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="FAQ" title={<span id="service-faq-heading">{service.shortName} questions</span>} />
          <Accordion items={service.faqs} />
        </div>
      </section>

      <section className="bg-white py-20" aria-labelledby="related-heading">
        <div className="container">
          <h2 id="related-heading" className="text-2xl text-ink-900">
            Related services
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/services/${r.slug}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-ink-900/[0.08] p-5 transition hover:border-volt-500/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-white">
                    <ServiceIcon name={r.icon} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="flex items-center gap-1 font-medium text-ink-900 group-hover:text-volt-600">
                      {r.name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-sm text-ink-600">{r.cardSummary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CustomQuote />
      <CtaBanner />
      <JsonLd data={[serviceSchema, faqJsonLd(service.faqs)]} />
    </>
  );
}
