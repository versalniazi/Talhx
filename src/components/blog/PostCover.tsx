import { BarChart3, Gauge, Globe2, Megaphone, MapPin, PenLine, Search, Share2 } from "lucide-react";
import type { BlogCategory } from "@/data/blog";
import { cn } from "@/lib/format";

const STYLE: Record<BlogCategory, { icon: typeof Search; from: string; to: string }> = {
  SEO: { icon: Search, from: "from-volt-600", to: "to-ink-800" },
  "Local SEO": { icon: MapPin, from: "from-emerald-600", to: "to-ink-800" },
  "Digital Marketing": { icon: Globe2, from: "from-iris-600", to: "to-ink-800" },
  "Content Marketing": { icon: PenLine, from: "from-amber-600", to: "to-ink-800" },
  "Social Media": { icon: Share2, from: "from-pink-600", to: "to-ink-800" },
  "Google Ads": { icon: Megaphone, from: "from-sky-600", to: "to-ink-800" },
  "Business Growth": { icon: BarChart3, from: "from-teal-600", to: "to-ink-800" },
  "Website Optimization": { icon: Gauge, from: "from-indigo-600", to: "to-ink-800" },
};

/** Lightweight, image-free cover artwork generated per category. */
export function PostCover({ category, className }: { category: BlogCategory; className?: string }) {
  const s = STYLE[category];
  return (
    <div className={cn("relative isolate overflow-hidden bg-gradient-to-br", s.from, s.to, className)} aria-hidden="true">
      <div className="absolute inset-0 -z-10 bg-grid-faint bg-[size:28px_28px] opacity-70" />
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full border border-white/15" />
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full border border-white/20" />
      <s.icon className="absolute left-6 top-6 h-8 w-8 text-white/90" strokeWidth={1.5} />
    </div>
  );
}
