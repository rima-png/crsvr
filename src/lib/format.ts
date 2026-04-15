export function getCurrencySymbol(currency: string): string {
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
    RON: 'RON ',
    HUF: 'HUF ',
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
    HKD: 'HK$',
    IDR: 'IDR ',
    MYR: 'RM',
  }
  return symbols[currency] ?? currency + ' '
}

export function formatCurrency(amount: number, currency = 'GBP'): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `${getCurrencySymbol(currency)}${(amount / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(amount) >= 10_000) {
    return `${getCurrencySymbol(currency)}${Math.round(amount / 1000)}k`
  }
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${getCurrencySymbol(currency)}${Math.round(amount).toLocaleString()}`
  }
}
