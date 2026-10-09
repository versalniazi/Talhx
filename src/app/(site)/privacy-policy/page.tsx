import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { CompanyBlock } from "@/components/layout/CompanyBlock";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How TALHX LIMITED collects, uses and protects personal data under UK GDPR and the Data Protection Act 2018.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy"
      intro="This policy explains how TALHX LIMITED collects, uses and protects your personal data when you use this website or our services."
    >
      <h2>1. Who we are</h2>
      <p>
        This website is operated by TALHX LIMITED (&ldquo;TALHX&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). TALHX LIMITED is the
        controller of personal data collected through this website, for the purposes of the UK General Data Protection Regulation (UK GDPR) and the
        Data Protection Act 2018.
      </p>
      <CompanyBlock />
      <p>
        You can contact us about this policy or your personal data using our <Link href="/contact">contact form</Link> or by post at our registered
        office address above.
      </p>

      <h2>2. Personal data we collect</h2>
      <ul>
        <li>
          <strong>Order information:</strong> your full name, email address, phone number, business name, website URL, business location, the package
          you order and any additional requirements you provide at checkout.
        </li>
        <li>
          <strong>Payment confirmation information:</strong> your name, email, order number, payment reference, payment date, amount paid and, if you
          choose to upload one, a screenshot or document showing your payment.
        </li>
        <li>
          <strong>Enquiries:</strong> your name, email, and optionally your phone number, company, website, service of interest, budget and message.
        </li>
        <li>
          <strong>Live chat:</strong> the messages you send in our website chat, the page you started the chat on and, if you choose to give
          them, your name and email address.
        </li>
        <li>
          <strong>Newsletter:</strong> your email address and your consent to receive emails.
        </li>
        <li>
          <strong>Technical data:</strong> basic server logs, such as IP address, browser type and the time of requests, which are used to keep the
          website secure and prevent abuse.
        </li>
      </ul>
      <p>
        We do not collect payment card details. Payments are made by bank transfer directly from your bank. Please do not send passwords or other
        sensitive information through our website forms.
      </p>

      <h2>3. How we use your data and our lawful bases</h2>
      <ul>
        <li>
          <strong>To process and deliver your order</strong>, verify your payment and communicate with you about it — necessary for the performance of
          a contract with you.
        </li>
        <li>
          <strong>To respond to enquiries</strong> and provide quotes — our legitimate interests in responding to people who contact us, or steps
          taken at your request before entering into a contract.
        </li>
        <li>
          <strong>To keep accounting and tax records</strong> — necessary to comply with our legal obligations.
        </li>
        <li>
          <strong>To answer live chat questions</strong> — our legitimate interests in responding to people who contact us. Chat replies come either
          from an automatic assistant, which answers from information published on this website, or from a member of our team.
        </li>
        <li>
          <strong>To send our newsletter</strong> — your consent, which you can withdraw at any time.
        </li>
        <li>
          <strong>To protect the website</strong> against spam, fraud and misuse — our legitimate interests in operating a secure service.
        </li>
      </ul>

      <h2>4. Who we share data with</h2>
      <p>We do not sell your personal data. We share it only where necessary with:</p>
      <ul>
        <li>service providers who host this website, store data or send email on our behalf, under appropriate data processing terms;</li>
        <li>our bank, in connection with receiving and refunding payments;</li>
        <li>professional advisers such as accountants, where required; and</li>
        <li>authorities where we are required to do so by law.</li>
      </ul>
      <p>
        Where a service provider processes data outside the UK, we make sure appropriate safeguards are in place, such as UK adequacy regulations or
        the International Data Transfer Agreement.
      </p>

      <h2>5. How long we keep data</h2>
      <ul>
        <li>Order and payment records are kept for six years after the end of the financial year they relate to, to meet UK tax and accounting requirements.</li>
        <li>Enquiries that do not lead to an order are kept for up to 12 months.</li>
        <li>Payment screenshots are deleted once your payment has been verified and any related query is resolved, unless needed as part of our accounting records.</li>
        <li>Live chat conversations are kept for up to 12 months, unless they relate to an order, in which case they are kept with the order records.</li>
        <li>Newsletter data is kept until you unsubscribe.</li>
      </ul>

      <h2>6. Your rights</h2>
      <p>Under UK data protection law you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you;</li>
        <li>have inaccurate data corrected;</li>
        <li>have your data erased in certain circumstances;</li>
        <li>restrict or object to certain processing;</li>
        <li>data portability in certain circumstances; and</li>
        <li>withdraw consent at any time, where we rely on consent.</li>
      </ul>
      <p>
        To exercise any of these rights, please <Link href="/contact">contact us</Link>. You also have the right to complain to the Information
        Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk" rel="noopener noreferrer" target="_blank">ico.org.uk</a>. We would appreciate
        the chance to address your concerns first.
      </p>

      <h2>7. Security</h2>
      <p>
        We use appropriate technical and organisational measures to protect personal data, including encrypted connections (HTTPS), input validation
        and access controls. No method of transmission over the internet is completely secure, but we work to protect your information.
      </p>

      <h2>8. Cookies and browser storage</h2>
      <p>
        Information about cookies and similar technologies is set out in our <Link href="/cookie-policy">Cookie Policy</Link>.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page shows when it was last changed.</p>
    </LegalPage>
  );
}
