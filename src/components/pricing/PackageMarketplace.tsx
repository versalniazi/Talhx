"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORY_FILTERS, CATEGORY_LABELS, type PackageCategory, type ServicePackage } from "@/data/packages";
import { PackageCard } from "./PackageCard";
import { PackageDetails } from "./PackageDetails";
import { cn, formatGBP } from "@/lib/format";

type Filter = "all" | PackageCategory;
type Sort = "recommended" | "price-asc" | "price-desc";

interface Props {
  packages: ServicePackage[];
  /** Show search + sort controls (full pricing page). */
  full?: boolean;
}

export function PackageMarketplace({ packages, full = true }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recommended");
  const [active, setActive] = useState<ServicePackage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  // Allow deep links such as /pricing?category=local-seo
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    if (c && CATEGORY_FILTERS.some((f) => f.value === c)) setFilter(c as Filter);
  }, []);

  function selectFilter(f: Filter) {
    setFilter(f);
    if (full) {
      const url = new URL(window.location.href);
      if (f === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", f);
      window.history.replaceState(null, "", url);
    }
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = packages.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (!q) return true;
      return [p.name, p.summary, CATEGORY_LABELS[p.category], ...p.included].join(" ").toLowerCase().includes(q);
    });
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [packages, filter, query, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: packages.length };
    for (const p of packages) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [packages]);

  function openDetails(pkg: ServicePackage) {
    lastTrigger.current = document.activeElement as HTMLElement;
    setActive(pkg);
  }

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (active && !d.open) {
      d.showModal();
      document.body.style.overflow = "hidden";
    }
  }, [active]);

  function closeDetails() {
    dialogRef.current?.close();
  }

  function onDialogClose() {
    document.body.style.overflow = "";
    setActive(null);
    lastTrigger.current?.focus();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter packages by category" className="-mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={filter === f.value}
                onClick={() => selectFilter(f.value)}
                className={cn(
                  "inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition",
                  filter === f.value
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-ink-900/15 bg-white text-ink-700 hover:border-ink-900/30",
                )}
              >
                {f.label}
                <span className={cn("text-xs tabular-nums", filter === f.value ? "text-white/60" : "text-ink-400")}>{counts[f.value] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {full && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-72">
              <label htmlFor="package-search" className="sr-only">
                Search packages
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input
                id="package-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search packages…"
                className="field-input !rounded-full !py-2.5 pl-11"
                autoComplete="off"
              />
            </div>
            <div className="relative">
              <label htmlFor="package-sort" className="sr-only">
                Sort packages
              </label>
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <select
                id="package-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="field-input appearance-none !rounded-full !py-2.5 pl-11 pr-10"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? "package" : "packages"} shown
      </p>

      {results.length > 0 ? (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((p) => (
            <li key={p.slug}>
              <PackageCard pkg={p} onDetails={openDetails} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-ink-900/15 p-12 text-center">
          <p className="text-lg font-medium text-ink-900">No packages match your search.</p>
          <p className="mt-2 text-ink-600">Try a different term, or tell us what you need and we&apos;ll recommend a service.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setQuery("");
                selectFilter("all");
              }}
            >
              Clear filters
            </button>
            <Link href="/contact" className="btn-primary">
              Request a Custom Quote
            </Link>
          </div>
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClose={onDialogClose}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDetails();
        }}
        aria-labelledby="package-dialog-title"
        className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink-950/70 backdrop:backdrop-blur-sm sm:m-auto sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-3xl"
      >
        {active && (
          <div className="flex h-full max-h-[100dvh] flex-col bg-white sm:max-h-[90vh] sm:rounded-3xl">
            <div className="flex items-start justify-between gap-4 border-b border-ink-900/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-sm text-volt-600">{CATEGORY_LABELS[active.category]}</p>
                <h2 id="package-dialog-title" className="mt-1 text-2xl text-ink-900">
                  {active.name}
                </h2>
                <p className="mt-1 text-lg font-semibold text-ink-900">
                  {formatGBP(active.price)}
                  {active.billing === "monthly" && <span className="text-sm font-normal text-ink-500"> /month</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetails}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink-900/10 text-ink-700 hover:bg-mist"
                aria-label="Close package details"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-8 sm:px-8">
              <PackageDetails pkg={active} compact />
              <p className="mt-6 text-center text-sm">
                <Link href={`/pricing/${active.slug}`} className="text-volt-600 underline-offset-4 hover:underline">
                  Open the full {active.name} page
                </Link>
              </p>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
