import Link from 'next/link'
import type { Metadata } from 'next'

// Copy Revision v0.2.1 — 21st April 2026
// Brand-aligned to Teamed Brand Kit (AirOps 13640): Chloé voice, Crossover Economics,
// Graduation Model, GEMO (Global Employment Management and Operations), no em dashes,
// UK English, sentence case headings.

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
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-forest/5 via-grey-light to-pastel-purple/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#4B8E8220,transparent)]" />
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-pastel-red/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-pastel-purple/20 blur-3xl" />
          <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
            <h1 className="font-heading font-bold text-black text-4xl sm:text-5xl leading-tight mb-6">
              When does EOR stop being the right structure?
            </h1>
            <p className="font-sans text-xl text-gray-700 leading-relaxed mb-10">
              Find the exact month an owned entity becomes cheaper than EOR. Modelled on
              Crossover Economics, the data layer behind the Graduation Model we&apos;ve applied
              advising over 1,000 companies across 187+ countries.
            </p>
            <Link
              href="/calculator"
              className="inline-block bg-forest text-white rounded-btn px-8 py-4 font-heading font-bold text-lg hover:bg-forest-dark transition-colors shadow-lg shadow-forest/25"
            >
              Calculate your Crossover Point
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-heading font-bold text-black text-2xl text-center mb-14">
              How it works
            </h2>
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-forest/5 to-transparent border border-forest/10">
                <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center mb-4 text-white shadow-md">
                  <span className="font-heading font-bold text-xl">1</span>
                </div>
                <h3 className="font-heading font-bold text-black mb-2">
                  Tell us where you&apos;re hiring
                </h3>
                <p className="font-sans text-gray-600 text-sm">
                  Select your country and enter your current and planned headcount.
                </p>
                <div className="hidden sm:block absolute top-14 -right-4 w-8 h-0.5 bg-forest/40" aria-hidden />
              </div>
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-forest-dark/5 to-transparent border border-forest-dark/20">
                <div className="w-14 h-14 rounded-full bg-forest-dark flex items-center justify-center mb-4 text-white shadow-md">
                  <span className="font-heading font-bold text-xl">2</span>
                </div>
                <h3 className="font-heading font-bold text-black mb-2">
                  We model the Crossover Economics
                </h3>
                <p className="font-sans text-gray-600 text-sm">
                  EOR cost against entity cost over 36 months, using real setup and ongoing
                  costs by country.
                </p>
                <div className="hidden sm:block absolute top-14 -right-4 w-8 h-0.5 bg-forest-dark/40" />
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-pastel-purple/20 to-transparent border border-pastel-purple/30">
                <div className="w-14 h-14 rounded-full bg-pastel-purple flex items-center justify-center mb-4 text-white shadow-md">
                  <span className="font-heading font-bold text-xl">3</span>
                </div>
                <h3 className="font-heading font-bold text-black mb-2">
                  See your Crossover Point
                </h3>
                <p className="font-sans text-gray-600 text-sm">
                  The exact month, the three-year savings, and a Crossover Memo you can take
                  to your board.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA again — outline style */}
        <section className="py-12 bg-grey-light">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Link
              href="/calculator"
              className="inline-block border-2 border-black text-black rounded-btn px-8 py-4 font-heading font-bold text-lg hover:bg-black hover:text-white transition-colors"
            >
              Calculate your Crossover Point
            </Link>
          </div>
        </section>

        {/* SEO content */}
        <section className="py-16 bg-white border-t border-grey-mid">
          <article className="max-w-3xl mx-auto px-6">
            <h2 className="font-heading font-bold text-black text-2xl mb-6">
              What is the EOR to entity Crossover Point?
            </h2>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              The Crossover Point is the month where running your own legal entity becomes
              cheaper than staying on an Employer of Record. Before it, EOR is usually the
              right structure. You avoid setup costs, payroll infrastructure, and compliance
              overhead. Past it, the fixed costs of an entity spread across enough employees
              that in-house employment pulls ahead. Most companies never calculate this
              number. They stay on EOR long past the point where it serves them, or rush into
              entity setup before the maths supports it.
            </p>

            <h2 className="font-heading font-bold text-black text-2xl mt-10 mb-6">
              Why the Graduation Model matters
            </h2>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              Contractor, EOR, owned entity. That&apos;s the Graduation Model we&apos;ve
              watched companies move through. Knowing your Crossover Point lets you plan the
              move instead of reacting to it. Start too late and you overpay for months.
              Start too early and you tie up management attention before the savings land.
              The calculator gives you the target month so you can work backwards.
            </p>

            <h2 className="font-heading font-bold text-black text-2xl mt-10 mb-6">
              How country complexity tiers affect the decision
            </h2>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              Not every country is the same. Straightforward markets have earlier Crossover
              Points and simpler setups. Complex markets push the Crossover Point out and
              often mean EOR stays the right structure for longer. Operating in the local
              language reduces compliance friction and pulls the threshold down. The
              calculator applies country-specific data and asks whether your team works in
              the local language, so the model reflects your actual situation.
            </p>

            <h2 className="font-heading font-bold text-black text-2xl mt-10 mb-6">
              What is GEMO?
            </h2>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              GEMO, Global Employment Management and Operations, is our term for the full
              scope of global employment. Not just EOR. It covers entity setup, payroll
              registration, statutory compliance, and governance. One system, one
              relationship, from first hire to your own presence in-country. For companies
              past their Crossover Point, GEMO is the practical path off EOR without
              re-onboarding employees or switching vendors.
            </p>
          </article>
        </section>

        {/* Tom pull quote — standalone break before FAQ */}
        <section className="py-16 bg-grey-light">
          <div className="max-w-3xl mx-auto px-6">
            <figure className="border-l-4 border-forest pl-6 sm:pl-8">
              <blockquote className="font-heading font-bold text-black text-2xl sm:text-3xl leading-snug mb-6">
                &ldquo;It&rsquo;s a dirty little hidden secret. Tons of people are on EOR when
                they should be managing their own entity. It&rsquo;s not in any EOR
                provider&rsquo;s interest to move you off the model, so they don&rsquo;t.&rdquo;
              </blockquote>
              <figcaption className="font-sans text-gray-500 text-sm">
                Tom Price-Daniel, Co-founder and CRO, Teamed
              </figcaption>
            </figure>
          </div>
        </section>

        {/* FAQ with schema */}
        <section
          className="py-16 bg-gradient-to-b from-pastel-red/5 to-grey-light"
          aria-labelledby="faq-heading"
        >
          <div className="max-w-3xl mx-auto px-6">
            <h2
              id="faq-heading"
              className="font-heading font-bold text-black text-2xl text-center mb-12"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <details className="group bg-white rounded-card border border-forest/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <summary className="font-heading font-bold text-black cursor-pointer list-none flex justify-between items-center">
                  When should I set up my own entity vs stay on EOR?
                  <span className="text-forest group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="font-sans text-gray-700 mt-4 leading-relaxed">
                  It depends on headcount concentration, trajectory, and commitment. If you
                  have enough employees in one country to pass the Crossover Point inside a
                  reasonable timeframe, typically twelve to twenty-four months, and headcount
                  is growing or stable, an entity usually makes sense. If you&apos;re below
                  the threshold or headcount is flat or declining, EOR is usually still the
                  right structure. The calculator shows your exact Crossover Point so you can
                  decide with numbers rather than a guess.
                </p>
              </details>
              <details className="group bg-white rounded-card border border-forest-dark/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <summary className="font-heading font-bold text-black cursor-pointer list-none flex justify-between items-center">
                  How does EOR vs entity cost comparison work?
                  <span className="text-forest-dark group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="font-sans text-gray-700 mt-4 leading-relaxed">
                  EOR charges a per-employee fee each month. Entity costs include an upfront
                  setup, plus ongoing payroll, compliance, and local infrastructure. Over 36
                  months, entity costs are front-loaded. EOR costs accumulate linearly. The
                  Crossover Point is where cumulative entity cost falls below cumulative EOR
                  cost. The model uses real setup estimates and ongoing costs for each
                  country covered.
                </p>
              </details>
              <details className="group bg-white rounded-card border border-pastel-purple/30 p-6 shadow-sm hover:shadow-md transition-shadow">
                <summary className="font-heading font-bold text-black cursor-pointer list-none flex justify-between items-center">
                  How many employees before I should consider my own entity?
                  <span className="text-pastel-purple group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="font-sans text-gray-700 mt-4 leading-relaxed">
                  It varies by country. In Straightforward jurisdictions, the threshold is
                  often five to ten employees. In Complex markets, it can sit between fifteen
                  and twenty-five. The threshold also depends on whether you operate in the
                  local language, because that reduces compliance complexity. The calculator
                  applies country-specific thresholds and your headcount, so you see the
                  exact point where an entity becomes the right structure.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Footer CTA — dark section, ghost CTA */}
        <section className="py-12 bg-black text-white">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-sans text-gray-300 mb-4">
              Ready to see your Crossover Point?
            </p>
            <Link
              href="/calculator"
              className="inline-block border-2 border-white text-white rounded-btn px-8 py-4 font-heading font-bold text-lg hover:bg-white hover:text-black transition-colors"
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
                  text: 'It varies by country. In Straightforward jurisdictions, the threshold is often five to ten employees. In Complex markets, it can sit between fifteen and twenty-five. The threshold also depends on whether you operate in the local language, because that reduces compliance complexity. The calculator applies country-specific thresholds and your headcount, so you see the exact point where an entity becomes the right structure.',
                },
              },
            ],
          }),
        }}
      />
    </>
  )
}
