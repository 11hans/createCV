export interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Company {
  email: string
  name: string
  logo?: string
  address: Address
  taxId?: string
}

export interface QuoteItem {
  description: string
  quantity: number
  price: number
  amount: number
}

export interface Quote {
  id: string
  number: string
  issueDate: string
  dueDate: string
  issuer: Company
  client: Company
  items: QuoteItem[]
  subtotal: number
  total: number
  paymentDetails: {
    network: string
    wallet: string
    token?: {
      name: string
      symbol: string
      icon?: string
    }
  }
}