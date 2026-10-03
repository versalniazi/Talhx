import { Check, Gauge, MapPin, Search, FileText, Link2 } from "lucide-react";

const CHECKS = [
  { label: "Indexing & crawlability", icon: Search },
  { label: "Titles & meta descriptions", icon: FileText },
  { label: "Page speed", icon: Gauge },
  { label: "Google Business Profile", icon: MapPin },
  { label: "Internal links", icon: Link2 },
];

/** Decorative, CSS-only animated illustration of a search + SEO audit workflow. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]" aria-hidden="true">
      {/* orbit rings */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-white/10" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt-500/30 blur-[90px]" />

      {/* browser / search panel */}
      <div className="glass relative overflow-hidden rounded-3xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 h-5 flex-1 rounded-md bg-white/[0.06]" />
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-ink-950/60 px-4 py-3">
            <Search className="h-4 w-4 text-volt-300" />
            <span className="relative inline-block overflow-hidden whitespace-nowrap font-mono text-[13px] text-white/85">
              <span className="inline-block animate-typing overflow-hidden whitespace-nowrap align-bottom">seo services near me</span>
              <span className="ml-0.5 inline-block h-4 w-px animate-blink bg-volt-300 align-middle" />
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-volt-400/40 bg-volt-500/10 p-4 shadow-glow">
              <div className="absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-volt-300/10 to-transparent" />
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-gradient text-[9px] font-bold text-white">Y</span>
                <span className="text-xs text-white/60">yourbusiness.co.uk</span>
              </div>
              <p className="mt-2 text-[15px] font-medium text-volt-100">Your Business — Clear, Relevant &amp; Easy to Find</p>
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 w-11/12 rounded bg-white/15" />
                <div className="h-1.5 w-8/12 rounded bg-white/10" />
              </div>
            </div>
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] p-4 opacity-60">
                <div className="h-2 w-24 rounded bg-white/10" />
                <div className="mt-2.5 h-2.5 w-3/4 rounded bg-white/15" />
                <div className="mt-2 h-1.5 w-11/12 rounded bg-white/[0.07]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* audit checklist card */}
      <div className="glass absolute -bottom-10 -left-4 w-[250px] animate-float rounded-2xl p-4 shadow-2xl sm:-left-12 sm:w-[270px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">SEO audit checklist</p>
        <ul className="mt-3 space-y-2.5">
          {CHECKS.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2.5 text-[13px] text-white/80">
              <span
                className="flex h-5 w-5 animate-pop-in items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"
                style={{ animationDelay: `${0.8 + i * 0.35}s` }}
              >
                <Check className="h-3 w-3" />
              </span>
              <c.icon className="h-3.5 w-3.5 text-white/40" />
              {c.label}
            </li>
          ))}
        </ul>
      </div>

      {/* floating tags */}
      <div className="glass absolute -right-2 top-16 hidden animate-float rounded-full px-3.5 py-2 text-xs text-white/80 [animation-delay:-2s] sm:block">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-volt-300" /> Technical SEO
      </div>
      <div className="glass absolute -right-6 bottom-24 hidden animate-float rounded-full px-3.5 py-2 text-xs text-white/80 [animation-delay:-4s] sm:block">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-iris-400" /> Local visibility
      </div>
    </div>
  );
}
