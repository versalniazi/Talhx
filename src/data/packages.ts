export type PackageCategory = "seo" | "local-seo" | "content" | "social" | "advertising" | "growth";
export type Billing = "one-time" | "monthly";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ServicePackage {
  id: number;
  slug: string;
  name: string;
  category: PackageCategory;
  price: number;
  billing: Billing;
  /** One-line card description. */
  summary: string;
  /** Longer overview used on detail views. */
  overview: string;
  included: string[];
  deliverables: string[];
  whoFor: string[];
  /** Estimated delivery window, counted from payment verification and receipt of required details. */
  delivery: string;
  /** What we need from the customer to begin. */
  needFromYou: string[];
  popular?: boolean;
  faqs: FaqItem[];
}

export const CATEGORY_LABELS: Record<PackageCategory, string> = {
  seo: "SEO",
  "local-seo": "Local SEO",
  content: "Content",
  social: "Social Media",
  advertising: "Advertising",
  growth: "Growth",
};

export const CATEGORY_FILTERS: { value: "all" | PackageCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "seo", label: "SEO" },
  { value: "local-seo", label: "Local SEO" },
  { value: "content", label: "Content" },
  { value: "social", label: "Social Media" },
  { value: "advertising", label: "Advertising" },
  { value: "growth", label: "Growth" },
];

const WEBSITE_ACCESS = "Your website URL (and read-only access to Google Search Console if available)";

