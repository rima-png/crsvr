import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'When does EOR stop making sense? | EOR vs Entity Crossover Calculator | Teamed',
  description:
    'Find the exact month where setting up your own entity becomes cheaper than EOR. Free. 60 seconds. Based on data from 1,000+ companies across 70+ countries.',
  openGraph: {
    title: 'When does EOR stop making sense? | Teamed',
    description:
      'Find the exact month where setting up your own entity becomes cheaper than EOR. Free. 60 seconds.',
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
              When does EOR stop making sense?
            </h1>
            <p className="font-sans text-xl text-gray-700 leading-relaxed mb-10">
              Find the exact month where setting up your own entity becomes cheaper than EOR. Free.
              60 seconds. Based on data from 1,000+ companies across 70+ countries.
            </p>
            <Link
              href="/calculator"
              className="inline-block bg-forest text-white rounded-btn px-8 py-4 font-heading font-bold text-lg hover:bg-forest-dark transition-colors shadow-lg shadow-forest/25"
            >
              Calculate your crossover point
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
                <h3 className="font-heading font-bold text-black mb-2">Tell us where and how many</h3>
                <p className="font-sans text-gray-600 text-sm">
                  Select your country and enter your current and planned headcount.
                </p>
                <div className="hidden sm:block absolute top-14 -right-4 w-8 h-0.5 bg-forest/40" aria-hidden />
              </div>
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-forest-dark/5 to-transparent border border-forest-dark/20">
                <div className="w-14 h-14 rounded-full bg-forest-dark flex items-center justify-center mb-4 text-white shadow-md">
                  <span className="font-heading font-bold text-xl">2</span>
                </div>
                <h3 className="font-heading font-bold text-black mb-2">We model the economics</h3>
                <p className="font-sans text-gray-600 text-sm">
                  EOR cost vs entity cost over 3 years, using real setup and ongoing costs.
                </p>
                <div className="hidden sm:block absolute top-14 -right-4 w-8 h-0.5 bg-forest-dark/40" />
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-pastel-purple/20 to-transparent border border-pastel-purple/30">
                <div className="w-14 h-14 rounded-full bg-pastel-purple flex items-center justify-center mb-4 text-white shadow-md">
                  <span className="font-heading font-bold text-xl">3</span>
                </div>
                <h3 className="font-heading font-bold text-black mb-2">See your crossover point</h3>
                <p className="font-sans text-gray-600 text-sm">
                  The exact month and cumulative savings — plus a downloadable crossover memo.
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
              Calculate your crossover point
            </Link>
          </div>
        </section>

        {/* SEO content */}
        <section className="py-16 bg-white border-t border-grey-mid">
          <article className="max-w-3xl mx-auto px-6">
            <h2 className="font-heading font-bold text-black text-2xl mb-6">
              What is the EOR to entity crossover point?
            </h2>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              The EOR to entity crossover point is the moment when the total cost of running your own
              legal entity becomes lower than the total cost of staying on an Employer of Record
              (EOR). Up until that month, EOR is typically more economical because you avoid setup
              costs, compliance overhead, and local payroll infrastructure. Once you pass the
              crossover, the fixed costs of an entity are spread across enough employees that
              in-house employment becomes cheaper.
            </p>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              Most companies never calculate this number. They either stay on EOR indefinitely,
              paying per-employee fees that add up, or they rush into entity setup before the
              economics justify it. The crossover point is different for every country, every
              headcount, and every EOR fee — which is why a data-driven calculator matters.
            </p>

            <h2 className="font-heading font-bold text-black text-2xl mt-10 mb-6">
              Why does it matter?
            </h2>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              Knowing your crossover point helps you plan instead of react. Companies that stay on
              EOR past the crossover often overpay by tens or hundreds of thousands over three years.
              Those that move too early face unnecessary complexity and setup costs before the
              economics justify it. The sweet spot is aligning your transition timeline with the
              exact month where entity becomes cheaper — and preparing in advance so you can move
              smoothly when the time comes.
            </p>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              Beyond cost, timing affects your team. Entity setup can take 3–12 months depending on
              jurisdiction. If you start too late, you overpay for months. If you start too early,
              you tie up resources and management attention before the payoff. Our calculator gives
              you the target month so you can work backwards and plan your entity readiness,
              compliance, and transition support.
            </p>

            <h2 className="font-heading font-bold text-black text-2xl mt-10 mb-6">
              How do country complexity tiers affect the decision?
            </h2>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              Not all countries are equal. Teamed uses complexity tiers (Straightforward, Moderate,
              Complex) based on setup time, regulatory burden, and ongoing compliance. In
              straightforward jurisdictions, the crossover may occur earlier and the move is simpler.
              In complex markets, setup can take longer and cost more, pushing the crossover out and
              making EOR attractive for a longer period. Our calculator factors in country-specific
              setup costs and timelines so you get a realistic crossover month for your target
              market.
            </p>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              Language matters too. Operating in the local language often reduces compliance
              complexity and can lower the recommended threshold. The calculator asks whether you
              operate in the local language and adjusts the crossover and threshold accordingly.
              Whether you&apos;re expanding into one country or many, understanding these tiers helps
              you prioritise where to set up entities first.
            </p>

            <h2 className="font-heading font-bold text-black text-2xl mt-10 mb-6">
              What is GEMO?
            </h2>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              GEMO (Global Entity & Employment Operations) is Teamed&apos;s framework for owning and
              managing your own legal entities abroad. It covers entity setup, employer IDs, payroll
              registration, statutory compliance, and governance — all on a single platform. GEMO
              sits at the mature end of the global employment journey: after contractors and EOR, it
              represents full ownership and control.
            </p>
            <p className="font-sans text-gray-700 leading-relaxed mb-4">
              For companies past the crossover point, GEMO offers a smooth transition from EOR
              without re-onboarding, with a bridge period where both models can run in parallel
              during entity setup. You get one unified platform for contractors, EOR hires, and owned
              entities — simplifying payroll, invoicing, and compliance across your global footprint.
              If your calculator shows you&apos;re past the crossover, downloading the GEMO framework
              is a practical next step to understand the transition path.
            </p>
          </article>
        </section>

        {/* FAQ with schema */}
        <section className="py-16 bg-gradient-to-b from-pastel-red/5 to-grey-light" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto px-6">
            <h2 id="faq-heading" className="font-heading font-bold text-black text-2xl text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <details className="group bg-white rounded-card border border-forest/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <summary className="font-heading font-bold text-black cursor-pointer list-none flex justify-between items-center">
                  When should I set up my own entity vs stay on EOR?
                  <span className="text-forest group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="font-sans text-gray-700 mt-4 leading-relaxed">
                  The decision depends on headcount concentration, economics, and commitment. If you
                  have enough employees in one country to pass the crossover point within a
                  reasonable timeframe (often 12–24 months), and your headcount is growing or
                  stable, an entity typically makes sense. If you&apos;re below the threshold or
                  headcount is flat or declining, EOR usually remains the better option. Use our
                  calculator to see your exact crossover month.
                </p>
              </details>
              <details className="group bg-white rounded-card border border-forest-dark/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <summary className="font-heading font-bold text-black cursor-pointer list-none flex justify-between items-center">
                  How does EOR vs entity cost comparison work?
                  <span className="text-forest-dark group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="font-sans text-gray-700 mt-4 leading-relaxed">
                  EOR charges a per-employee fee each month. Entity costs include an upfront setup
                  plus ongoing payroll, compliance, and infrastructure. Over 36 months, entity costs
                  are front-loaded; EOR costs accumulate linearly. The crossover is when cumulative
                  entity cost falls below cumulative EOR cost. Our model uses real setup estimates
                  and ongoing costs from 70+ countries.
                </p>
              </details>
              <details className="group bg-white rounded-card border border-pastel-purple/30 p-6 shadow-sm hover:shadow-md transition-shadow">
                <summary className="font-heading font-bold text-black cursor-pointer list-none flex justify-between items-center">
                  How many employees before I should consider my own entity?
                  <span className="text-pastel-purple group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="font-sans text-gray-700 mt-4 leading-relaxed">
                  It varies by country. In straightforward jurisdictions, the threshold is often 5–10
                  employees. In more complex markets, it can be 15–25. The threshold also depends on
                  whether you operate in the local language (reducing compliance complexity). Our
                  calculator uses country-specific thresholds and your headcount to show exactly when
                  an entity becomes cost-effective.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Footer CTA — dark section, ghost CTA */}
        <section className="py-12 bg-black text-white">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-sans text-gray-300 mb-4">
              Ready to see your crossover point?
            </p>
            <Link
              href="/calculator"
              className="inline-block border-2 border-white text-white rounded-btn px-8 py-4 font-heading font-bold text-lg hover:bg-white hover:text-black transition-colors"
            >
              Calculate your crossover point
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
                  text: "The decision depends on headcount concentration, economics, and commitment. If you have enough employees in one country to pass the crossover point within a reasonable timeframe (often 12–24 months), and your headcount is growing or stable, an entity typically makes sense. If you're below the threshold or headcount is flat or declining, EOR usually remains the better option. Use our calculator to see your exact crossover month.",
                },
              },
              {
                '@type': 'Question',
                name: 'How does EOR vs entity cost comparison work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'EOR charges a per-employee fee each month. Entity costs include an upfront setup plus ongoing payroll, compliance, and infrastructure. Over 36 months, entity costs are front-loaded; EOR costs accumulate linearly. The crossover is when cumulative entity cost falls below cumulative EOR cost. Our model uses real setup estimates and ongoing costs from 70+ countries.',
                },
              },
              {
                '@type': 'Question',
                name: 'How many employees before I should consider my own entity?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "It varies by country. In straightforward jurisdictions, the threshold is often 5–10 employees. In more complex markets, it can be 15–25. The threshold also depends on whether you operate in the local language (reducing compliance complexity). Our calculator uses country-specific thresholds and your headcount to show exactly when an entity becomes cost-effective.",
                },
              },
            ],
          }),
        }}
      />
    </>
  )
}
