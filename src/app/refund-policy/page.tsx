import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Refund Policy",
  description: "TALHX LIMITED refund and cancellation policy for one-time and monthly digital marketing services.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      path="/refund-policy"
      intro="We want you to be confident ordering from us. This policy explains when refunds are available and how to request one."
    >
      <h2>1. Before work starts</h2>
      <p>
        If you cancel your order before we have started work, you will receive a full refund of any amount you have paid. This includes orders that
        are awaiting payment verification.
      </p>

      <h2>2. Consumer cancellation rights</h2>
      <p>
        If you are a consumer, you may cancel within 14 days of your contract being formed. If you asked us to begin work during that period, we may
        deduct an amount proportionate to the work completed before you told us you wanted to cancel. If the service was fully completed within the
        14 days at your request, the right to cancel no longer applies.
      </p>

      <h2>3. After work has started</h2>
      <p>
        If you cancel after work has started, we will refund the price less a fair amount for the work already completed. We will explain how this has
        been calculated.
      </p>

      <h2>4. If something isn&apos;t right</h2>
      <p>
        If a deliverable does not match the package description, please tell us within 14 days of delivery. We will first put it right at no extra
        cost. If we cannot, you may be entitled to a full or partial refund. Refunds are not available simply because a particular ranking, traffic
        level or sales result was not achieved, as these are outside our control and are not guaranteed.
      </p>

      <h2>5. Monthly services</h2>
      <p>
        Monthly services can be stopped at any time before the next month&apos;s payment. Payments for a month that has already started are refundable
        only in line with sections 2–4 above.
      </p>

      <h2>6. Advertising spend</h2>
      <p>
        Advertising budget is paid directly by you to platforms such as Google or Meta and is not handled by TALHX LIMITED, so we cannot refund it.
      </p>

      <h2>7. Incorrect payments</h2>
      <p>If you pay more than the order total, we will refund the difference. If you pay less, we will contact you before starting work.</p>

      <h2>8. How to request a refund</h2>
      <p>
        Please <Link href="/contact">contact us</Link>, choose &ldquo;Help with an existing order&rdquo; and include your order number and payment
        reference. Approved refunds are made by bank transfer to the account the payment came from, within 14 days of approval.
      </p>

      <p>
        This policy does not affect your statutory rights. See also our <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>.
      </p>
    </LegalPage>
  );
}
