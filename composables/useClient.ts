// composables/useClient.ts
import { ref, watch } from 'vue'
import type { Database } from '~/types/database.types'
import type { Client, ClientFormData, ClientInsert } from '~/types/client'
import { mapClientFormToDb, mapDbToClientForm } from '~/types/client'
import { useToast } from '@/components/ui/toast'

export const useClient = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const clients = ref<Client[]>([])
  const selectedClient = ref<Client | null>(null)
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const { toast } = useToast()

  const fetchClients = async () => {
    try {
      loading.value = true
      error.value = null
      if (!user.value) throw new Error('No authenticated user')

      const { data, error: fetchError } = await supabase
        .from('clients')
        .select()
        .eq('user_id', user.value.id)
        .order('company_name', { ascending: true })

      if (fetchError) throw fetchError
      clients.value = data || []
      return data
    } catch (err: any) {
      logError('Error fetching clients:', err)
      error.value = err.message
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch clients"
      })
      return []
    } finally {
      loading.value = false
    }
  }

  const getClientById = async (id: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('clients')
        .select()
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      if (data) {
        selectedClient.value = data
        return mapDbToClientForm(data)
      }
      return null
    } catch (err: any) {
      logError('Error fetching client:', err)
      error.value = err.message
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch client details"
      })
      return null
    } finally {
      loading.value = false
    }
  }

  const createClient = async (formData: ClientFormData) => {
    try {
      loading.value = true
      error.value = null
      if (!user.value) throw new Error('No authenticated user')

      const newClient = mapClientFormToDb(formData, user.value.id)

      const { data, error: insertError } = await supabase
        .from('clients')
        .insert(newClient)
        .select()
        .single()

      if (insertError) throw insertError
      if (data) {
        selectedClient.value = data
        await fetchClients()
        toast({
          title: "Success",
          description: "Client created successfully"
        })
        return data
      }
      return null
    } catch (err: any) {
      logError('Error creating client:', err)
      error.value = err.message
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create client"
      })
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteClient = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      if (!user.value) throw new Error('No authenticated user')
  
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.value.id)
  
      if (deleteError) throw deleteError
  
      if (selectedClient.value?.id === id) {
        selectedClient.value = null
      }
      
      await fetchClients()
      toast({
        title: "Success",
        description: "Client deleted successfully"
      })
      return true
    } catch (err: any) {
      logError('Error deleting client:', err)
      error.value = err.message
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete client"
      })
      return false
    } finally {
      loading.value = false
    }
  }

  const updateClient = async (id: string, formData: ClientFormData) => {
    try {
      loading.value = true
      error.value = null
      if (!user.value) throw new Error('No authenticated user')

      const updates = mapClientFormToDb(formData, user.value.id)

      const { data, error: updateError } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      if (data) {
        selectedClient.value = data
        await fetchClients()
        toast({
          title: "Success",
          description: "Client updated successfully"
        })
        return data
      }
      return null
    } catch (err: any) {
      logError('Error updating client:', err)
      error.value = err.message
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update client"
      })
      return null
    } finally {
      loading.value = false
    }
  }

  const selectClient = (client: Client) => {
    selectedClient.value = client
  }

  const clearSelectedClient = () => {
    selectedClient.value = null
    error.value = null
  }

  // Watch for user changes and reset state
  watch(user, (newUser) => {
    if (!newUser) {
      clients.value = []
      selectedClient.value = null
      error.value = null
    }
  })

  return {
    loading,
    error,
    clients,
    selectedClient,
    fetchClients,
    getClientById,
    createClient,
    updateClient,
    selectClient,
    clearSelectedClient,
    deleteClient
  }
}