import { Suspense } from "react";
import { PaymentConfirmationForm } from "@/components/payment/PaymentConfirmationForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Payment Verification",
  description: "Submit your bank transfer confirmation so TALHX LIMITED can verify your payment.",
  path: "/payment-pending",
  noIndex: true,
});

export default function PaymentPendingPage() {
  return (
    <div className="bg-mist">
      <div className="container py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Payment verification</p>
          <h1 className="mt-3 text-3xl tracking-tight text-ink-900 sm:text-4xl">I&apos;ve made the payment</h1>
          <p className="mt-2 max-w-2xl text-ink-600">Submit your payment details below. Your order stays in review until we&apos;ve verified the transfer in our bank account.</p>
        </div>
        <div className="mt-10">
          <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
            <PaymentConfirmationForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
