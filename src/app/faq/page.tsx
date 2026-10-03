import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { FAQ_GROUPS } from "@/data/faqs";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ — Ordering, Payment & Delivery",
  description:
    "Answers to common questions about TALHX services, how to order, paying by bank transfer, delivery times, custom packages, support and refunds.",
  path: "/faq",
});

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

export default function FaqPage() {
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
        eyebrow="Help centre"
        title="Frequently asked questions"
        description="Everything you need to know about our services, ordering, payment and delivery."
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="container grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav aria-label="FAQ sections" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {FAQ_GROUPS.map((g) => (
                <li key={g.title}>
                  <a href={`#${slug(g.title)}`} className="block rounded-full border border-ink-900/10 px-4 py-2 text-sm text-ink-700 hover:border-volt-500/40 hover:text-volt-600 lg:rounded-lg lg:border-0 lg:px-3">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14">
            {FAQ_GROUPS.map((g) => (
              <section key={g.title} id={slug(g.title)} aria-labelledby={`${slug(g.title)}-h`}>
                <h2 id={`${slug(g.title)}-h`} className="text-2xl text-ink-900">
                  {g.title}
                </h2>
                <Accordion items={g.items} className="mt-3" />
              </section>
            ))}
            <p className="text-ink-600">
              Can&apos;t find your answer?{" "}
              <Link href="/contact" className="font-medium text-volt-600 hover:underline">
                Contact TALHX
              </Link>{" "}
              and we&apos;ll help.
            </p>
          </div>
        </div>
      </section>
      <CtaBanner />
      <JsonLd data={faqJsonLd(FAQ_GROUPS.flatMap((g) => g.items))} />
    </>
  );
}
