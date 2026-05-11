'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/format'
import type { MonthlyDataPoint } from '@/lib/types'
import type { Country } from '@/lib/types'

interface CrossoverChartProps {
  dataPoints: MonthlyDataPoint[]
  crossoverMonth: number | null
  currency: string
  country: Country
  threshold: number
}

/**
 * Recharts components want hex literals, so we keep a small palette object
 * here rather than relying on Tailwind class names. Each entry traces back
 * to a token defined in tailwind.config.ts.
 */
const CHART = {
  zoneWait: '#C9BEAD', // parchment-400
  zonePlan: '#C79140', // warning (Kraft Yellow)
  zoneAct: '#5F7F4B', // success (Postmark Green)
  lineEor: '#C4654A', // sienna-500
  lineEnt: '#8B9E7E', // sage-500
  grid: '#E5DDD0', // parchment-300
  axis: '#6B6155', // parchment-600
  refCost: '#2D3B2D', // forest-700 (Deep Forest)
  refHead: '#A37F52', // amber-700
} as const

function CustomTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: number
  currency: string
}) {
  if (!active || !payload?.length || label == null) return null
  const eor = payload.find((p) => p.dataKey === 'eorCumulative')?.value ?? 0
  const entity = payload.find((p) => p.dataKey === 'entityCumulative')?.value ?? 0
  const diff = entity - eor
  return (
    <div className="bg-white border border-parchment-300 rounded-card p-4 shadow-card">
      <p className="font-sans font-bold text-forest-700 mb-2">Month {label}</p>
      <p className="font-sans text-sm text-forest-700">
        EOR (cumulative): {formatCurrency(eor, currency)}
      </p>
      <p className="font-sans text-sm text-forest-700">
        Entity (cumulative): {formatCurrency(entity, currency)}
      </p>
      <p className="font-sans text-sm text-sienna-700 mt-1">
        Difference: {formatCurrency(diff, currency)}
      </p>
    </div>
  )
}

export function CrossoverChart({
  dataPoints,
  crossoverMonth,
  currency,
  country,
  threshold,
}: CrossoverChartProps) {
  // First month where projected headcount clears the country's complexity threshold.
  // Null means the threshold is never met inside the 36-month window.
  const complexityClearedMonth = useMemo(() => {
    return dataPoints.find((p) => p.headcount >= threshold)?.month ?? null
  }, [dataPoints, threshold])

  // The two signals can land in either order. "First cleared" is the earlier of the
  // two milestones; "both cleared" is the later. Either can be null if a signal never
  // fires inside the window.
  const { firstCleared, bothCleared } = useMemo(() => {
    if (crossoverMonth != null && complexityClearedMonth != null) {
      return {
        firstCleared: Math.min(crossoverMonth, complexityClearedMonth),
        bothCleared: Math.max(crossoverMonth, complexityClearedMonth),
      }
    }
    return {
      firstCleared: crossoverMonth ?? complexityClearedMonth,
      bothCleared: null as number | null,
    }
  }, [crossoverMonth, complexityClearedMonth])

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={dataPoints} margin={{ top: 30, right: 20, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `Month ${v}`}
            tick={{ fontSize: 12, fill: CHART.axis }}
            interval={5}
            domain={[1, 36]}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => {
              if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
              if (v >= 10_000) return `${Math.round(v / 1000)}k`
              return String(v)
            }}
            tick={{ fontSize: 12, fill: CHART.axis }}
          />
          <Tooltip
            content={<CustomTooltip currency={currency} />}
            cursor={{ stroke: CHART.grid, strokeWidth: 1 }}
          />
          {/* Wait zone — neither signal cleared */}
          <ReferenceArea
            x1={1}
            x2={firstCleared ?? 36}
            fill={CHART.zoneWait}
            fillOpacity={0.22}
          />
          {/* Plan zone — one signal cleared */}
          {firstCleared != null && bothCleared != null && firstCleared !== bothCleared && (
            <ReferenceArea
              x1={firstCleared}
              x2={bothCleared}
              fill={CHART.zonePlan}
              fillOpacity={0.16}
            />
          )}
          {/* Plan zone — only one signal ever fires inside the window */}
          {firstCleared != null && bothCleared == null && (
            <ReferenceArea
              x1={firstCleared}
              x2={36}
              fill={CHART.zonePlan}
              fillOpacity={0.16}
            />
          )}
          {/* Act zone — both signals cleared */}
          {bothCleared != null && (
            <ReferenceArea
              x1={bothCleared}
              x2={36}
              fill={CHART.zoneAct}
              fillOpacity={0.18}
            />
          )}
          {crossoverMonth && (
            <ReferenceLine
              x={crossoverMonth}
              stroke={CHART.refCost}
              strokeDasharray="4 4"
              label={{
                value: 'Cost',
                position: 'top',
                fill: CHART.refCost,
                fontSize: 11,
              }}
            />
          )}
          {complexityClearedMonth && (
            <ReferenceLine
              x={complexityClearedMonth}
              stroke={CHART.refHead}
              strokeDasharray="4 4"
              label={{
                value: 'Headcount',
                position: 'top',
                fill: CHART.refHead,
                fontSize: 11,
                offset: 14,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="eorCumulative"
            stroke={CHART.lineEor}
            strokeWidth={2.5}
            name="EOR Cost"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="entityCumulative"
            stroke={CHART.lineEnt}
            strokeWidth={2.5}
            name="Entity Cost"
            dot={false}
          />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => (
              <span className="font-sans text-sm text-forest-700">
                {value === 'EOR Cost' ? 'EOR (cumulative)' : 'Entity (cumulative)'}
              </span>
            )}
            iconType="circle"
            iconSize={8}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-parchment-700">
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: CHART.zoneWait, opacity: 0.6 }}
          />
          Wait, neither signal cleared
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: CHART.zonePlan, opacity: 0.55 }}
          />
          Plan, one cleared
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: CHART.zoneAct, opacity: 0.6 }}
          />
          Act, both cleared
        </span>
      </div>
      {!crossoverMonth && (
        <p className="font-sans text-parchment-600 text-sm mt-3">
          At your current headcount in {country.name}, EOR remains more cost-effective for the
          full 3-year window. We&apos;ll remind you when to review.
        </p>
      )}
    </div>
  )
}
