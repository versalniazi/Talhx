import Link from "next/link";
import { ArrowRight, Landmark, LayoutGrid, Rocket, UserRoundPen } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const STEPS = [
  { n: "01", icon: LayoutGrid, title: "Choose a Service", body: "Browse clearly priced packages and pick the one that fits your goals." },
  { n: "02", icon: UserRoundPen, title: "Submit Your Details", body: "Tell us about your business, website and any specific requirements." },
  { n: "03", icon: Landmark, title: "Complete Bank Transfer", body: "Pay by UK bank transfer using your unique order reference." },
  { n: "04", icon: Rocket, title: "We Verify & Start Your Order", body: "Once your payment is verified, we confirm by email and begin work." },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-24 sm:py-28" aria-labelledby="how-heading">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title={<span id="how-heading">From choosing a package to work starting</span>}
          description="A simple, four-step process with no account to create and no hidden steps."
        />
        <ol className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-[44px] hidden h-px bg-gradient-to-r from-transparent via-ink-900/15 to-transparent lg:block" aria-hidden="true" />
          {STEPS.map((s) => (
            <li key={s.n} className="relative rounded-3xl border border-ink-900/[0.08] bg-white p-7 shadow-card">
              <div className="flex items-center justify-between">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-white ring-8 ring-white">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-3xl font-medium text-ink-900/10">{s.n}</span>
              </div>
              <h3 className="mt-6 text-lg text-ink-900">
                <span className="sr-only">Step {s.n}: </span>
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 text-center">
          <Link href="/pricing" className="btn-primary">
            Get Started <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
