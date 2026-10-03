import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { PostCover } from "@/components/blog/PostCover";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { BLOG_AUTHOR, BLOG_POSTS, getPostBySlug, type BlogBlock } from "@/data/blog";
import { getServiceBySlug } from "@/data/services";
import { COMPANY, SITE_URL } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const post = getPostBySlug((await params).slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}`, type: "article" });
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      );
    case "tip":
      return (
        <aside className="not-prose my-8 flex gap-3 rounded-2xl border border-volt-200 bg-volt-50 p-5 text-ink-800">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-volt-600" aria-hidden="true" />
          <p>{block.text}</p>
        </aside>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();
  const service = getServiceBySlug(post.relatedService);
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    articleSection: post.category,
    inLanguage: "en-GB",
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: COMPANY.legalName, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <PageHero
        compact
        breadcrumbs={[
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
        eyebrow={post.category}
        title={post.title}
        description={post.description}
      >
        <p className="mt-6 text-sm text-white/55">
          {BLOG_AUTHOR} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} min read
        </p>
      </PageHero>

      <article className="bg-white py-14 sm:py-20">
        <div className="container max-w-3xl">
          <PostCover category={post.category} className="mb-12 h-48 rounded-3xl sm:h-64" />
          <div className="prose prose-lg prose-slate max-w-none prose-headings:tracking-tight prose-headings:text-ink-900 prose-p:text-ink-700 prose-li:text-ink-700 prose-a:text-volt-600">
            {post.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>

          {service && (
            <aside className="mt-14 rounded-3xl bg-ink-900 p-7 text-white sm:p-9">
              <p className="text-sm text-volt-200">Related service</p>
              <p className="mt-2 text-2xl">{service.name}</p>
              <p className="mt-2 text-white/65">{service.cardSummary}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={`/services/${service.slug}`} className="btn-white">
                  Explore {service.shortName} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/pricing" className="btn-ghost-dark">
                  View Pricing
                </Link>
              </div>
            </aside>
          )}

          <Link href="/blog" className="mt-10 inline-flex items-center gap-1.5 text-volt-600 hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to all articles
          </Link>
        </div>
      </article>

      <section className="bg-mist py-16 sm:py-20" aria-labelledby="more-heading">
        <div className="container">
          <h2 id="more-heading" className="text-2xl text-ink-900">
            More articles
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block h-full rounded-2xl border border-ink-900/[0.08] bg-white p-6 transition hover:border-volt-500/40">
                  <p className="text-sm text-volt-600">{p.category}</p>
                  <p className="mt-2 font-medium text-ink-900 group-hover:text-volt-600">{p.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBanner />
      <JsonLd data={articleSchema} />
    </>
  );
}
