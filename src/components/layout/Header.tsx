"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/data/site";
import { cn } from "@/lib/format";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "dark-surface sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || open ? "border-b border-white/10 bg-ink-900/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl" : "border-b border-transparent bg-ink-900",
      )}
    >
      <div className="container flex h-[68px] items-center justify-between gap-6">
        <Logo dark />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[15px] transition-colors",
                    isActive(l.href) ? "text-white" : "text-white/65 hover:text-white",
                  )}
                >
                  {l.label}
                  {isActive(l.href) && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-accent-gradient" aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/pricing" className="btn-gradient hidden !min-h-[40px] !py-2 sm:inline-flex">
            Get Started <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-68px)] overflow-y-auto border-t border-white/10 bg-ink-900 lg:hidden"
      >
        <nav aria-label="Mobile" className="container flex h-full flex-col py-6">
          <ul className="space-y-1">
            {NAV_LINKS.map((l, i) => (
              <li key={l.href} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-4 text-2xl font-medium tracking-tight",
                    isActive(l.href) ? "bg-white/[0.06] text-white" : "text-white/80 hover:bg-white/[0.04]",
                  )}
                >
                  {l.label}
                  <ArrowRight className="h-5 w-5 text-white/40" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-3 pb-4 pt-8">
            <Link href="/pricing" className="btn-gradient w-full !min-h-[52px] text-base">
              Get Started
            </Link>
            <Link href="/contact" className="btn-ghost-dark w-full !min-h-[52px] text-base">
              Contact TALHX
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
