import type { NuxtConfig } from '@nuxt/schema'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    // Consolidated auth configuration
    auth?: {
      redirects?: {
        login: string
        callback: string
        logout: string
      }
      cookiePolicy?: 'lax' | 'strict'
    }
    
    runtimeConfig?: {
      resendApiKey?: string
      public?: {
        supabase: {
          url: string
          key: string
        }
      }
    }
    supabase?: {
      redirect?: boolean
      redirectOptions?: {
        login?: string
        callback?: string
        exclude?: string[]
      }
      cookieOptions?: {
        maxAge?: number
        secure?: boolean
        sameSite?: string
      }
    }
    i18n?: {
      strategy?: string
      defaultLocale?: string
      detectBrowserLanguage?: boolean
      differentDomains?: boolean
      locales?: Array<{
        code: string
        iso: string
        file: string
        domain: string
        name: string
      }>
      lazy?: boolean
      langDir?: string
      vueI18n?: string
    }
  }
} 