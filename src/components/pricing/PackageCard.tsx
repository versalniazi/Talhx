import Link from "next/link";
import { ArrowRight, Check, Clock, Repeat } from "lucide-react";
import { CATEGORY_LABELS, type ServicePackage } from "@/data/packages";
import { CATEGORY_ICON, ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn, formatGBP } from "@/lib/format";

interface Props {
  pkg: ServicePackage;
  /** When provided, "View details" opens a modal instead of navigating. */
  onDetails?: (pkg: ServicePackage) => void;
  headingLevel?: "h2" | "h3";
}

export function BillingLabel({ billing, className }: { billing: ServicePackage["billing"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        billing === "monthly" ? "bg-iris-500/10 text-iris-600" : "bg-ink-900/[0.05] text-ink-700",
        className,
      )}
    >
      {billing === "monthly" && <Repeat className="h-3 w-3" aria-hidden="true" />}
      {billing === "monthly" ? "Monthly service" : "One-time service"}
    </span>
  );
}

export function PackageCard({ pkg, onDetails, headingLevel: H = "h3" }: Props) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-7",
        pkg.popular ? "border-volt-500/40 ring-1 ring-volt-500/20" : "border-ink-900/[0.08]",
      )}
    >
      {pkg.popular && (
        <span className="absolute -top-3 right-6 rounded-full bg-accent-gradient px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-glow">
          Popular
        </span>
      )}
      <div className="flex items-center gap-2.5 text-sm text-ink-600">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-volt-50 text-volt-600">
          <ServiceIcon name={CATEGORY_ICON[pkg.category]} className="h-4 w-4" />
        </span>
        {CATEGORY_LABELS[pkg.category]}
      </div>

      <H className="mt-5 text-xl leading-snug text-ink-900">{pkg.name}</H>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{pkg.summary}</p>

      <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-2">
        <p className="text-[2.5rem] font-semibold leading-none tracking-tight text-ink-900">
          {formatGBP(pkg.price)}
          {pkg.billing === "monthly" && <span className="ml-1 text-base font-normal text-ink-500">/month</span>}
        </p>
        <BillingLabel billing={pkg.billing} className="mb-1" />
      </div>

      <div className="mt-6 border-t border-ink-900/[0.07] pt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">Deliverables</p>
        <ul className="mt-3 space-y-2 text-sm text-ink-700">
          {pkg.deliverables.map((d) => (
            <li key={d} className="flex gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-volt-500" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 flex items-center gap-2 text-sm text-ink-600">
        <Clock className="h-4 w-4 text-ink-400" aria-hidden="true" />
        <span>
          <span className="sr-only">Estimated delivery: </span>
          {pkg.delivery}
        </span>
      </p>

      <div className="mt-auto flex flex-col gap-2.5 pt-7 sm:flex-row">
        <Link
          href={`/checkout?package=${pkg.slug}`}
          className="btn-primary flex-1"
          aria-label={`Purchase ${pkg.name} for ${formatGBP(pkg.price)}`}
        >
          Purchase
        </Link>
        {onDetails ? (
          <button type="button" className="btn-secondary flex-1" onClick={() => onDetails(pkg)} aria-haspopup="dialog">
            View details
          </button>
        ) : (
          <Link href={`/pricing/${pkg.slug}`} className="btn-secondary flex-1" aria-label={`View details for ${pkg.name}`}>
            Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}
