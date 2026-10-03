import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export function CtaBanner({
  title = "Ready to strengthen your online presence?",
  description = "Choose a clearly priced package and order online, or tell us what you need and we'll recommend the right service.",
}: Props) {
  return (
    <section className="bg-white py-20 sm:py-24" aria-labelledby="cta-heading">
      <div className="container">
        <div className="dark-surface relative isolate overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="absolute inset-0 -z-10 bg-grid-faint bg-[size:44px_44px] mask-radial" aria-hidden="true" />
          <div className="absolute -bottom-32 left-1/2 -z-10 h-72 w-[700px] -translate-x-1/2 rounded-full bg-accent-gradient opacity-40 blur-[110px]" aria-hidden="true" />
          <h2 id="cta-heading" className="mx-auto max-w-2xl text-3xl leading-tight text-white sm:text-[2.75rem]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">{description}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/pricing" className="btn-white !min-h-[52px] px-7 text-base">
              Get Started <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn-ghost-dark !min-h-[52px] px-7 text-base">
              Request a Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
