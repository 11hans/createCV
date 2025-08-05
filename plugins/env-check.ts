/**
 * This plugin checks that critical environment variables are loaded
 */
export default defineNuxtPlugin({
  name: 'env-check',
  enforce: 'pre', // Make sure this runs early
  setup() {
    // Check Supabase environment variables
    const supabaseUrl = process.env.SUPABASE_URL || ''
    // Get Supabase key from environment variables
  const supabaseKey = process.env.SUPABASE_ANON_KEY || ''
    
    log('Environment check:')
    log('- SUPABASE_URL length:', supabaseUrl.length > 0 ? 'OK' : 'MISSING')
    log('- SUPABASE_ANON_KEY length:', supabaseKey.length > 0 ? 'OK' : 'MISSING')
    
    // In Nuxt 3, runtime config is the preferred way to access env vars
    const config = useRuntimeConfig()
    log('Runtime config check:')
    log('- supabase.url:', config.public?.supabase?.url ? 'OK' : 'MISSING')
    log('- supabase.key:', config.public?.supabase?.key ? 'OK' : 'MISSING')
    
    // No need to provide anything
    return {}
  }
}) 