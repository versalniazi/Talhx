import { Plus } from "lucide-react";
import type { FaqItem } from "@/data/packages";
import { cn } from "@/lib/format";

/** Accessible, zero-JavaScript accordion built on native <details>/<summary>. */
export function Accordion({ items, className, dark }: { items: FaqItem[]; className?: string; dark?: boolean }) {
  return (
    <div className={cn("divide-y", dark ? "divide-white/10" : "divide-ink-900/10", className)}>
      {items.map((item) => (
        <details key={item.q} className="group py-1 [&[open]_.acc-icon]:rotate-45">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-start justify-between gap-6 rounded-lg py-5 text-left text-[17px] font-medium transition-colors",
              dark ? "text-white hover:text-volt-200" : "text-ink-900 hover:text-volt-600",
            )}
          >
            <span>{item.q}</span>
            <span
              className={cn(
                "acc-icon mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-300",
                dark ? "border-white/15 text-white/80" : "border-ink-900/15 text-ink-700",
              )}
              aria-hidden="true"
            >
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <p className={cn("-mt-1 max-w-3xl pb-6 pr-12 leading-relaxed", dark ? "text-white/65" : "text-ink-600")}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
