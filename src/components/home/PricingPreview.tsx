import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORY_LABELS, PACKAGES, type PackageCategory } from "@/data/packages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatGBP } from "@/lib/format";

const ORDER: PackageCategory[] = ["seo", "local-seo", "content", "social", "advertising", "growth"];

/** Compact price list of every package, grouped by category. */
export function PricingPreview() {
  return (
    <section className="bg-mist py-24 sm:py-28" aria-labelledby="price-list-heading">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Full price list"
            title={<span id="price-list-heading">Every package, every price</span>}
            description="All 30 packages at a glance. Select any package to see full details and purchase."
          />
          <Link href="/pricing" className="btn-secondary shrink-0">
            View Pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-14 gap-6 md:columns-2 lg:columns-3">
          {ORDER.map((cat) => {
            const items = PACKAGES.filter((p) => p.category === cat).sort((a, b) => a.price - b.price);
            return (
              <div key={cat} className="card mb-6 break-inside-avoid p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-ink-900">{CATEGORY_LABELS[cat]}</h3>
                  <Link href={`/pricing?category=${cat}`} className="text-sm text-volt-600 hover:underline" aria-label={`View all ${CATEGORY_LABELS[cat]} packages`}>
                    View all
                  </Link>
                </div>
                <ul className="mt-4 divide-y divide-ink-900/[0.07]">
                  {items.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/pricing/${p.slug}`} className="group flex items-baseline justify-between gap-4 py-3 text-[15px]">
                        <span className="text-ink-700 transition group-hover:text-volt-600">
                          {p.name}
                          {p.billing === "monthly" && <span className="ml-1.5 text-xs text-iris-600">Monthly</span>}
                        </span>
                        <span className="shrink-0 font-medium tabular-nums text-ink-900">
                          {formatGBP(p.price)}
                          {p.billing === "monthly" && <span className="text-xs font-normal text-ink-500">/mo</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
