import { NextResponse } from 'next/server'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import type { UserInputs, CalculationResult, LeadData } from '@/lib/types'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B8E82',
  },
  memoLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  preparedFor: {
    fontSize: 12,
    marginBottom: 24,
    color: '#374151',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 16,
  },
  statBox: {
    width: '48%',
    border: '1px solid #4B8E82',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121213',
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 20,
    color: '#374151',
  },
  countryIntel: {
    fontSize: 10,
    marginBottom: 16,
  },
  readiness: {
    fontSize: 10,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#121213',
  },
  bulletList: {
    fontSize: 9,
    marginBottom: 8,
    color: '#374151',
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
    color: '#9ca3af',
    textAlign: 'center',
  },
  memoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 9,
  },
  memoHeaderLeft: {
    color: '#374151',
  },
  memoHeaderRight: {
    color: '#6b7280',
    maxWidth: '65%',
    textAlign: 'right',
  },
  memoHeaderRule: {
    borderBottomWidth: 1,
    borderBottomColor: '#4B8E82',
    marginBottom: 16,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  confidenceVerified: {
    backgroundColor: '#DEF1EC',
    color: '#2F6B61',
  },
  confidenceBaseline: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  confidenceTierDefault: {
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
  },
  marginWarning: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 3,
    borderLeftColor: '#F43855',
    padding: 8,
    marginBottom: 16,
    fontSize: 9,
    color: '#991B1B',
  },
  statRange: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },
  terminationBlock: {
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#FEF2F2',
  },
  footnote: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#6b7280',
    marginLeft: 6,
    marginTop: 2,
    marginBottom: 4,
  },
  assumptionsBlock: {
    marginTop: 12,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  assumptionsRow: {
    flexDirection: 'row',
    fontSize: 9,
    marginBottom: 3,
    color: '#374151',
  },
  assumptionsLabel: {
    width: '40%',
    color: '#6b7280',
  },
  assumptionsValue: {
    width: '60%',
    color: '#121213',
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
  if (confidence === 'baseline') return 'Baseline estimates — contact Teamed to verify'
  return 'Regional tier averages — contact Teamed for country-specific figures'
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

  let summaryText = ''
  if (result.status === 'ABOVE_THRESHOLD') {
    summaryText = `Based on your inputs, ${lead.companyName} is currently past the economic crossover point in ${country.name}. At ${inputs.currentHeadcount} employees, an entity would save approximately ${formatCurrencyPdf(result.totalSavings, currency)} over the next 3 years compared to your current EOR arrangement.`
  } else if (result.status === 'NEAR_THRESHOLD') {
    summaryText = `Based on your inputs, ${lead.companyName} is approaching the crossover point in ${country.name}. Now is the time to begin transition planning.`
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
            Based on inputs submitted at this date. Advisory only — refresh before any board or legal decision.
          </Text>
        </View>
        <View style={styles.memoHeaderRule} />

        <Text style={styles.title}>EOR vs Entity Analysis — {country.name}</Text>
        <Text style={styles.preparedFor}>
          Prepared for: {lead.firstName}, {lead.companyName}
        </Text>

        <Text
          style={[
            styles.confidenceBadge,
            country.dataConfidence === 'verified'
              ? styles.confidenceVerified
              : country.dataConfidence === 'baseline'
                ? styles.confidenceBaseline
                : styles.confidenceTierDefault,
          ]}
        >
          {confidenceBadgeLabel(country.dataConfidence)} — {country.name}
        </Text>

        {result.marginFlag && (
          <Text style={styles.marginWarning}>
            The cost range straddles the decision point. Low and high setup-cost scenarios give
            opposite recommendations. Treat this memo as directional, not determinative — refine
            with a local advisor before committing.
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
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#991B1B', marginBottom: 4 }}>
              If you wind the entity down at month 36
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', marginBottom: 4 }}>
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
        {country.thresholdJustification && (
          <Text style={styles.footnote}>{country.thresholdJustification}</Text>
        )}
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

        <Text style={styles.sectionTitle}>Your transition readiness</Text>
        {result.readinessItems.map((item, i) => (
          <View key={i} style={styles.checklistItem}>
            <View
              style={[
                styles.checklistDot,
                {
                  backgroundColor:
                    item.status === 'green' ? '#4B8E82' : item.status === 'amber' ? '#EAB308' : '#F43855',
                },
              ]}
            />
            <View>
              <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{item.criterion}</Text>
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
              ? " You're getting closer — a few things to address."
              : ' Not yet — stay on EOR and review when you grow.'}
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
                ? `Native (${country.name}) — threshold ${country.thresholdNative}`
                : `Non-native — threshold ${country.thresholdNonNative} (Language Buffer Rule applied)`}
            </Text>
          </View>
          <View style={styles.assumptionsRow}>
            <Text style={styles.assumptionsLabel}>EOR fee per employee / month</Text>
            <Text style={styles.assumptionsValue}>
              {formatCurrencyPdf(inputs.eorFeePerMonth, currency)}
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
          Generated by Teamed · teamed.global · Employee thresholds follow the GEMO Framework v2.0
          (Country Concentration & Entity Transition). Illustrative economics only — not a binding
          quote. Contact Teamed for a personalised assessment.
        </Text>
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
