import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORY_FILTERS, CATEGORY_LABELS, PACKAGES, type PackageCategory } from "@/data/packages";
import { CATEGORY_ICON, ServiceIcon } from "@/components/ui/ServiceIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatGBP } from "@/lib/format";

const BLURBS: Record<PackageCategory, string> = {
  seo: "Audits, technical checks, keyword research and on-page optimisation.",
  "local-seo": "Google Business Profile, local audits and citations.",
  content: "SEO articles and optimisation of existing content.",
  social: "Social media audits and ready-to-post content.",
  advertising: "Google Ads and Facebook / Instagram ads setup.",
  growth: "Speed, combined packages and monthly SEO services.",
};

export function ServiceCategories() {
  const cats = CATEGORY_FILTERS.filter((f) => f.value !== "all").map((f) => f.value as PackageCategory);
  return (
    <section className="bg-white py-24 sm:py-28" aria-labelledby="categories-heading">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Browse by category"
          title={<span id="categories-heading">Find packages by what you need</span>}
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => {
            const items = PACKAGES.filter((p) => p.category === c);
            const from = Math.min(...items.map((p) => p.price));
            return (
              <li key={c}>
                <Link
                  href={`/pricing?category=${c}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-ink-900/[0.08] p-5 transition hover:border-volt-500/40 hover:bg-volt-50/40"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-volt-50 text-volt-600 transition group-hover:bg-volt-500 group-hover:text-white">
                    <ServiceIcon name={CATEGORY_ICON[c]} className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-medium text-ink-900">{CATEGORY_LABELS[c]}</span>
                      <ArrowRight className="h-4 w-4 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-volt-600" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-sm text-ink-600">{BLURBS[c]}</span>
                    <span className="mt-3 block text-xs text-ink-500">
                      {items.length} packages · from <span className="font-medium text-ink-900">{formatGBP(from)}</span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
