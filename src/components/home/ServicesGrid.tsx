import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

export function ServicesGrid({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const ItemHeading = headingAs === "h1" ? "h2" : "h3";
  return (
    <section className="bg-white py-24 sm:py-28" aria-labelledby={headingAs === "h2" ? "services-heading" : undefined}>
      <div className="container">
        {headingAs === "h2" && (
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Services"
              title={<span id="services-heading">Everything you need to grow online</span>}
              description="Six focused service areas, each broken down into clear, practical deliverables."
            />
            <Link href="/services" className="btn-secondary shrink-0">
              Explore Services
            </Link>
          </div>
        )}
        <ul className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${headingAs === "h2" ? "mt-14" : ""}`}>
          {SERVICES.map((s, idx) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/[0.08] bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-volt-500/30 hover:shadow-card-hover"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-white transition-colors duration-300 group-hover:bg-accent-gradient">
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-ink-400">0{idx + 1}</span>
                </div>
                <ItemHeading className="mt-6 flex items-center gap-1.5 text-xl text-ink-900">
                  {s.name}
                  <ArrowUpRight className="h-4 w-4 text-ink-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-volt-600" aria-hidden="true" />
                </ItemHeading>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{s.cardSummary}</p>
                <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-ink-900/[0.07] pt-5">
                  {s.items.map((i) => (
                    <li key={i.name} className="rounded-full bg-mist px-2.5 py-1 text-xs text-ink-700">
                      {i.name}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
