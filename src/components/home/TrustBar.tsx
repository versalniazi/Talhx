import { BadgePoundSterling, ClipboardCheck, Briefcase, MapPinned, MousePointerClick } from "lucide-react";

const ITEMS = [
  { icon: BadgePoundSterling, title: "Transparent Pricing", body: "Fixed GBP prices shown up front." },
  { icon: ClipboardCheck, title: "Clear Deliverables", body: "Know exactly what you'll receive." },
  { icon: Briefcase, title: "Professional Service", body: "Structured, documented work." },
  { icon: MapPinned, title: "UK-Focused Business", body: "Registered in England & Wales." },
  { icon: MousePointerClick, title: "Simple Online Ordering", body: "Choose, order and pay in minutes." },
];

export function TrustBar() {
  return (
    <section aria-label="Why customers choose TALHX" className="relative z-10 -mt-12 sm:-mt-14">
      <div className="container">
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-ink-900/[0.08] bg-ink-900/[0.07] shadow-card-hover sm:grid-cols-2 lg:grid-cols-5">
          {ITEMS.map((it) => (
            <li key={it.title} className="flex items-start gap-3.5 bg-white p-5 last:sm:col-span-2 sm:p-6 last:lg:col-span-1">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-volt-50 text-volt-600">
                <it.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-ink-900">{it.title}</p>
                <p className="mt-0.5 text-sm text-ink-500">{it.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
