// server/api/auth/confirm.ts
import { createClient, type EmailOtpType } from '@supabase/supabase-js'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()

  try {
    console.info('Starting email confirmation process')
    
    const query = getQuery(event)
    const token_hash = query.token_hash as string
    const type = query.type as EmailOtpType
    const next = query.next as string || '/auth/login'

    if (!token_hash || !type) {
      logError('Missing token_hash or type')
      return sendRedirect(event, '/auth/error?message=Invalid confirmation link')
    }

    // Create a Supabase client
    const supabase = createClient(
      config.public.supabase.url as string,
      config.public.supabase.key as string
    )

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
      options: {
        redirectTo: `${config.public.siteUrl}/auth/login?email_confirmed=true`
      }
    })

    if (error) {
      logError('OTP verification error:', error)
      logError('Error details:', JSON.stringify(error))
      return sendRedirect(event, `/auth/error?message=${encodeURIComponent(error.message)}`)
    }

    return sendRedirect(event, `/auth/login?email_confirmed=true`)
  } catch (err) {
    logError('Confirm handler error:', err)
    return sendRedirect(event, `/auth/error?message=An error occurred during confirmation`)
  }
})