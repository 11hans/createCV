import type { QuoteItemJSON } from './quote'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      quotes: {
        Row: {
          id: string
          number: string
          client_id: string
          status: 'draft' | 'sent' | 'accepted' | 'rejected'
          total: number
          subtotal: number | null
          tax_total: number | null
          valid_until: string | null
          notes: string | null
          user_id: string
          created_at: string
          updated_at: string | null
          issue_date: string | null
          due_date: string | null
          items: QuoteItemType[]
        }
        Insert: Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>
      }
      clients: {
        Row: {
          id: string
          user_id: string
          created_at: string
          email: string | null
          phone: string | null
          zip: string | null
          country: string | null
          street: string | null
          city: string | null
          state: string | null
          company_name: string
          contact_name: string | null
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          street: string | null
          city: string | null
          state: string | null
          zip: string | null
          country: string | null
          tax_id: string | null
          is_tax_payer: boolean | null
          tax_number: string | null
          created_at: string
          updated_at: string
          quote_prefix: string | null
          quote_terms: string | null
          quote_header: string | null
          menu_conditions: string | null
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      quote_settings: {
        Row: {
          id: string
          user_id: string
          prefix: string | null
          terms: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['quote_settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['quote_settings']['Insert']>
      }
    }
  }
}

// Base types from database
export type Quote = Database['public']['Tables']['quotes']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type QuoteSettings = Database['public']['Tables']['quote_settings']['Row']
export type QuoteStatus = Quote['status']
export type NewQuote = Database['public']['Tables']['quotes']['Insert']
export type UpdateQuote = Database['public']['Tables']['quotes']['Update']
export type NewClient = Database['public']['Tables']['clients']['Insert']
export type UpdateClient = Database['public']['Tables']['clients']['Update']
export type NewQuoteSettings = Database['public']['Tables']['quote_settings']['Insert']
export type UpdateQuoteSettings = Database['public']['Tables']['quote_settings']['Update']

// Quote item type
export interface QuoteItemType {
  id: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  price_includes_tax: boolean
  is_tax_exempt: boolean
  sort_order: number | null
  price: number
  amount: number
}

export interface QuoteItem extends QuoteItemType {
  quote_id: string
  created_at: string
  updated_at: string
}

// Extended types
export interface QuoteWithClient extends Quote {
  client: Client
}

export interface QuoteWithItems extends QuoteWithClient {
  items: QuoteItem[]
}

// Form types
export interface QuoteForm {
  number: string
  client: {
    id?: string
    company_name: string
    email: string | null
    street: string | null
    city: string | null
    state: string | null
    zip: string | null
    country: string | null
  }
  items: QuoteItemJSON[]
  total: number
  subtotal: number
  tax_total: number
  tax_rate: number
  tax_included: boolean
  valid_until?: string | null
  notes?: string | null
  issue_date?: string | null
  due_date?: string | null
  status?: QuoteStatus
}

// Constants
export const QUOTE_STATUSES: QuoteStatus[] = ['draft', 'sent', 'accepted', 'rejected']
export type QuoteStatusOption = typeof QUOTE_STATUSES[number] | 'All'