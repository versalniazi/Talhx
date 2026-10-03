import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CustomQuote() {
  return (
    <section className="bg-mist py-16 sm:py-20" aria-labelledby="custom-heading">
      <div className="container">
        <div className="card flex flex-col items-start gap-8 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-glow">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="custom-heading" className="text-2xl text-ink-900 sm:text-[1.75rem]">
                Need Something Custom?
              </h2>
              <p className="mt-2 max-w-xl text-ink-600">
                Don&apos;t see exactly what you need? Tell us what you&apos;re trying to achieve and we&apos;ll help you identify the right service.
              </p>
            </div>
          </div>
          <Link href="/contact?service=Custom%20quote" className="btn-primary shrink-0">
            Request Custom Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
