import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Information about cookies and browser storage used on the TALHX LIMITED website.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      path="/cookie-policy"
      intro="This policy explains how this website uses cookies and similar technologies such as browser storage."
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device by websites you visit. Similar technologies, such as session storage, let a website remember
        information in your browser.
      </p>

      <h2>2. Our approach</h2>
      <p>
        We keep this website lightweight and privacy-friendly. <strong>We do not currently use analytics, advertising or tracking cookies</strong>, and we
        do not load third-party marketing scripts.
      </p>

      <h2>3. Strictly necessary storage</h2>
      <p>We use your browser&apos;s session storage only to make checkout work:</p>
      <ul>
        <li>
          <strong>talhx:checkout-draft</strong> — keeps the details you have typed at checkout so they are not lost if you go back a step. It is cleared
          when your order is placed or when you close the browser tab.
        </li>
        <li>
          <strong>talhx:orders</strong> — remembers your order number, reference and amount so the payment pages can show your bank transfer details.
          It is cleared when you close the browser tab.
        </li>
      </ul>
      <p>
        This storage is strictly necessary to provide the service you request, so it does not require consent under the Privacy and Electronic
        Communications Regulations (PECR). It is not used to track you.
      </p>

      <h2>4. Managing cookies and storage</h2>
      <p>
        You can clear cookies and site data at any time in your browser settings. Blocking session storage may prevent the checkout from working
        correctly.
      </p>

      <h2>5. Changes</h2>
      <p>
        If we introduce analytics or other non-essential cookies in future, we will update this policy and ask for your consent before setting them.
        For more about how we handle personal data, see our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
