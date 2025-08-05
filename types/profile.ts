import type { Database } from './database.types'

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  tax_id: string | null;
  /** @deprecated Tax payer functionality is temporarily disabled */
  is_tax_payer: boolean;
  /** @deprecated Tax payer functionality is temporarily disabled */
  tax_number: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export interface ProfileFormData {
  email: string | null;
  name: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  tax_id: string | null;
  /** @deprecated Tax payer functionality is temporarily disabled */
  is_tax_payer: boolean;
  /** @deprecated Tax payer functionality is temporarily disabled */
  tax_number: string | null;
}

export const mapProfileToFormData = (profile: Profile): ProfileFormData => ({
  email: profile.email ?? null,
  name: profile.name ?? null,
  street: profile.street ?? null,
  city: profile.city ?? null,
  state: profile.state ?? null,
  zip: profile.zip ?? null,
  country: profile.country ?? null,
  tax_id: profile.tax_id ?? null,
  is_tax_payer: profile.is_tax_payer ?? false,
  tax_number: profile.tax_number ?? null
})

export const mapFormDataToProfile = (formData: ProfileFormData): Partial<Profile> => ({
  email: formData.email,
  name: formData.name,
  street: formData.street,
  city: formData.city,
  state: formData.state,
  zip: formData.zip,
  country: formData.country,
  tax_id: formData.tax_id,
  is_tax_payer: formData.is_tax_payer,
  tax_number: formData.tax_number
})