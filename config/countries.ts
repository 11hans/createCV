// config/countries.ts
export interface CountryConfig {
    currency: {
      code: string
      symbol: string
      format: Intl.NumberFormatOptions
    }
    date: {
      format: string
      locale: string
    }
    tax: {
      rates: Array<{
        value: number
        label: string
      }>
      defaultRate: number
      label: string
    }
  }
  
  export const countryConfigs: Record<string, CountryConfig> = {
    CZ: {
      currency: {
        code: 'CZK',
        symbol: 'Kč',
        format: {
          style: 'currency',
          currency: 'CZK',
          currencyDisplay: 'symbol',
          minimumFractionDigits: 2
        }
      },
      date: {
        format: 'dd.MM.yyyy',
        locale: 'cs-CZ'
      },
      tax: {
        rates: [
          { value: 21, label: 'DPH 21%' },
          { value: 15, label: 'DPH 15%' },
          { value: 10, label: 'DPH 10%' },
          { value: 0, label: 'Bez DPH' }
        ],
        defaultRate: 21,
        label: 'DPH'
      }
    },
    US: {
      currency: {
        code: 'USD',
        symbol: '$',
        format: {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'symbol',
          minimumFractionDigits: 2
        }
      },
      date: {
        format: 'MM/dd/yyyy',
        locale: 'en-US'
      },
      tax: {
        rates: [
          { value: 0, label: 'No Tax' },
          { value: 8.875, label: 'NY Sales Tax' },
          { value: 7.25, label: 'CA Sales Tax' },
          { value: 6.25, label: 'TX Sales Tax' }
        ],
        defaultRate: 0,
        label: 'Sales Tax'
      }
    }
  }