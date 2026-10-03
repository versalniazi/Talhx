import Link from "next/link";
import { HOME_FAQS } from "@/data/faqs";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HomeFaq() {
  return (
    <section className="bg-mist py-24 sm:py-28" aria-labelledby="home-faq-heading">
      <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="FAQ"
            title={<span id="home-faq-heading">Questions, answered</span>}
            description="Quick answers about our services, ordering and payment."
          />
          <Link href="/faq" className="btn-secondary mt-8">
            View all FAQs
          </Link>
        </div>
        <Accordion items={HOME_FAQS} />
      </div>
    </section>
  );
}
