import Link from "next/link";
import { cn } from "@/lib/format";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-8 w-8", className)}>
      <defs>
        <linearGradient id="talhx-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3f6bff" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#talhx-g)" />
      <path d="M9 10.5h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M16 10.5V23" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M20 18.5l3-3 3 3" stroke="#fff" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)} aria-label="TALHX — home">
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className={cn("text-[19px] font-semibold tracking-[0.08em]", dark ? "text-white" : "text-ink-900")}>TALHX</span>
    </Link>
  );
}
