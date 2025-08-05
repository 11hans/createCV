import { useRouter, useRoute } from '#imports'
import { useToast } from '@/components/ui/toast'
import { useAuthStore } from '../stores/auth'
import { safeGetUser } from '~/utils/supabase-auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const router = useRouter()
  const route = useRoute()
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  const authStore = useAuthStore()
  
  // Check if we're on a public page
  const isPublicRoute = route.path === '/' || 
                       route.path.startsWith('/public') || 
                       route.path.startsWith('/auth') ||
                       route.path.includes('/api/auth/');
  
  // Wait for Supabase to be initialized
  if (nuxtApp.$supabaseInitialized) {
    await nuxtApp.$supabaseInitialized
  }

  // Fetch initial user
  try {
    // Use our safer method to get the user
    const { user, error } = await safeGetUser()
    
    if (error) {
      // Only log warnings for protected routes
      if (!isPublicRoute && !error.message.includes('Auth session missing')) {
        console.warn('Initial auth state error:', error.message)
      }
    } else if (user) {
      await authStore.setUser(user)
    } else if (!isPublicRoute) {
      // Only log for protected routes
      log('No user found during initialization')
    }
  } catch (err) {
    // Only log errors for protected routes
    if (!isPublicRoute) {
      logError('Failed to check initial auth state:', err)
    }
  }

  // Only run client-side code in the browser
  if (process.client) {
    supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle session changes
      try {
        // Only log for non-public routes or significant events
        if (!isPublicRoute || ['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) {
          log('Auth state changed:', event)
        }
        
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              await authStore.setUser(session.user)
            } else {
              await authStore.fetchUser()
            }
            
            if (route.query.email_confirmed) {
              toast({
                title: "Success",
                description: "Email confirmed successfully! You can now log in.",
                duration: 5000,
              })
              router.replace({
                path: '/auth/login',
                query: { ...route.query, email_confirmed: undefined }
              })
            } else {
              // Only redirect to dashboard if the user is on an auth page
              // Otherwise, leave them where they are (e.g., in /dashboard/quotes/new)
              if (route.path.startsWith('/auth/')) {
                router.replace('/dashboard')
              }
            }
            break;

          case 'SIGNED_OUT':
            authStore.clearUser();
            router.replace('/auth/login');
            break;

          case 'USER_UPDATED':
            if (session?.user) {
              await authStore.setUser(session.user)
            } else {
              await authStore.fetchUser()
            }
            
            const user = session?.user
            if (user?.email_confirmed_at) {
              toast({
                title: "Success",
                description: "Email confirmed successfully! You can now log in.",
                duration: 5000,
              })
              router.replace('/auth/login')
            }
            break
            
          case 'PASSWORD_RECOVERY':
            router.replace('/auth/reset-password')
            break;
            
          case 'TOKEN_REFRESHED':
            log('Token refreshed, updating user data')
            // Refresh the user data when token is refreshed
            if (session?.user) {
              await authStore.setUser(session.user)
            } else {
              await authStore.fetchUser()
            }
            break
        }
      } catch (err) {
        logError('Auth state change error:', err)
      }
    })
  }
})