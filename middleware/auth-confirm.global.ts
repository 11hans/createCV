import { useRuntimeConfig } from '#imports'
import type { EmailOtpType } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only intercept requests to /auth/confirm with token_hash
  if (to.path === '/auth/confirm' && to.query.token_hash && to.query.type) {
    try {
      console.info('Auth confirm middleware: redirecting to server handler')
      console.info('NOTE: Make sure you have added this domain to the allowed redirect URLs in your Supabase project settings (Auth > URL Configuration > Redirect URLs)')
      
      const token_hash = to.query.token_hash as string
      const type = to.query.type as EmailOtpType
      const config = useRuntimeConfig()
      
      // Redirect to the server route with the same query parameters
      const apiUrl = `/api/auth/confirm?token_hash=${encodeURIComponent(token_hash)}&type=${encodeURIComponent(type)}`
      return navigateTo(apiUrl)
    } catch (err: any) {
      logError('Error in auth-confirm middleware:', err)
      return navigateTo(`/auth/error?message=${encodeURIComponent(err.message || 'Verification failed')}`)
    }
  }
}) 