import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
    <PageHero eyebrow="404" title="Page not found" description="The page you're looking for doesn't exist or may have moved.">
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-white">
          Back to homepage
        </Link>
        <Link href="/services" className="btn-ghost-dark">
          Explore Services
        </Link>
      </div>
    </PageHero>
      </main>
      <Footer />
    </>
  );
}
