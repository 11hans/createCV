export interface PersonalInfoFormData {
  email: string
  name: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  taxId: string
  /** @deprecated Tax payer functionality is temporarily disabled */
  isTaxPayer: boolean
  /** @deprecated Tax payer functionality is temporarily disabled */
  taxNumber?: string
}
export interface ClientFormData {
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