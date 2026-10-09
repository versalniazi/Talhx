import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
