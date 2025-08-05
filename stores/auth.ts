import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { safeGetUser } from '~/utils/supabase-auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
      this.error = null
      this.initialized = true
      return this.user
    },
    
    async fetchUser() {
      try {
        this.loading = true
        this.error = null
        
        // Use the safer utility function that handles all edge cases
        const { user, error } = await safeGetUser()
        
        if (error) {
          this.error = error.message
          logError('Error in fetchUser:', error)
          return null
        }
        
        if (user) {
          this.user = user
          this.initialized = true
          return user
        }
        
        // No user found even after all attempts
        this.user = null
        this.initialized = true
        return null
      } catch (err) {
        this.user = null
        this.error = err instanceof Error ? err.message : 'Unknown error'
        logError('Unexpected error in fetchUser:', err)
        return null
      } finally {
        this.loading = false
      }
    },
    
    clearUser() {
      this.user = null
      this.error = null
    }
  }
})