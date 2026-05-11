import path from 'path'
import { NextResponse } from 'next/server'
import { Document, Font, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import type { UserInputs, CalculationResult, LeadData } from '@/lib/types'
import {
  changesInWindow,
  formatReviewedDate,
  isStale,
} from '@/lib/freshness'
import { convertCurrency } from '@/lib/fx'

/**
 * Font registration for @react-pdf/renderer.
 *
 * Previously this ran at module top. That intermittently failed with
 * "Could not resolve font for Instrument Sans, fontWeight 400" because, with
 * `experimental.serverComponentsExternalPackages: ['@react-pdf/renderer']`,
 * the package's Font registry can end up in a different module instance from
 * the one rendering the PDF after a dev hot-reload.
 *
 * Fix: re-register inside the POST handler. Font.register is idempotent, so
 * re-running it is cheap. Production deployments need the TTFs bundled into
 * the serverless function — see `outputFileTracingIncludes` in next.config.js.
 */
const fontsDir = path.join(process.cwd(), 'public', 'fonts')

function registerFonts() {
  Font.register({
    family: 'General Sans',
    fonts: [
      { src: path.join(fontsDir, 'GeneralSans-Regular.ttf'), fontWeight: 400 },
      { src: path.join(fontsDir, 'GeneralSans-Medium.ttf'), fontWeight: 500 },
      { src: path.join(fontsDir, 'GeneralSans-Semibold.ttf'), fontWeight: 600 },
      { src: path.join(fontsDir, 'GeneralSans-Bold.ttf'), fontWeight: 700 },
    ],
  })

  Font.register({
    family: 'Instrument Sans',
    fonts: [
      { src: path.join(fontsDir, 'InstrumentSans-Regular.ttf'), fontWeight: 400 },
      { src: path.join(fontsDir, 'InstrumentSans-Medium.ttf'), fontWeight: 500 },
      { src: path.join(fontsDir, 'InstrumentSans-Semibold.ttf'), fontWeight: 600 },
      { src: path.join(fontsDir, 'InstrumentSans-Bold.ttf'), fontWeight: 700 },
    ],
  })
}

/**
 * Brand palette — matched to the new Teamed website (Starr Conspiracy rebuild)
 * staging at https://teamed-website-platform.vercel.app/. See
 * tailwind.config.ts for the web equivalent.
 */
const PALETTE = {
  ink: '#121213', // black headings on light
  inkSoft: '#4A4238', // parchment-700 — body
  inkMuted: '#6B6155', // parchment-600 — labels
  inkFade: '#9E9382', // parchment-500 — footer
  surface: '#FAFAF7', // parchment-50
  surfaceSoft: '#F5F1EA', // parchment-100
  hairline: '#E5DDD0', // parchment-300
  brand: '#C4654A', // sienna-500 — primary
  brandDark: '#924530', // sienna-700
  brandSoft: '#F2D9CE', // sienna-100
  brandDeep: '#5C2B1D', // sienna-900
  forest: '#2D3B2D', // forest-700 — deep ink for titles
  sageSoft: '#DFE6D8', // sage-100
  sage: '#5F6F52', // sage-700
  amberSoft: '#F5E6CF', // amber-100
  amberInk: '#6B5235', // amber-900
  warning: '#C79140', // Kraft Yellow
  success: '#5F7F4B', // Postmark Green
  successDot: '#8B9E7E', // sage-500
} as const

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Instrument Sans',
    fontSize: 10,
    color: PALETTE.ink,
    lineHeight: 1.5,
    backgroundColor: PALETTE.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontFamily: 'General Sans',
    fontSize: 18,
    fontWeight: 700,
    color: PALETTE.brand,
  },
  memoLabel: {
    fontSize: 10,
    color: PALETTE.inkMuted,
  },
  title: {
    fontFamily: 'General Sans',
    fontSize: 20,
    fontWeight: 700,
    color: PALETTE.forest,
    marginBottom: 16,
  },
  preparedFor: {
    fontSize: 12,
    marginBottom: 24,
    color: PALETTE.inkSoft,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 16,
  },
  statBox: {
    width: '48%',
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: PALETTE.surfaceSoft,
  },
  statLabel: {
    fontSize: 9,
    color: PALETTE.inkMuted,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'General Sans',
    fontSize: 14,
    fontWeight: 700,
    color: PALETTE.forest,
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 20,
    color: PALETTE.inkSoft,
  },
  countryIntel: {
    fontSize: 10,
    marginBottom: 16,
  },
  readiness: {
    fontSize: 10,
    marginBottom: 24,
    color: PALETTE.inkSoft,
  },
  sectionTitle: {
    fontFamily: 'General Sans',
    fontSize: 12,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 8,
    color: PALETTE.forest,
  },
  bulletList: {
    fontSize: 9,
    marginBottom: 8,
    color: PALETTE.inkSoft,
  },
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  checklistDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    marginTop: 5,
  },
  dataTable: {
    fontSize: 9,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: PALETTE.inkFade,
    textAlign: 'center',
  },
  memoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 9,
  },
  memoHeaderLeft: {
    color: PALETTE.inkSoft,
  },
  memoHeaderRight: {
    color: PALETTE.inkMuted,
    maxWidth: '65%',
    textAlign: 'right',
  },
  memoHeaderRule: {
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.brand,
    marginBottom: 16,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 600,
    marginBottom: 12,
  },
  confidenceVerified: {
    backgroundColor: PALETTE.sageSoft,
    color: PALETTE.sage,
  },
  confidenceBaseline: {
    backgroundColor: PALETTE.amberSoft,
    color: PALETTE.amberInk,
  },
  confidenceTierDefault: {
    backgroundColor: PALETTE.surfaceSoft,
    color: PALETTE.inkSoft,
  },
  marginWarning: {
    backgroundColor: PALETTE.brandSoft,
    borderLeftWidth: 3,
    borderLeftColor: PALETTE.brandDark,
    padding: 8,
    marginBottom: 16,
    fontSize: 9,
    color: PALETTE.brandDeep,
  },
  statRange: {
    fontSize: 8,
    color: PALETTE.inkMuted,
    marginTop: 2,
  },
  terminationBlock: {
    borderWidth: 1,
    borderColor: PALETTE.brand,
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    backgroundColor: PALETTE.brandSoft,
  },
  footnote: {
    fontSize: 8,
    fontStyle: 'italic',
    color: PALETTE.inkMuted,
    marginLeft: 6,
    marginTop: 2,
    marginBottom: 4,
  },
  assumptionsBlock: {
    marginTop: 12,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: PALETTE.hairline,
  },
  assumptionsRow: {
    flexDirection: 'row',
    fontSize: 9,
    marginBottom: 3,
    color: PALETTE.inkSoft,
  },
  assumptionsLabel: {
    width: '40%',
    color: PALETTE.inkMuted,
  },
  assumptionsValue: {
    width: '60%',
    color: PALETTE.ink,
  },
  reviewedDate: {
    fontSize: 8,
    color: PALETTE.inkMuted,
    marginTop: -8,
    marginBottom: 12,
  },
  planningWindowWarning: {
    backgroundColor: PALETTE.amberSoft,
    borderLeftWidth: 3,
    borderLeftColor: PALETTE.warning,
    padding: 8,
    marginBottom: 16,
    fontSize: 9,
    color: PALETTE.amberInk,
  },
  upcomingChangeRow: {
    marginBottom: 8,
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: PALETTE.warning,
  },
  upcomingChangeTitle: {
    fontFamily: 'General Sans',
    fontSize: 10,
    fontWeight: 700,
    color: PALETTE.forest,
    marginBottom: 2,
  },
  upcomingChangeDate: {
    fontSize: 8,
    color: PALETTE.inkMuted,
    marginBottom: 2,
  },
  upcomingChangeSummary: {
    fontSize: 9,
    color: PALETTE.inkSoft,
    lineHeight: 1.4,
  },
  justificationSummary: {
    fontFamily: 'General Sans',
    fontSize: 10,
    fontWeight: 700,
    color: PALETTE.forest,
    marginTop: 4,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  justificationSection: {
    fontSize: 9,
    color: PALETTE.inkSoft,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  justificationSectionHeading: {
    fontWeight: 700,
    color: PALETTE.ink,
  },
})

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    GBP: '£',
    EUR: '€',
    USD: '$',
    CHF: 'CHF ',
    SEK: 'SEK ',
    DKK: 'DKK ',
    NOK: 'NOK ',
    PLN: 'PLN ',
    CZK: 'CZK ',
    AUD: 'A$',
    NZD: 'NZ$',
    SGD: 'S$',
    CAD: 'CA$',
    AED: 'AED ',
    ZAR: 'R',
    BRL: 'R$',
    MXN: 'MX$',
    JPY: '¥',
    INR: '₹',
    KES: 'KES ',
    RON: 'RON ',
    HUF: 'HUF ',
  }
  return symbols[currency] ?? currency + ' '
}

