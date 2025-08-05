   // server/routes/sitemap.xml.ts
   import { SitemapStream, streamToPromise } from 'sitemap'
   import { defineEventHandler, createError } from 'h3'
   import { languageService } from '~/language/service';
   
   export default defineEventHandler(async (event) => {
   try {
       const hostname = event.headers.get('host') || '';
       const currentLocale = languageService.detectLocale(hostname)
       const baseUrl = languageService.getTargetDomain(currentLocale)
 
       const sitemap = new SitemapStream({
         hostname: baseUrl,
         xmlns: {
           news: false,
           xhtml: true,
           image: true,
           video: false
         }
       })
 
       // Dynamické generování tras
       const routes = [
         { url: '/', changefreq: 'daily', priority: 1.0 },
         // Přidat další důležité cesty
         { url: '/features', changefreq: 'weekly', priority: 0.7 },
         { url: '/pricing', changefreq: 'weekly', priority: 0.9 },
       ]
       
     for (const route of routes) {
       const alternateUrls = [
         {
           hreflang: 'cs',
           href: languageService.getTargetDomain('cs') + route.url
         },
         {
           hreflang: 'en',
           href: languageService.getTargetDomain('en') + route.url
         },
         {
           hreflang: 'x-default',
           href: languageService.getTargetDomain('cs') + route.url
         }
       ]

       sitemap.write({
         ...route,
         lastmod: new Date().toISOString(),
         links: alternateUrls
       })
         }
       
 
       sitemap.end()
       const xml = await streamToPromise(sitemap)
         
       // Vylepšené hlavičky
       event.node.res.setHeader('Content-Type', 'application/xml')
       event.node.res.setHeader('Cache-Control', 'public, max-age=3600')
       event.node.res.setHeader('X-Robots-Tag', 'noindex')
         
       return xml
     } catch (error) {
       logError('Error generating sitemap:', error)
       throw createError({
         statusCode: 500,
         statusMessage: 'Error generating sitemap',
           data: process.env.NODE_ENV === 'development' ? error : undefined
       })
     }
   })