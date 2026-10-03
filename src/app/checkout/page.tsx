import { Suspense } from "react";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Checkout",
  description: "Complete your TALHX order: confirm your package, enter your details and continue to payment.",
  path: "/checkout",
  noIndex: true,
});

function CheckoutSkeleton() {
  return <div className="h-[520px] animate-pulse rounded-3xl bg-white/70" aria-hidden="true" />;
}

export default function CheckoutPage() {
  return (
    <div className="bg-mist">
      <div className="container py-12 sm:py-16">
        <h1 className="text-3xl tracking-tight text-ink-900 sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-ink-600">Secure online ordering. Payment by UK bank transfer.</p>
        <div className="mt-10">
          <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutFlow />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
