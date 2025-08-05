import { useState } from '#imports'

/**
 * A composable to explicitly reset form state used in components
 * This is particularly useful for the QuoteItemsForm component which
 * uses a separate state storage that doesn't get reset with other methods
 */
export function useFormStateReset() {
  /**
   * Function to reset a specific form state by key
   */
  const resetFormState = (key: string) => {
    log(`Explicitly resetting form state for key: ${key}`)
    
    if (process.client) {
      try {
        // First try to clear any localStorage data with this key
        localStorage.removeItem(key)
        
        // Set a flag to indicate this state should be reset
        sessionStorage.setItem(`reset_${key}`, 'true')
        
        // Create a fresh useState instance with the key and set it to initial value
        // For 'quoteItems_new', this will be an empty array that the component will fill 
        // with a default item
        const state = useState(key)
        if (state.value) {
          if (Array.isArray(state.value)) {
            state.value = []
            log(`Successfully reset array state for ${key}`)
          } else if (typeof state.value === 'object') {
            state.value = {}
            log(`Successfully reset object state for ${key}`)
          } else {
            state.value = null
            log(`Successfully reset primitive state for ${key}`)
          }
        }
        
        // Also try to access the Nuxt state directly
        if (window.__NUXT__ && window.__NUXT__.state) {
          if (key in window.__NUXT__.state) {
            delete window.__NUXT__.state[key]
            log(`Successfully removed ${key} from Nuxt state`)
          }
        }
        
        return true
      } catch (e) {
        logError(`Error resetting form state for ${key}:`, e)
        return false
      }
    }
    return false
  }

  return {
    resetFormState
  }
} 