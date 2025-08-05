// composables/useFormatting.ts
import { countryConfigs } from '~/config/countries'
import { format, parseISO } from 'date-fns'
import { enUS, cs } from 'date-fns/locale'

export const useFormatting = () => {
  let currentLocale
  try {
    const { currentLocale: locale } = useLanguage()
    currentLocale = locale
  } catch (e) {
    console.warn('useFormatting: Error using useLanguage composable', e)
    currentLocale = ref('cs')
  }
  
  const config = computed(() => 
    countryConfigs[currentLocale.value === 'en' ? 'US' : 'CZ']
  )

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    
    if (isNaN(numAmount)) {
      console.warn('Invalid amount provided to formatCurrency:', amount)
      return '0'
    }

    try {
      const formatted = new Intl.NumberFormat(
        currentLocale.value === 'en' ? 'en-US' : 'cs-CZ',
        config.value.currency.format
      ).format(numAmount)

      return formatted
    } catch (error) {
      logError('Error formatting currency:', error)
      return numAmount.toString()
    }
  }

  const formatNumber = (num: number | string, options?: Intl.NumberFormatOptions) => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num
    
    if (isNaN(numValue)) {
      console.warn('Invalid number provided to formatNumber:', num)
      return '0'
    }

    try {
      return new Intl.NumberFormat(
        currentLocale.value === 'en' ? 'en-US' : 'cs-CZ',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          ...options
        }
      ).format(numValue)
    } catch (error) {
      logError('Error formatting number:', error)
      return numValue.toString()
    }
  }

  const formatDate = (date: Date | string | number) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
      return format(
        dateObj,
        config.value.date.format,
        { locale: currentLocale.value === 'en' ? enUS : cs }
      )
    } catch (error) {
      logError('Error formatting date:', error)
      return String(date)
    }
  }

  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (isNaN(numValue)) {
      console.warn('Invalid value provided to formatPercentage:', value)
      return '0%'
    }

    try {
      return new Intl.NumberFormat(
        currentLocale.value === 'en' ? 'en-US' : 'cs-CZ',
        {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }
      ).format(numValue / 100)
    } catch (error) {
      logError('Error formatting percentage:', error)
      return `${numValue}%`
    }
  }

  const getTaxRates = () => config.value.tax.rates
  
  const getDefaultTaxRate = () => config.value.tax.defaultRate
  
  const getTaxLabel = () => config.value.tax.label

  const getCurrencySymbol = () => config.value.currency.symbol

  return {
    formatCurrency,
    formatNumber,
    formatDate,
    formatPercentage,
    getTaxRates,
    getDefaultTaxRate,
    getTaxLabel,
    getCurrencySymbol,
    config
  }
}