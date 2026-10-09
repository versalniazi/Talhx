import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CustomQuote } from "@/components/layout/CustomQuote";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Digital Marketing Services UK — SEO, Social, Ads & Web",
  description:
    "Explore TALHX digital marketing services for UK businesses: SEO, local SEO, content marketing, social media marketing, paid advertising and website solutions.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Our services"
        title="Digital marketing services for UK businesses"
        description="SEO, local SEO, content, social media, paid advertising and website solutions — each available as clearly priced packages with defined deliverables."
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className="btn-gradient">
            View Pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/contact" className="btn-ghost-dark">
            Request a Custom Quote
          </Link>
        </div>
      </PageHero>
      <ServicesGrid headingAs="h1" />
      <HowItWorks />
      <CustomQuote />
      <CtaBanner />
    </>
  );
}
