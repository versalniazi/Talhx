import Link from "next/link";
import { ArrowRight, BarChart3, Code2, Globe2, MapPin, Megaphone, PenLine, Search } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { COMPANY, addressLines } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About TALHX LIMITED — UK Digital Marketing & SEO",
  description:
    "TALHX LIMITED provides digital marketing, SEO and digital solutions designed to help UK businesses improve their online presence. Company number 17475450.",
  path: "/about",
});

const AREAS = [
  { icon: Search, title: "SEO", body: "Technical, on-page and content foundations that help search engines understand and present your website." },
  { icon: Globe2, title: "Digital marketing", body: "Joined-up plans across search, content, social and advertising, sized to what a business actually needs." },
  { icon: MapPin, title: "Local visibility", body: "Google Business Profile optimisation, local signals and consistent listings for businesses serving local areas." },
  { icon: PenLine, title: "Content", body: "Original, search-focused writing that answers customer questions and supports key pages." },
  { icon: Megaphone, title: "Paid advertising", body: "Structured Google Ads and Meta campaigns, built for review before any budget is spent." },
  { icon: Code2, title: "Website optimisation", body: "Speed, structure and usability improvements that make websites better for visitors and search engines." },
  { icon: BarChart3, title: "Digital growth", body: "Practical, prioritised recommendations so businesses can grow online step by step." },
];

const PRINCIPLES = [
  { title: "Transparency first", body: "Prices, deliverables and delivery estimates are published for every package before you order." },
  { title: "No unrealistic promises", body: "We don't guarantee rankings, traffic or sales. We commit to doing the agreed work carefully and explaining it clearly." },
  { title: "Accessible to small businesses", body: "Packages start small so businesses can begin with what matters most and build from there." },
  { title: "Your accounts stay yours", body: "You keep ownership of your website, profiles and ad accounts. We only ever ask for the access the work needs." },
];

export default function AboutPage() {
  const details: [string, React.ReactNode][] = [
    ["Legal name", COMPANY.legalName],
    ["Company number", <span key="n" className="font-mono">{COMPANY.companyNumber}</span>],
    ["Company status", COMPANY.companyStatus],
    ["Company type", COMPANY.companyType],
    ["Incorporated", COMPANY.incorporationDateLabel],
    [
      "Registered office",
      <address key="a" className="not-italic">
        {addressLines.join(", ")}
      </address>,
    ],
    [
      "Registered activities (SIC)",
      <ul key="s" className="space-y-1">
        {COMPANY.sicCodes.map((s) => (
          <li key={s.code}>
            <span className="font-mono">{s.code}</span> — {s.label}
          </li>
        ))}
      </ul>,
    ],
  ];

  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About us"
        title="About TALHX LIMITED"
        description="TALHX LIMITED provides digital marketing, SEO and digital solutions designed to help businesses improve their online presence."
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="Who we are" title="A UK digital growth company built around clarity" />
          <div className="space-y-5 text-lg leading-relaxed text-ink-600">
            <p>
              TALHX LIMITED is a private limited company registered in {COMPANY.registeredIn}, with its registered office in Hammersmith, London. We
              work with small businesses, startups, local businesses, e-commerce stores and service businesses that want to be easier to find online.
            </p>
            <p>
              Buying digital marketing can be confusing: vague scopes, unclear pricing and promises that are hard to hold anyone to. Our approach is
              simple — clearly priced packages, clearly defined deliverables and honest explanations of what each service can and can&apos;t do.
            </p>
            <p>
              Alongside marketing services, our registered activities include software publishing and business software development, which reflects
              the technical, website-focused side of our work.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-24" aria-labelledby="areas-heading">
        <div className="container">
          <SectionHeading eyebrow="What we do" title={<span id="areas-heading">Areas we work across</span>} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AREAS.map((a) => (
              <li key={a.title} className="card p-6">
                <a.icon className="h-6 w-6 text-volt-600" aria-hidden="true" />
                <h3 className="mt-4 text-lg text-ink-900">{a.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{a.body}</p>
              </li>
            ))}
            <li className="flex flex-col justify-between rounded-3xl bg-ink-900 p-6 text-white">
              <p className="text-lg">See every service in detail.</p>
              <Link href="/services" className="mt-6 inline-flex items-center gap-1.5 font-medium text-volt-200 hover:text-white">
                Explore Services <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="dark-surface bg-ink-900 py-20 text-white sm:py-24" aria-labelledby="principles-heading">
        <div className="container">
          <SectionHeading dark eyebrow="How we work" title={<span id="principles-heading">Our working principles</span>} />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="bg-ink-900 p-7 sm:p-8">
                <span className="font-mono text-sm text-volt-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-white/60">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24" aria-labelledby="company-heading">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Company details"
            title={<span id="company-heading">Registered company information</span>}
            description="Our details as recorded at Companies House."
          />
          <dl className="divide-y divide-ink-900/10 rounded-3xl border border-ink-900/10">
            {details.map(([k, val]) => (
              <div key={k} className="grid gap-1 p-5 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="text-sm text-ink-500">{k}</dt>
                <dd className="text-ink-900">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-mist py-20" aria-labelledby="proof-heading">
        <div className="container">
          <h2 id="proof-heading" className="sr-only">
            Case studies and reviews
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-dashed border-ink-900/20 p-8 text-center">
              <p className="text-lg font-medium text-ink-900">Case studies coming soon.</p>
              <p className="mt-2 text-ink-600">We&apos;ll publish examples of our work here once projects are complete and clients have agreed to share them.</p>
            </div>
            <div className="rounded-3xl border border-dashed border-ink-900/20 p-8 text-center">
              <p className="text-lg font-medium text-ink-900">Customer reviews will appear here.</p>
              <p className="mt-2 text-ink-600">We only publish genuine reviews from real customers.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
