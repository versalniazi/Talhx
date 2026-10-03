import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";

export default function NotFound() {
  return (
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
  );
}
