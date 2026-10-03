import { PageHero } from "@/components/ui/PageHero";
import { PackageMarketplace } from "@/components/pricing/PackageMarketplace";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CustomQuote } from "@/components/layout/CustomQuote";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { JsonLd } from "@/components/ui/JsonLd";
import { PACKAGES } from "@/data/packages";
import { SITE_URL } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing — SEO & Digital Marketing Packages from £15",
  description:
    "Browse 30 clearly priced SEO and digital marketing packages in GBP: SEO audits, keyword research, local SEO, content, social media, Google Ads and monthly SEO. Order online.",
  path: "/pricing",
});

export default function PricingPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TALHX service packages",
    itemListElement: PACKAGES.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/pricing/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{ name: "Pricing", path: "/pricing" }]}
        eyebrow="Pricing"
        title="Clear prices. Clear deliverables."
        description="Choose from 30 fixed-price packages. Every price is shown in GBP with its deliverables and estimated delivery time — no sales call required."
      />
      <section className="bg-mist py-14 sm:py-20" aria-label="All packages">
        <div className="container">
          <PackageMarketplace packages={PACKAGES} />
          <p className="mt-12 text-center text-sm text-ink-500">
            Prices are in GBP and are the total amount payable. Advertising spend for ads setup packages is paid directly to the platform and is not included.
          </p>
        </div>
      </section>
      <HowItWorks />
      <CustomQuote />
      <CtaBanner />
      <JsonLd data={itemList} />
    </>
  );
}
