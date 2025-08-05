import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'
import type { ClientFormData } from '~/types/client'
import { ClientError } from './errors'

type DatabaseClient = Database['public']['Tables']['clients']['Row']
type DatabaseClientInsert = Database['public']['Tables']['clients']['Insert']

export async function saveClientToDatabase(formData: ClientFormData, userId: string): Promise<DatabaseClient> {
  const supabase = useSupabaseClient()

  try {
    const clientData: DatabaseClientInsert = {
      user_id: userId,
      company_name: formData.company_name,
      contact_name: formData.contact_name,
      email: formData.email,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country
    }

    if (formData.id) {
      // Update existing client
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', formData.id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new ClientError('CLIENT_UPDATE_FAILED', 'Failed to update client')
      
      return data
    } else {
      // Check for duplicate company name before creating
      const { data: existingClients, error: searchError } = await supabase
        .from('clients')
        .select('id, company_name')
        .eq('user_id', userId)
        .ilike('company_name', formData.company_name)
        
      if (searchError) throw searchError
      
      // If we found any clients with the same name (case insensitive), throw an error
      if (existingClients && existingClients.length > 0) {
        throw new ClientError('CLIENT_DUPLICATE', 'A client with this company name already exists')
      }
      
      // Create new client
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new ClientError('CLIENT_CREATE_FAILED', 'Failed to create client')
      
      return data
    }
  } catch (error) {
    logError('Error saving client:', error)
    throw error instanceof ClientError 
      ? error 
      : new ClientError('CLIENT_SAVE_FAILED', 'Failed to save client')
  }
}

export async function fetchClients(userId: string): Promise<DatabaseClient[]> {
  const supabase = useSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('company_name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    logError('Error fetching clients:', error)
    throw error instanceof ClientError 
      ? error 
      : new ClientError('CLIENT_FETCH_FAILED', 'Failed to fetch clients')
  }
}

export async function deleteClient(clientId: string, userId: string): Promise<void> {
  const supabase = useSupabaseClient()

  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .eq('user_id', userId)

    if (error) throw error
  } catch (error) {
    logError('Error deleting client:', error)
    throw error instanceof ClientError 
      ? error 
      : new ClientError('CLIENT_DELETE_FAILED', 'Failed to delete client')
  }
} 