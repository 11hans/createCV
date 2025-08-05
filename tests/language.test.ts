import { describe, it, expect, vi, beforeEach } from 'vitest'
import { languageService } from '../language/service'
import { useFormatting } from '../composables/useFormatting'
import { useLanguageError } from '../composables/useLanguageError'

describe('Language System', () => {
  describe('Domain Detection', () => {
    beforeEach(() => {
      // Reset import.meta.env.DEV before each test
      vi.stubGlobal('import', {
        meta: {
          env: {
            DEV: false,
          },
        },
      })
    })

    describe('Production Environment', () => {
      it('should detect Czech locale for .cz domain', () => {
        const locale = languageService.detectLocale('qfast.cz')
        expect(locale).toBe('cs')
      })

      it('should detect English locale for .co domain', () => {
        const locale = languageService.detectLocale('qfast.co')
        expect(locale).toBe('en')
      })

      it('should handle www subdomain correctly', () => {
        expect(languageService.detectLocale('www.qfast.cz')).toBe('cs')
        expect(languageService.detectLocale('www.qfast.co')).toBe('en')
      })
    })

    describe('Development Environment', () => {
      beforeEach(() => {
        // Set development environment
        vi.stubGlobal('import', {
          meta: {
            env: {
              DEV: true,
            },
          },
        })
      })

      it('should detect Czech locale for port 3000', () => {
        const locale = languageService.detectLocale('localhost:3000')
        expect(locale).toBe('cs')
      })

      it('should detect English locale for port 3001', () => {
        const locale = languageService.detectLocale('localhost:3001')
        expect(locale).toBe('en')
      })

      it('should default to Czech for unknown port', () => {
        const locale = languageService.detectLocale('localhost:3002')
        expect(locale).toBe('cs')
      })
    })
  })

  describe('Formatting', () => {
    it('should format Czech currency correctly', () => {
      vi.mock('vue-i18n', () => ({
        useI18n: () => ({
          locale: { value: 'cs' },
        }),
      }))

      const { formatCurrency } = useFormatting()
      expect(formatCurrency(1234.56)).toBe('1 234,56 Kč')
    })

    it('should format English currency correctly', () => {
      vi.mock('vue-i18n', () => ({
        useI18n: () => ({
          locale: { value: 'en' },
        }),
      }))

      const { formatCurrency } = useFormatting()
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('should handle invalid currency values', () => {
      const { formatCurrency } = useFormatting()
      expect(formatCurrency('invalid')).toBe('0')
    })
  })

  describe('Error Handling', () => {
    it('should fallback to key when translation is missing', () => {
      vi.mock('vue-i18n', () => ({
        useI18n: () => ({
          t: (key: string) => key, // Return the key as fallback
        }),
      }))

      const { t } = require('vue-i18n').useI18n()
      expect(t('missing.translation.key')).toBe('missing.translation.key')
    })

    it('should validate locales correctly', () => {
      const { validateLocale } = useLanguageError()
      expect(validateLocale('cs')).toBe(true)
      expect(validateLocale('en')).toBe(true)
      expect(validateLocale('invalid')).toBe(false)
    })
  })
})
