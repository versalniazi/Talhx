import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { PopularPackages } from "@/components/home/PopularPackages";
import { WhyTalhx } from "@/components/home/WhyTalhx";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PricingPreview } from "@/components/home/PricingPreview";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { HomeFaq } from "@/components/home/HomeFaq";
import { CustomQuote } from "@/components/layout/CustomQuote";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { JsonLd } from "@/components/ui/JsonLd";
import { HOME_FAQS } from "@/data/faqs";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "TALHX — Digital Marketing & SEO Services UK",
  absoluteTitle: true,
  description:
    "Clearly priced digital marketing services for UK businesses: SEO, local SEO, content marketing, social media, Google Ads and website optimisation. Order online from £15.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <PopularPackages />
      <WhyTalhx />
      <HowItWorks />
      <PricingPreview />
      <ServiceCategories />
      <HomeFaq />
      <CustomQuote />
      <CtaBanner />
      <JsonLd data={faqJsonLd(HOME_FAQS)} />
    </>
  );
}
