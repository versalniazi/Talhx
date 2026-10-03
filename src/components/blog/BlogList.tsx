"use client";

import Link from "next/link";
import { useState } from "react";
import { BLOG_CATEGORIES, type BlogPost } from "@/data/blog";
import { PostCover } from "./PostCover";
import { cn, formatDate } from "@/lib/format";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [cat, setCat] = useState<string>("All");
  const visible = cat === "All" ? posts : posts.filter((p) => p.category === cat);

  return (
    <div>
      <div role="group" aria-label="Filter articles by category" className="-mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {["All", ...BLOG_CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "min-h-[40px] whitespace-nowrap rounded-full border px-4 text-sm font-medium transition",
                cat === c ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/15 bg-white text-ink-700 hover:border-ink-900/30",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} articles shown
      </p>
      {visible.length ? (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/[0.08] bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <PostCover category={p.category} className="h-40" />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm text-volt-600">{p.category}</p>
                  <h2 className="mt-2 text-xl leading-snug text-ink-900">
                    <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0 after:rounded-3xl">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-600">{p.description}</p>
                  <p className="mt-5 text-sm text-ink-500">
                    <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time> · {p.readingMinutes} min read
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-3xl border border-dashed border-ink-900/15 p-10 text-center text-ink-600">Articles in this category are coming soon.</p>
      )}
    </div>
  );
}
