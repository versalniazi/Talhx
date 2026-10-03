import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { COMPANY, LEGAL_LINKS, NAV_LINKS, addressLines } from "@/data/site";
import { SERVICES } from "@/data/services";

export function Footer() {
  return (
    <footer className="dark-surface relative overflow-hidden bg-ink-950 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="absolute -top-32 left-0 h-64 w-[600px] rounded-full bg-volt-500/10 blur-[120px]" aria-hidden="true" />
      <div className="container relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo dark />
            <p className="mt-5 text-sm font-semibold tracking-wide text-white">{COMPANY.legalName}</p>
            <p className="text-sm text-white/55">{COMPANY.tagline}</p>
            <address className="mt-5 text-sm not-italic leading-relaxed text-white/60">
              {addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <p className="mt-4 text-sm text-white/60">
              Company Number: <span className="font-mono text-white/80">{COMPANY.companyNumber}</span>
            </p>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">Navigation</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/70 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">Services</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="text-white/70 transition hover:text-white">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">Legal</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/70 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {COMPANY.legalName}. All rights reserved.</p>
          <p>
            {COMPANY.legalName} is a private limited company registered in {COMPANY.registeredIn}, company number {COMPANY.companyNumber}.
          </p>
        </div>
      </div>
    </footer>
  );
}
