import { Suspense } from "react";
import { PaymentInstructions } from "@/components/payment/PaymentInstructions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Order Submitted — Payment Instructions",
  description: "Your TALHX order has been submitted. Complete your bank transfer using your unique payment reference.",
  path: "/payment-success",
  noIndex: true,
});

export default function PaymentSuccessPage() {
  return (
    <div className="bg-mist">
      <div className="container py-12 sm:py-16">
        <h1 className="sr-only">Payment instructions</h1>
        <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
          <PaymentInstructions />
        </Suspense>
      </div>
    </div>
  );
}
