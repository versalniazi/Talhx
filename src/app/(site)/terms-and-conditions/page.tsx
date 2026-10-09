import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { CompanyBlock } from "@/components/layout/CompanyBlock";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms and conditions that apply when you order services from TALHX LIMITED.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      path="/terms-and-conditions"
      intro="These terms apply to orders placed with TALHX LIMITED through this website. Please read them carefully before placing an order."
    >
      <h2>1. About us</h2>
      <CompanyBlock />
      <p>
        You can contact us using our <Link href="/contact">contact form</Link> or by post at our registered office.
      </p>

      <h2>2. Our services</h2>
      <p>
        We provide digital marketing, SEO, content, social media, paid advertising setup and website services as described on this website. Each
        package description sets out what is included, the deliverables and an estimated delivery time. Images and examples are for illustration
        only.
      </p>

      <h2>3. Placing an order</h2>
      <p>
        When you complete checkout you make an offer to buy the selected package. You will be given an order number and a unique payment reference.
        A contract is formed when we confirm by email that your payment has been verified and your order has been accepted. We may decline an order,
        for example if we cannot deliver the service for your business, in which case any payment received will be refunded in full.
      </p>

      <h2>4. Prices and payment</h2>
      <ul>
        <li>Prices are shown in pounds sterling (GBP) and are the total amount payable for the package.</li>
        <li>Payment is made by UK bank transfer to the account shown during checkout. Please use your unique payment reference and transfer the exact amount shown.</li>
        <li>Payments are verified manually. Submitting a payment confirmation does not mean your payment has been received.</li>
        <li>If an incorrect amount is received, we will contact you to arrange payment of any shortfall or refund any overpayment.</li>
        <li>Advertising spend for Google Ads, Meta (Facebook and Instagram) or other platforms is not included and is paid by you directly to the platform.</li>
      </ul>

      <h2>5. Monthly services</h2>
      <p>
        Monthly services are paid in advance, one month at a time, by bank transfer. There is no minimum term. Each new month begins once payment for
        that month has been verified. You can stop a monthly service at any time by letting us know before the next month&apos;s payment is due.
      </p>

      <h2>6. Delivery</h2>
      <p>
        Delivery times are estimates in business days (Monday to Friday, excluding UK bank holidays), counted from verification of your payment and
        receipt of the information and access we need. If we expect a delay, we will let you know.
      </p>

      <h2>7. Your responsibilities</h2>
      <ul>
        <li>Provide accurate information and any access reasonably required to deliver the service.</li>
        <li>Make sure you have the right to give us access to any website, account or profile you ask us to work on.</li>
        <li>Never send passwords through website forms. We will arrange secure access with you.</li>
        <li>Review deliverables and request any included revisions within 14 days of delivery.</li>
      </ul>

      <h2>8. No guarantee of results</h2>
      <p>
        Search engine rankings, website traffic, advertising performance, enquiries and sales depend on many factors outside our control, including
        third-party platforms such as Google and Meta. We do not guarantee any particular ranking, traffic level or commercial result. We will perform
        the services with reasonable care and skill.
      </p>

      <h2>9. Third-party platforms</h2>
      <p>
        Our services may involve third-party platforms such as Google Search, Google Business Profile, Google Ads, Facebook and Instagram. TALHX
        LIMITED is independent and is not affiliated with, endorsed by or a partner of these platforms. Their policies and decisions are outside our
        control.
      </p>

      <h2>10. Intellectual property</h2>
      <p>
        Once your order has been paid in full, you own the deliverables we create specifically for you, such as written content and reports. We
        retain ownership of our general know-how, templates and tools.
      </p>

      <h2>11. Cancellation rights for consumers</h2>
      <p>
        If you are a consumer (buying for purposes outside your trade, business, craft or profession), you have the right to cancel within 14 days of
        the contract being formed under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013. If you ask us to
        start work within the cancellation period, you must pay for the work carried out up to the time you tell us you wish to cancel. If the service
        has been fully performed within that period at your request, the right to cancel no longer applies. See our{" "}
        <Link href="/refund-policy">Refund Policy</Link> for details.
      </p>

      <h2>12. Liability</h2>
      <p>
        Nothing in these terms limits or excludes our liability for death or personal injury caused by negligence, fraud or fraudulent
        misrepresentation, or any other liability that cannot be limited or excluded by law. Subject to this, for business customers our total
        liability in connection with an order is limited to the price paid for that order, and we are not liable for loss of profits, revenue,
        business or goodwill, or any indirect or consequential loss. If you are a consumer, we are responsible for loss you suffer that is a
        foreseeable result of our breach of these terms, and your statutory rights are not affected.
      </p>

      <h2>13. Confidentiality and data protection</h2>
      <p>
        We treat information you share with us about your business as confidential and use personal data in line with our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>14. Changes to these terms</h2>
      <p>We may update these terms from time to time. The terms in force when you place your order will apply to that order.</p>

      <h2>15. Governing law</h2>
      <p>
        These terms are governed by the law of England and Wales. The courts of England and Wales have jurisdiction, except that consumers living in
        Scotland or Northern Ireland may also bring proceedings in their local courts.
      </p>
    </LegalPage>
  );
}
