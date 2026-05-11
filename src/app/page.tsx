import Link from 'next/link'
import type { Metadata } from 'next'

// Copy Revision v0.3.0 — 11th May 2026
// Reskinned to match the new Teamed website (Starr Conspiracy rebuild) at
// https://teamed-website-platform.vercel.app/. Warm parchment palette,
// sienna CTAs, editorial typography. Voice unchanged (Chloé). UK English,
// sentence case headings, no em dashes.

export const metadata: Metadata = {
  title:
    'EOR vs entity crossover calculator | When EOR stops being the right structure | Teamed',
  description:
    'Crossover Economics, modelled for your country and headcount. See the month an owned entity becomes cheaper than EOR. Built on the Graduation Model applied across 187+ countries.',
  openGraph: {
    title: 'EOR vs entity crossover calculator | Teamed',
    description:
      'See the month an owned entity becomes cheaper than EOR. Modelled on Crossover Economics and the Graduation Model.',
  },
}

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-parchment-50">
        {/* Hero */}
        <section className="relative">
          <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
            <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-sienna-700 mb-6">
              The EOR that tells you when to stop using EOR.
            </p>
            <h1 className="font-heading font-bold text-forest-700 text-4xl sm:text-5xl leading-tight mb-6">
              EOR works. Until the maths says it doesn&apos;t.
            </h1>
            <p className="font-sans text-lg sm:text-xl text-parchment-700 leading-relaxed mb-10">
              The signals that say it&apos;s time to look beyond EOR. Modelled on Crossover
              Economics, applied across 1,000+ companies and 187+ countries.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/calculator"
                className="inline-block bg-sienna-500 text-white rounded-btn px-8 py-4 font-heading font-bold text-lg hover:bg-sienna-700 transition-colors shadow-cta hover:shadow-cta-hover"
              >
                Calculate your Crossover Point
              </Link>
              <a
                href="#learn-more"
                className="group inline-flex items-center gap-2 font-sans text-base font-semibold text-sienna-700 hover:text-sienna-900 px-6 py-4 rounded-btn border border-sienna-500/60 hover:border-sienna-700 hover:bg-sienna-100/40 transition-colors"
              >
                Learn more
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                >
                  <path
                    d="M7 2v9M3 7l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 bg-parchment-100 border-y border-parchment-300">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-heading font-bold text-forest-700 text-2xl sm:text-3xl text-center mb-14">
              How it works
            </h2>
            <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
              <div className="rounded-2xl overflow-hidden bg-parchment-50 border border-parchment-300 shadow-card">
                <div className="h-3 bg-amber-500" />
                <div className="p-7">
                  <p className="font-script text-sienna-700 text-2xl leading-none mb-3">Step 1.</p>
                  <h3 className="font-heading font-bold text-forest-700 text-lg mb-3">
                    Tell us where you&apos;re hiring
                  </h3>
                  <p className="font-sans text-parchment-700 text-sm leading-relaxed">
                    Select your country and enter your current and planned headcount.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden bg-parchment-50 border border-parchment-300 shadow-card">
                <div className="h-3 bg-sienna-500" />
                <div className="p-7">
                  <p className="font-script text-sienna-700 text-2xl leading-none mb-3">Step 2.</p>
                  <h3 className="font-heading font-bold text-forest-700 text-lg mb-3">
                    We model the Crossover Economics
                  </h3>
                  <p className="font-sans text-parchment-700 text-sm leading-relaxed">
                    EOR cost against entity cost over 36 months, using real setup and ongoing
                    costs by country.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden bg-parchment-50 border border-parchment-300 shadow-card">
                <div className="h-3 bg-sage-500" />
                <div className="p-7">
                  <p className="font-script text-sienna-700 text-2xl leading-none mb-3">Step 3.</p>
                  <h3 className="font-heading font-bold text-forest-700 text-lg mb-3">
                    See your Crossover Point
                  </h3>
                  <p className="font-sans text-parchment-700 text-sm leading-relaxed">
                    The exact month, the three-year economics, and a Crossover Memo you can take
                    to your board.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip — who already chose this way */}
        <section className="py-20 bg-parchment-50">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="font-script text-sienna-900 text-xl sm:text-2xl mb-3">
              ↓ and here&apos;s who already chose this way
            </p>
            <h2 className="font-heading font-bold text-forest-700 text-3xl sm:text-4xl leading-tight mb-5">
              Built for the teams that{' '}
              <span className="text-sienna-700">do this for real.</span>
            </h2>
            <p className="font-sans text-parchment-700 max-w-2xl mx-auto mb-12">
              From F1 paddocks in Grove to fintechs in Stockholm, from Big-Four challengers in
              the UK to design unicorns in San Francisco. Finance, people and legal teams trust
              Teamed to run their global hiring.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { file: 'klarna.png', name: 'Klarna', tagline: 'Buy-now-pay-later · fintech', scale: 'Sweden · ~5,000 emp' },
                { file: 'wise.png', name: 'Wise', tagline: 'Cross-border payments', scale: 'United Kingdom · ~5,500 emp' },
                { file: 'notion.png', name: 'Notion', tagline: 'Connected workspace · SaaS', scale: 'United States · ~800 emp' },
                { file: 'biontech.png', name: 'BioNTech', tagline: 'Immunotherapy · pharma', scale: 'Germany · ~6,000 emp' },
                { file: 'eventbrite.webp', name: 'Eventbrite', tagline: 'Events & ticketing', scale: 'United States · ~700 emp' },
                { file: 'williams-racing.webp', name: 'Williams Racing', tagline: 'Formula 1 · Grove HQ', scale: 'United Kingdom · ~1,000 emp' },
                { file: 'bdo.png', name: 'BDO', tagline: 'Top-5 audit & advisory', scale: 'UK / EU / Global · ~115,000 emp' },
                { file: 'personio.png', name: 'Personio', tagline: 'HR platform · DACH', scale: 'Germany · ~2,200 emp' },
                { file: 'goat.webp', name: 'GOAT', tagline: 'Sneaker & fashion marketplace', scale: 'US & Europe · ~1,800 emp' },
                { file: 'globant.webp', name: 'Globant', tagline: 'IT & engineering', scale: 'Argentina · ~33,000 emp' },
              ].map((c) => (
                <div
                  key={c.file}
                  className="bg-parchment-100 border border-parchment-300 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center"
                >
                  <div className="h-10 sm:h-12 w-full flex items-center justify-center mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/customers/${c.file}`}
                      alt={`${c.name} logo`}
                      className="max-h-full max-w-[120px] object-contain"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-script text-sienna-900 text-base sm:text-lg leading-tight mb-2">
                    {c.tagline}
                  </p>
                  <p className="font-sans text-parchment-700 text-[10px] sm:text-[11px] uppercase tracking-wider leading-tight">
                    {c.scale}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-script text-sienna-900 text-xl sm:text-2xl mt-12">
              + dozens more across <span className="text-sienna-700">UK · EU · US</span>, picked
              Teamed for the same Crossover Economics.
            </p>
          </div>
        </section>

        {/* Second-chance CTA */}
        <section className="py-20 bg-parchment-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-heading font-bold text-forest-700 text-2xl sm:text-3xl mb-3">
              See your Crossover Point in 2 minutes
            </h2>
            <p className="font-sans text-parchment-700 mb-8">
              Country-specific data, three-year economics, and a Crossover Memo you can share.
            </p>
            <Link
              href="/calculator"
              className="inline-block bg-sienna-500 text-white rounded-btn px-8 py-4 font-heading font-bold text-lg hover:bg-sienna-700 transition-colors shadow-cta hover:shadow-cta-hover"
            >
              Calculate your Crossover Point
            </Link>
          </div>
        </section>

        {/* Tom pull quote */}
        <section className="py-20 bg-parchment-100 border-y border-parchment-300">
          <div className="max-w-3xl mx-auto px-6">
            <figure className="border-l-4 border-sienna-500 pl-6 sm:pl-8">
              <blockquote className="font-heading font-bold text-forest-700 text-2xl sm:text-3xl leading-snug mb-6">
                &ldquo;It&rsquo;s a dirty little hidden secret. Tons of people are on EOR when they
                should be managing their own entity. It&rsquo;s not in any EOR provider&rsquo;s
                interest to move you off the model, so they don&rsquo;t.&rdquo;
              </blockquote>
              <figcaption className="font-script text-sienna-900 text-2xl leading-none">
                Tom Price-Daniel, Co-founder and CRO, Teamed
              </figcaption>
            </figure>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="learn-more"
          className="py-20 bg-parchment-50"
          aria-labelledby="faq-heading"
        >
          <div className="max-w-3xl mx-auto px-6">
            <h2
              id="faq-heading"
              className="font-heading font-bold text-forest-700 text-2xl sm:text-3xl text-center mb-12"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              <details className="group bg-parchment-100 rounded-card border border-parchment-300 p-6 hover:shadow-card transition-shadow">
                <summary className="font-heading font-bold text-forest-700 cursor-pointer list-none flex justify-between items-center gap-4">
                  What is the Graduation Model?
                  <span className="text-sienna-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="font-sans text-parchment-700 mt-4 leading-relaxed">
                  Contractor, EOR, owned entity. That&apos;s the Graduation Model we&apos;ve
                  watched companies move through. The Crossover Point is the month where running
                  your own legal entity becomes cheaper than staying on EOR. The calculator gives
                  you that target month so you can plan the move instead of reacting to it, or
                  jumping too early before the maths supports it.
                </p>
              </details>
              <details className="group bg-parchment-100 rounded-card border border-parchment-300 p-6 hover:shadow-card transition-shadow">
                <summary className="font-heading font-bold text-forest-700 cursor-pointer list-none flex justify-between items-center gap-4">
                  When should I set up my own entity vs stay on EOR?
                  <span className="text-sienna-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="font-sans text-parchment-700 mt-4 leading-relaxed">
                  It depends on headcount concentration, trajectory, and commitment. If you have
                  enough employees in one country to pass the Crossover Point inside a reasonable
                  timeframe, typically twelve to twenty-four months, and headcount is growing or
                  stable, an entity usually makes sense. If you&apos;re below the threshold or
                  headcount is flat or declining, EOR is usually still the right structure. The
                  calculator shows your exact Crossover Point so you can decide with numbers
                  rather than a guess.
                </p>
              </details>
              <details className="group bg-parchment-100 rounded-card border border-parchment-300 p-6 hover:shadow-card transition-shadow">
                <summary className="font-heading font-bold text-forest-700 cursor-pointer list-none flex justify-between items-center gap-4">
                  How does EOR vs entity cost comparison work?
                  <span className="text-sienna-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="font-sans text-parchment-700 mt-4 leading-relaxed">
                  EOR charges a per-employee fee each month. Entity costs include an upfront
                  setup, plus ongoing payroll, compliance, and local infrastructure. Over 36
                  months, entity costs are front-loaded. EOR costs accumulate linearly. The
                  Crossover Point is where cumulative entity cost falls below cumulative EOR
                  cost. The model uses real setup estimates and ongoing costs for each country
                  covered.
                </p>
              </details>
              <details className="group bg-parchment-100 rounded-card border border-parchment-300 p-6 hover:shadow-card transition-shadow">
                <summary className="font-heading font-bold text-forest-700 cursor-pointer list-none flex justify-between items-center gap-4">
                  How many employees before I should consider my own entity?
                  <span className="text-sienna-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="font-sans text-parchment-700 mt-4 leading-relaxed">
                  It varies by country complexity. In straightforward markets, typically from 10
                  employees in the local language, or 13 to 15 if not. In moderate markets, 15 to
                  20 / 20 to 30. In complex markets, 25 to 35 / 35 to 50 if operating in another
                  language. The calculator applies these thresholds per country and combines them
                  with your 3-year EOR vs entity economics.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-20 bg-parchment-900 text-parchment-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-heading font-bold text-parchment-50 text-2xl sm:text-3xl mb-3">
              Stop guessing when to graduate off EOR
            </h2>
            <p className="font-sans text-parchment-300 mb-8">
              The Crossover Point gives you the target month. Two minutes, no signup until you
              want the memo.
            </p>
            <Link
              href="/calculator"
              className="inline-block bg-parchment-50 text-parchment-900 rounded-btn px-8 py-4 font-heading font-bold text-lg hover:bg-white transition-colors shadow-lg"
            >
              Calculate your Crossover Point
            </Link>
          </div>
        </section>
      </main>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is the Graduation Model?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Contractor, EOR, owned entity. That's the Graduation Model we've watched companies move through. The Crossover Point is the month where running your own legal entity becomes cheaper than staying on EOR. The calculator gives you that target month so you can plan the move instead of reacting to it, or jumping too early before the maths supports it.",
                },
              },
              {
                '@type': 'Question',
                name: 'When should I set up my own entity vs stay on EOR?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "It depends on headcount concentration, trajectory, and commitment. If you have enough employees in one country to pass the Crossover Point inside a reasonable timeframe, typically twelve to twenty-four months, and headcount is growing or stable, an entity usually makes sense. If you're below the threshold or headcount is flat or declining, EOR is usually still the right structure. The calculator shows your exact Crossover Point so you can decide with numbers rather than a guess.",
                },
              },
              {
                '@type': 'Question',
                name: 'How does EOR vs entity cost comparison work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'EOR charges a per-employee fee each month. Entity costs include an upfront setup, plus ongoing payroll, compliance, and local infrastructure. Over 36 months, entity costs are front-loaded. EOR costs accumulate linearly. The Crossover Point is where cumulative entity cost falls below cumulative EOR cost. The model uses real setup estimates and ongoing costs for each country covered.',
                },
              },
              {
                '@type': 'Question',
                name: 'How many employees before I should consider my own entity?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'It varies by country complexity. In straightforward markets, typically from 10 employees in the local language, or 13 to 15 if not. In moderate markets, 15 to 20 / 20 to 30. In complex markets, 25 to 35 / 35 to 50 if operating in another language. The calculator applies these thresholds per country and combines them with your 3-year EOR vs entity economics.',
                },
              },
            ],
          }),
        }}
      />
    </>
  )
}
