import { useState, computed } from '#imports'

export function useFormState<T extends object>(key: string, initialState: T) {
  // For quote creation, check if we need to reset the state
  if (key === 'quoteItems_new' && process.client) {
    // Try to get the existing state
    try {
      const existingState = useState<T>(key)
      
      // If we're starting a new quote creation session, reset the state
      if (window.location.pathname.includes('/dashboard/quotes/new') && 
          (!existingState.value || 
           (Array.isArray(existingState.value) && existingState.value.length === 0))) {
        log('Resetting quote items state for new session')
        existingState.value = JSON.parse(JSON.stringify(initialState))
      }
    } catch (e) {
      logError('Error checking existing state:', e)
    }
  }
  
  // For edit mode, ensure we have a clean state
  if (key.startsWith('quoteItems_edit_') && process.client) {
    try {
      // Check if we're in edit mode
      if (window.location.pathname.includes('/edit')) {
        log(`Initializing form state for edit mode: ${key}`)
      }
    } catch (e) {
      logError('Error checking edit mode:', e)
    }
  }
  
  // Create state using useState to ensure proper SSR handling
  // Use a factory function to ensure we only initialize once
  const state = useState<T>(key, () => {
    log(`Initializing form state for key: ${key}`)
    
    // Always use the initial state for quote items in a new session
    if (key === 'quoteItems_new' && process.client) {
      log('Using initial state for quote items')
      return JSON.parse(JSON.stringify(initialState))
    }
    
    // For edit mode, we'll initialize with empty state and let the component fill it
    if (key.startsWith('quoteItems_edit_') && process.client) {
      log('Initializing empty state for edit mode')
      // Return empty state for edit mode - will be filled from store
      if (Array.isArray(initialState)) {
        return [] as unknown as T
      }
    }
    
    // Default to initial state
    return JSON.parse(JSON.stringify(initialState))
  })
  
  // Create a serializable copy of the state for watching
  const formData = computed(() => {
    return JSON.parse(JSON.stringify(state.value))
  })
  
  // Update state function that ensures data is serializable
  const updateState = (newValue: Partial<T>) => {
    state.value = {
      ...state.value,
      ...JSON.parse(JSON.stringify(newValue))
    }
  }
  
  return {
    state,
    formData,
    updateState
  }
} 