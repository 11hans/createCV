import { useQuoteStore } from '~/stores/quote'
import { useAuth } from '~/composables/useAuth'

export enum QuoteMode {
  PUBLIC = 'public',
  NEW = 'new',
  EDIT = 'edit'
}

// Define types for event handlers
interface EventHandlers {
  blur: () => void;
  focus: () => void;
}

// Define the return type for the composable
interface QuoteStateReturn {
  initializeStore: () => Promise<void>;
  validateOperation: (operation: string) => Promise<boolean>;
  mode: QuoteMode;
  isSwitchingWindows: Ref<boolean>;
  handleWindowBlur: () => void;
  handleWindowFocus: () => void;
  eventHandlers?: EventHandlers;
  beforeUnloadHandler?: (event: BeforeUnloadEvent) => void;
  unregisterGuard?: () => void;
  checkWindowSwitchingState: () => boolean;
}

export function useQuoteState(mode: QuoteMode): QuoteStateReturn {
  const store = useQuoteStore()
  const { user } = useAuth()
  
  // Add a flag to track if we're just switching windows
  const isSwitchingWindows = ref(false)

  // Initialize store based on mode
  const initializeStore = async () => {
    // Check if we're restoring from a window switch
    if (process.client) {
      // Check sessionStorage first for the flag we set
      const onQuoteCreationPage = sessionStorage.getItem('onQuoteCreationPage')
      
      if (onQuoteCreationPage === 'true') {
        log('Detected return to quote creation page, attempting to restore state')
        const restored = store.restoreQuoteData()
        if (restored) {
          log('Successfully restored quote data from previous session')
          return
        }
      }
    }
    
    // If not restoring, initialize based on mode
    if (mode === QuoteMode.NEW) {
      // For new quotes, we have already cleared the store in the page component
      log('Initializing store for new quote creation')
    } 
    else if (mode === QuoteMode.EDIT) {
      // For editing, we'll load the quote in the page component
      log('Initializing store for quote editing')
    }
    else if (mode === QuoteMode.PUBLIC) {
      // For public quotes, initialize with empty state
      log('Initializing store for public quote')
      store.resetForm()
      
      // Set terms to indicate public quote
      store.updateTerms({
        ...store.terms,
        status: 'draft',
        note: 'Public quote created by anonymous user'
      })
    }
  }
  
  // Handler for when window loses focus - can be directly called or used as event handler
  const handleWindowBlur = () => {
    log('Window lost focus')
    
    if (process.client) {
      // Mark that we're switching windows
      isSwitchingWindows.value = true
      sessionStorage.setItem('isSwitchingWindows', 'true')
      
      // Persist the current state
      if (store.currentStep > 1 || store.items.length > 0) {
        log('Auto-saving quote data on blur')
        store.persistQuoteData()
      }
    }
  }
  
  // Handler for when window regains focus
  const handleWindowFocus = () => {
    log('Window regained focus')
    
    if (process.client) {
      // Try to restore data first
      const restored = store.restoreQuoteData()
      if (restored) {
        log('Restored quote data after focus')
      }
      
      // Reset the switching windows flag after a short delay
      // This is to ensure any navigation guard that might run immediately after
      // focus still sees the switching windows flag as true
      setTimeout(() => {
        log('Resetting switching windows flag')
        isSwitchingWindows.value = false
        
        // Clear the sessionStorage flag after another short delay
        setTimeout(() => {
          sessionStorage.removeItem('isSwitchingWindows')
        }, 2000)
      }, 2000)
    }
  }
  
  // Check if the user is switching windows - consolidate all our logic here
  const checkWindowSwitchingState = () => {
    if (!process.client) return false
    
    // Check sessionStorage first for the flag we set
    const storedSwitchingState = sessionStorage.getItem('isSwitchingWindows')
    
    // Check the blur time to see if it's recent
    const blurTime = sessionStorage.getItem('quotePageBlurTime')
    const timeSinceBlur = blurTime ? Date.now() - parseInt(blurTime) : null
    
    // If either the flag is set or we've recently blurred (within 3 minutes)
    // consider it as switching windows
    const shouldBeMarkedAsSwitching = 
      storedSwitchingState === 'true' || 
      (timeSinceBlur !== null && timeSinceBlur < 180000) // 3 minutes
    
    // Update our reactive state
    isSwitchingWindows.value = shouldBeMarkedAsSwitching
    
    // Debug log
    if (shouldBeMarkedAsSwitching) {
      log('Detected window switching:', { 
        storedSwitchingState, 
        blurTime, 
        timeSinceBlur 
      })
    }
    
    return shouldBeMarkedAsSwitching
  }
  
  // Validate that the user can perform operations
  const validateOperation = async (operation: string): Promise<boolean> => {
    if (mode === QuoteMode.PUBLIC) {
      // Public quotes can't be manipulated
      log(`Operation "${operation}" not allowed in public mode`)
      return false
    }
    
    // If we're in a normal mode, ensure the user is authenticated
    if (!user.value?.id) {
      log(`User is not authenticated, operation "${operation}" blocked`)
      return false
    }
    
    return true
  }
  
  return {
    initializeStore,
    validateOperation,
    mode,
    isSwitchingWindows,
    handleWindowBlur,
    handleWindowFocus,
    checkWindowSwitchingState
  }
} 