import { NextResponse } from 'next/server'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import type { UserInputs, CalculationResult, LeadData, ReadinessItem } from '@/lib/types'

const COLOR = {
  forest: '#4B8E82',
  forestDark: '#2F6B61',
  forestBg: '#F0F8F6',
  forestBgMid: '#DEF1EC',
  red: '#F43855',
  redBg: '#FEF2F2',
  redText: '#991B1B',
  amber: '#EAB308',
  amberBg: '#FEF3C7',
  amberBorder: '#F3D17E',
  amberText: '#92400E',
  black: '#121213',
  grey700: '#374151',
  grey500: '#6b7280',
  grey400: '#9ca3af',
  grey200: '#E5E7EB',
  grey100: '#F3F4F6',
  white: '#FFFFFF',
} as const

const styles = StyleSheet.create({
  page: {
    paddingTop: 72,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    color: COLOR.black,
  },

  masthead: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 30,
    paddingBottom: 12,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.forest,
  },
  mastheadLogo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR.forest,
    letterSpacing: 2,
  },
  mastheadLabel: {
    fontSize: 8,
    color: COLOR.grey500,
    letterSpacing: 0.5,
  },

  preparedBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  preparedBannerLeft: {
    fontSize: 8,
    color: COLOR.grey700,
    fontWeight: 'bold',
  },
  preparedBannerRight: {
    fontSize: 8,
    color: COLOR.grey500,
    maxWidth: '65%',
    textAlign: 'right',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.black,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 10,
    color: COLOR.grey500,
    marginBottom: 16,
  },

  heroCard: {
    flexDirection: 'row',
    backgroundColor: COLOR.forestBg,
    borderLeftWidth: 4,
    borderLeftColor: COLOR.forest,
    borderRadius: 4,
    padding: 14,
    marginBottom: 16,
  },
  heroCardLeft: {
    flex: 1,
    paddingRight: 10,
  },
  heroLabel: {
    fontSize: 7,
    color: COLOR.forestDark,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR.black,
    marginBottom: 4,
  },
  heroDetail: {
    fontSize: 10,
    color: COLOR.grey700,
    lineHeight: 1.4,
  },
  confidencePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
  },
  pillVerified: {
    backgroundColor: COLOR.forest,
    color: COLOR.white,
  },
  pillBaseline: {
    backgroundColor: COLOR.amberBg,
    color: COLOR.amberText,
  },
  pillTierDefault: {
    backgroundColor: COLOR.grey200,
    color: COLOR.grey700,
  },

  marginWarning: {
    backgroundColor: COLOR.redBg,
    borderLeftWidth: 4,
    borderLeftColor: COLOR.red,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  marginWarningTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLOR.redText,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  marginWarningText: {
    fontSize: 9,
    color: COLOR.redText,
    lineHeight: 1.45,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: COLOR.grey200,
    borderRadius: 4,
    padding: 10,
  },
  statLabel: {
    fontSize: 7,
    color: COLOR.grey500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR.forest,
    marginBottom: 2,
  },
  statValueNeutral: {
    color: COLOR.black,
  },
  statValueAlert: {
    color: COLOR.redText,
  },
  statRangePill: {
    fontSize: 7,
    color: COLOR.grey700,
    marginTop: 5,
    backgroundColor: COLOR.grey100,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 2,
    alignSelf: 'flex-start',
  },

  terminationCard: {
    backgroundColor: COLOR.amberBg,
    borderWidth: 1,
    borderColor: COLOR.amberBorder,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  terminationLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: COLOR.amberText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  terminationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR.black,
    marginBottom: 3,
  },
  terminationDetail: {
    fontSize: 9,
    color: COLOR.grey700,
    marginBottom: 4,
  },
  terminationNote: {
    fontSize: 8,
    fontStyle: 'italic',
    color: COLOR.grey500,
    lineHeight: 1.4,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLOR.forest,
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLOR.forestBgMid,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 'bold',
    color: COLOR.forestDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.grey200,
  },
  tableRowZebra: {
    backgroundColor: COLOR.grey100,
  },
  tableCell: {
    fontSize: 9,
    color: COLOR.grey700,
  },

  intelGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  intelCard: {
    flex: 1,
    backgroundColor: COLOR.grey100,
    padding: 10,
    borderRadius: 4,
  },
  intelLabel: {
    fontSize: 7,
    color: COLOR.grey500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  intelValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLOR.black,
  },
  intelJustification: {
    fontSize: 9,
    fontStyle: 'italic',
    color: COLOR.grey700,
    borderLeftWidth: 2,
    borderLeftColor: COLOR.forest,
    paddingLeft: 8,
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 1.45,
  },

  bulletGroup: {
    marginBottom: 6,
  },
  bulletHeading: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLOR.black,
    marginBottom: 3,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 2,
  },
  bulletDot: {
    fontSize: 9,
    color: COLOR.forest,
    width: 10,
  },
  bulletText: {
    fontSize: 9,
    color: COLOR.grey700,
    flex: 1,
    lineHeight: 1.45,
  },

  readinessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  readinessScoreBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  readinessScoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.forest,
  },
  readinessScoreMax: {
    fontSize: 10,
    color: COLOR.grey500,
    marginLeft: 2,
  },
  readinessTracker: {
    flexDirection: 'row',
    gap: 4,
  },
  readinessTrackerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  readinessItemRow: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  readinessDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
    marginRight: 10,
  },
  readinessItemBody: {
    flex: 1,
  },
  readinessCriterion: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLOR.black,
    marginBottom: 2,
  },
  readinessQuestion: {
    fontSize: 9,
    color: COLOR.grey700,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  readinessDetail: {
    fontSize: 8,
    color: COLOR.grey500,
    lineHeight: 1.45,
  },
  readinessSummary: {
    fontSize: 10,
    color: COLOR.black,
    marginTop: 4,
    padding: 8,
    backgroundColor: COLOR.forestBg,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.forest,
  },

  assumptionsTable: {
    borderWidth: 1,
    borderColor: COLOR.grey200,
    borderRadius: 4,
  },
  assumptionsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.grey200,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  assumptionsRowLast: {
    borderBottomWidth: 0,
  },
  assumptionsRowZebra: {
    backgroundColor: COLOR.grey100,
  },
  assumptionsLabel: {
    width: '45%',
    fontSize: 9,
    color: COLOR.grey500,
  },
  assumptionsValue: {
    width: '55%',
    fontSize: 9,
    color: COLOR.black,
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLOR.grey200,
  },
  footerText: {
    fontSize: 7,
    color: COLOR.grey400,
    maxWidth: '82%',
    lineHeight: 1.4,
  },
  footerPage: {
    fontSize: 7,
    color: COLOR.grey400,
    fontWeight: 'bold',
  },
})

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    GBP: '£', EUR: '€', USD: '$', CHF: 'CHF ', SEK: 'SEK ', DKK: 'DKK ',
    NOK: 'NOK ', PLN: 'PLN ', CZK: 'CZK ', AUD: 'A$', NZD: 'NZ$', SGD: 'S$',
    CAD: 'CA$', AED: 'AED ', ZAR: 'R', BRL: 'R$', MXN: 'MX$', JPY: '¥',
    INR: '₹', KES: 'KES ', RON: 'RON ', HUF: 'HUF ',
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