export const PACKAGES: ServicePackage[] = [
  {
    id: 1,
    slug: "seo-quick-audit",
    name: "SEO Quick Audit",
    category: "seo",
    price: 15,
    billing: "one-time",
    popular: true,
    summary: "A fast, focused review of your website's most important SEO issues with a prioritised fix list.",
    overview:
      "A practical starting point for any website. We review your site's key SEO fundamentals — indexing signals, titles and descriptions, headings, mobile usability and obvious technical issues — and hand back a short, prioritised list of what to fix first.",
    included: [
      "Review of homepage and up to 5 key pages",
      "Indexing and crawlability spot-checks",
      "Title tag, meta description and heading review",
      "Mobile-friendliness and basic page speed check",
      "Prioritised list of quick wins",
    ],
    deliverables: ["PDF audit summary", "Prioritised action list (high / medium / low)"],
    whoFor: ["New website owners", "Small businesses unsure where to start with SEO", "Anyone wanting a low-cost second opinion"],
    delivery: "2–3 business days",
    needFromYou: ["Your website URL", "Your main products, services or target locations"],
    faqs: [
      { q: "Is this a full SEO audit?", a: "No. It is a focused, high-level review designed to surface the most important issues quickly. For a deeper review, consider the Website SEO Health Check or Technical SEO Check." },
    ],
  },
  {
    id: 2,
    slug: "seo-keyword-mini-research",
    name: "SEO Keyword Mini Research",
    category: "seo",
    price: 17,
    billing: "one-time",
    summary: "A short list of relevant keyword opportunities for one product, service or topic.",
    overview:
      "Understand how customers search for one specific product, service or topic. We research relevant search terms and group them by intent so you know which phrases to target on a single page.",
    included: [
      "Research for 1 product, service or topic",
      "Up to 5 recommended keywords",
      "Search intent classification",
      "Indicative monthly search volume and competition",
    ],
    deliverables: ["Keyword spreadsheet (Google Sheets or Excel)", "Short recommendation on which keyword to prioritise"],
    whoFor: ["Businesses planning a new page", "Bloggers and content writers", "Anyone testing keyword research before a larger project"],
    delivery: "1–2 business days",
    needFromYou: ["The product, service or topic to research", "Your target location (e.g. UK-wide or a specific town)"],
    faqs: [
      { q: "Where does the search volume data come from?", a: "We use established third-party keyword tools. Search volumes are estimates and should be treated as indicative rather than exact." },
    ],
  },
  {
    id: 3,
    slug: "meta-tags-optimization",
    name: "Meta Tags Optimization",
    category: "seo",
    price: 25,
    billing: "one-time",
    summary: "Rewritten title tags and meta descriptions for up to 10 pages, written for search and clicks.",
    overview:
      "Titles and meta descriptions are often the first thing a searcher sees. We write clear, keyword-aware title tags and meta descriptions for up to 10 pages, within recommended length limits, to better describe each page in search results.",
    included: [
      "Up to 10 pages",
      "New title tag for each page",
      "New meta description for each page",
      "Length and duplication checks",
    ],
    deliverables: ["Spreadsheet of current vs recommended tags", "Optional implementation if CMS access is provided"],
    whoFor: ["Websites with missing or duplicated meta tags", "Small business websites built from templates"],
    delivery: "2–3 business days",
    needFromYou: ["Your website URL and the pages to optimise", "CMS access if you want us to implement the changes"],
    faqs: [
      { q: "Will Google always show my meta description?", a: "Not always. Search engines sometimes rewrite snippets based on the search query. Well-written tags still give you the best chance of a clear, relevant listing." },
    ],
  },
  {
    id: 4,
    slug: "social-media-audit",
    name: "Social Media Audit",
    category: "social",
    price: 30,
    billing: "one-time",
    summary: "A review of up to 2 social media profiles with practical recommendations to improve them.",
    overview:
      "We review up to two of your social media profiles — for example Facebook and Instagram — looking at profile completeness, branding consistency, content mix, posting frequency and engagement patterns, and give you clear recommendations.",
    included: [
      "Review of up to 2 social profiles",
      "Profile completeness and branding check",
      "Content mix and posting frequency review",
      "Engagement pattern observations",
      "Recommendations for improvement",
    ],
    deliverables: ["PDF audit report", "List of recommended next steps"],
    whoFor: ["Businesses with existing social profiles", "Owners who manage social media themselves"],
    delivery: "2–3 business days",
    needFromYou: ["Links to the profiles to review", "Your main business goals for social media"],
    faqs: [
      { q: "Do you need my login details?", a: "No. The audit is based on your public profiles. Never share passwords with us by email or the order form." },
    ],
  },
  {
    id: 5,
    slug: "1-seo-blog-article",
    name: "1 SEO Blog Article",
    category: "content",
    price: 35,
    billing: "one-time",
    summary: "One original, search-focused blog article of up to 800 words, written around a target keyword.",
    overview:
      "An original article written for your audience and structured for search. We agree a topic and target keyword with you, then write a clear, well-structured article with headings, a meta title and a meta description.",
    included: [
      "1 original article, up to 800 words",
      "Target keyword and topic agreed with you",
      "SEO-friendly heading structure",
      "Meta title and meta description",
      "1 round of revisions",
    ],
    deliverables: ["Article as a Google Doc or Word document", "Meta title and description"],
    whoFor: ["Businesses starting a blog", "Websites needing fresh, relevant content"],
    delivery: "3–5 business days",
    needFromYou: ["Your preferred topic or keyword (or ask us to suggest one)", "Any brand tone or style guidance"],
    faqs: [
      { q: "Is the content original?", a: "Yes. Every article is written for your business and is not copied or spun from existing content." },
    ],
  },
  {
    id: 6,
    slug: "google-business-profile-audit",
    name: "Google Business Profile Audit",
    category: "local-seo",
    price: 39,
    billing: "one-time",
    summary: "A detailed review of your Google Business Profile with a checklist of improvements.",
    overview:
      "We review your Google Business Profile against current best practice — categories, business information, services, photos, reviews handling and posts — and provide a clear checklist of improvements you can make.",
    included: [
      "Category and business information review",
      "Services, products and description review",
      "Photos and visual content check",
      "Review response approach check",
      "Name, address and phone consistency spot-check",
    ],
    deliverables: ["PDF audit with improvement checklist"],
    whoFor: ["Local businesses with an existing Google Business Profile", "Service-area businesses"],
    delivery: "2–3 business days",
    needFromYou: ["A link to your Google Business Profile or your exact business name and address"],
    faqs: [
      { q: "Do I need a Google Business Profile already?", a: "Yes, this audit reviews an existing profile. If you do not have one, contact us and we can advise on setup." },
    ],
  },
  {
    id: 7,
    slug: "technical-seo-check",
    name: "Technical SEO Check",
    category: "seo",
    price: 40,
    billing: "one-time",
    summary: "A technical crawl of your site covering indexing, redirects, broken links, sitemaps and more.",
    overview:
      "We crawl your website to identify technical issues that can affect how search engines discover and understand your pages — including broken links, redirect chains, duplicate content signals, sitemap and robots.txt configuration, and canonical tags.",
    included: [
      "Site crawl of up to 500 URLs",
      "Broken links and redirect review",
      "XML sitemap and robots.txt review",
      "Canonical tag and duplicate content checks",
      "HTTPS and mobile usability checks",
    ],
    deliverables: ["PDF technical report", "Spreadsheet of affected URLs", "Prioritised fix list"],
    whoFor: ["Websites that have grown over time", "Businesses after a redesign or migration"],
    delivery: "3–4 business days",
    needFromYou: [WEBSITE_ACCESS],
    faqs: [
      { q: "Will you fix the issues for me?", a: "This package identifies and explains the issues. Fixes can be quoted separately, or you can pass the report to your web developer." },
    ],
  },
  {
    id: 8,
    slug: "local-seo-audit",
    name: "Local SEO Audit",
    category: "local-seo",
    price: 42,
    billing: "one-time",
    summary: "A review of your local search presence across your website, Google Business Profile and listings.",
    overview:
      "We look at the signals that influence local search visibility: your Google Business Profile, location pages, local keyword usage, name/address/phone consistency, local citations and reviews. You receive a clear report with prioritised recommendations.",
    included: [
      "Google Business Profile review",
      "Website local signals review",
      "NAP (name, address, phone) consistency check",
      "Sample of local citations reviewed",
      "Local competitor snapshot (up to 3)",
    ],
    deliverables: ["PDF local SEO report", "Prioritised recommendations"],
    whoFor: ["Local service businesses", "Shops, clinics, trades and hospitality businesses"],
    delivery: "3–4 business days",
    needFromYou: ["Your website URL", "Your Google Business Profile link", "Your target towns or areas"],
    faqs: [
      { q: "What is a citation?", a: "A citation is an online mention of your business name, address and phone number — for example on a business directory. Consistent citations help search engines trust your business details." },
    ],
  },
  {
    id: 9,
    slug: "on-page-seo-optimization",
    name: "On-Page SEO Optimization",
    category: "seo",
    price: 45,
    billing: "one-time",
    popular: true,
    summary: "On-page optimisation of up to 3 pages: titles, headings, content, internal links and images.",
    overview:
      "We optimise up to three important pages so they clearly communicate their topic to search engines and visitors — refining titles, meta descriptions, headings, on-page copy, image alt text and internal links around agreed target keywords.",
    included: [
      "Up to 3 pages",
      "Target keyword mapping for each page",
      "Title, meta description and heading optimisation",
      "On-page copy recommendations",
      "Image alt text and internal link suggestions",
    ],
    deliverables: ["Optimisation document per page", "Implementation in your CMS if access is provided"],
    whoFor: ["Businesses with key service or product pages", "Websites with thin or unfocused page content"],
    delivery: "3–5 business days",
    needFromYou: ["The pages you want optimised", "CMS access if you want us to implement changes"],
    faqs: [
      { q: "Which pages should I choose?", a: "Usually the pages that matter most commercially — your homepage and main service or product pages. We can advise when you place your order." },
    ],
  },
  {
    id: 10,
    slug: "10-keyword-research-package",
    name: "10 Keyword Research Package",
    category: "seo",
    price: 50,
    billing: "one-time",
    summary: "Ten researched keyword opportunities grouped by intent and mapped to pages.",
    overview:
      "A structured keyword research project covering your core offering. We identify 10 relevant keyword opportunities, group them by search intent and suggest which page on your site each should target.",
    included: [
      "10 researched keywords",
      "Search intent grouping",
      "Indicative volume and difficulty",
      "Keyword-to-page mapping",
    ],
    deliverables: ["Keyword research spreadsheet", "Keyword-to-page mapping"],
    whoFor: ["Small business websites", "Businesses planning new content"],
    delivery: "2–3 business days",
    needFromYou: ["Your website URL", "Your main products or services", "Your target location"],
    faqs: [
      { q: "Can I choose the topics?", a: "Yes. Tell us your priorities in the requirements field at checkout and we will focus the research there." },
    ],
  },
  {
    id: 11,
    slug: "competitor-seo-analysis",
    name: "Competitor SEO Analysis",
    category: "seo",
    price: 55,
    billing: "one-time",
    summary: "Compare your website's SEO with up to 3 competitors and find practical gaps to close.",
    overview:
      "We compare your website with up to three competitors across visible SEO factors — content coverage, keyword overlap, on-page structure, technical basics and backlink profile overview — and highlight realistic opportunities.",
    included: [
      "Up to 3 competitors",
      "Keyword and content gap overview",
      "On-page structure comparison",
      "Backlink profile overview",
      "Opportunity summary",
    ],
    deliverables: ["PDF competitor analysis report", "Opportunity list"],
    whoFor: ["Businesses in competitive local or national markets", "Businesses planning an SEO strategy"],
    delivery: "3–5 business days",
    needFromYou: ["Your website URL", "Up to 3 competitor websites (or ask us to identify them)"],
    faqs: [
      { q: "What if I don't know my competitors?", a: "We can identify the websites that appear for your main search terms and use those for the analysis." },
    ],
  },
  {
    id: 12,
    slug: "website-seo-health-check",
    name: "Website SEO Health Check",
    category: "seo",
    price: 56,
    billing: "one-time",
    summary: "A broader SEO review combining technical, on-page and content checks across your site.",
    overview:
      "A well-rounded review of your website's SEO health. We combine a technical crawl with an on-page and content review, then summarise findings in plain English with a prioritised action plan.",
    included: [
      "Technical crawl of up to 500 URLs",
      "On-page review of key pages",
      "Content quality and duplication checks",
      "Page speed and Core Web Vitals overview",
      "Prioritised action plan",
    ],
    deliverables: ["PDF health check report", "Prioritised action plan", "Spreadsheet of affected URLs"],
    whoFor: ["Established websites", "Businesses wanting a full picture before investing in SEO"],
    delivery: "4–5 business days",
    needFromYou: [WEBSITE_ACCESS],
    faqs: [
      { q: "How is this different from the Quick Audit?", a: "The Quick Audit is a high-level look at a handful of pages. The Health Check crawls the site and reviews technical, on-page and content factors in more depth." },
    ],
  },
  {
    id: 13,
    slug: "google-business-profile-optimization",
    name: "Google Business Profile Optimization",
    category: "local-seo",
    price: 59,
    billing: "one-time",
    popular: true,
    summary: "Improve the structure, completeness and local-search readiness of your Google Business Profile.",
    overview:
      "Improve the structure, completeness and local-search readiness of your Google Business Profile. We review and update your categories, business description, services, attributes and opening hours, and give guidance on photos, posts and responding to reviews.",
    included: [
      "Primary and secondary category review",
      "Business description written for clarity and relevance",
      "Services / products section completed",
      "Attributes, hours and contact details checked",
      "Photo and posting guidance",
      "Review response guidance",
    ],
    deliverables: ["Optimised profile (with manager access) or a ready-to-paste update document", "Summary of changes made"],
    whoFor: ["Local businesses", "Service-area businesses", "Businesses with incomplete profiles"],
    delivery: "3–4 business days",
    needFromYou: ["Manager access to your Google Business Profile, or willingness to apply our recommended changes", "Your services and service areas"],
    faqs: [
      { q: "Do you need ownership of my profile?", a: "No. Manager access is enough, and you remain the owner at all times. Alternatively, we can provide a document of changes for you to apply." },
      { q: "Can you guarantee map pack rankings?", a: "No one can honestly guarantee rankings. This service improves the completeness and quality of your profile, which supports local visibility." },
    ],
  },
  {
    id: 14,
    slug: "seo-content-optimization",
    name: "SEO Content Optimization",
    category: "content",
    price: 60,
    billing: "one-time",
    summary: "Improve up to 3 existing pages or articles so they are clearer, more complete and better targeted.",
    overview:
      "Existing content often has untapped potential. We review up to three pages or articles, refine the copy around agreed keywords, improve structure and readability, and fill content gaps compared with what searchers expect.",
    included: [
      "Up to 3 existing pages or articles",
      "Keyword and search intent alignment",
      "Copy edits for clarity and completeness",
      "Heading structure and readability improvements",
      "Internal linking suggestions",
    ],
    deliverables: ["Edited content with tracked changes", "Updated meta titles and descriptions"],
    whoFor: ["Websites with older blog posts", "Pages that receive impressions but few clicks"],
    delivery: "4–5 business days",
    needFromYou: ["Links to the pages you want optimised"],
    faqs: [],
  },
  {
    id: 15,
    slug: "2-seo-blog-articles",
    name: "2 SEO Blog Articles",
    category: "content",
    price: 65,
    billing: "one-time",
    summary: "Two original, search-focused articles of up to 800 words each.",
    overview:
      "Two original articles written for your audience and structured for search, each built around a target keyword agreed with you, with meta titles and descriptions included.",
    included: [
      "2 original articles, up to 800 words each",
      "Topics and keywords agreed with you",
      "SEO-friendly heading structure",
      "Meta titles and descriptions",
      "1 round of revisions per article",
    ],
    deliverables: ["2 articles as Google Docs or Word documents", "Meta titles and descriptions"],
    whoFor: ["Businesses building a regular blog", "Websites targeting informational searches"],
    delivery: "5–7 business days",
    needFromYou: ["Preferred topics or keywords (or ask us to suggest them)", "Any tone or style guidance"],
    faqs: [],
  },
  {
    id: 16,
    slug: "local-citation-setup",
    name: "Local Citation Setup",
    category: "local-seo",
    price: 70,
    billing: "one-time",
    summary: "Manual submission of your business to up to 15 relevant UK business directories.",
    overview:
      "Consistent business listings help search engines verify your details. We manually submit your business to up to 15 relevant UK directories using consistent name, address and phone information.",
    included: [
      "Up to 15 relevant UK directory submissions",
      "Consistent NAP details across listings",
      "Business description and categories",
      "Submission report with links",
    ],
    deliverables: ["Citation report (directory, status and link)"],
    whoFor: ["Local businesses", "New businesses establishing an online footprint"],
    delivery: "5–7 business days",
    needFromYou: ["Exact business name, address and phone number", "Business description, logo and opening hours"],
    faqs: [
      { q: "Will all listings go live immediately?", a: "Some directories verify listings manually or by phone/email, so approval times vary and are outside our control. The report shows the status of each submission." },
    ],
  },
  {
    id: 17,
    slug: "seo-backlink-starter",
    name: "SEO Backlink Starter",
    category: "seo",
    price: 80,
    billing: "one-time",
    summary: "A backlink audit plus a researched list of legitimate link-building opportunities.",
    overview:
      "A responsible starting point for link building. We review your existing backlink profile, flag potentially harmful patterns, and research legitimate opportunities such as relevant directories, industry associations, local organisations and outreach prospects. We do not buy or sell links.",
    included: [
      "Backlink profile review",
      "Identification of potentially low-quality links",
      "Up to 20 researched link opportunities",
      "Outreach email template",
    ],
    deliverables: ["Backlink audit summary", "Link opportunity spreadsheet", "Outreach template"],
    whoFor: ["Websites with few backlinks", "Businesses wanting to build authority the right way"],
    delivery: "4–6 business days",
    needFromYou: ["Your website URL", "Your industry and location"],
    faqs: [
      { q: "Do you buy links?", a: "No. Paid link schemes are against search engine guidelines and can harm your website. We focus on legitimate, relevant opportunities." },
    ],
  },
  {
    id: 18,
    slug: "website-speed-optimization",
    name: "Website Speed Optimization",
    category: "growth",
    price: 85,
    billing: "one-time",
    summary: "Practical improvements to page speed and Core Web Vitals on your website.",
    overview:
      "Slow pages frustrate visitors. We measure your site's performance, identify the main bottlenecks — such as oversized images, render-blocking resources and caching — and implement or document improvements depending on your platform and access.",
    included: [
      "Performance measurement of key pages",
      "Image optimisation recommendations or implementation",
      "Caching and compression review",
      "Render-blocking script and CSS review",
      "Before and after measurements",
    ],
    deliverables: ["Performance report", "Changes implemented (with access) or a developer-ready fix list"],
    whoFor: ["WordPress, Shopify and similar sites", "Websites with slow mobile load times"],
    delivery: "3–5 business days",
    needFromYou: ["Your website URL", "Admin or hosting access if you want changes implemented"],
    faqs: [
      { q: "Can you guarantee a specific speed score?", a: "No. Results depend on your platform, hosting, theme and third-party scripts. We will explain what was changed and show before-and-after measurements." },
    ],
  },
  {
    id: 19,
    slug: "25-keyword-research-package",
    name: "25 Keyword Research Package",
    category: "seo",
    price: 90,
    billing: "one-time",
    summary: "Twenty-five researched keywords with intent grouping, page mapping and content ideas.",
    overview:
      "A fuller keyword research project for growing websites. We identify 25 relevant keyword opportunities, group them by intent, map them to existing or new pages and suggest content ideas.",
    included: [
      "25 researched keywords",
      "Search intent grouping and topic clusters",
      "Indicative volume and difficulty",
      "Keyword-to-page mapping",
      "New content ideas",
    ],
    deliverables: ["Keyword research spreadsheet", "Content opportunity list"],
    whoFor: ["Growing websites", "E-commerce stores", "Businesses planning a content calendar"],
    delivery: "3–5 business days",
    needFromYou: ["Your website URL", "Your main products or services", "Your target location"],
    faqs: [],
  },
  {
    id: 20,
    slug: "on-page-seo-complete",
    name: "On-Page SEO Complete",
    category: "seo",
    price: 100,
    billing: "one-time",
    popular: true,
    summary: "On-page optimisation of up to 8 pages, including keyword mapping and internal linking.",
    overview:
      "A more complete on-page project covering up to eight pages. We map keywords across your site to avoid overlap, then optimise titles, meta descriptions, headings, copy, image alt text, internal links and basic structured data recommendations.",
    included: [
      "Up to 8 pages",
      "Site-wide keyword mapping",
      "Titles, meta descriptions and headings",
      "On-page copy recommendations",
      "Internal linking plan",
      "Structured data recommendations",
    ],
    deliverables: ["Optimisation document per page", "Keyword map", "Implementation in your CMS if access is provided"],
    whoFor: ["Small business websites", "Service businesses with multiple service pages"],
    delivery: "5–7 business days",
    needFromYou: ["The pages you want optimised", "CMS access if you want us to implement changes"],
    faqs: [],
  },
  {
    id: 21,
    slug: "local-seo-starter",
    name: "Local SEO Starter",
    category: "local-seo",
    price: 45,
    billing: "one-time",
    summary: "Essential local SEO foundations: profile tidy-up, local keywords and NAP consistency.",
    overview:
      "A simple local SEO starting point. We check your Google Business Profile basics, research a handful of local keywords and review your website's contact and location information for consistency.",
    included: [
      "Google Business Profile basics check",
      "Up to 5 local keywords",
      "Website NAP consistency review",
      "Local SEO quick-win checklist",
    ],
    deliverables: ["Local SEO starter report", "Local keyword list"],
    whoFor: ["New local businesses", "Sole traders and small teams"],
    delivery: "2–4 business days",
    needFromYou: ["Your website URL", "Your Google Business Profile link", "Your target town or area"],
    faqs: [],
  },
  {
    id: 22,
    slug: "seo-content-starter",
    name: "SEO Content Starter",
    category: "content",
    price: 55,
    billing: "one-time",
    summary: "One SEO article plus a content brief and 5 future topic ideas.",
    overview:
      "Get your content off to a good start. We write one original SEO article of up to 800 words and provide five researched topic ideas so you know what to publish next.",
    included: [
      "1 original article, up to 800 words",
      "Keyword research for the article",
      "5 researched future topic ideas",
      "Meta title and description",
    ],
    deliverables: ["Article as a Google Doc or Word document", "Topic ideas list with target keywords"],
    whoFor: ["Businesses starting content marketing", "Websites without a blog"],
    delivery: "4–6 business days",
    needFromYou: ["Your website URL", "Any topic preferences"],
    faqs: [],
  },
  {
    id: 23,
    slug: "social-media-content-10-posts",
    name: "Social Media Content — 10 Posts",
    category: "social",
    price: 60,
    billing: "one-time",
    summary: "Ten ready-to-publish social media posts with captions, hashtags and simple graphics.",
    overview:
      "Ten social media posts created for your business, with captions, relevant hashtags and simple branded graphics, ready for you to schedule on Facebook, Instagram or LinkedIn.",
    included: [
      "10 posts with captions",
      "Relevant hashtag suggestions",
      "Simple branded graphics",
      "1 round of revisions",
    ],
    deliverables: ["10 graphics (PNG/JPG)", "Caption document"],
    whoFor: ["Businesses without time to create content", "New social media accounts"],
    delivery: "5–7 business days",
    needFromYou: ["Logo and brand colours", "Key products, services or offers to feature", "Any photos you would like used"],
    faqs: [
      { q: "Do you post the content for me?", a: "This package covers content creation. Scheduling and posting can be quoted separately if required." },
    ],
  },
  {
    id: 24,
    slug: "facebook-instagram-ads-setup",
    name: "Facebook / Instagram Ads Setup",
    category: "advertising",
    price: 70,
    billing: "one-time",
    summary: "Setup of one Meta ads campaign with audience targeting, ad copy and tracking guidance.",
    overview:
      "We set up one campaign in Meta Ads Manager for Facebook and Instagram — including objective selection, audience targeting, placements, ad copy and creative guidance — plus advice on Meta Pixel tracking. Your advertising budget is paid directly to Meta and is not included.",
    included: [
      "1 campaign with up to 2 ad sets",
      "Audience targeting setup",
      "Ad copy for up to 3 ads",
      "Pixel / conversion tracking guidance",
      "Campaign walkthrough notes",
    ],
    deliverables: ["Campaign built in your ad account (paused for your approval)", "Setup summary document"],
    whoFor: ["Businesses new to social advertising", "Local businesses promoting offers"],
    delivery: "3–5 business days",
    needFromYou: ["Partner access to your Meta Business account", "Your budget, offer and target audience"],
    faqs: [
      { q: "Is ad spend included?", a: "No. Ad spend is paid directly by you to Meta. The package price covers our setup work only." },
    ],
  },
  {
    id: 25,
    slug: "google-ads-setup",
    name: "Google Ads Setup",
    category: "advertising",
    price: 85,
    billing: "one-time",
    summary: "Setup of one Google Search campaign with keyword research, ad copy and conversion tracking guidance.",
    overview:
      "We set up one Google Search campaign — including keyword research, ad groups, responsive search ads, negative keywords and location targeting — and advise on conversion tracking. Your advertising budget is paid directly to Google and is not included.",
    included: [
      "1 Search campaign with up to 3 ad groups",
      "Keyword research and negative keywords",
      "Responsive search ad copy",
      "Location and schedule settings",
      "Conversion tracking guidance",
    ],
    deliverables: ["Campaign built in your account (paused for your approval)", "Setup summary document"],
    whoFor: ["Businesses wanting leads from Google search", "Local service businesses"],
    delivery: "3–5 business days",
    needFromYou: ["Access to your Google Ads account (or we can guide you to create one)", "Your budget, services and target areas"],
    faqs: [
      { q: "Is ad spend included?", a: "No. Ad spend is paid directly by you to Google. The package price covers our setup work only." },
    ],
  },
  {
    id: 26,
    slug: "seo-plus-speed-optimization",
    name: "SEO + Speed Optimization",
    category: "growth",
    price: 90,
    billing: "one-time",
    summary: "On-page SEO for up to 3 pages combined with website speed improvements.",
    overview:
      "A combined package that improves both how clearly your key pages target search terms and how quickly your site loads — two foundations of a better search and user experience.",
    included: [
      "On-page optimisation of up to 3 pages",
      "Performance measurement and bottleneck review",
      "Image and caching improvements (with access)",
      "Before and after measurements",
    ],
    deliverables: ["On-page optimisation document", "Performance report", "Implemented changes with access"],
    whoFor: ["Small business websites", "Sites with slow pages and unclear targeting"],
    delivery: "5–7 business days",
    needFromYou: ["Your website URL", "CMS or hosting access if you want changes implemented"],
    faqs: [],
  },
  {
    id: 27,
    slug: "local-seo-growth-package",
    name: "Local SEO Growth Package",
    category: "local-seo",
    price: 100,
    billing: "one-time",
    summary: "Google Business Profile optimisation, local keywords, location page advice and 10 citations.",
    overview:
      "A fuller local SEO project combining Google Business Profile optimisation, local keyword research, on-page recommendations for your location pages and submissions to up to 10 relevant UK directories.",
    included: [
      "Google Business Profile optimisation",
      "Up to 10 local keywords",
      "Location / service page recommendations",
      "Up to 10 directory submissions",
      "Review generation guidance",
    ],
    deliverables: ["Summary report", "Local keyword list", "Citation report"],
    whoFor: ["Local businesses ready to invest in visibility", "Multi-service local businesses"],
    delivery: "7–10 business days",
    needFromYou: ["Manager access to your Google Business Profile", "Exact business name, address and phone", "Your target areas"],
    faqs: [],
  },
  {
    id: 28,
    slug: "monthly-seo-starter",
    name: "Monthly SEO Starter",
    category: "growth",
    price: 100,
    billing: "monthly",
    summary: "Ongoing monthly SEO maintenance: technical monitoring, on-page improvements and a monthly report.",
    overview:
      "Consistent, ongoing SEO for small websites. Each month we monitor technical health, optimise up to 2 pages, review Search Console data and send a plain-English report of what was done and what is next.",
    included: [
      "Monthly technical health monitoring",
      "On-page optimisation of up to 2 pages per month",
      "Google Search Console review",
      "Monthly plain-English report",
    ],
    deliverables: ["Monthly report", "Monthly optimisation log"],
    whoFor: ["Small businesses wanting steady SEO support", "Websites that need regular maintenance"],
    delivery: "Monthly service — first report within 30 days",
    needFromYou: [WEBSITE_ACCESS, "CMS access for implementing changes"],
    faqs: [
      { q: "Is there a minimum term?", a: "No minimum term. Each month is paid in advance by bank transfer, and you can stop before the next month begins. See our Terms & Conditions for details." },
    ],
  },
  {
    id: 29,
    slug: "monthly-seo-growth",
    name: "Monthly SEO Growth",
    category: "growth",
    price: 100,
    billing: "monthly",
    summary: "Monthly content-led SEO: one optimised article, keyword tracking and on-page refinements.",
    overview:
      "A content-focused monthly service. Each month we write one SEO article, refine one existing page, track agreed keywords and report on progress and next steps.",
    included: [
      "1 SEO article per month (up to 800 words)",
      "1 existing page refined per month",
      "Tracking of up to 15 keywords",
      "Monthly report and recommendations",
    ],
    deliverables: ["Monthly article", "Monthly report"],
    whoFor: ["Businesses that want to build content consistently", "Websites targeting informational searches"],
    delivery: "Monthly service — first article within 14 days",
    needFromYou: [WEBSITE_ACCESS, "Topic preferences and tone guidance"],
    faqs: [
      { q: "How is this different from Monthly SEO Starter?", a: "Monthly SEO Starter focuses on technical monitoring and on-page work. Monthly SEO Growth focuses on producing new content and refining existing pages." },
      { q: "Is there a minimum term?", a: "No minimum term. Each month is paid in advance by bank transfer, and you can stop before the next month begins." },
    ],
  },
  {
    id: 30,
    slug: "complete-digital-marketing-starter",
    name: "Complete Digital Marketing Starter",
    category: "growth",
    price: 150,
    billing: "one-time",
    popular: true,
    summary: "A combined starter: SEO audit, Google Business Profile optimisation, 1 article and a social review.",
    overview:
      "A practical, all-round starting point for your online presence. We combine an SEO health review, on-page optimisation of your homepage, Google Business Profile optimisation, one SEO article and a social media review — then pull it together in a simple 90-day action plan.",
    included: [
      "Website SEO review and prioritised fix list",
      "Homepage on-page optimisation",
      "Google Business Profile optimisation",
      "1 SEO blog article (up to 800 words)",
      "Review of up to 2 social profiles",
      "90-day digital marketing action plan",
    ],
    deliverables: ["Combined report", "Article", "90-day action plan"],
    whoFor: ["Startups and new businesses", "Small businesses wanting a joined-up starting point"],
    delivery: "7–10 business days",
    needFromYou: ["Your website URL", "Google Business Profile manager access", "Links to your social profiles"],
    faqs: [],
  },
];

/** FAQs shared by every package, appended after the package-specific ones. */
export const COMMON_PACKAGE_FAQS: FaqItem[] = [
  {
    q: "When does work start?",
    a: "Work starts once your bank transfer has been verified and we have the details we need. Delivery times are estimates in business days from that point.",
  },
  {
    q: "How do I pay?",
    a: "Complete checkout and you will receive bank transfer details with a unique payment reference. Use that reference so we can match your payment to your order.",
  },
  {
    q: "Can this package be adjusted?",
    a: "Yes. If you need something slightly different, request a custom quote and tell us what you are trying to achieve.",
  },
];

export const getPackageBySlug = (slug: string) => PACKAGES.find((p) => p.slug === slug);
export const getPackagesByCategory = (category: PackageCategory) => PACKAGES.filter((p) => p.category === category);
export const POPULAR_PACKAGES = PACKAGES.filter((p) => p.popular);
export const PACKAGES_BY_PRICE = [...PACKAGES].sort((a, b) => a.price - b.price || a.id - b.id);
