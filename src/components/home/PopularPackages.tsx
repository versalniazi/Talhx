import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { POPULAR_PACKAGES } from "@/data/packages";
import { PackageCard } from "@/components/pricing/PackageCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PopularPackages() {
  const items = POPULAR_PACKAGES.slice(0, 3);
  return (
    <section className="bg-mist py-24 sm:py-28" aria-labelledby="popular-heading">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Popular packages"
            title={<span id="popular-heading">Popular ways to get started</span>}
            description="A few of the packages customers often start with. Every package lists its price, deliverables and estimated delivery time."
          />
          <Link href="/pricing" className="btn-secondary shrink-0">
            View all 30 packages <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li key={p.slug}>
              <PackageCard pkg={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