function formatAmountWithSymbol(amount: number, symbol: string): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(amount) >= 10_000) {
    return `${symbol}${Math.round(amount / 1000)}k`
  }
  return `${symbol}${Math.round(amount).toLocaleString()}`
}

function formatCurrencyPdf(amount: number, currency: string, amountUsd?: number | null): string {
  const local = formatAmountWithSymbol(amount, getCurrencySymbol(currency))
  if (amountUsd == null || currency === 'USD') return local
  const usd = formatAmountWithSymbol(amountUsd, '$')
  return `${local} (~${usd})`
}

function formatDatePdf(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function confidenceBadgeLabel(confidence: 'verified' | 'baseline' | 'tier_default'): string {
  if (confidence === 'verified') return 'Advisor-verified figures'
  if (confidence === 'baseline') return 'Baseline estimates, contact Teamed to verify'
  return 'Regional tier averages, contact Teamed for country-specific figures'
}

function CrossoverMemoDoc({
  inputs,
  result,
  lead,
}: {
  inputs: UserInputs
  result: CalculationResult
  lead: LeadData
}) {
  const country = inputs.country!
  const currency = country.currency
  const stale = isStale(country.lastReviewedDate)
  const upcoming = changesInWindow(country.upcomingChanges, 36)
  const materialUpcoming = upcoming.filter((c) => c.impact !== 'informational')

  const crossoverText = result.crossoverMonth
    ? `Month ${result.crossoverMonth}`
    : 'Not within 3 years'

  let summaryText = ''
  if (result.status === 'ABOVE_THRESHOLD') {
    summaryText = `Based on your inputs, ${lead.companyName} is currently past the economic crossover point in ${country.name}. At ${inputs.currentHeadcount} employees, an entity would save approximately ${formatCurrencyPdf(result.totalSavings, currency)} over the next 3 years compared to your current EOR arrangement.`
  } else if (result.status === 'NEAR_THRESHOLD') {
    summaryText = `Based on your inputs, ${lead.companyName} is approaching the crossover point in ${country.name}. Now is the time to begin transition planning.`
  } else if (result.status === 'WORTH_CONVERSATION') {
    summaryText = `Based on your inputs, ${lead.companyName} is inside the band where a transition conversation pays off in ${country.name}. The maths still favours EOR at ${inputs.currentHeadcount} employees, but the ${result.threshold}-employee threshold is close enough that planning conversations are worth the time.`
  } else {
    summaryText = `Based on your inputs, ${lead.companyName} is currently best served by EOR in ${country.name}. Review when headcount reaches ${result.threshold}.`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>TEAMED</Text>
          <Text style={styles.memoLabel}>
            Crossover Memo · {new Date().toLocaleDateString('en-GB')}
          </Text>
        </View>

        <View style={styles.memoHeader}>
          <Text style={styles.memoHeaderLeft}>Prepared on {formatDatePdf(new Date())}</Text>
          <Text style={styles.memoHeaderRight}>
            Based on inputs submitted at this date. Advisory only, refresh before any board or legal decision.
          </Text>
        </View>
        <View style={styles.memoHeaderRule} />

        <Text style={styles.title}>EOR vs Entity Analysis, {country.name}</Text>
        <Text style={styles.preparedFor}>
          Prepared for: {lead.firstName}, {lead.companyName}
        </Text>

        <Text
          style={[
            styles.confidenceBadge,
            country.dataConfidence === 'verified' && !stale
              ? styles.confidenceVerified
              : stale || country.dataConfidence === 'baseline'
                ? styles.confidenceBaseline
                : styles.confidenceTierDefault,
          ]}
        >
          {country.dataConfidence === 'verified' && stale
            ? `Advisor-verified, refresh due, ${country.name}`
            : country.dataConfidence === 'baseline' && stale
              ? `Baseline estimates, refresh due, ${country.name}`
              : `${confidenceBadgeLabel(country.dataConfidence)}, ${country.name}`}
        </Text>

        {country.lastReviewedDate && (
          <Text style={styles.reviewedDate}>
            Last reviewed {formatReviewedDate(country.lastReviewedDate)}
          </Text>
        )}

        {result.marginFlag && (
          <Text style={styles.marginWarning}>
            The cost range straddles the decision point. Low and high setup-cost scenarios give
            opposite recommendations. Treat this memo as directional, not determinative, refine
            with a local advisor before committing.
          </Text>
        )}

        {materialUpcoming.length > 0 && (
          <Text style={styles.planningWindowWarning}>
            Heads-up: {materialUpcoming.length === 1 ? 'a regulatory change' : `${materialUpcoming.length} regulatory changes`} land
            inside your 3-year planning window (earliest:{' '}
            {formatReviewedDate(materialUpcoming[0].effectiveDate)}). See &quot;What&apos;s changing
            ahead&quot; below for the impact on your Crossover Point.
          </Text>
        )}

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Crossover Month</Text>
            <Text style={styles.statValue}>{crossoverText}</Text>
            {(result.crossoverMonthLow !== result.crossoverMonth ||
              result.crossoverMonthHigh !== result.crossoverMonth) && (
              <Text style={styles.statRange}>
                Range: {result.crossoverMonthLow ? `M${result.crossoverMonthLow}` : 'none'} –{' '}
                {result.crossoverMonthHigh ? `M${result.crossoverMonthHigh}` : 'none'}
              </Text>
            )}
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>3-Year EOR Cost</Text>
            <Text style={styles.statValue}>
              {formatCurrencyPdf(result.totalEorCost, currency, result.usdTotalEorCost)}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>3-Year Entity Cost</Text>
            <Text style={styles.statValue}>
              {formatCurrencyPdf(result.totalEntityCost, currency, result.usdTotalEntityCost)}
            </Text>
            <Text style={styles.statRange}>
              Range: {formatCurrencyPdf(result.totalEntityCostLow, currency)} –{' '}
              {formatCurrencyPdf(result.totalEntityCostHigh, currency)}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>3-Year Savings</Text>
            <Text style={styles.statValue}>
              {formatCurrencyPdf(Math.abs(result.totalSavings), currency, result.usdTotalSavings != null ? Math.abs(result.usdTotalSavings) : null)}
              {result.totalSavings >= 0 ? ' saved' : ' more with EOR'}
            </Text>
            <Text style={styles.statRange}>
              Range: {formatCurrencyPdf(result.totalSavingsLow, currency)} –{' '}
              {formatCurrencyPdf(result.totalSavingsHigh, currency)}
            </Text>
          </View>
        </View>

        <Text style={styles.summary}>{summaryText}</Text>

        {country.terminationCostPerEmployee != null && (
          <View style={styles.terminationBlock}>
            <Text style={{ fontFamily: 'General Sans', fontSize: 11, fontWeight: 700, color: PALETTE.brandDeep, marginBottom: 4 }}>
              If you wind the entity down at month 36
            </Text>
            <Text style={{ fontSize: 10, color: PALETTE.inkSoft, marginBottom: 4 }}>
              Estimated exit cost:{' '}
              {formatCurrencyPdf(
                country.terminationCostPerEmployee * inputs.plannedHeadcount,
                currency,
                country.fxToUsd != null
                  ? country.terminationCostPerEmployee * inputs.plannedHeadcount * country.fxToUsd
                  : null
              )}{' '}
              ({inputs.plannedHeadcount} employees × {formatCurrencyPdf(country.terminationCostPerEmployee, currency)} per employee)
            </Text>
            {country.terminationBasisNote && (
              <Text style={styles.footnote}>{country.terminationBasisNote}</Text>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>Crossover data (cumulative costs)</Text>
        <View style={styles.dataTable}>
          {[1, 6, 12, 18, 24, 30, 36].map((m) => {
            const point = result.dataPoints.find((p) => p.month === m) ?? result.dataPoints[m - 1]
            if (!point) return null
            return (
              <Text key={m} style={styles.bulletList}>
                Month {point.month}: EOR {formatCurrencyPdf(point.eorCumulative, currency)} · Entity{' '}
                {formatCurrencyPdf(point.entityCumulative, currency)}
              </Text>
            )
          })}
        </View>

        <Text style={styles.sectionTitle}>What you need to know about {country.name}</Text>
        <Text style={styles.bulletList}>Setup complexity: {country.complexityLabel}</Text>
        <Text style={styles.bulletList}>
          Teamed recommends considering an entity from {result.threshold} employees
        </Text>
        {country.thresholdJustification &&
          (typeof country.thresholdJustification === 'string' ? (
            <Text style={styles.footnote}>{country.thresholdJustification}</Text>
          ) : (
            <View>
              <Text style={styles.justificationSummary}>
                {country.thresholdJustification.summary}
              </Text>
              {country.thresholdJustification.sections?.map((section, i) => (
                <Text key={i} style={styles.justificationSection}>
                  <Text style={styles.justificationSectionHeading}>{section.heading} — </Text>
                  {section.body}
                </Text>
              ))}
            </View>
          ))}
        <Text style={styles.bulletList}>
          {country.setupMonthsLow}–{country.setupMonthsHigh} months to establish a legal entity
        </Text>
        <Text style={styles.bulletList}>Key factors:</Text>
        {country.complexityFactors.map((f, i) => (
          <Text key={i} style={styles.bulletList}>
            • {f}
          </Text>
        ))}
        <Text style={styles.bulletList}>Red flags to review:</Text>
        {country.redFlags.map((f, i) => (
          <Text key={i} style={styles.bulletList}>
            • {f}
          </Text>
        ))}

        {upcoming.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>What&apos;s changing ahead</Text>
            {upcoming.map((change, i) => (
              <View key={i} style={styles.upcomingChangeRow}>
                <Text style={styles.upcomingChangeDate}>
                  Effective {formatReviewedDate(change.effectiveDate)}
                </Text>
                <Text style={styles.upcomingChangeTitle}>{change.title}</Text>
                <Text style={styles.upcomingChangeSummary}>{change.summary}</Text>
                {change.source && (
                  <Text style={styles.upcomingChangeDate}>Source: {change.source}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Your transition readiness</Text>
        {result.readinessItems.map((item, i) => (
          <View key={i} style={styles.checklistItem}>
            <View
              style={[
                styles.checklistDot,
                {
                  backgroundColor:
                    item.status === 'green'
                      ? PALETTE.successDot
                      : item.status === 'amber'
                        ? PALETTE.warning
                        : PALETTE.brandDark,
                },
              ]}
            />
            <View>
              <Text style={{ fontSize: 9, fontWeight: 600, color: PALETTE.forest }}>
                {item.criterion}
              </Text>
              <Text style={styles.bulletList}>{item.question}</Text>
              <Text style={styles.bulletList}>{item.detail}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.readiness}>
          You meet {result.readinessScore}/5 transition criteria.
          {result.readinessScore >= 4
            ? ' You look ready to move.'
            : result.readinessScore >= 2
              ? " You're getting closer, a few things to address."
              : ' Not yet, stay on EOR and review when you grow.'}
        </Text>

        <View style={styles.assumptionsBlock}>
          <Text style={styles.sectionTitle}>Your assumptions</Text>
          <View style={styles.assumptionsRow}>
            <Text style={styles.assumptionsLabel}>Country</Text>
            <Text style={styles.assumptionsValue}>
              {country.flag} {country.name} (Tier {country.tier})
            </Text>
          </View>
          <View style={styles.assumptionsRow}>
            <Text style={styles.assumptionsLabel}>Current headcount</Text>
            <Text style={styles.assumptionsValue}>{inputs.currentHeadcount}</Text>
          </View>
          <View style={styles.assumptionsRow}>
            <Text style={styles.assumptionsLabel}>Planned headcount (by month 12)</Text>
            <Text style={styles.assumptionsValue}>{inputs.plannedHeadcount}</Text>
          </View>
          <View style={styles.assumptionsRow}>
            <Text style={styles.assumptionsLabel}>Operating language</Text>
            <Text style={styles.assumptionsValue}>
              {inputs.operatesInLocalLanguage
                ? `Native (${country.name}), threshold ${country.thresholdNative}`
                : `Non-native, threshold ${country.thresholdNonNative} (Language Buffer Rule applied)`}
            </Text>
          </View>
          <View style={styles.assumptionsRow}>
            <Text style={styles.assumptionsLabel}>EOR fee per employee / month</Text>
            <Text style={styles.assumptionsValue}>
              {formatCurrencyPdf(inputs.eorFeePerMonth, currency)}
              {inputs.eorFeeCurrency && inputs.eorFeeCurrency !== currency
                ? ` (entered as ${formatCurrencyPdf(
                    Math.round(
                      convertCurrency(inputs.eorFeePerMonth, currency, inputs.eorFeeCurrency)
                    ),
                    inputs.eorFeeCurrency
                  )})`
                : ''}
            </Text>
          </View>
          <View style={styles.assumptionsRow}>
            <Text style={styles.assumptionsLabel}>Entity setup cost band (midpoint used)</Text>
            <Text style={styles.assumptionsValue}>
              {formatCurrencyPdf(country.setupCostLow, currency)} –{' '}
              {formatCurrencyPdf(country.setupCostHigh, currency)} (midpoint{' '}
              {formatCurrencyPdf(result.setupCostUsed, currency)})
            </Text>
          </View>
          <View style={styles.assumptionsRow}>
            <Text style={styles.assumptionsLabel}>Ongoing entity cost / employee / year</Text>
            <Text style={styles.assumptionsValue}>
              {formatCurrencyPdf(country.ongoingCostPerEmployeePerYear, currency)}
            </Text>
          </View>
          {result.fxSnapshotDate && (
            <View style={styles.assumptionsRow}>
              <Text style={styles.assumptionsLabel}>FX snapshot (for USD comparison)</Text>
              <Text style={styles.assumptionsValue}>{result.fxSnapshotDate}</Text>
            </View>
          )}
          <View style={styles.assumptionsRow}>
            <Text style={styles.assumptionsLabel}>Data confidence</Text>
            <Text style={styles.assumptionsValue}>
              {confidenceBadgeLabel(country.dataConfidence)}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated by Teamed · teamed.global · Employee thresholds follow the Graduation Model.
          Illustrative economics only, not a binding quote. Contact Teamed for a personalised
          assessment.
        </Text>
      </Page>
    </Document>
  )
}

export async function POST(request: Request) {
  try {
    // Re-register fonts on every request. With Next.js + @react-pdf and
    // experimental.serverComponentsExternalPackages, the Font registry can be
    // reset between hot-reloads in dev. Idempotent and cheap given the buffers
    // are cached at module load.
    registerFonts()

    const body = await request.json()
    const { inputs, result, lead } = body as {
      inputs: UserInputs
      result: CalculationResult
      lead: LeadData
    }

    if (!inputs?.country || !result || !lead) {
      console.error('[generate-pdf] Missing inputs, result, or lead')
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const doc = <CrossoverMemoDoc inputs={inputs} result={result} lead={lead} />
    const streamOrBuffer = await pdf(doc).toBuffer()
    let pdfBase64: string
    if (Buffer.isBuffer(streamOrBuffer) || streamOrBuffer instanceof Uint8Array) {
      pdfBase64 = Buffer.from(streamOrBuffer as Buffer).toString('base64')
    } else {
      const arrBuf = await new Response(
        streamOrBuffer as unknown as ReadableStream
      ).arrayBuffer()
      pdfBase64 = Buffer.from(new Uint8Array(arrBuf)).toString('base64')
    }

    return NextResponse.json({ success: true, pdfBase64 })
  } catch (err) {
    console.error('[generate-pdf]', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
