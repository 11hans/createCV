import type { User } from '@supabase/supabase-js'

/**
 * Safely gets the current user session from Supabase
 * Always uses getSession() first, which is more reliable than getUser()
 */
export async function safeGetUser(): Promise<{
  user: User | null;
  error: Error | null;
}> {
  const supabase = useSupabaseClient()
  
  try {
    const { data, error } = await supabase.auth.getUser()
    
    if (error) {
      return { user: null, error }
    }
    
    return { user: data.user, error: null }
  } catch (e) {
    return { 
      user: null, 
      error: new Error('Failed to get user: ' + (e instanceof Error ? e.message : String(e))) 
    }
  }
}

/**
 * Safely signs in a user with email and password
 */
export async function safeSignIn(email: string, password: string) {
  const supabase = useSupabaseClient()
  
  try {
    // First ensure we don't have any existing session
    if (process.client) {
      // Try to sign out first to clear any existing session
      try {
        await supabase.auth.signOut()
      } catch (e) {
        console.warn('Error during pre-signin signout:', e)
      }
    }
    
    // Now sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { data, error }
  } catch (e) {
    logError('Sign in error:', e)
    return { 
      data: null, 
      error: e instanceof Error ? e : new Error('Unknown sign in error') 
    }
  }
}

/**
 * Safely signs out a user
 */
export async function safeSignOut() {
  const supabase = useSupabaseClient()
  
  try {
    // First get the session to check if we're actually signed in
    const { data: sessionData } = await supabase.auth.getSession()
    
    if (!sessionData.session) {
      log('No active session to sign out from')
      return { error: null }
    }
    
    // Now sign out
    return await supabase.auth.signOut()
  } catch (e) {
    logError('Sign out error:', e)
    return { 
      error: e instanceof Error ? e : new Error('Unknown sign out error') 
    }
  }
}

// A more comprehensive function that handles session refreshes
export async function safeCheckSession() {
  try {
    // First, try to get the current session
    const { data: sessionData, error: sessionError } = await useSupabaseClient().auth.getSession()
    
    if (sessionError) {
      return { session: null, user: null, error: sessionError }
    }
    
    const session = sessionData?.session
    
    // If we have a session, try to refresh it
    if (session) {
      try {
        const { data: refreshData, error: refreshError } = await useSupabaseClient().auth.refreshSession()
        
        if (refreshError) {
          return { session, user: session.user, error: refreshError }
        }
        
        return { 
          session: refreshData.session, 
          user: refreshData.session?.user || session.user, 
          error: null 
        }
      } catch (refreshException) {
        // If refresh fails, return the original session
        return { 
          session, 
          user: session.user, 
          error: new Error('Session refresh failed: ' + 
            (refreshException instanceof Error ? refreshException.message : String(refreshException))) 
        }
      }
    }
    
    // No session
    return { session: null, user: null, error: null }
  } catch (e) {
    return { 
      session: null, 
      user: null, 
      error: new Error('Failed to check session: ' + (e instanceof Error ? e.message : String(e))) 
    }
  }
} 