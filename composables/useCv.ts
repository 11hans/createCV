import { ref, reactive } from 'vue'

interface Company {
  email: string
  name: string
  logo?: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  taxId: string
}

interface Client {
  email: string
  name: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

interface QuoteItem {
  description: string
  quantity: number
  price: number
  amount: number
}

interface Quote {
  number: string
  issueDate: string
  dueDate: string
  company: Company
  client: Client
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  terms: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
}

export const useQuote = () => {
  const currentStep = ref(1)
  const steps = [
    'Your company',
    'Your client',
    'Quote details',
    'Quote terms',
    'Review & download'
  ]

  const quote = reactive<Quote>({
    number: '000001',
    issueDate: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    company: {
      email: '',
      name: '',
      logo: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      },
      taxId: ''
    },
    client: {
      email: '',
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      }
    },
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    terms: '',
    status: 'draft'
  })

  const saveIssuerDetails = (company: Company) => {
    quote.company = { ...company }
  }

  const saveClientDetails = (client: Client) => {
    quote.client = { ...client }
  }

  const calculateTotals = () => {
    quote.subtotal = quote.items.reduce((sum, item) => sum + item.amount, 0)
    quote.tax = quote.subtotal * 0.1 // 10% tax rate as example
    quote.total = quote.subtotal + quote.tax
  }

  return {
    currentStep,
    steps,
    quote,
    saveIssuerDetails,
    saveClientDetails,
    calculateTotals
  }
} 