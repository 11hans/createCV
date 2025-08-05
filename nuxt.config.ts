import { defineNuxtConfig } from 'nuxt/config'
import type { NuxtConfig } from '@nuxt/schema'
import type { ModuleOptions as ContentModuleOptions } from '@nuxt/content'

export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: false
  },

  pages: true,

  // Router configuration
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  runtimeConfig: {
    // Private keys that are exposed to the server
    // API key for Resend email service
    resendApiKey: process.env.RESEND_API_KEY,
    // Public keys that are exposed to the client
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,
        // Anonymous key for Supabase authentication
      key: process.env.SUPABASE_ANON_KEY
      },
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  // Vite configuration for HMR
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      }
    }
  },

  devtools: { enabled: true },

  // Development-specific settings
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['nuxt-link'].includes(tag)
    }
  },

  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/i18n',
    '@nuxt/content',
    '@nuxtjs/supabase'
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/variables.css',
    '~/assets/css/forms.css'
  ],

  experimental: {
    viewTransition: true,
    payloadExtraction: false,
    asyncEntry: true
  },

  // Supabase module configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirect: false,
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: [
        '/',
        '/public/**',
        '/auth/**',
        '/api/auth/**',
        '/dashboard/quotes/edit-*'
      ]
    },
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  },

  nitro: {
    preset: 'vercel',
    prerender: {
      routes: [],
      crawlLinks: true,
      failOnError: false,
    },
    routeRules: {
      '/_payload.json': {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      },
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': '*',
          'Vary': 'Origin, Accept-Language',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        cache: {
          maxAge: 60,
          swr: true
        }
      },
      '/quote/preview/**': {
        cache: {
          maxAge: 60,
          swr: true
        }
      },
      '/images/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      },
      '/svg/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      },
      '/cs/**': {
        headers: {
          'Vary': 'Origin, Accept-Language',
          'Content-Language': 'cs',
          'Link': '<https://qfast.co>; rel="alternate"; hreflang="en"'
        }
      },
      '/en/**': {
        headers: {
          'Vary': 'Origin, Accept-Language',
          'Content-Language': 'en',
          'Link': '<https://qfast.cz>; rel="alternate"; hreflang="cs"'
        }
      },
      '/auth/confirm': { ssr: true },
      '/auth/callback': { ssr: true },
      '/api/auth/**': { cors: true },
      '/_nuxt/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      },
      '/css/**': {
        headers: {
          'Content-Type': 'text/css; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      },
      '/**': {
        headers: {
          'Vary': 'Accept-Language, Accept-Encoding',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'X-Robots-Tag': 'index, follow, max-image-preview:large',
          'Content-Security-Policy': process.env.NODE_ENV === 'production' 
            ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://fsgqxdqcqhmjeddzadbj.supabase.co wss://fsgqxdqcqhmjeddzadbj.supabase.co https://api.resend.com; frame-src 'self'; object-src 'none'; base-uri 'self';"
            : ''
        }
      }
    }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'Fast & Professional Quote Management Software | QuoteFast',
      titleTemplate: '%s | QuoteFast',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Quickly create and manage professional quotes with QuoteFast—simplified quote management software built specifically for small businesses, freelancers, and contractors.' },
        { name: 'keywords', content: 'quote management software, professional quotes, small business quoting tool, proposal software, estimate creator, quote generator, quote templates' },
        // Open Graph meta tags for better social sharing
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'QuoteFast' },
        { property: 'og:title', content: 'Fast & Professional Quote Management Software | QuoteFast' },
        { property: 'og:description', content: 'Quickly create and manage professional quotes with QuoteFast—simplified quote management software built specifically for small businesses, freelancers, and contractors.' },
        { property: 'og:image', content: 'https://qfast.cz/images/og-image.jpg' },
        { property: 'og:url', content: 'https://qfast.cz' },
        { property: 'og:locale', content: 'cs_CZ' },
        // Twitter Card meta tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Fast & Professional Quote Management Software | QuoteFast' },
        { name: 'twitter:description', content: 'Quickly create and manage professional quotes with QuoteFast—simplified quote management software built specifically for small businesses, freelancers, and contractors.' },
        { name: 'twitter:image', content: 'https://qfast.cz/images/og-image.jpg' },
        // Additional SEO meta tags
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'author', content: 'QuoteFast' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'canonical',
          href: process.env.NODE_ENV === 'production'
            ? 'https://qfast.cz'
            : 'http://localhost:3000',
          'data-nuxt-canonical': 'true'
        },
        { rel: 'alternate', hreflang: 'cs', href: 'https://qfast.cz' },
        { rel: 'alternate', hreflang: 'en', href: 'https://qfast.co' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://qfast.cz' },
        { rel: 'stylesheet', type: 'text/css', href: '/css/variables.css' },
        { rel: 'stylesheet', type: 'text/css', href: '/css/main.css' },
        { rel: 'stylesheet', type: 'text/css', href: '/css/forms.css' }
      ]
    }
  },

  build: {
    transpile: [
      '@vuepic/vue-datepicker',
      'radix-vue'
    ]
  },

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
    viewer: false
  },

  imports: {
    dirs: ['stores']
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'cs',
    detectBrowserLanguage: false,
    differentDomains: true,
    skipSettingLocaleOnNavigate: false,
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://qfast.cz' 
      : 'http://localhost:3000',
    locales: [
      {
        code: 'cs',
        iso: 'cs-CZ',
        file: 'cs.json',
        domain: process.env.NODE_ENV === 'development' 
          ? 'localhost:3000' 
          : 'qfast.cz'
      },
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        domain: process.env.NODE_ENV === 'development' 
          ? 'localhost:3001' 
          : 'qfast.co'
      }
    ],
    vueI18n: './i18n.config.ts'
  },

  // Add hooks for better domain handling
  hooks: {
    'pages:extend'(pages) {
      // Ensure pages are properly configured for domain-based routing
      pages.forEach(page => {
        if (!page.file?.includes('error')) {
          path: page.path || '/'
        }
      })
    }
  },

  compatibilityDate: '2025-01-28',
})