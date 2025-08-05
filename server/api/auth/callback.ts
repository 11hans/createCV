import { serverSupabaseClient } from '#supabase/server'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const token_hash = query.token_hash as string
  const type = query.type as 'recovery' | 'signup'
  const next = (query.next as string) ?? '/'

  if (!token_hash || !type) {
    return sendRedirect(event, '/auth/login?error=invalid_token')
  }

  try {
    const supabase = await serverSupabaseClient(event)
    const config = useRuntimeConfig()

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
      options: {
        redirectTo: `${config.public.siteUrl}/auth/callback`
      }
    })

    if (error) {
      return sendRedirect(event, `/auth/login?error=${encodeURIComponent(error.message)}`)
    }
    
    return sendRedirect(event, next)
  } catch (err) {
    logError('Callback error:', err)
    return sendRedirect(event, '/auth/login?error=verification_failed')
  }
})