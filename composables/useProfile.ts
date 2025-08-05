import { ref, watch } from 'vue'
import type { Database } from '~/types/database.types'
import type { Profile, ProfileFormData } from '~/types/profile'
import { mapFormDataToProfile, mapProfileToFormData } from '~/types/profile'
import { useToast } from '@/components/ui/toast'

export const useProfile = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const { toast } = useToast()
  const route = useRoute()

  const fetchProfile = async () => {
    if (!user.value?.id) return null

    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (err?.code === 'PGRST116') {
        // Create initial profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert({
            id: user.value.id,
            email: user.value.email,
            name: null,
            street: null,
            city: null,
            state: null,
            zip: null,
            country: null,
            tax_id: null,
            is_tax_payer: false,
            tax_number: null,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (createError) throw createError
        profile.value = newProfile
        return profile.value
      }

      if (err) throw err
      
      profile.value = data
      return profile.value
    } catch (err) {
      error.value = err as Error
      logError('Error fetching profile:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (formData: ProfileFormData) => {
    if (!user.value?.id) return null

    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .update(mapFormDataToProfile(formData))
        .eq('id', user.value.id)
        .select('*')
        .single()

      if (err) throw err
      profile.value = data
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
      return data
    } catch (err) {
      error.value = err as Error
      logError('Error updating profile:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update profile"
      })
      return null
    } finally {
      loading.value = false
    }
  }

  const resetProfile = () => {
    profile.value = null
    error.value = null
    loading.value = false
  }

  // Watch for user changes and fetch profile only if not on public route
  watch(user, async (newUser) => {
    if (newUser && !route.meta.public) {
      await fetchProfile()
    } else {
      resetProfile()
    }
  }, { immediate: true })

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    resetProfile
  }
}

// Type guards
export const isProfileError = (error: unknown): error is Error => {
  return error instanceof Error
}

export const isProfileData = (data: unknown): data is Profile => {
  return data !== null && typeof data === 'object' && 'id' in data
}