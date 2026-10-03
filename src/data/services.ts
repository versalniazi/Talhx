import type { FaqItem } from "./packages";

export type ServiceIcon = "search" | "map-pin" | "pen" | "share" | "megaphone" | "code";

export interface ServiceItem {
  name: string;
  description: string;
}

export interface Service {
  slug: string;
  name: string;
  shortName: string;
  icon: ServiceIcon;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string;
  cardSummary: string;
  items: ServiceItem[];
  approach: { title: string; body: string }[];
  goodFitFor: string[];
  relatedPackageSlugs: string[];
  faqs: FaqItem[];
  relatedServices: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "seo",
    name: "SEO Services",
    shortName: "SEO",
    icon: "search",
    metaTitle: "SEO Services UK — Audits, Technical & On-Page SEO",
    metaDescription:
      "Clearly priced SEO services for UK businesses: SEO audits, technical SEO, on-page optimisation, keyword research, competitor analysis and backlink audits. Order online from £15.",
    h1: "SEO services for UK businesses",
    eyebrow: "Search Engine Optimisation",
    intro:
      "Search engine optimisation helps the right people find your website. Our SEO services cover the technical, on-page and content foundations that make your pages easier for search engines to crawl, understand and present to searchers — delivered as clearly priced packages with defined deliverables.",
    cardSummary: "Audits, technical fixes, on-page optimisation and keyword research to strengthen your search foundations.",
    items: [
      { name: "SEO Audit", description: "A structured review of your website's SEO, with prioritised recommendations in plain English." },
      { name: "Technical SEO", description: "Crawling, indexing, redirects, sitemaps, canonical tags and site architecture reviewed and improved." },
      { name: "On-Page SEO", description: "Titles, headings, copy, images and internal links refined around clearly mapped keywords." },
      { name: "Keyword Research", description: "Search terms your customers actually use, grouped by intent and mapped to the right pages." },
      { name: "Content SEO", description: "Content planned and structured to answer search intent and support your key pages." },
      { name: "Competitor Analysis", description: "A comparison of your visible SEO with competitors to find realistic gaps and opportunities." },
      { name: "Backlink Audit", description: "A review of who links to you, potential risks and legitimate opportunities to earn links." },
      { name: "Website SEO Optimization", description: "Combined technical and on-page improvements applied directly to your site where access allows." },
    ],
    approach: [
      { title: "Understand", body: "We start with your goals, your customers and how they search — not a generic checklist." },
      { title: "Diagnose", body: "We review technical health, on-page signals and content to find what is holding pages back." },
      { title: "Prioritise", body: "Recommendations are ranked by likely impact and effort so you know what to do first." },
      { title: "Deliver", body: "You receive clear deliverables, and where you give access we can implement the changes." },
    ],
    goodFitFor: ["Small and medium-sized businesses", "E-commerce stores", "Service businesses", "Startups launching a new website"],
    relatedPackageSlugs: [
      "seo-quick-audit",
      "technical-seo-check",
      "on-page-seo-optimization",
      "10-keyword-research-package",
      "competitor-seo-analysis",
      "website-seo-health-check",
      "seo-backlink-starter",
      "on-page-seo-complete",
    ],
    faqs: [
      { q: "How long does SEO take to work?", a: "SEO is a long-term activity. Some technical fixes can be picked up by search engines within weeks, while content and authority improvements usually take months. We do not promise specific timescales or rankings." },
      { q: "Do you guarantee first-page rankings?", a: "No. Search engines control rankings and no provider can honestly guarantee them. We focus on improving the factors you can influence." },
      { q: "Which SEO package should I start with?", a: "If you are unsure, the SEO Quick Audit or Website SEO Health Check gives you a clear picture before you invest further." },
      { q: "Do you work with websites outside London?", a: "Yes. We work with businesses across the UK. Our registered office is in London, and all services are delivered online." },
    ],
    relatedServices: ["local-seo", "content-marketing", "web-development"],
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    shortName: "Local SEO",
    icon: "map-pin",
    metaTitle: "Local SEO UK — Google Business Profile Optimization",
    metaDescription:
      "Local SEO services for UK businesses: Google Business Profile optimisation, local SEO audits, local keyword research and citation setup. Clear fixed prices from £39.",
    h1: "Local SEO and Google Business Profile optimisation",
    eyebrow: "Local Search Visibility",
    intro:
      "When people search for a service near them, local search results and Google Maps play a big part in who they contact. Our local SEO services help make your business information complete, consistent and relevant for the areas you serve.",
    cardSummary: "Google Business Profile optimisation, local audits, citations and local keyword research.",
    items: [
      { name: "Google Business Profile Optimization", description: "Categories, services, description, attributes and media improved for completeness and relevance." },
      { name: "Local SEO Audit", description: "A review of your profile, website location signals, citations and local competitors." },
      { name: "Local Keyword Research", description: "Location-specific search terms that reflect how local customers look for your services." },
      { name: "Citation Setup", description: "Consistent business listings on relevant UK directories to reinforce your business details." },
      { name: "Local Ranking Optimization", description: "On-page and profile improvements focused on the local factors you can influence." },
    ],
    approach: [
      { title: "Profile", body: "We make sure your Google Business Profile is complete, accurate and well categorised." },
      { title: "Consistency", body: "We check your name, address and phone number match across your website and listings." },
      { title: "Relevance", body: "We align your website and profile with the services and areas you want to be found for." },
      { title: "Reputation", body: "We give practical guidance on requesting and responding to customer reviews." },
    ],
    goodFitFor: ["Trades and home services", "Clinics, salons and studios", "Restaurants, cafés and shops", "Service-area businesses"],
    relatedPackageSlugs: [
      "google-business-profile-audit",
      "local-seo-audit",
      "local-seo-starter",
      "google-business-profile-optimization",
      "local-citation-setup",
      "local-seo-growth-package",
    ],
    faqs: [
      { q: "What is a Google Business Profile?", a: "It is the free business listing that can appear in Google Search and Google Maps, showing your details, opening hours, photos and reviews." },
      { q: "Do I need a physical address for local SEO?", a: "Not necessarily. Service-area businesses can hide their address and list the areas they serve instead, in line with Google's guidelines." },
      { q: "Can you write fake reviews?", a: "No. Fake reviews break Google's policies and UK consumer law. We only provide guidance on asking genuine customers for reviews." },
      { q: "Is TALHX a Google Partner?", a: "No. TALHX LIMITED is not affiliated with or endorsed by Google. We provide independent optimisation services." },
    ],
    relatedServices: ["seo", "paid-advertising", "social-media"],
  },
  {
    slug: "content-marketing",
    name: "Content Marketing",
    shortName: "Content",
    icon: "pen",
    metaTitle: "Content Marketing & SEO Blog Writing Services UK",
    metaDescription:
      "SEO blog writing, content optimisation, content briefs and website copy for UK businesses. Original, search-focused content with clear pricing from £35.",
    h1: "Content marketing and SEO writing",
    eyebrow: "Content That Answers Questions",
    intro:
      "Useful content helps customers understand what you do and helps search engines understand when to show your pages. We write and optimise original content built around real search intent and your business goals.",
    cardSummary: "SEO blog articles, content optimisation, briefs and website copy written for people and search.",
    items: [
      { name: "SEO Blog Writing", description: "Original articles researched around a target keyword and written for your audience." },
      { name: "SEO Content Optimization", description: "Existing pages and posts refined for clarity, completeness and search intent." },
      { name: "Content Briefs", description: "Structured outlines with keywords, headings and questions for your own writers." },
      { name: "Website Content", description: "Clear homepage, about and service page copy that explains your offer." },
      { name: "Product/Service Content", description: "Descriptions that help customers decide and help search engines understand your offer." },
    ],
    approach: [
      { title: "Research", body: "We look at what searchers want to know and what already ranks for the topic." },
      { title: "Structure", body: "We plan headings and sections so the content is easy to scan and understand." },
      { title: "Write", body: "We write original content in a tone that suits your brand." },
      { title: "Refine", body: "You review the draft and we make agreed revisions before final delivery." },
    ],
    goodFitFor: ["Businesses starting a blog", "Websites with thin service pages", "E-commerce product ranges", "Teams that need content support"],
    relatedPackageSlugs: ["1-seo-blog-article", "seo-content-starter", "seo-content-optimization", "2-seo-blog-articles", "monthly-seo-growth"],
    faqs: [
      { q: "Do you use AI to write content?", a: "We may use software tools to support research and editing, but every piece is reviewed, edited and checked for accuracy by a person before delivery." },
      { q: "Who owns the content?", a: "Once your order is paid in full and delivered, you own the content we write for you." },
      { q: "Can you publish the article on my website?", a: "Yes, if you provide CMS access we can publish it for you. Let us know in your order requirements." },
    ],
    relatedServices: ["seo", "social-media", "web-development"],
  },
  {
    slug: "social-media",
    name: "Social Media Marketing",
    shortName: "Social Media",
    icon: "share",
    metaTitle: "Social Media Marketing Services UK — Facebook & Instagram",
    metaDescription:
      "Social media marketing for UK businesses: social media audits, profile setup, content creation and Facebook and Instagram marketing. Fixed prices from £30.",
    h1: "Social media marketing for growing businesses",
    eyebrow: "Social Media",
    intro:
      "Social media helps businesses stay visible and build familiarity with potential customers. We help you set up, review and create content for your profiles so your social presence reflects your business professionally.",
    cardSummary: "Audits, profile setup and ready-to-post content for Facebook and Instagram.",
    items: [
      { name: "Social Media Audit", description: "A review of your profiles, content mix and consistency with clear recommendations." },
      { name: "Social Media Setup", description: "Professional profile setup with consistent branding, bios and key information." },
      { name: "Social Media Content", description: "Ready-to-publish posts with captions, hashtags and simple graphics." },
      { name: "Facebook Marketing", description: "Page optimisation and content planning suited to Facebook audiences." },
      { name: "Instagram Marketing", description: "Profile, grid and content guidance tailored to Instagram." },
    ],
    approach: [
      { title: "Review", body: "We look at your current profiles, audience and goals." },
      { title: "Plan", body: "We recommend content themes and a realistic posting rhythm." },
      { title: "Create", body: "We produce posts that match your brand and messaging." },
      { title: "Improve", body: "We suggest adjustments based on what you learn from your audience." },
    ],
    goodFitFor: ["Local businesses", "Consumer brands", "Hospitality and retail", "Owners managing social media themselves"],
    relatedPackageSlugs: ["social-media-audit", "social-media-content-10-posts", "facebook-instagram-ads-setup"],
    faqs: [
      { q: "Do you manage my accounts day to day?", a: "Our packages cover audits and content creation. Ongoing management can be discussed through a custom quote." },
      { q: "Which platforms do you cover?", a: "Our packages focus on Facebook and Instagram, with content that can also be adapted for LinkedIn." },
      { q: "Can you guarantee followers or engagement?", a: "No. We never buy followers or engagement, and we do not guarantee specific numbers." },
    ],
    relatedServices: ["paid-advertising", "content-marketing", "local-seo"],
  },
  {
    slug: "paid-advertising",
    name: "Paid Advertising",
    shortName: "Advertising",
    icon: "megaphone",
    metaTitle: "Google Ads & Facebook Ads Setup Services UK",
    metaDescription:
      "Google Ads and Facebook / Instagram ads setup for UK businesses: campaign setup, targeting, ad copy and optimisation. Setup packages from £70, ad spend paid directly to the platform.",
    h1: "Google Ads and social advertising setup",
    eyebrow: "Paid Advertising",
    intro:
      "Paid advertising can put your business in front of people actively searching or scrolling. We set up structured campaigns on Google Ads and Meta (Facebook and Instagram) so your budget is directed at relevant audiences from the start.",
    cardSummary: "Google Ads, Facebook and Instagram campaign setup and optimisation.",
    items: [
      { name: "Google Ads Setup", description: "Search campaigns with researched keywords, ad groups, ad copy and location targeting." },
      { name: "Facebook Ads", description: "Campaigns built in Meta Ads Manager with relevant audiences and placements." },
      { name: "Instagram Ads", description: "Ad formats and creative guidance suited to Instagram feeds, Stories and Reels." },
      { name: "Campaign Setup", description: "Objectives, budgets, schedules and tracking configured with care." },
      { name: "Campaign Optimization", description: "Reviews of search terms, audiences and ads to reduce waste and improve relevance." },
    ],
    approach: [
      { title: "Objective", body: "We agree what a successful result looks like — calls, enquiries or sales." },
      { title: "Structure", body: "We organise campaigns so budgets, keywords and audiences are easy to manage." },
      { title: "Launch-ready", body: "Campaigns are built and left paused for your review and approval." },
      { title: "Review", body: "We explain how to monitor results and when to make adjustments." },
    ],
    goodFitFor: ["Local service businesses", "E-commerce stores", "Businesses launching new offers", "Businesses testing new markets"],
    relatedPackageSlugs: ["facebook-instagram-ads-setup", "google-ads-setup"],
    faqs: [
      { q: "Is advertising spend included in the price?", a: "No. Our prices cover setup work only. Ad spend is paid directly by you to Google or Meta, and you stay in control of your budget." },
      { q: "Will my ads go live straight away?", a: "We build campaigns in a paused state so you can review them before they start spending." },
      { q: "Do you guarantee leads or sales?", a: "No. Advertising results depend on your offer, budget, competition and website. We focus on a solid, well-structured setup." },
    ],
    relatedServices: ["social-media", "local-seo", "web-development"],
  },
  {
    slug: "web-development",
    name: "Website & Digital Solutions",
    shortName: "Web & Digital",
    icon: "code",
    metaTitle: "Website Speed, SEO Optimisation & Development Services UK",
    metaDescription:
      "Website SEO optimisation, speed optimisation, website development and digital growth consulting for UK businesses. Practical, clearly scoped digital solutions.",
    h1: "Website and digital solutions",
    eyebrow: "Web & Digital Solutions",
    intro:
      "Your website is the foundation of your online presence. We help make it faster, better structured for search and easier for customers to use — and we can build new websites and digital tools when you need them.",
    cardSummary: "Website SEO optimisation, speed improvements, development and digital growth consulting.",
    items: [
      { name: "Website SEO Optimization", description: "Technical and on-page improvements implemented directly on your website." },
      { name: "Website Speed Optimization", description: "Image, caching and script improvements to help pages load faster." },
      { name: "Website Development", description: "Modern, responsive websites built with performance, accessibility and SEO in mind." },
      { name: "Digital Growth Consulting", description: "Practical advice on priorities across SEO, content, social and advertising." },
    ],
    approach: [
      { title: "Measure", body: "We measure performance and review structure before recommending changes." },
      { title: "Plan", body: "We agree a clear scope, timeline and price before starting." },
      { title: "Build", body: "We implement improvements or build with modern, maintainable technology." },
      { title: "Hand over", body: "You receive documentation and before-and-after measurements where relevant." },
    ],
    goodFitFor: ["Slow or outdated websites", "Businesses planning a new website", "Startups needing a digital roadmap", "Websites with technical SEO issues"],
    relatedPackageSlugs: [
      "website-speed-optimization",
      "seo-plus-speed-optimization",
      "monthly-seo-starter",
      "monthly-seo-growth",
      "complete-digital-marketing-starter",
    ],
    faqs: [
      { q: "How much does a new website cost?", a: "Website development is scoped individually. Request a custom quote with your requirements and we will provide a clear, fixed proposal." },
      { q: "Which platforms do you work with?", a: "We commonly work with WordPress, Shopify, Wix, Squarespace and custom-built websites. Let us know your platform when you order." },
      { q: "Will you need access to my hosting?", a: "For speed optimisation and implementation work, admin or hosting access is usually needed. Never send passwords through the order form — we will arrange secure access with you." },
    ],
    relatedServices: ["seo", "content-marketing", "paid-advertising"],
  },
];

export const getServiceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
