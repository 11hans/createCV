import { useLanguage } from './useLanguage'
import { useI18n } from 'vue-i18n'
import { languageService } from '../language/service'

/**
 * Specialized composable for Dashboard routes to ensure they always use
 * the correct language based on the current domain
 */
export function useDashboardLocale() {
  const { locale } = useI18n()
  const { detectAndSetLocale } = useLanguage()
  
  // Immediately detect and set the locale on component initialization
  onMounted(() => {
    if (process.client) {
      // Get current hostname and detect locale
      const hostname = window.location.hostname + (window.location.port ? ':' + window.location.port : '')
      const detectedLocale = languageService.detectLocale(hostname)
      
      // Force update locale if it doesn't match the detected one
      if (locale.value !== detectedLocale) {
        log(`[Dashboard] Forcing locale update from ${locale.value} to ${detectedLocale}`)
        locale.value = detectedLocale
        document.documentElement.lang = detectedLocale
      }
      
      log(`[Dashboard] Current locale confirmed: ${locale.value}`)
    }
  })
  
  // Force reactivity of translations by watching locale changes
  const t = (key: string, fallback?: string) => {
    const { t: translate } = useI18n()
    return computed(() => translate(key) || fallback || key)
  }
  
  // Also trigger detection on tab visibility changes
  if (process.client) {
    useEventListener(window, 'visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        log('[Dashboard] Tab became visible, re-detecting locale')
        detectAndSetLocale()
      }
    })
  }
  
  return {
    forceLocaleUpdate: detectAndSetLocale,
    t
  }
} 