function confidenceLabel(c: 'verified' | 'baseline' | 'tier_default'): string {
  if (c === 'verified') return 'Advisor-verified'
  if (c === 'baseline') return 'Baseline estimate'
  return 'Regional average'
}

function confidenceFullLabel(c: 'verified' | 'baseline' | 'tier_default'): string {
  if (c === 'verified') return 'Advisor-verified figures'
  if (c === 'baseline') return 'Baseline estimates — contact Teamed to verify'
  return 'Regional tier averages — contact Teamed for country-specific figures'
}

function readinessDotColor(status: ReadinessItem['status']): string {
  if (status === 'green') return COLOR.forest
  if (status === 'amber') return COLOR.amber
  return COLOR.red
}

function recommendationHeadline(
  status: CalculationResult['status'],
  countryName: string,
  threshold: number,
  currentHeadcount: number
): { label: string; detail: string } {
  if (status === 'ABOVE_THRESHOLD') {
    return {
      label: `Move to entity in ${countryName}`,
      detail: `At ${currentHeadcount} employees you are past the economic crossover. Begin transition planning now to capture multi-year savings.`,
    }
  }
  if (status === 'NEAR_THRESHOLD') {
    return {
      label: `Transition window opening in ${countryName}`,
      detail: `You are within 20% of the ${threshold}-employee threshold. Start scoping entity setup, local counsel and payroll provider.`,
    }
  }
  return {
    label: `Stay on EOR in ${countryName}`,
    detail: `EOR remains the efficient path at your current scale. Revisit when headcount approaches the ${threshold}-employee threshold.`,
  }
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

  const crossoverText = result.crossoverMonth
    ? `Month ${result.crossoverMonth}`
    : 'Not within 3 years'

  const crossoverRange =
    result.crossoverMonthLow !== result.crossoverMonth ||
    result.crossoverMonthHigh !== result.crossoverMonth
      ? `${result.crossoverMonthLow ? `M${result.crossoverMonthLow}` : 'none'} – ${
          result.crossoverMonthHigh ? `M${result.crossoverMonthHigh}` : 'none'
        }`
      : null

  const savingsPositive = result.totalSavings >= 0
  const confidencePillStyle =
    country.dataConfidence === 'verified'
      ? styles.pillVerified
      : country.dataConfidence === 'baseline'
        ? styles.pillBaseline
        : styles.pillTierDefault

  const reco = recommendationHeadline(
    result.status,
    country.name,
    result.threshold,
    inputs.currentHeadcount
  )

  const preparedFor = [lead.firstName, lead.companyName].filter(Boolean).join(' · ')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.masthead} fixed>
          <Text style={styles.mastheadLogo}>TEAMED</Text>
          <Text style={styles.mastheadLabel}>
            EOR vs Entity Crossover Memo · {new Date().toLocaleDateString('en-GB')}
          </Text>
        </View>

        <View style={styles.preparedBanner}>
          <Text style={styles.preparedBannerLeft}>
            Prepared on {formatDatePdf(new Date())}
          </Text>
          <Text style={styles.preparedBannerRight}>
            Advisory only — refresh before any board or legal decision. Built on the GEMO Framework.
          </Text>
        </View>

        <Text style={styles.title}>
          {country.flag} {country.name} — EOR vs Entity Analysis
        </Text>
        <Text style={styles.subtitle}>
          {preparedFor ? `Prepared for ${preparedFor}` : 'Prepared for you'} · Tier {country.tier}{' '}
          · {inputs.currentHeadcount} employees today, {inputs.plannedHeadcount} planned in 12 months
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.heroCardLeft}>
            <Text style={styles.heroLabel}>Recommendation</Text>
            <Text style={styles.heroValue}>{reco.label}</Text>
            <Text style={styles.heroDetail}>{reco.detail}</Text>
          </View>
          <Text style={[styles.confidencePill, confidencePillStyle]}>
            {confidenceLabel(country.dataConfidence)}
          </Text>
        </View>

        {result.marginFlag && (
          <View style={styles.marginWarning}>
            <Text style={styles.marginWarningTitle}>Directional only</Text>
            <Text style={styles.marginWarningText}>
              Low and high setup-cost scenarios give opposite recommendations. The cost range
              straddles the decision point — treat this memo as a starting conversation, not a
              final answer. Refine with a local advisor before committing.
            </Text>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Crossover</Text>
            <Text style={[styles.statValue, styles.statValueNeutral]}>{crossoverText}</Text>
            {crossoverRange && (
              <Text style={styles.statRangePill}>Range {crossoverRange}</Text>
            )}
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>3-Year EOR</Text>
            <Text style={[styles.statValue, styles.statValueNeutral]}>
              {formatCurrencyPdf(result.totalEorCost, currency, result.usdTotalEorCost)}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>3-Year Entity</Text>
            <Text style={[styles.statValue, styles.statValueNeutral]}>
              {formatCurrencyPdf(result.totalEntityCost, currency, result.usdTotalEntityCost)}
            </Text>
            <Text style={styles.statRangePill}>
              Range {formatCurrencyPdf(result.totalEntityCostLow, currency)} –{' '}
              {formatCurrencyPdf(result.totalEntityCostHigh, currency)}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>3-Year Savings</Text>
            <Text
              style={[
                styles.statValue,
                savingsPositive ? {} : styles.statValueAlert,
              ]}
            >
              {formatCurrencyPdf(
                Math.abs(result.totalSavings),
                currency,
                result.usdTotalSavings != null ? Math.abs(result.usdTotalSavings) : null
              )}
            </Text>
            <Text style={styles.statRangePill}>
              {savingsPositive ? 'entity saves' : 'EOR wins'} ·{' '}
              {formatCurrencyPdf(result.totalSavingsLow, currency)} –{' '}
              {formatCurrencyPdf(result.totalSavingsHigh, currency)}
            </Text>
          </View>
        </View>

        {country.terminationCostPerEmployee != null && (
          <View style={styles.terminationCard}>
            <Text style={styles.terminationLabel}>If you wind this entity down at month 36</Text>
            <Text style={styles.terminationValue}>
              {formatCurrencyPdf(
                country.terminationCostPerEmployee * inputs.plannedHeadcount,
                currency,
                country.fxToUsd != null
                  ? country.terminationCostPerEmployee * inputs.plannedHeadcount * country.fxToUsd
                  : null
              )}{' '}
              estimated exit cost
            </Text>
            <Text style={styles.terminationDetail}>
              {inputs.plannedHeadcount} employees × {formatCurrencyPdf(country.terminationCostPerEmployee, currency)} per employee
            </Text>
            {country.terminationBasisNote && (
              <Text style={styles.terminationNote}>{country.terminationBasisNote}</Text>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>Cumulative cost by month</Text>
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Month</Text>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Headcount</Text>
            <Text style={[styles.tableHeaderCell, { width: '27.5%' }]}>EOR cumulative</Text>
            <Text style={[styles.tableHeaderCell, { width: '27.5%' }]}>Entity cumulative</Text>
          </View>
          {[1, 6, 12, 18, 24, 30, 36].map((m, idx) => {
            const point =
              result.dataPoints.find((p) => p.month === m) ?? result.dataPoints[m - 1]
            if (!point) return null
            return (
              <View
                key={m}
                style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowZebra : {}]}
              >
                <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>
                  M{point.month}
                </Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>{point.headcount}</Text>
                <Text style={[styles.tableCell, { width: '27.5%' }]}>
                  {formatCurrencyPdf(point.eorCumulative, currency)}
                </Text>
                <Text style={[styles.tableCell, { width: '27.5%' }]}>
                  {formatCurrencyPdf(point.entityCumulative, currency)}
                </Text>
              </View>
            )
          })}
        </View>

        <Text style={styles.sectionTitle}>What you need to know about {country.name}</Text>
        <View style={styles.intelGrid}>
          <View style={styles.intelCard}>
            <Text style={styles.intelLabel}>Complexity</Text>
            <Text style={styles.intelValue}>{country.complexityLabel}</Text>
          </View>
          <View style={styles.intelCard}>
            <Text style={styles.intelLabel}>Threshold (applied)</Text>
            <Text style={styles.intelValue}>{result.threshold} employees</Text>
          </View>
          <View style={styles.intelCard}>
            <Text style={styles.intelLabel}>Entity setup time</Text>
            <Text style={styles.intelValue}>
              {country.setupMonthsLow}–{country.setupMonthsHigh} months
            </Text>
          </View>
        </View>
        {country.thresholdJustification && (
          <Text style={styles.intelJustification}>{country.thresholdJustification}</Text>
        )}

        <View style={styles.bulletGroup}>
          <Text style={styles.bulletHeading}>Key factors</Text>
          {country.complexityFactors.slice(0, 5).map((f, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bulletGroup}>
          <Text style={styles.bulletHeading}>Red flags to review before you decide</Text>
          {country.redFlags.map((f, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{f}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Your transition readiness</Text>
        <View style={styles.readinessHeader}>
          <View style={styles.readinessScoreBlock}>
            <Text style={styles.readinessScoreValue}>{result.readinessScore}</Text>
            <Text style={styles.readinessScoreMax}> / 5 criteria met</Text>
          </View>
          <View style={styles.readinessTracker}>
            {result.readinessItems.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.readinessTrackerDot,
                  { backgroundColor: readinessDotColor(item.status) },
                ]}
              />
            ))}
          </View>
        </View>

        {result.readinessItems.map((item, i) => (
          <View key={i} style={styles.readinessItemRow}>
            <View
              style={[styles.readinessDot, { backgroundColor: readinessDotColor(item.status) }]}
            />
            <View style={styles.readinessItemBody}>
              <Text style={styles.readinessCriterion}>{item.criterion}</Text>
              <Text style={styles.readinessQuestion}>{item.question}</Text>
              <Text style={styles.readinessDetail}>{item.detail}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.readinessSummary}>
          {result.readinessScore >= 4
            ? 'You look ready to move. Talk to Teamed about a transition plan.'
            : result.readinessScore >= 2
              ? "You're getting closer — a few criteria still to address before an entity makes sense."
              : 'Not yet. Stay on EOR and revisit when headcount and plans firm up.'}
        </Text>

        <Text style={styles.sectionTitle}>Your assumptions</Text>
        <View style={styles.assumptionsTable}>
          {[
            {
              label: 'Country',
              value: `${country.flag} ${country.name} (Tier ${country.tier})`,
            },
            { label: 'Current headcount', value: String(inputs.currentHeadcount) },
            {
              label: 'Planned headcount (by month 12)',
              value: String(inputs.plannedHeadcount),
            },
            {
              label: 'Operating language',
              value: inputs.operatesInLocalLanguage
                ? `Native (${country.name}) — threshold ${country.thresholdNative}`
                : `Non-native — threshold ${country.thresholdNonNative} (Language Buffer Rule)`,
            },
            {
              label: 'EOR fee per employee / month',
              value: formatCurrencyPdf(inputs.eorFeePerMonth, currency),
            },
            {
              label: 'Entity setup cost band',
              value: `${formatCurrencyPdf(country.setupCostLow, currency)} – ${formatCurrencyPdf(country.setupCostHigh, currency)} · midpoint ${formatCurrencyPdf(result.setupCostUsed, currency)}`,
            },
            {
              label: 'Ongoing entity cost / employee / year',
              value: formatCurrencyPdf(country.ongoingCostPerEmployeePerYear, currency),
            },
            ...(result.fxSnapshotDate
              ? [{ label: 'FX snapshot (USD comparison)', value: result.fxSnapshotDate }]
              : []),
            {
              label: 'Data confidence',
              value: confidenceFullLabel(country.dataConfidence),
            },
          ].map((row, i, arr) => (
            <View
              key={i}
              style={[
                styles.assumptionsRow,
                i % 2 === 1 ? styles.assumptionsRowZebra : {},
                i === arr.length - 1 ? styles.assumptionsRowLast : {},
              ]}
            >
              <Text style={styles.assumptionsLabel}>{row.label}</Text>
              <Text style={styles.assumptionsValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated by Teamed · teamed.global · Illustrative economics only — not a binding
            quote. Employee thresholds follow GEMO Framework v2.0.
          </Text>
          <Text
            style={styles.footerPage}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}

export async function POST(request: Request) {
  try {
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
