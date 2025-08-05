import { useQuoteStore } from '~/stores/quote'
import { useState } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  // Get the store
  const quoteStore = useQuoteStore()
  
  // Check if we're on a quote route
  if (to.path.startsWith('/dashboard/quotes/')) {
    const segments = to.path.split('/')
    // If we have an ID and 'edit' in the path, ensure we're using the edit page
    if (segments.length === 5 && segments[4] === 'edit') {
      log('Quote edit route detected:', to.path)
      // Ensure we're using the edit page component
      return
    }
    
    // If we have just an ID, ensure we're using the view page component
    if (segments.length === 4) {
      log('Quote view route detected:', to.path)
      return
    }
  }
  
  // Check if we're just switching windows
  const isSwitchingWindows = process.client && (
    // Check sessionStorage first (more reliable)
    sessionStorage.getItem('onQuoteCreationPage') === 'true' ||
    // Fall back to localStorage
    localStorage.getItem('quoteState') !== null
  )
  
  // If we're returning to the quote creation page after switching windows
  if (to.path === '/dashboard/quotes/new' && isSwitchingWindows) {
    log('Returning to quote creation page after window switch, preserving data')
    return
  }
  
  // Handle abandoning quote creation process
  // If navigating away from quote creation page
  if (from.path.includes('/dashboard/quotes/new')) {
    // And going to any other page that's not the quote creation page
    // Only clear data if we're actually navigating to a different page within the app
    // This prevents clearing data when just switching browser windows/tabs
    if (!to.path.includes('/dashboard/quotes/new') && to.path !== from.path && !isSwitchingWindows) {
      log('Abandoning quote creation process, clearing form data')
      
      // Clear the form data in the store
      quoteStore.clearFormData()
      
      // Also clear the useState data for the quote items
      if (process.client) {
        // Clear localStorage cache for the form
        localStorage.removeItem('quoteItems')
        localStorage.removeItem('quoteForm')
        localStorage.removeItem('quoteState')
        
        // Clear sessionStorage flags
        sessionStorage.removeItem('onQuoteCreationPage')
        sessionStorage.removeItem('quotePageBlurTime')
        
        // Clear the useState data
        try {
          // Reset the useState for quoteItems_new
          const quoteItems = useState('quoteItems_new')
          if (quoteItems.value) {
            quoteItems.value = []
          }
        } catch (e) {
          logError('Error clearing useState:', e)
        }
        
        log('Cleared all quote data')
      }
    } else if (isSwitchingWindows) {
      log('Detected window switching, preserving quote data')
    }
  }
  
  // Also handle navigating away from edit page
  if (from.path.includes('/dashboard/quotes/') && from.path.includes('/edit')) {
    // And going to a different section (not within the same edit page)
    if (!to.path.includes(from.path) && to.path !== from.path && !isSwitchingWindows) {
      log('Navigating away from quote edit page')
      
      // No need to clear data when editing, as we want to preserve it
      // But we should clear any temporary storage
      if (process.client) {
        localStorage.removeItem('quoteItems')
        log('Cleared localStorage cache for quote items')
      }
    }
  }
  
  // Handle navigating to the quote creation page
  if (to.path.includes('/dashboard/quotes/new') && !from.path.includes('/dashboard/quotes/new')) {
    // Only clear if we're not just switching windows
    if (!isSwitchingWindows) {
      log('Navigating to quote creation page, ensuring clean state')
      
      // Clear the form data to ensure a fresh start
      quoteStore.clearFormData()
      
      // Also clear the useState data
      if (process.client) {
        try {
          // Reset the useState for quoteItems_new
          const quoteItems = useState('quoteItems_new')
          if (quoteItems.value) {
            quoteItems.value = []
          }
        } catch (e) {
          logError('Error clearing useState:', e)
        }
      }
    } else {
      log('Returning to quote creation page from window switch, preserving data')
    }
  }
}) 