import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

interface WindowSwitchingOptions {
  // The page identifier (e.g., 'quote-new', 'quote-edit', 'quote-detail')
  pageId: string;
  
  // The ID of the item being viewed/edited (optional)
  itemId?: string;
  
  // Max time in milliseconds to consider as window switching (default: 3 minutes)
  maxSwitchTime?: number;
}

export function useWindowSwitching(options: WindowSwitchingOptions) {
  const router = useRouter()
  const isSwitchingWindows = ref(false)
  
  // Default max time is 3 minutes
  const maxSwitchTime = options.maxSwitchTime || 180000
  
  // Storage keys - use consistent prefixes
  const storageKeyPrefix = 'qf_'
  const pageKey = `${storageKeyPrefix}on_${options.pageId}_page`
  const itemKey = options.itemId ? `${storageKeyPrefix}${options.pageId}_id` : null
  const blurTimeKey = `${storageKeyPrefix}blur_time`
  const switchingKey = `${storageKeyPrefix}is_switching_windows`
  
  // Check if we're switching windows
  const checkWindowSwitchingState = () => {
    if (!process.client) return false
    
    const storedSwitchingState = sessionStorage.getItem(switchingKey)
    const blurTime = sessionStorage.getItem(blurTimeKey)
    const timeSinceBlur = blurTime ? Date.now() - parseInt(blurTime) : null
    
    // Determine if we're switching windows
    const shouldBeMarkedAsSwitching = 
      storedSwitchingState === 'true' ||
      (timeSinceBlur !== null && timeSinceBlur < maxSwitchTime)
    
    isSwitchingWindows.value = shouldBeMarkedAsSwitching
    return shouldBeMarkedAsSwitching
  }
  
  // Handle window blur - user is leaving the tab/window
  const handleWindowBlur = () => {
    if (!process.client) return
    
    log(`Window lost focus (${options.pageId})`)
    
    // Set the switching windows flag
    isSwitchingWindows.value = true
    sessionStorage.setItem(switchingKey, 'true')
    sessionStorage.setItem(blurTimeKey, Date.now().toString())
  }
  
  // Handle window focus - user is returning to the tab/window
  const handleWindowFocus = () => {
    if (!process.client) return
    
    log(`Window regained focus (${options.pageId})`)
    
    // Check if we're returning within the time threshold
    const blurTime = sessionStorage.getItem(blurTimeKey)
    const timeDiff = blurTime ? Date.now() - parseInt(blurTime) : 0
    
    if (timeDiff < maxSwitchTime) {
      log(`Returning within ${maxSwitchTime/1000} seconds, keeping state`)
      
      // Keep the switching flag true briefly to ensure navigation guards don't trigger
      // Then gradually clean up
      setTimeout(() => {
        isSwitchingWindows.value = false
        sessionStorage.removeItem(switchingKey)
      }, 1000)
    } else {
      // Reset immediately if returning after a long time
      isSwitchingWindows.value = false
      sessionStorage.removeItem(switchingKey)
    }
  }
  
  // Setup function
  const setupWindowSwitching = () => {
    if (!process.client) return { cleanup: () => {} }
    
    // Set page flags
    sessionStorage.setItem(pageKey, 'true')
    if (itemKey && options.itemId) {
      sessionStorage.setItem(itemKey, options.itemId)
    }
    
    // Check existing state immediately
    checkWindowSwitchingState()
    
    // Add event listeners
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)
    
    // Setup navigation guard
    const unregisterGuard = router.beforeEach((to, from, next) => {
      // Check window switching state
      const isSwitching = checkWindowSwitchingState()
      
      log(`Navigation guard (${options.pageId}):`, {
        from: from.path,
        to: to.path,
        isSwitchingWindows: isSwitchingWindows.value,
        isSwitching
      })
      
      // If switching windows, set flag to make sure it persists
      if (isSwitching) {
        log('Allowing navigation because we are just switching windows')
        sessionStorage.setItem(switchingKey, 'true')
      }
      
      // Always continue navigation
      next()
    })
    
    // Return cleanup function
    return {
      cleanup: () => {
        // Remove event listeners
        window.removeEventListener('blur', handleWindowBlur)
        window.removeEventListener('focus', handleWindowFocus)
        
        // Unregister navigation guard
        unregisterGuard()
        
        // Don't clear flags if we're switching windows
        if (!isSwitchingWindows.value) {
          sessionStorage.removeItem(pageKey)
          if (itemKey) sessionStorage.removeItem(itemKey)
          sessionStorage.removeItem(blurTimeKey)
          sessionStorage.removeItem(switchingKey)
        }
      }
    }
  }
  
  // Ref to store cleanup function
  const cleanupRef = ref<(() => void) | null>(null)
  
  // Setup on mount
  onMounted(() => {
    const { cleanup } = setupWindowSwitching()
    cleanupRef.value = cleanup
  })
  
  // Cleanup on unmount
  onBeforeUnmount(() => {
    if (cleanupRef.value) {
      cleanupRef.value()
    }
  })
  
  return {
    isSwitchingWindows,
    checkWindowSwitchingState,
    handleWindowBlur,
    handleWindowFocus
  }
} 