/**
 * This plugin properly initializes Supabase sessions at application startup
 * It should run before the auth plugin
 */
import { logger } from '~/utils/logger';

export default defineNuxtPlugin({
  name: 'supabase-init',
  enforce: 'pre', // Make sure this runs before auth plugin
  async setup() {
    logger.log('Initializing Supabase session...')
    
    // Check if Supabase environment variables are set
    const config = useRuntimeConfig();
    const supabaseUrl = config.public.supabase?.url;
    const supabaseKey = config.public.supabase?.key;
    
    if (!supabaseUrl || !supabaseKey) {
      logger.warn('Supabase URL or key is missing. Authentication features will not work.');
      // Return early with a resolved promise to prevent blocking the app
      return {
        provide: {
          supabaseInitialized: Promise.resolve()
        }
      };
    }
    
    const supabase = useSupabaseClient()
    
    // Create a promise that resolves when initialization is complete
    const initPromise = new Promise<void>(async (resolve) => {
      try {
        if (process.client) {
          // Clear any potentially corrupted session data
          const storageKey = 'sb-' + supabaseUrl.replace(/^https?:\/\//, '').replace(/\./g, '-') + '-auth-token'
          const hasToken = localStorage.getItem(storageKey) !== null
          
          if (hasToken) {
            try {
              // Parse the stored session to check if it's valid JSON
              const storedSession = localStorage.getItem(storageKey)
              if (storedSession) {
                try {
                  JSON.parse(storedSession)
                } catch (e) {
                  // If it's not valid JSON, clear it
                  logger.warn('Found corrupted session data, clearing it')
                  localStorage.removeItem(storageKey)
                }
              }
            } catch (e) {
              logger.error('Error checking stored session:', e)
            }
          }
        }
        
        // Always check for an existing session first
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          logger.error('Failed to get initial session:', sessionError.message)
          resolve()
          return
        }
        
        if (sessionData.session) {
          logger.log('Found existing session, refreshing it...')
          // Always refresh the session on app init
          await supabase.auth.refreshSession()
          resolve()
        } else if (process.client) {
          // Check for token in storage
          const storageKey = 'sb-' + supabaseUrl.replace(/^https?:\/\//, '').replace(/\./g, '-') + '-auth-token'
          const hasToken = localStorage.getItem(storageKey) !== null
          
          if (hasToken) {
            logger.log('Found token in storage, attempting to recover session...')
            try {
              const { error: refreshError } = await supabase.auth.refreshSession()
              if (refreshError) {
                logger.warn('Failed to refresh session from storage:', refreshError.message)
              }
            } catch (e) {
              logger.error('Error refreshing session:', e)
            }
          }
          resolve()
        } else {
          resolve()
        }
      } catch (err) {
        logger.error('Error initializing Supabase session:', err)
        resolve() // Resolve anyway to not block the app
      }
    })
    
    // Make the initialization promise available globally
    return {
      provide: {
        supabaseInitialized: initPromise
      }
    }
  }
}) 