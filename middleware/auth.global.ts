// middleware/auth.global.ts
import { safeGetUser } from '~/utils/supabase-auth'

export default defineNuxtRouteMiddleware(async (to) => {
  // Check if we're returning to the quote creation page after switching windows
  const isReturningToQuoteCreation = process.client && 
    to.path === '/dashboard/quotes/new' && 
    (sessionStorage.getItem('onQuoteCreationPage') === 'true' || localStorage.getItem('quoteState') !== null)
  
  // Skip middleware for public routes or when returning to quote creation
  if (to.meta.public || // Check meta.public flag
      to.path === '/' || // Allow root path
      to.path.startsWith('/public/') || // Allow public directory
      to.path.startsWith('/auth/confirm') || 
      to.path.startsWith('/auth/callback') || 
      to.path.startsWith('/auth/error') ||
      to.path.startsWith('/auth/login') ||
      to.path.startsWith('/dashboard/quotes/edit-') || // Allow edit routes
      to.path === '/dashboard/quotes/new' || // Allow quote creation page without auth check
      isReturningToQuoteCreation) { // Allow returning to quote creation after window switch
    return
  }
  
  // Only check auth for protected routes
  if (to.path.startsWith('/dashboard')) {
    const authStore = useAuthStore()
    
    try {
      // First check if we already have a user in the store and we're already initialized
      if (authStore.isAuthenticated && authStore.initialized) {
        return // User is already authenticated
      }
      
      // Use our safer method to get the user
      const { user, error } = await safeGetUser()
      
      if (error) {
        console.warn('Auth middleware error:', error.message)
        return navigateTo('/auth/login')
      }
      
      if (user) {
        // User is authenticated
        authStore.setUser(user)
        return
      }
      
      // No user found after all attempts
      console.warn('No authenticated user found in middleware')
      return navigateTo('/auth/login')
    } catch (err) {
      logError('Auth middleware unexpected error:', err)
      return navigateTo('/auth/login')
    }
  }
  
  // Allow all other routes to pass through
  return
})