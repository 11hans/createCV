import type { User, AuthError } from '@supabase/supabase-js'
import { useToast } from '@/components/ui/toast'
import type { AuthState, AuthUser, SignUpOptions } from '~/types/auth'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()
  const { toast } = useToast()

  const getCurrentUser = computed(() => user.value as AuthUser | null)

  
  const state = reactive<AuthState>({
    user: null,
    initialized: false,
    loading: false
  })

    // Handle auth errors
    const handleError = (error: AuthError) => {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message
        })
        return error
      }

      const setUser = async () => {
        try {
          state.loading = true
          
          // Check if we're on a public page
          const route = useRoute()
          const isPublicRoute = route.path === '/' || 
                               route.path.startsWith('/public') || 
                               route.path.startsWith('/auth') ||
                               route.path.includes('/api/auth/');
          
          const { data: { user: authUser }, error } = await supabase.auth.getUser()
          
          if (error) {
            state.user = null
            // Only log errors on protected pages
            if (!isPublicRoute && !error.message.includes('Auth session missing')) {
              logError('Error fetching user:', error)
            }
            return
          }
          
          state.user = authUser as AuthUser
          state.initialized = true
        } catch (err) {
          // Check if we're on a public page before logging errors
          const route = useRoute()
          const isPublicRoute = route.path === '/' || 
                               route.path.startsWith('/public') || 
                               route.path.startsWith('/auth') ||
                               route.path.includes('/api/auth/');
          
          if (!isPublicRoute) {
            logError('Auth initialization error:', err)
            handleError(err as AuthError)
          }
          
          state.user = null
        } finally {
          state.loading = false
        }
      }

  // Initialize auth state
  const initializeAuth = async () => {
    if (state.initialized) return

    await setUser()
  }

  const signUp = async (email: string, password: string, options: SignUpOptions) => {
    try {
      state.loading = true
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: options.name },
          emailRedirectTo: process.env.NODE_ENV === 'production'
            ? 'https://q-fast-johns-projects-7011cf4d.vercel.app/auth/confirm'
            : 'http://localhost:3000/auth/confirm'
        }
      })
      
      if (signUpError) throw signUpError
      
      toast({
        title: "Success",
        description: "Please check your email to confirm your account."
      })
      
      // Store the email for potential resend
      if (process.client) {
        window.localStorage.setItem('confirmEmail', email)
      }
      
      return data
    } catch (err) {
      throw handleError(err as AuthError)
    } finally {
      state.loading = false
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      state.loading = true
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (signInError) throw signInError
      
      state.user = data.user as AuthUser

      return data
    } catch (err) {
      throw handleError(err as AuthError)
    } finally {
      state.loading = false
    }
  }

  const signOut = async () => {
    try {
      state.loading = true
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) throw signOutError

      state.user = null
      router.push('/auth/login')
    } catch (err) {
      throw handleError(err as AuthError)
    } finally {
      state.loading = false
    }
  }

  return {
    user: getCurrentUser,
    isLoading: readonly(computed(() => state.loading)),
    isInitialized: readonly(computed(() => state.initialized)),
    initializeAuth,
    signUp,
    signIn,
    signOut
  }
}