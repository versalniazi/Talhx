import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="dark-surface relative isolate overflow-hidden bg-ink-900 text-white" aria-labelledby="hero-heading">
      <div className="absolute inset-0 -z-10 bg-grid-faint bg-[size:64px_64px] mask-radial" aria-hidden="true" />
      <div className="absolute -left-40 -top-40 -z-10 h-[500px] w-[500px] rounded-full bg-volt-500/20 blur-[130px]" aria-hidden="true" />
      <div className="absolute -right-32 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-iris-500/20 blur-[130px]" aria-hidden="true" />

      <div className="container grid items-center gap-16 pb-28 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-32 lg:pt-24">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            UK digital marketing &amp; SEO services
          </p>
          <h1
            id="hero-heading"
            className="mt-7 text-[2.65rem] font-semibold leading-[1.02] tracking-tightest sm:text-6xl lg:text-[4.4rem]"
          >
            Digital Growth That Moves Your <span className="text-gradient">Business Forward</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
            SEO, digital marketing and online growth services designed to help businesses build visibility, attract customers and grow online.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/services" className="btn-gradient !min-h-[54px] px-7 text-base">
              Explore Services <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/pricing" className="btn-ghost-dark !min-h-[54px] px-7 text-base">
              View Pricing
            </Link>
          </div>
          <p className="mt-8 flex items-center gap-2 text-sm text-white/55">
            <ShieldCheck className="h-4 w-4 text-volt-300" aria-hidden="true" />
            Fixed prices in GBP · Clear deliverables · No long-term contracts
          </p>
        </div>
        <div className="animate-fade-up [animation-delay:150ms] lg:pl-8">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
