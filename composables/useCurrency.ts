import { useI18n } from 'vue-i18n'

/**
 * Composable for handling currency formatting based on locale
 * For Czech (cs) locale, it uses CZK
 * For English (en) locale, it uses USD
 */
export function useCurrency() {
  const { locale } = useI18n()
  
  // Get currency symbol based on locale
  const currencySymbol = computed(() => {
    return locale.value === 'cs' ? 'Kč' : '$'
  })
  
  // Get currency code based on locale
  const currencyCode = computed(() => {
    return locale.value === 'cs' ? 'CZK' : 'USD'
  })
  
  // Format amount with the appropriate currency symbol
  const formatCurrency = (amount: number | string) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    
    if (isNaN(numericAmount)) {
      return locale.value === 'cs' ? '0 Kč' : '$0'
    }
    
    // Format the number with appropriate thousands separators
    const formattedAmount = new Intl.NumberFormat(
      locale.value === 'cs' ? 'cs-CZ' : 'en-US', 
      { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ).format(numericAmount)
    
    // Return formatted amount with currency symbol in the correct position
    return locale.value === 'cs' 
      ? `${formattedAmount} Kč` 
      : `$${formattedAmount}`
  }
  
  return {
    currencySymbol,
    currencyCode,
    formatCurrency
  }
} 