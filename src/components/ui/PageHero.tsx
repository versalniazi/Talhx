import { Breadcrumbs } from "./Breadcrumbs";
import { cn } from "@/lib/format";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  children?: React.ReactNode;
  compact?: boolean;
}

/** Dark header band used at the top of interior pages. */
export function PageHero({ eyebrow, title, description, breadcrumbs, children, compact }: Props) {
  return (
    <section className="dark-surface relative isolate overflow-hidden bg-ink-900 text-white">
      <div className="absolute inset-0 -z-10 bg-grid-faint bg-[size:56px_56px] mask-radial opacity-60" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-volt-500/25 blur-[120px]"
        aria-hidden="true"
      />
      <div className="absolute -right-20 top-20 -z-10 h-64 w-64 rounded-full bg-iris-500/20 blur-[100px]" aria-hidden="true" />
      <div className={cn("container", compact ? "pb-14 pt-10 sm:pb-16" : "pb-16 pt-12 sm:pb-24 sm:pt-16")}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className={cn("max-w-3xl", breadcrumbs && "mt-8")}>
          {eyebrow && (
            <p className="eyebrow">
              <span className="h-px w-6 bg-volt-300/60" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className="mt-4 text-[2.4rem] leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]">{title}</h1>
          {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
