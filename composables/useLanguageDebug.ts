import { useI18n } from 'vue-i18n'
import { languageService } from '~/language/service'
import { log, debug } from '~/utils/logger'

/**
 * Composable for debugging language/translation issues
 */
export function useLanguageDebug() {
  const { locale, t, te } = useI18n()
  
  // Test keys that should exist in both languages (cs/en)
  const testKeys = [
    'settings.title',
    'settings.saveChanges',
    'settings.company.title',
    'settings.company.description',
    'settings.company.basicInfo',
    'navigation.dashboard',
    'navigation.quotes',
    'navigation.clients',
    'navigation.settings',
    'quotes.title',
    'quotes.empty.title'
  ]
  
  /**
   * Run a diagnostics check to see if translations are loading correctly
   */
  function runDiagnostics() {
    if (process.client) {
      // Use debug for verbose diagnostic info
      debug(`[LanguageDebug] Running diagnostics for locale: ${locale.value}`)
      
      // Check the current domain and expected locale
      const hostname = window.location.hostname + (window.location.port ? ':' + window.location.port : '')
      const detectedLocale = languageService.detectLocale(hostname)
      debug(`Domain: ${hostname}, Detected locale: ${detectedLocale}, Current locale: ${locale.value}`)
      
      // Check if HTML lang attribute is correctly set
      debug(`HTML lang attribute: ${document.documentElement.lang}`)
      
      // Test translation keys
      const results = testKeys.map(key => {
        const exists = te(key)
        const value = exists ? t(key) : null
        return { key, exists, value }
      })
      
      // These will only show in development mode
      if (process.env.NODE_ENV !== 'production') {
        console.group(`[LanguageDebug] Diagnostics for locale: ${locale.value}`)
        console.table(results)
        console.groupEnd()
      }
      
      // Check cookie state
      const cookie = languageService.getPersistedLocale()
      debug(`Locale cookie value: ${cookie}`)
      
      // Check translation for potential problem areas
      debug('Testing specific UI elements:')
      debug(`- "settings.company.description" = "${t('settings.company.description')}"`)
      debug(`- "settings.company.basicInfo" = "${t('settings.company.basicInfo')}"`)
      
      return results
    }
    return []
  }
  
  /**
   * Force reload all translations
   */
  function forceReloadTranslations() {
    if (process.client) {
      // Get detected locale
      const hostname = window.location.hostname + (window.location.port ? ':' + window.location.port : '')
      const detectedLocale = languageService.detectLocale(hostname)
      
      log(`[LanguageDebug] Forcing reload of translations for ${detectedLocale}`)
      
      // Set locale in all available ways
      locale.value = detectedLocale
      document.documentElement.lang = detectedLocale
      languageService.persistLocale(detectedLocale)
      
      // Force page reload for the most aggressive fix
      const shouldReload = confirm('Reload page to fix translations?')
      if (shouldReload) {
        window.location.reload()
      }
    }
  }
  
  return {
    runDiagnostics,
    forceReloadTranslations
  }
} 