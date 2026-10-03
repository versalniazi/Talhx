export const BLOG_CATEGORIES = [
  "SEO",
  "Local SEO",
  "Digital Marketing",
  "Content Marketing",
  "Social Media",
  "Google Ads",
  "Business Growth",
  "Website Optimization",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  publishedAt: string; // ISO date
  readingMinutes: number;
  relatedService: string; // service slug
  body: BlogBlock[];
}

export const BLOG_AUTHOR = "TALHX Editorial Team";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "seo-basics-for-small-businesses",
    title: "SEO Basics for Small Businesses: Where to Start",
    description:
      "A practical introduction to search engine optimisation for small UK businesses — what matters, what to fix first and what to avoid.",
    category: "SEO",
    publishedAt: "2026-10-01",
    readingMinutes: 5,
    relatedService: "seo",
    body: [
      { type: "p", text: "Search engine optimisation (SEO) can feel complicated, but the foundations are straightforward. Search engines want to show people pages that are relevant, trustworthy and easy to use. Your job is to make it as clear as possible what each page is about and to remove anything that gets in the way." },
      { type: "h2", text: "1. Make sure your pages can be found" },
      { type: "p", text: "Before a page can appear in search results, it has to be discovered and indexed. Check that your important pages are not blocked by robots.txt or a noindex tag, and that you have an XML sitemap submitted in Google Search Console. Search Console is free and shows which pages are indexed and any problems found." },
      { type: "h2", text: "2. Give every important page a clear focus" },
      { type: "p", text: "Each key page should target one main topic. A plumber, for example, might have separate pages for boiler repairs, bathroom installations and emergency call-outs rather than listing everything on the homepage. This helps both visitors and search engines understand what you offer." },
      { type: "ul", items: ["Write a unique, descriptive title tag for every page", "Use one H1 heading that describes the page", "Break content into sections with logical H2 and H3 headings", "Answer the questions customers ask before buying"] },
      { type: "h2", text: "3. Fix the technical basics" },
      { type: "p", text: "You do not need to be a developer to spot common technical problems. Broken links, slow mobile pages and duplicate pages are among the most frequent issues on small business websites. A technical check will surface these quickly." },
      { type: "h2", text: "4. Be patient and avoid shortcuts" },
      { type: "p", text: "SEO is a long-term investment. Be cautious of anyone promising guaranteed rankings or offering to sell you thousands of links — these tactics break search engine guidelines and can damage your website's visibility." },
      { type: "tip", text: "Not sure where your site stands? Start with a focused audit so you can prioritise the fixes that matter most." },
    ],
  },
  {
    slug: "google-business-profile-checklist",
    title: "A Google Business Profile Checklist for Local Businesses",
    description:
      "Use this checklist to make your Google Business Profile complete, accurate and ready for local search.",
    category: "Local SEO",
    publishedAt: "2026-09-30",
    readingMinutes: 4,
    relatedService: "local-seo",
    body: [
      { type: "p", text: "For many local businesses, a Google Business Profile is the first impression a customer sees. A complete and accurate profile helps people decide whether to call, visit or click through to your website." },
      { type: "h2", text: "The essentials" },
      { type: "ul", items: ["Business name exactly as it appears in the real world — no added keywords", "The most specific primary category that describes your business", "Accurate address, or service areas if you visit customers", "Opening hours, including holiday hours", "Phone number and website link"] },
      { type: "h2", text: "Details that add clarity" },
      { type: "ul", items: ["A clear business description explaining what you do and who you help", "Services or products listed with short descriptions", "Relevant attributes, such as accessibility information", "Recent, genuine photos of your premises, team or work"] },
      { type: "h2", text: "Reviews" },
      { type: "p", text: "Ask genuine customers for reviews and respond to them professionally — including critical ones. Never offer incentives for reviews or post reviews yourself; this breaks Google's policies and UK consumer protection law." },
      { type: "h2", text: "Keep it consistent" },
      { type: "p", text: "Make sure your name, address and phone number match exactly across your profile, website and directory listings. Inconsistencies can confuse customers and search engines." },
      { type: "tip", text: "Review your profile every few months. Hours, services and photos go out of date faster than most businesses expect." },
    ],
  },
  {
    slug: "building-a-simple-digital-marketing-plan",
    title: "How to Build a Simple Digital Marketing Plan",
    description:
      "A lightweight framework for planning your digital marketing without a large team or budget.",
    category: "Digital Marketing",
    publishedAt: "2026-09-29",
    readingMinutes: 5,
    relatedService: "web-development",
    body: [
      { type: "p", text: "A digital marketing plan does not need to be a long document. For most small businesses, a single page that answers a few key questions is more useful than a complex strategy nobody reads." },
      { type: "h2", text: "Step 1: Define one clear goal" },
      { type: "p", text: "Pick the outcome that matters most over the next three months — for example more enquiries from your website, more calls from local customers, or more online orders. Everything else in the plan should support that goal." },
      { type: "h2", text: "Step 2: Know who you are trying to reach" },
      { type: "p", text: "Describe your ideal customer in a few sentences: what they need, where they look for solutions and what might stop them from choosing you." },
      { type: "h2", text: "Step 3: Choose two or three channels" },
      { type: "p", text: "Rather than trying everything, pick the channels that match how your customers search. A local trade business may focus on Google Business Profile and local SEO; an online shop may focus on product page SEO and social media." },
      { type: "h2", text: "Step 4: Set a realistic routine" },
      { type: "ul", items: ["Weekly: respond to reviews and messages, post on social media", "Monthly: publish or update one piece of website content", "Quarterly: review what is working and adjust the plan"] },
      { type: "h2", text: "Step 5: Measure what matters" },
      { type: "p", text: "Use free tools such as Google Search Console and Google Analytics to track progress towards your goal. Focus on enquiries and sales rather than vanity metrics." },
      { type: "tip", text: "Keep your plan to one page and revisit it every quarter. A simple plan you follow beats a perfect plan you don't." },
    ],
  },
  {
    slug: "writing-blog-posts-that-answer-search-intent",
    title: "Writing Blog Posts That Answer Search Intent",
    description:
      "How to plan and write blog content that matches what searchers are actually looking for.",
    category: "Content Marketing",
    publishedAt: "2026-09-28",
    readingMinutes: 5,
    relatedService: "content-marketing",
    body: [
      { type: "p", text: "Search intent is the reason behind a search. Someone searching \"how to unblock a sink\" wants instructions; someone searching \"emergency plumber Hammersmith\" wants to hire someone now. Content that matches intent is far more likely to be useful — and to perform well in search." },
      { type: "h2", text: "The main types of search intent" },
      { type: "ul", items: ["Informational — the searcher wants to learn something", "Commercial — the searcher is comparing options", "Transactional — the searcher is ready to buy or book", "Navigational — the searcher is looking for a specific website"] },
      { type: "h2", text: "Check what already ranks" },
      { type: "p", text: "Search for your target keyword and look at the first page of results. Are they guides, product pages, lists or videos? This tells you what format searchers and search engines expect." },
      { type: "h2", text: "Structure your article" },
      { type: "ol", items: ["Answer the main question early", "Use clear headings for each sub-topic", "Add examples relevant to your customers", "Finish with a helpful next step"] },
      { type: "h2", text: "Write for people first" },
      { type: "p", text: "Use the language your customers use, explain jargon and keep paragraphs short. Include your target keyword naturally in the title, introduction and headings — but never at the expense of readability." },
      { type: "tip", text: "Before writing, list the five questions a customer is most likely to have about the topic. Make sure your article answers all of them." },
    ],
  },
  {
    slug: "social-media-for-local-businesses",
    title: "Social Media for Local Businesses: A Realistic Approach",
    description:
      "How small and local businesses can use social media consistently without it taking over their week.",
    category: "Social Media",
    publishedAt: "2026-09-27",
    readingMinutes: 4,
    relatedService: "social-media",
    body: [
      { type: "p", text: "Social media can help local businesses stay visible and build trust, but it is easy to spend hours on it without a clear plan. A realistic approach focuses on consistency and relevance rather than volume." },
      { type: "h2", text: "Choose the right platforms" },
      { type: "p", text: "Most local businesses do not need to be everywhere. Choose one or two platforms where your customers already spend time — often Facebook and Instagram for consumer businesses, or LinkedIn for business-to-business services." },
      { type: "h2", text: "Plan content themes" },
      { type: "ul", items: ["Behind the scenes — your team, premises or process", "Helpful tips related to your service", "Recent work or new products", "Local news, events and community involvement", "Offers and announcements"] },
      { type: "h2", text: "Batch your content" },
      { type: "p", text: "Set aside time once a fortnight or once a month to create and schedule posts in advance. Native scheduling tools in Meta Business Suite make this straightforward." },
      { type: "h2", text: "Engage, don't just broadcast" },
      { type: "p", text: "Reply to comments and messages promptly. Social media works best as a conversation, and responsiveness reflects well on your business." },
      { type: "tip", text: "Avoid buying followers or engagement. It inflates numbers without reaching real customers and can harm how platforms show your content." },
    ],
  },
  {
    slug: "google-ads-setup-mistakes",
    title: "Common Google Ads Setup Mistakes (and How to Avoid Them)",
    description:
      "Avoid wasted budget by getting the fundamentals of your first Google Ads campaign right.",
    category: "Google Ads",
    publishedAt: "2026-09-26",
    readingMinutes: 5,
    relatedService: "paid-advertising",
    body: [
      { type: "p", text: "Google Ads can put your business in front of people searching for exactly what you offer — but a poorly structured campaign can spend budget quickly on irrelevant clicks. These are some of the most common setup mistakes." },
      { type: "h2", text: "1. Using broad keywords without negatives" },
      { type: "p", text: "Broad keywords can match a wide range of searches. Without negative keywords, a \"boiler repair\" ad might show for \"boiler repair jobs\" or \"DIY boiler repair\". Review the search terms report regularly and add negatives." },
      { type: "h2", text: "2. Targeting the wrong locations" },
      { type: "p", text: "Check location settings carefully. By default, campaigns can include people who have shown interest in a location, not just people located there. For local businesses, target people in or regularly in your service area." },
      { type: "h2", text: "3. Sending everyone to the homepage" },
      { type: "p", text: "Send each ad group to the most relevant page on your site. If someone searches for a specific service, land them on that service page with a clear way to contact you." },
      { type: "h2", text: "4. Not tracking conversions" },
      { type: "p", text: "Without conversion tracking, you cannot tell which keywords lead to enquiries or sales. Set up tracking for form submissions, calls or purchases before you start spending." },
      { type: "h2", text: "5. Launching without a review" },
      { type: "p", text: "Build campaigns in a paused state and check everything — ads, keywords, budgets and locations — before going live." },
      { type: "tip", text: "Start with a modest budget and a tightly focused campaign. Expand once you understand what is working." },
    ],
  },
  {
    slug: "questions-to-ask-before-hiring-a-digital-marketing-provider",
    title: "Questions to Ask Before Hiring a Digital Marketing Provider",
    description:
      "Practical questions that help you compare digital marketing providers and avoid unrealistic promises.",
    category: "Business Growth",
    publishedAt: "2026-09-25",
    readingMinutes: 4,
    relatedService: "seo",
    body: [
      { type: "p", text: "Choosing a digital marketing provider is an important decision for a growing business. Asking the right questions up front helps you understand exactly what you are paying for." },
      { type: "h2", text: "What exactly will be delivered?" },
      { type: "p", text: "Ask for a clear list of deliverables and timeframes. \"SEO services\" can mean anything from a short report to months of ongoing work." },
      { type: "h2", text: "Do you guarantee results?" },
      { type: "p", text: "Be cautious of guaranteed rankings, traffic or sales. Search engines and advertising platforms control results, so honest providers explain what they will do rather than promising outcomes they cannot control." },
      { type: "h2", text: "Who owns the work and accounts?" },
      { type: "p", text: "Make sure you retain ownership of your website, content, Google Business Profile and advertising accounts. Providers should be given access, not ownership." },
      { type: "h2", text: "How will we communicate?" },
      { type: "p", text: "Agree how and when you will receive updates, and what information the provider will need from you." },
      { type: "h2", text: "What are the payment and cancellation terms?" },
      { type: "ul", items: ["Is the price fixed or variable?", "Is there a minimum term for monthly services?", "What happens if you need to cancel?"] },
      { type: "tip", text: "Clear pricing and clear deliverables make it much easier to judge whether a service is good value." },
    ],
  },
  {
    slug: "website-speed-quick-wins",
    title: "Website Speed: Quick Wins for Small Business Websites",
    description:
      "Simple, practical steps to help your website load faster on mobile and desktop.",
    category: "Website Optimization",
    publishedAt: "2026-09-24",
    readingMinutes: 4,
    relatedService: "web-development",
    body: [
      { type: "p", text: "Page speed affects how visitors experience your website, particularly on mobile connections. Google also uses page experience signals, including Core Web Vitals, as part of how it evaluates pages." },
      { type: "h2", text: "Measure first" },
      { type: "p", text: "Use Google PageSpeed Insights to test your key pages. Focus on the specific opportunities it lists rather than chasing a perfect score." },
      { type: "h2", text: "Optimise images" },
      { type: "ul", items: ["Resize images to the size they are displayed", "Use modern formats such as WebP or AVIF", "Compress images before uploading", "Lazy-load images that appear further down the page"] },
      { type: "h2", text: "Reduce unnecessary scripts" },
      { type: "p", text: "Plugins, chat widgets, tracking tags and embedded content can all slow pages down. Remove anything you no longer use and load non-essential scripts after the main content." },
      { type: "h2", text: "Use caching and a good host" },
      { type: "p", text: "Browser and server caching help repeat visits load faster. If your hosting is slow even for simple pages, upgrading your hosting plan may make a noticeable difference." },
      { type: "tip", text: "Re-test after every change so you know exactly what made a difference." },
    ],
  },
];

export const getPostBySlug = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);
export const categorySlug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");
