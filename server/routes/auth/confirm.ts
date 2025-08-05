import { createClient, type EmailOtpType } from '@supabase/supabase-js'
import { H3Event, sendRedirect } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  
  try {
    console.info('Server confirm handler: processing token verification')
    
    // Get query parameters
    const query = getQuery(event)
    const token_hash = query.token_hash as string
    const type = query.type as EmailOtpType
    
    if (!token_hash || !type) {
      logError('Missing required parameters: token_hash or type')
      return sendRedirect(event, '/auth/error?message=Invalid verification link')
    }
    
    // Create a Supabase client for server-side operations
    const supabase = createClient(
      config.public.supabase.url as string,
      config.public.supabase.key as string
    )
    
    // Verify the OTP token
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
      options: {
        redirectTo: `${config.public.siteUrl}/auth/login?email_confirmed=true`
      }
    })
    
    if (error) {
      logError('Token verification error:', error.message)
      logError('Error details:', JSON.stringify(error))
      return sendRedirect(event, `/auth/error?message=${encodeURIComponent(error.message)}`)
    }
    
    // If verified successfully, redirect to login with success message
    return sendRedirect(event, '/auth/login?email_confirmed=true')
  } catch (err: any) {
    logError('Confirm handler error:', err)
    return sendRedirect(event, `/auth/error?message=${encodeURIComponent(err.message || 'Verification failed')}`)
  }
}) 