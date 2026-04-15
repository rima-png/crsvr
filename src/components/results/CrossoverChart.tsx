'use client'

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
}: CrossoverChartProps) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={dataPoints} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
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
          {crossoverMonth && (
            <>
              <ReferenceLine
                x={crossoverMonth}
                stroke="#31695F"
                strokeDasharray="4 4"
                label={{
                  value: 'Crossover',
                  position: 'top',
                  fill: '#31695F',
                  fontSize: 12,
                }}
              />
              <ReferenceArea
                x1={crossoverMonth}
                x2={36}
                fill="#4B8E82"
                fillOpacity={0.08}
              />
            </>
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
      {!crossoverMonth && (
        <p className="font-sans text-gray-500 text-sm mt-4">
          At your current headcount, EOR remains more cost-effective for the full 3-year window.
          We&apos;ll remind you when to review.
        </p>
      )}
    </div>
  )
}
