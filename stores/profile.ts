// stores/profile.ts
import { defineStore } from 'pinia'
import type { Profile, ProfileFormData } from '~/types/profile'
import { mapFormDataToProfile, mapProfileToFormData } from '~/types/profile'

export const useProfileStore = defineStore('profile', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const profile = ref<ProfileFormData | null>(null)
  const userId = ref<string | null>(null)

  // Get Supabase client using the composable
  const supabase = useSupabaseClient()

  // Getters
  const hasProfile = computed(() => !!profile.value)

  // Actions
  const fetchProfile = async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    try {
      loading.value = true
      error.value = null

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) throw new Error('No authenticated user')
      
      userId.value = user.id

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      if (data) {
        profile.value = mapProfileToFormData(data)
        return profile.value
      }

      return null
    } catch (err: any) {
      logError('Error fetching profile:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (formData: ProfileFormData) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    try {
      loading.value = true
      error.value = null
      success.value = false

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) throw new Error('No authenticated user')

      const profileData = mapFormDataToProfile(formData)
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        })

      if (updateError) throw updateError

      profile.value = formData
      success.value = true
      return profile.value
    } catch (err: any) {
      logError('Error updating profile:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const resetProfile = () => {
    profile.value = null
    error.value = null
    loading.value = false
    success.value = false
  }

  return {
    // State
    profile,
    loading,
    error,
    success,
    userId,
    // Getters
    hasProfile,
    // Actions
    fetchProfile,
    updateProfile,
    resetProfile
  }
})