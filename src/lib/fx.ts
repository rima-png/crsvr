import fxSnapshot from '@/data/fx-snapshot.json'

const RATES = fxSnapshot.rates as Record<string, number>

/**
 * Convert an amount between two currencies using the committed FX snapshot.
 * Rates are stored as "USD per 1 unit of local currency", so:
 *   amountInUsd     = amount * RATES[fromCurrency]
 *   amountInTarget  = amountInUsd / RATES[toCurrency]
 *
 * Falls back to returning the amount unchanged when either currency is missing
 * from the snapshot (fail-open — no silent multiplication by undefined).
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (!Number.isFinite(amount)) return 0
  const from = fromCurrency.toUpperCase()
  const to = toCurrency.toUpperCase()
  if (from === to) return amount
  const fromRate = RATES[from]
  const toRate = RATES[to]
  if (!fromRate || !toRate) return amount
  return (amount * fromRate) / toRate
}
