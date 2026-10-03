import { PageHero } from "@/components/ui/PageHero";
import { LEGAL_LAST_UPDATED } from "@/data/site";

export function LegalPage({ title, path, intro, children }: { title: string; path: string; intro: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero compact breadcrumbs={[{ name: title, path }]} eyebrow="Legal" title={title} description={intro}>
        <p className="mt-6 text-sm text-white/50">Last updated: {LEGAL_LAST_UPDATED}</p>
      </PageHero>
      <section className="bg-white py-14 sm:py-20">
        <div className="container max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:tracking-tight prose-headings:text-ink-900 prose-h2:mt-12 prose-h2:text-2xl prose-p:text-ink-700 prose-li:text-ink-700 prose-a:text-volt-600 prose-strong:text-ink-900">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
