// plugins/i18n.ts
import { languageService } from '~/language/service';
import type { AvailableLocale } from '~/language/types';
import { logger } from '~/utils/logger';

const initializeLocale = (nuxtApp: any) => {
  try {
    // Check if i18n is properly initialized
    const globalProperties = nuxtApp.vueApp.config.globalProperties;
    if (!globalProperties.$i18n) {
      logger.error('i18n is not properly initialized');
      return;
    }
    
    const { $i18n } = globalProperties;
    const cookie = useCookie<AvailableLocale>('qfast-locale');
    const isDev = import.meta.env.DEV;
    const hostname = process.client 
        ? window.location.hostname + (window.location.port ? ':' + window.location.port : '') 
        : useRequestHeaders(['host']).host || '';
    const detectedLocale = languageService.detectLocale(hostname);
    const persistedLocale = languageService.getPersistedLocale();
    // Use detected locale by default in dev
    const newLocale = isDev && persistedLocale ? persistedLocale : detectedLocale;
    
    if ($i18n.locale !== newLocale) {
      $i18n.locale = newLocale;
      cookie.value = newLocale;
      languageService.persistLocale(newLocale);
      logger.log('[i18n Plugin] Locale updated:', newLocale);
    }

    if (process.client) {
      document.documentElement.lang = $i18n.locale;
    }
  } catch (error) {
    logger.error('[i18n Plugin] Error initializing locale:', error);
  }
};

export default defineNuxtPlugin((nuxtApp) => {
  try {
    initializeLocale(nuxtApp);

    if (import.meta.env.DEV) {
      const globalProperties = nuxtApp.vueApp.config.globalProperties;
      if (!globalProperties.$i18n) {
        logger.error('[i18n Plugin] i18n is not properly initialized');
        return;
      }
      
      const { $i18n } = globalProperties;
      const cookie = useCookie<AvailableLocale>('qfast-locale');
      const hostname = process.client 
        ? window.location.hostname + (window.location.port ? ':' + window.location.port : '') 
        : useRequestHeaders(['host']).host || '';

      logger.log('[i18n Plugin] Initialized:', {
        currentLocale: $i18n.locale,
        hostname,
        cookie: cookie.value,
        persistedLocale: languageService.getPersistedLocale()
      });
    }
  } catch (error) {
    logger.error('[i18n Plugin] Error in plugin:', error);
  }
});