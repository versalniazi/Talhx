import Link from "next/link";
import { ArrowRight, Check, Clock, ClipboardList, Users } from "lucide-react";
import { COMMON_PACKAGE_FAQS, type ServicePackage } from "@/data/packages";
import { Accordion } from "@/components/ui/Accordion";
import { BillingLabel } from "./PackageCard";
import { formatGBP } from "@/lib/format";

/** Full package information, shared by the detail modal and the dedicated package page. */
export function PackageDetails({ pkg, compact }: { pkg: ServicePackage; compact?: boolean }) {
  const H = compact ? "h3" : "h2";
  return (
    <div className="space-y-10">
      <section>
        <H className="text-xl text-ink-900">Overview</H>
        <p className="mt-3 leading-relaxed text-ink-600">{pkg.overview}</p>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <H className="text-xl text-ink-900">What&apos;s included</H>
          <ul className="mt-4 space-y-3">
            {pkg.included.map((i) => (
              <li key={i} className="flex gap-3 text-ink-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-volt-50">
                  <Check className="h-3.5 w-3.5 text-volt-600" aria-hidden="true" />
                </span>
                {i}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <H className="text-xl text-ink-900">Deliverables</H>
          <ul className="mt-4 space-y-3">
            {pkg.deliverables.map((d) => (
              <li key={d} className="flex gap-3 text-ink-700">
                <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-iris-500" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl bg-mist p-5">
          <H className="flex items-center gap-2 text-base text-ink-900">
            <Users className="h-4 w-4 text-volt-600" aria-hidden="true" /> Who it&apos;s for
          </H>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-700 marker:text-ink-400">
            {pkg.whoFor.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-mist p-5">
          <H className="flex items-center gap-2 text-base text-ink-900">
            <Clock className="h-4 w-4 text-volt-600" aria-hidden="true" /> Delivery time
          </H>
          <p className="mt-3 text-sm font-medium text-ink-900">{pkg.delivery}</p>
          <p className="mt-1.5 text-sm text-ink-600">Estimated from payment verification and receipt of the details we need.</p>
        </section>
      </div>

      <section>
        <H className="text-xl text-ink-900">What we&apos;ll need from you</H>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-700 marker:text-ink-400">
          {pkg.needFromYou.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-ink-500">Please never send passwords through website forms. We&apos;ll arrange secure access with you by email.</p>
      </section>

      <section>
        <H className="text-xl text-ink-900">FAQ</H>
        <Accordion items={[...pkg.faqs, ...COMMON_PACKAGE_FAQS]} className="mt-2" />
      </section>

      <div className="flex flex-col gap-4 rounded-2xl border border-ink-900/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-ink-500">Price</p>
          <p className="text-3xl font-semibold tracking-tight text-ink-900">
            {formatGBP(pkg.price)}
            {pkg.billing === "monthly" && <span className="text-base font-normal text-ink-500"> /month</span>}
          </p>
          <BillingLabel billing={pkg.billing} className="mt-2" />
        </div>
        <Link href={`/checkout?package=${pkg.slug}`} className="btn-primary !min-h-[52px] px-7">
          Purchase Package <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
