import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="relative z-50 bg-ink-950 text-white">
      <div className="container flex min-h-[40px] items-center justify-center py-2 text-center text-[13px] text-white/75">
        <p>
          <span className="mr-2 inline-flex items-center rounded-full bg-accent-gradient px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
            New
          </span>
          Fixed-price SEO &amp; digital marketing packages from £15 — order online in minutes.{" "}
          <Link href="/pricing" className="inline-flex items-center gap-1 font-medium text-white underline-offset-4 hover:underline">
            View pricing <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
}
