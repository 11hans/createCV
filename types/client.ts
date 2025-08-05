// Enhanced Client Types and Validation
import type { Client as DatabaseClient, NewClient } from './database.types'

// Database types with stricter typing
export type Client = DatabaseClient

export type ClientInsert = NewClient

// Enhanced ValidationResult with translation keys
interface ValidationResult {
  isValid: boolean
  error?: string
}

// Validation messages for translation
const validationMessages = {
  invalidPhone: 'validation.invalidPhone',
  invalidEmail: 'validation.invalidEmail',
  invalidState: 'validation.invalidState',
  invalidZip: 'validation.invalidZip',
  requiredField: 'validation.requiredField',
  // Add more messages as needed
}

// Enhanced phone validation with international support
export const validatePhone = (phone: string | null | undefined): ValidationResult => {
  if (!phone) return { isValid: true }
  
  // International phone number regex
  const phoneRegex = /^\+?[\d\s-()]{6,}$/
  return {
    isValid: phoneRegex.test(phone),
    error: phoneRegex.test(phone) ? undefined : 'invalidPhone'
  }
}

// Enhanced email validation
export const validateEmail = (email: string | null | undefined): ValidationResult => {
  if (!email) return { isValid: true }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return {
    isValid: emailRegex.test(email),
    error: emailRegex.test(email) ? undefined : 'invalidEmail'
  }
}

// Enhanced US State validation
export const validateUSState = (state: string | null | undefined): ValidationResult => {
  if (!state) return { isValid: true }
  
  const stateRegex = /^[A-Z]{2}$/
  return {
    isValid: stateRegex.test(state.toUpperCase()),
    error: stateRegex.test(state.toUpperCase()) ? undefined : 'invalidState'
  }
}

// Enhanced ZIP/Postal code validation with more countries
export const validateZip = (zip: string | null | undefined, country: string): ValidationResult => {
  if (!zip) return { isValid: true }
  
  const patterns: Record<string, RegExp> = {
    'United States': /^\d{5}(-\d{4})?$/,
    'Czech Republic': /^\d{3}\s?\d{2}$/,
    'Canada': /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    'Germany': /^\d{5}$/,
    'default': /^[A-Z0-9\s-]{3,10}$/i
  }

  const pattern = patterns[country] || patterns.default
  return {
    isValid: pattern.test(zip),
    error: pattern.test(zip) ? undefined : 'invalidZip'
  }
}

// Enhanced ClientFormData interface
export interface ClientFormData {
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

// Enhanced form validation with detailed error messages
export const validateClientForm = (formData: ClientFormData): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  // Required fields validation
  if (!formData.company_name?.trim()) {
    errors.company_name = 'requiredField'
  }

  // Email validation
  if (formData.email) {
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid && emailValidation.error) {
      errors.email = emailValidation.error
    }
  }

  // Phone validation
  if (formData.phone) {
    const phoneValidation = validatePhone(formData.phone)
    if (!phoneValidation.isValid && phoneValidation.error) {
      errors.phone = phoneValidation.error
    }
  }

  // Country-specific validations
  if (formData.country === 'United States') {
    if (formData.state) {
      const stateValidation = validateUSState(formData.state)
      if (!stateValidation.isValid && stateValidation.error) {
        errors.state = stateValidation.error
      }
    }
    
    if (formData.zip) {
      const zipValidation = validateZip(formData.zip, 'United States')
      if (!zipValidation.isValid && zipValidation.error) {
        errors.zip = zipValidation.error
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Enhanced mapping functions with type safety
export const mapClientFormToDb = (formData: ClientFormData, userId: string): ClientInsert => {
  return {
    company_name: formData.company_name,
    contact_name: formData.contact_name || formData.company_name,
    email: formData.email || null,
    phone: formData.phone || null,
    street: formData.street || null,
    city: formData.city || null,
    state: formData.state || null,
    zip: formData.zip || null,
    country: formData.country || null,
    user_id: userId,
  }
}

export const mapDbToClientForm = (dbData: Client): ClientFormData => {
  return {
    id: dbData.id,
    company_name: dbData.company_name,
    contact_name: dbData.contact_name || '',
    email: dbData.email || '',
    phone: dbData.phone || '',
    street: dbData.street || '',
    city: dbData.city || '',
    state: dbData.state || '',
    zip: dbData.zip || '',
    country: dbData.country || 'United States'
  }
}

// Enhanced address formatting with international support
export const formatFullAddress = (address: {
  street: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country
  ].filter((value): value is string => value !== null && value !== '')
  
  return parts.join(', ')
}

// Enhanced address validation helpers
export const isAddressEmpty = (client: Pick<ClientFormData, 'street' | 'city' | 'state' | 'zip' | 'country'>): boolean => {
  return !Object.values({
    street: client.street,
    city: client.city,
    state: client.state,
    zip: client.zip,
    country: client.country
  }).some(value => value?.trim())
}

export const hasCompleteAddress = (client: Client): boolean => {
  return Boolean(
    client.street &&
    client.city &&
    client.country
  )
}

// Additional utility functions
export const getCountrySpecificLabels = (country: string) => {
  return {
    zipLabel: country === 'United States' ? 'ZIP Code' : 'Postal Code',
    stateLabel: country === 'United States' ? 'State' : 'Region'
  }
}

// Type-safe error handling
export class ClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ClientError'
  }
}