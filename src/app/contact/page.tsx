import Link from "next/link";
import { Building2, FileText, MapPin, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { COMPANY, addressLines } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact TALHX — Request a Custom Quote",
  description:
    "Contact TALHX LIMITED about SEO, digital marketing, social media, paid advertising or website services. Send an enquiry or request a custom quote.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title="Contact TALHX"
        description="Questions about a package, need a custom quote, or want help choosing the right service? Send us an enquiry and we'll get back to you by email."
      />
      <section className="bg-mist py-14 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[1.4fr_0.9fr] lg:gap-12">
          <ContactForm />
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start" aria-label="Company information">
            <div className="card p-6 sm:p-7">
              <h2 className="flex items-center gap-2.5 text-lg text-ink-900">
                <Building2 className="h-5 w-5 text-volt-600" aria-hidden="true" /> Company information
              </h2>
              <p className="mt-4 font-semibold text-ink-900">{COMPANY.legalName}</p>
              <address className="mt-3 flex gap-2.5 text-[15px] not-italic leading-relaxed text-ink-700">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                <span>
                  {addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </span>
              </address>
              <p className="mt-4 flex gap-2.5 text-[15px] text-ink-700">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                <span>
                  Company Number: <span className="font-mono">{COMPANY.companyNumber}</span>
                </span>
              </p>
              {COMPANY.email && (
                <p className="mt-3 text-[15px]">
                  <a href={`mailto:${COMPANY.email}`} className="text-volt-600 underline">
                    {COMPANY.email}
                  </a>
                </p>
              )}
              <p className="mt-5 border-t border-ink-900/10 pt-4 text-sm text-ink-500">
                This is our registered office address. Our services are delivered online, so please get in touch using the form rather than visiting in person.
              </p>
            </div>
            <div className="card p-6 sm:p-7">
              <h2 className="flex items-center gap-2.5 text-lg text-ink-900">
                <ShoppingBag className="h-5 w-5 text-volt-600" aria-hidden="true" /> Ready to order?
              </h2>
              <p className="mt-2 text-[15px] text-ink-600">If you already know what you need, you can order a fixed-price package online.</p>
              <Link href="/pricing" className="btn-primary mt-5 w-full">
                View Pricing
              </Link>
            </div>
            <div className="rounded-3xl bg-ink-900 p-6 text-sm leading-relaxed text-white/70 sm:p-7">
              <p className="font-medium text-white">Question about an existing order?</p>
              <p className="mt-2">Choose &ldquo;Help with an existing order&rdquo; and include your order number (e.g. ORD-261003-7K3Q) and payment reference in your message.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
