import type { LanguageConfig, AvailableLocale } from './types';
import { languageConfig } from './config';
import { logger } from '~/utils/logger'

export class LanguageService {
private config: LanguageConfig;
private isDev: boolean;

constructor(config: LanguageConfig) {
    this.config = config;
    this.isDev = process.env.NODE_ENV === 'development';
}

public detectLocale(hostname: string): AvailableLocale {
    if (!hostname) {
        logger.log(`[LanguageService] No hostname provided, using default: ${this.config.defaultLocale}`);
        return this.config.defaultLocale;
    }

    // Clean the hostname first
    const cleanHostname = this.cleanHostname(hostname);
    
    // Development environment
    if (this.isDev) {
      const port = hostname.split(':')[1];
      if (port && this.config.devPortMap[port]) {
        const locale = this.config.devPortMap[port] as AvailableLocale;
        logger.log(`[LanguageService] Development mode: port ${port} maps to locale ${locale}`);
        return locale;
      }
      logger.log(`[LanguageService] Development mode: no port match, using default: ${this.config.defaultLocale}`);
      return this.config.defaultLocale;
    }

    // Production environment - strict domain matching
    if (cleanHostname === this.config.productionDomains.en) {
        logger.log(`[LanguageService] Matched English domain: ${cleanHostname}`);
        return 'en';
    }
    if (cleanHostname === this.config.productionDomains.cs) {
        logger.log(`[LanguageService] Matched Czech domain: ${cleanHostname}`);
        return 'cs';
    }
    
    // Fallback for preview deployments
    if (cleanHostname.includes('-co') || cleanHostname.endsWith('.co')) {
        logger.log(`[LanguageService] Domain ends with .co, using English: ${cleanHostname}`);
        return 'en';
    }
    
    logger.log(`[LanguageService] No domain match, using default Czech: ${cleanHostname}`);
    return 'cs';
}

 public getTargetDomain(locale: AvailableLocale): string {
   if (this.isDev) {
     const domain = `localhost:${locale === 'en' ? '3001' : '3000'}`;
     logger.log(`[LanguageService] Development target domain for ${locale}: ${domain}`);
     return domain;
   }
   const domain = this.config.productionDomains[locale];
   logger.log(`[LanguageService] Production target domain for ${locale}: ${domain}`);
   return domain;
 }

 public persistLocale(locale: AvailableLocale): void {
   if (!process.client) return;
   
   const localeCookie = useCookie('qfast-locale', {
     maxAge: 31536000, // 1 year
     path: '/',
     sameSite: 'lax',
     secure: process.env.NODE_ENV === 'production',
     // Only set domain in production, and don't use a leading dot as it can cause issues with auth
     domain: this.isDev ? undefined : this.config.productionDomains[locale]
   });
   
   localeCookie.value = locale;
   logger.log(`[LanguageService] Persisted locale ${locale} to cookie`);
 }

 public getPersistedLocale(): AvailableLocale | null {
   if (!process.client) return null;
   
   const localeCookie = useCookie<AvailableLocale>('qfast-locale');
   logger.log(`[LanguageService] Retrieved persisted locale from cookie: ${localeCookie.value || 'none'}`);
   return localeCookie.value || null;
 }

 private cleanHostname(hostname: string): string {
   const cleaned = hostname
     .replace(/^www\./, '')
     .split(':')[0]
     .replace(/\.vercel\.app$/, '')
     // Remove any Vercel preview URL parts
     .replace(/-[a-zA-Z0-9]+-[a-zA-Z0-9]+\.vercel\.app$/, '')
     // Remove any development URLs
     .replace(/\.localhost$/, '');
   
   logger.log(`[LanguageService] Cleaned hostname: ${hostname} → ${cleaned}`);
   return cleaned;
 }
}

export const languageService = new LanguageService(languageConfig);