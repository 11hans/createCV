// stores/types.ts
import type { QuoteItemForm } from '~/types/quote'
import type { QuoteForm } from '~/types/database.types'

export interface QuoteState {
  company: {
    email: string
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
    tax_id: string
    is_tax_payer: boolean
    tax_number?: string
  }
  client: {
    id?: string
    company_name: string
    contact_name: string | null
    email: string | null
    phone: string | null
    street: string | null
    city: string | null
    state: string | null
    zip: string | null
    country: string | null
  }
  terms: {
    number: string
    issueDate: Date | string
    dueDate: Date | string
    validUntil?: Date | string
    note: string
    status?: 'draft' | 'sent' | 'accepted' | 'rejected'
    subtotal?: number
    total?: number
    taxTotal?: number
  }
  items: QuoteItemForm[]
  currentStep: number
  steps: string[]
  taxRate: number
  taxIncluded: boolean
  _taxTotalOverride: number | null
  termsHeader?: string | null
  instructions?: string | null
}

export interface QuoteStore {
  company: QuoteState['company']
  client: QuoteState['client']
  terms: QuoteState['terms']
  items: QuoteItemForm[]
  currentStep: number
  steps: string[]
  taxRate: number
  taxIncluded: boolean
  _taxTotalOverride: number | null
  termsHeader?: string | null
  instructions?: string | null
  total: number
  subtotal: number
  taxTotal: number
  getQuoteData: () => QuoteForm
  updateCompany: (company: QuoteState['company']) => void
  updateClient: (client: QuoteState['client']) => void
  updateItems: (items: QuoteItemForm[]) => void 
  updateTerms: (terms: QuoteState['terms']) => void
  nextStep: () => void
  previousStep: () => void
  setStep: (step: number) => void
  resetForm: () => void
  loadQuote: (id: string) => Promise<void>
  saveQuote: (userId: string) => Promise<void>
  saveClient: (userId: string) => Promise<QuoteState['client']>
}