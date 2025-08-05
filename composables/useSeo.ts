import { useHead } from '#imports'
import type { MetaObject } from '@nuxt/schema'

interface SeoOptions {
  title?: string
  description?: string
  keywords?: string
  image?: string
  type?: string
  author?: string
  structuredData?: Record<string, any>
}

export const useSeo = () => {
  const { currentLocale } = useLanguage()
  const route = useRoute()
  const config = useRuntimeConfig()
  const { t } = useI18n()

  // Cache meta updates to prevent unnecessary re-renders
  const metaCache = ref(new Map<string, MetaObject>())

  const getAlternateLinks = () => {
    const paths = {
      cs: `https://qfast.cz${route.path}`,
      en: `https://qfast.co${route.path}`
    }

    return [
      {
        hreflang: 'cs-CZ',
        href: paths.cs
      },
      {
        hreflang: 'en-US',
        href: paths.en
      },
      {
        hreflang: 'x-default',
        href: paths.cs // Czech as default
      }
    ]
  }

  const generateStructuredData = (options: SeoOptions) => {
    return {
      '@context': 'https://schema.org',
      '@type': options.type || 'WebSite',
      name: options.title,
      description: options.description,
      url: `https://${currentLocale.value === 'en' ? 'qfast.co' : 'qfast.cz'}${route.path}`,
      image: options.image,
      author: {
        '@type': 'Organization',
        name: options.author || 'QFast'
      },
      inLanguage: currentLocale.value === 'en' ? 'en-US' : 'cs-CZ'
    }
  }

  const updateMetaTags = (options: SeoOptions = {}) => {
    const cacheKey = JSON.stringify(options)
    if (metaCache.value.has(cacheKey)) {
      return useHead(metaCache.value.get(cacheKey)!)
    }

    const locale = currentLocale.value === 'en' ? 'en-US' : 'cs-CZ'
    const domain = currentLocale.value === 'en' ? 'qfast.co' : 'qfast.cz'
    const url = `https://${domain}${route.path}`
    
    const meta: MetaObject = {
      title: options.title,
      titleTemplate: (title?: string) => 
        title ? `${title} | ${t('meta.common.siteName', 'QFast')}` : 'QFast',
      meta: [
        // Standard meta tags
        { name: 'description', content: options.description },
        { name: 'keywords', content: options.keywords },
        { name: 'author', content: options.author || 'QFast' },
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        
        // Open Graph
        { property: 'og:locale', content: locale },
        { property: 'og:title', content: options.title },
        { property: 'og:description', content: options.description },
        { property: 'og:image', content: options.image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: options.type || 'website' },
        { property: 'og:site_name', content: 'QFast' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: options.title },
        { name: 'twitter:description', content: options.description },
        { name: 'twitter:image', content: options.image },
        { name: 'twitter:site', content: '@QFast' },
        
        // Additional meta tags
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0094FF' }
      ],
      link: [
        // Canonical and alternate links
        { rel: 'canonical', href: url },
        ...getAlternateLinks().map(link => ({
          rel: 'alternate',
          hreflang: link.hreflang,
          href: link.href
        })),
        // Favicon
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(generateStructuredData(options))
        }
      ]
    }

    // Cache the meta object
    metaCache.value.set(cacheKey, meta)
    
    // Apply meta tags
    useHead(meta)
  }

  const clearMetaCache = () => {
    metaCache.value.clear()
  }

  return {
    updateMetaTags,
    getAlternateLinks,
    generateStructuredData,
    clearMetaCache
  }
}