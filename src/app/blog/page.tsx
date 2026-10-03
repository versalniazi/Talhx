import { PageHero } from "@/components/ui/PageHero";
import { BlogList } from "@/components/blog/BlogList";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { BLOG_POSTS } from "@/data/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog — SEO, Local SEO & Digital Marketing Guides",
  description:
    "Practical guides on SEO, local SEO, content marketing, social media, Google Ads, website optimisation and business growth for UK businesses.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{ name: "Blog", path: "/blog" }]}
        eyebrow="Insights"
        title="The TALHX blog"
        description="Practical, plain-English guides to SEO and digital marketing for small and growing UK businesses."
      />
      <section className="bg-mist py-14 sm:py-20" aria-label="Articles">
        <div className="container">
          <BlogList posts={posts} />
        </div>
      </section>
      <section className="dark-surface bg-ink-900 py-16 text-white sm:py-20" aria-labelledby="newsletter-heading">
        <div className="container flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-lg">
            <h2 id="newsletter-heading" className="text-3xl">
              Get new guides by email
            </h2>
            <p className="mt-3 text-white/65">Occasional, practical tips on SEO and digital marketing. No spam — unsubscribe any time.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
