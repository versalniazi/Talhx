import { Eye, FileCheck2, Layers, MessageSquareText, Scale, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const REASONS = [
  { icon: Eye, title: "Prices you can see", body: "Every package has a fixed GBP price on the website. No sales call needed to find out what something costs." },
  { icon: FileCheck2, title: "Defined deliverables", body: "Each package lists exactly what's included and what you'll receive, so expectations are clear from the start." },
  { icon: Scale, title: "Honest expectations", body: "We don't promise rankings, traffic or sales we can't control. We focus on doing the agreed work properly." },
  { icon: Layers, title: "Start small, scale up", body: "Begin with a focused audit or single task, then build on it with larger or monthly services when you're ready." },
  { icon: Wrench, title: "Technical by nature", body: "Our work covers the technical side of websites and SEO — crawling, structure and performance — not just marketing copy." },
  { icon: MessageSquareText, title: "Plain-English reporting", body: "Reports explain what was found, why it matters and what to do next — without unnecessary jargon." },
];

export function WhyTalhx() {
  return (
    <section className="dark-surface relative isolate overflow-hidden bg-ink-900 py-24 text-white sm:py-28" aria-labelledby="why-heading">
      <div className="absolute inset-0 -z-10 bg-grid-faint bg-[size:64px_64px] mask-fade-b opacity-70" aria-hidden="true" />
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-iris-500/15 blur-[120px]" aria-hidden="true" />
      <div className="container grid gap-14 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            dark
            eyebrow="Why TALHX"
            title={<span id="why-heading">A straightforward way to buy digital marketing</span>}
            description="TALHX LIMITED was set up to make professional digital marketing services easier to understand and easier to buy — especially for small businesses and startups."
          />
        </div>
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2">
          {REASONS.map((r) => (
            <li key={r.title} className="bg-ink-900 p-7 transition-colors hover:bg-ink-850">
              <r.icon className="h-6 w-6 text-volt-300" aria-hidden="true" />
              <h3 className="mt-5 text-lg text-white">{r.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/60">{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
