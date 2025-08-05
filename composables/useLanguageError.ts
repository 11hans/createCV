import { useI18n } from 'vue-i18n'

interface LanguageError {
  key: string
  error: Error
  timestamp: Date
  locale: string
  context?: Record<string, unknown>
}

export const useLanguageError = () => {
  const { t, te, locale } = useI18n()
  const fallbackLocale = 'en'
  const errorLog = ref<LanguageError[]>([])
  const maxLogSize = 100

  const logError = (key: string, error: Error, context?: Record<string, unknown>) => {
    errorLog.value.push({
      key,
      error,
      timestamp: new Date(),
      locale: locale.value,
      context
    })

    // Keep only last maxLogSize errors
    if (errorLog.value.length > maxLogSize) {
      errorLog.value = errorLog.value.slice(-maxLogSize)
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn(`[Language Error] ${key}:`, error, context)
    }
  }

  const fallbackTranslation = (key: string, error?: Error, context?: Record<string, unknown>): string => {
    // Log error if provided
    if (error) {
      logError(key, error, context)
    }

    // Try current locale with context
    if (context && te(key)) {
      try {
        return t(key, context)
      } catch (e) {
        logError(key, e as Error, context)
      }
    }

    // Try current locale without context
    if (te(key)) {
      try {
        return t(key)
      } catch (e) {
        logError(key, e as Error)
      }
    }

    // Try fallback locale with context
    if (locale.value !== fallbackLocale && context && te(key, fallbackLocale)) {
      try {
        return t(key, { locale: fallbackLocale, ...context })
      } catch (e) {
        logError(key, e as Error, { ...context, fallbackAttempt: true })
      }
    }

    // Try fallback locale without context
    if (locale.value !== fallbackLocale && te(key, fallbackLocale)) {
      try {
        return t(key, { locale: fallbackLocale })
      } catch (e) {
        logError(key, e as Error, { fallbackAttempt: true })
      }
    }

    // Try key parts (for nested keys)
    const keyParts = key.split('.')
    while (keyParts.length > 1) {
      keyParts.pop()
      const partialKey = keyParts.join('.')
      if (te(partialKey)) {
        try {
          return t(partialKey)
        } catch (e) {
          logError(partialKey, e as Error, { originalKey: key })
        }
      }
    }

    // Return key as last resort
    logError(key, new Error('No translation found'), { 
      finalFallback: true,
      availableLocales: [locale.value, fallbackLocale]
    })
    return key
  }

  const handleFormatError = <T>(
    value: T,
    formatter: (val: T) => string,
    fallback: (val: T) => string,
    context?: Record<string, unknown>
  ): string => {
    try {
      return formatter(value)
    } catch (error) {
      logError('format_error', error as Error, { 
        value,
        context,
        formatterName: formatter.name
      })
      return fallback(value)
    }
  }

  const validateLocale = (localeToValidate: string): boolean => {
    const validLocales = ['cs', 'en']
    if (!validLocales.includes(localeToValidate)) {
      logError('invalid_locale', new Error(`Invalid locale: ${localeToValidate}`), {
        validLocales,
        providedLocale: localeToValidate
      })
      return false
    }
    return true
  }

  const getErrorStats = () => {
    const now = new Date()
    return {
      total: errorLog.value.length,
      byKey: errorLog.value.reduce((acc, curr) => {
        acc[curr.key] = (acc[curr.key] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byLocale: errorLog.value.reduce((acc, curr) => {
        acc[curr.locale] = (acc[curr.locale] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      lastError: errorLog.value[errorLog.value.length - 1],
      last24Hours: errorLog.value.filter(
        error => (now.getTime() - error.timestamp.getTime()) < 24 * 60 * 60 * 1000
      ).length
    }
  }

  const clearErrorLog = () => {
    errorLog.value = []
  }

  return {
    fallbackTranslation,
    handleFormatError,
    validateLocale,
    fallbackLocale,
    getErrorStats,
    clearErrorLog,
    errorLog: readonly(errorLog)
  }
} 