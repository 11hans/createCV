import { ref, watch } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { defineStore } from 'pinia'
import type { Database } from '~/types/database.types'
import { useToast } from '@/components/ui/toast'

export interface QuoteSettings {
  prefix: string | null
  terms: string | null
  header: string | null
  instructions: string | null
}

export const useQuoteSettings = defineStore('quoteSettings', () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const { toast } = useToast()
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const settings = ref<QuoteSettings | null>(null)

  const fetchSettings = async () => {
    if (!user.value) return null

    try {
      loading.value = true
      error.value = null

      const { data: profileData, error: err } = await supabase
        .from('profiles')
        .select('quote_prefix, quote_terms, quote_header, quote_instructions')
        .eq('id', user.value.id)
        .single()

      if (err) {
        // If profile doesn't exist, create it
        if (err.code === 'PGRST116') {
          // Create initial profile with empty quote settings
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert({
              id: user.value.id,
              email: user.value.email,
              updated_at: new Date().toISOString()
            })
            .select('quote_prefix, quote_terms, quote_header, quote_instructions')
            .single()

          if (createError) {
            logError('Error creating profile for quote settings:', createError)
            error.value = createError.message
            return null
          }

          // Initialize empty settings
          settings.value = {
            prefix: null,
            terms: null,
            header: null,
            instructions: null
          }
          return settings.value
        }

        logError('Error fetching quote settings from profile:', err)
        error.value = err.message
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch quote settings"
        })
        return null
      }

      if (profileData) {
        settings.value = {
          prefix: profileData.quote_prefix || null,
          terms: profileData.quote_terms || null,
          header: profileData.quote_header || null,
          instructions: profileData.quote_instructions || null
        }
        return settings.value
      } else {
        settings.value = null
        return null
      }
    } catch (err: any) {
      logError('Error fetching quote settings:', err)
      error.value = err.message
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch quote settings"
      })
      return null
    } finally {
      loading.value = false
    }
  }

  const updateSettings = async (newSettings: QuoteSettings) => {
    if (!user.value) return false

    try {
      loading.value = true
      error.value = null

      const updates = {
        id: user.value.id, // Required for upsert
        quote_prefix: newSettings.prefix ?? null,
        quote_terms: newSettings.terms ?? null,
        quote_header: newSettings.header ?? null,
        quote_instructions: newSettings.instructions ?? null,
        updated_at: new Date().toISOString()
      }

      const { data: updatedProfile, error: err } = await supabase
        .from('profiles')
        .upsert(updates)
        .select('quote_prefix, quote_terms, quote_header, quote_instructions')
        .single()

      if (err) {
        logError('Error updating quote settings in profile:', err)
        error.value = err.message
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not update quote settings"
        })
        return false
      }

      if (updatedProfile) {
        settings.value = {
          prefix: updatedProfile.quote_prefix || null,
          terms: updatedProfile.quote_terms || null,
          header: updatedProfile.quote_header || null,
          instructions: updatedProfile.quote_instructions || null
        }
        toast({
          title: "Success",
          description: "Quote settings updated successfully"
        })
        return true
      }
      return false
    } catch (err: any) {
      logError('Error in updateSettings:', err)
      error.value = err.message
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update quote settings"
      })
      return false
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    error.value = null
    settings.value = null
    loading.value = false
  }

  watch(user, async (newUser) => {
    if (newUser) {
      await fetchSettings()
    } else {
      resetState()
    }
  }, { immediate: true })

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    resetState
  }
})