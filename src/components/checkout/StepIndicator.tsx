import { Check } from "lucide-react";
import { cn } from "@/lib/format";

export const CHECKOUT_STEPS = ["Package", "Your details", "Review", "Payment"] as const;

export function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center gap-2 sm:gap-3">
        {CHECKOUT_STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          return (
            <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3 last:flex-none">
              <span className="flex items-center gap-2.5" aria-current={active ? "step" : undefined}>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition",
                    done && "bg-volt-500 text-white",
                    active && "bg-ink-900 text-white ring-4 ring-volt-500/20",
                    !done && !active && "border border-ink-900/15 bg-white text-ink-500",
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden="true" /> : n}
                </span>
                <span className={cn("hidden text-sm sm:inline", active ? "font-medium text-ink-900" : "text-ink-500")}>
                  {label}
                  {done && <span className="sr-only"> (completed)</span>}
                </span>
                <span className="sr-only sm:hidden">
                  Step {n}: {label}
                  {done ? " (completed)" : active ? " (current)" : ""}
                </span>
              </span>
              {n < CHECKOUT_STEPS.length && (
                <span className={cn("h-px flex-1", done ? "bg-volt-500" : "bg-ink-900/10")} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm text-ink-500 sm:hidden">
        Step {current} of {CHECKOUT_STEPS.length}: <span className="font-medium text-ink-900">{CHECKOUT_STEPS[current - 1]}</span>
      </p>
    </nav>
  );
}
