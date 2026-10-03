import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { SERVICES } from "@/data/services";
import { PACKAGES } from "@/data/packages";
import { BLOG_POSTS } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-03");
  const staticPaths = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/pricing", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/faq", priority: 0.6 },
    { path: "/blog", priority: 0.6 },
    { path: "/privacy-policy", priority: 0.2 },
    { path: "/terms-and-conditions", priority: 0.2 },
    { path: "/refund-policy", priority: 0.2 },
    { path: "/cookie-policy", priority: 0.2 },
  ];
  return [
    ...staticPaths.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, priority: p.priority })),
    ...SERVICES.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: now, priority: 0.8 })),
    ...PACKAGES.map((p) => ({ url: `${SITE_URL}/pricing/${p.slug}`, lastModified: now, priority: 0.6 })),
    ...BLOG_POSTS.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.publishedAt), priority: 0.5 })),
  ];
}
