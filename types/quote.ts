// JSON item type from database
export interface QuoteItemJSON {
  id?: string
  description: string
  quantity: number
  unit_price: number
  tax_rate?: number
  price_includes_tax?: boolean
  is_tax_exempt?: boolean
  sort_order?: number | null
  price?: number
  amount?: number
}

export interface QuoteItem {
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  is_tax_exempt: boolean
  price_includes_tax: boolean
}
// Typ pro formulář
export interface QuoteItemForm {
  id?: string
  description: string
  quantity: number
  unitPrice: number
  price: number
  amount: number
  taxRate: number
  priceIncludesTax: boolean
  isTaxExempt: boolean
  sortOrder?: number
}

// Typ pro databázi
export interface DatabaseQuoteItem {
  id: string
  description: string
  unit_price: number
  quantity: number
  tax_rate: number
  price_includes_tax: boolean
  is_tax_exempt: boolean
  sort_order: number | null
  price: number
  amount: number
}

// Mapovací funkce
export const mapFormToQuoteItem = (formItem: QuoteItemForm): DatabaseQuoteItem => ({
  id: formItem.id || crypto.randomUUID(),
  description: formItem.description,
  quantity: formItem.quantity,
  unit_price: formItem.unitPrice,
  tax_rate: formItem.taxRate,
  price_includes_tax: formItem.priceIncludesTax,
  is_tax_exempt: formItem.isTaxExempt,
  sort_order: formItem.sortOrder ?? null,
  price: formItem.price,
  amount: formItem.amount
})

export const mapQuoteItemToForm = (item: DatabaseQuoteItem): QuoteItemForm => ({
  id: item.id,
  description: item.description,
  quantity: item.quantity,
  unitPrice: item.unit_price,
  price: item.price,
  amount: item.amount,
  taxRate: item.tax_rate,
  priceIncludesTax: item.price_includes_tax,
  isTaxExempt: item.is_tax_exempt,
  sortOrder: item.sort_order ?? undefined
})

export interface QuoteCompany {
  email: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  tax_id: string;
  is_tax_payer: boolean;
  tax_number: string;
}

export interface QuoteSettings {
  prefix: string | null;
  terms: string | null;
  header?: string | null;
  instructions?: string | null;
}