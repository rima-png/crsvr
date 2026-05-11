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
    <div className="bg-white border border-grey-mid rounded-card p-4 shadow-lg">
      <p className="font-sans font-bold text-black mb-2">Month {label}</p>
      <p className="font-sans text-sm text-black">EOR (cumulative): {formatCurrency(eor, currency)}</p>
      <p className="font-sans text-sm text-black">
        Entity (cumulative): {formatCurrency(entity, currency)}
      </p>
      <p className="font-sans text-sm text-forest mt-1">
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
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `Month ${v}`}
            tick={{ fontSize: 12, fill: '#6b7280' }}
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
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip
            content={<CustomTooltip currency={currency} />}
            cursor={{ stroke: '#E5E5E5', strokeWidth: 1 }}
          />
          {/* Wait zone — neither signal cleared */}
          <ReferenceArea
            x1={1}
            x2={firstCleared ?? 36}
            fill="#9CA3AF"
            fillOpacity={0.1}
          />
          {/* Plan zone — one signal cleared */}
          {firstCleared != null && bothCleared != null && firstCleared !== bothCleared && (
            <ReferenceArea
              x1={firstCleared}
              x2={bothCleared}
              fill="#F59E0B"
              fillOpacity={0.13}
            />
          )}
          {/* Plan zone — only one signal ever fires inside the window */}
          {firstCleared != null && bothCleared == null && (
            <ReferenceArea
              x1={firstCleared}
              x2={36}
              fill="#F59E0B"
              fillOpacity={0.13}
            />
          )}
          {/* Act zone — both signals cleared */}
          {bothCleared != null && (
            <ReferenceArea
              x1={bothCleared}
              x2={36}
              fill="#4B8E82"
              fillOpacity={0.14}
            />
          )}
          {crossoverMonth && (
            <ReferenceLine
              x={crossoverMonth}
              stroke="#31695F"
              strokeDasharray="4 4"
              label={{
                value: 'Cost',
                position: 'top',
                fill: '#31695F',
                fontSize: 11,
              }}
            />
          )}
          {complexityClearedMonth && (
            <ReferenceLine
              x={complexityClearedMonth}
              stroke="#D97706"
              strokeDasharray="4 4"
              label={{
                value: 'Headcount',
                position: 'top',
                fill: '#D97706',
                fontSize: 11,
                offset: 14,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="eorCumulative"
            stroke="#4B8E82"
            strokeWidth={2.5}
            name="EOR Cost"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="entityCumulative"
            stroke="#FFA287"
            strokeWidth={2.5}
            name="Entity Cost"
            dot={false}
          />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => (
              <span className="font-sans text-sm text-black">
                {value === 'EOR Cost' ? 'EOR (cumulative)' : 'Entity (cumulative)'}
              </span>
            )}
            iconType="circle"
            iconSize={8}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-400/30" />
          Wait — neither signal cleared
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-400/40" />
          Plan — one cleared
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-forest/40" />
          Act — both cleared
        </span>
      </div>
      {!crossoverMonth && (
        <p className="font-sans text-gray-500 text-sm mt-3">
          At your current headcount, EOR remains more cost-effective for the full 3-year window.
          We&apos;ll remind you when to review.
        </p>
      )}
    </div>
  )
}
