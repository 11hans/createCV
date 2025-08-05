import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'
import type { Client, ClientFormData } from '~/types/client'
import { ClientError } from './errors'
import { mapClientFormToDb } from '~/types/client'

type DatabaseClient = Database['public']['Tables']['clients']['Row']

export class ClientService {
  async createClient(formData: ClientFormData, userId: string): Promise<DatabaseClient> {
    const supabase = useSupabaseClient()

    try {
      const clientData = mapClientFormToDb(formData, userId)

      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new ClientError('CLIENT_CREATE_FAILED', 'Failed to create client')
      
      return data
    } catch (error) {
      logError('Error creating client:', error)
      throw error instanceof ClientError ? error : new ClientError('CLIENT_SAVE_FAILED', 'Failed to save client')
    }
  }
}