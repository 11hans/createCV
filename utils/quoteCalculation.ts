import type { QuoteItem } from '~/types/quote'

export const calculateTotals = (items: QuoteItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  const tax = items.reduce((sum, item) => sum + calculateItemTax(item), 0)
  
  return {
    subtotal,
    tax,
    total: subtotal + tax
  }
}

export const calculateItemTax = (item: QuoteItem) => {
  if (item.is_tax_exempt) return 0
  
  const baseAmount = item.quantity * item.unit_price
  return item.price_includes_tax 
    ? baseAmount - (baseAmount / (1 + item.tax_rate / 100))
    : baseAmount * (item.tax_rate / 100)
}