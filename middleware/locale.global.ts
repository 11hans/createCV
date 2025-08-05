import { defineNuxtRouteMiddleware } from 'nuxt/app';
import { languageService } from '~/language/service'; // Import languageService
import type { AvailableLocale } from '~/language/types';

export default defineNuxtRouteMiddleware((to) => {
    const isDev = process.env.NODE_ENV === 'development';
    const isDashboardRoute = to.path.startsWith('/dashboard');
    let lastMiddlewareRun: string | null = null;
    let now = 0;

    // Prevent infinite loops by checking for recent middleware runs
    if (process.client) {
        lastMiddlewareRun = localStorage.getItem('locale_middleware_last_run');
        now = Date.now();
        const middleThreshold = 1500; // 1.5 seconds
        
        if (lastMiddlewareRun && (now - parseInt(lastMiddlewareRun)) < middleThreshold) {
            log('[Locale Middleware] Preventing middleware loop - too soon since last run');
            return;
        }
        
        // Update the timestamp for the middleware run
        localStorage.setItem('locale_middleware_last_run', now.toString());
    }

    // Get full hostname with port
    const hostname = process.client
        ? window.location.hostname + (window.location.port ? ':' + window.location.port : '')
        : useRequestHeaders(['host']).host;

    if (!hostname) return;

    const nuxtApp = useNuxtApp();
    const { $i18n } = nuxtApp;
    const detectedLocale = languageService.detectLocale(hostname);
    const currentLocale = $i18n.locale.value;

    // Always check for need to update locale regardless of route
    const needsLocaleUpdate = currentLocale !== detectedLocale;

    // More detailed logging for dashboard routes
    if (isDashboardRoute) {
        log(`[Locale Middleware] Dashboard route check - Path: ${to.path}, Detected: ${detectedLocale}, Current: ${currentLocale}`);
    } else {
        log(`[Locale] Detection: domain=${hostname}, detected=${detectedLocale}, current=${currentLocale}`);
    }

    // Force the locale update if needed
    if (needsLocaleUpdate) {
        log(`[Locale] Switching from ${currentLocale} to ${detectedLocale} based on domain ${hostname}`);
        
        // First update Vue-i18n locale
        $i18n.setLocale(detectedLocale);
        
        // Then set HTML lang attribute
        if (process.client) {
            document.documentElement.lang = detectedLocale;
            
            // For dashboard routes, be even more aggressive but avoid infinite loops
            if (isDashboardRoute) {
                // Persist locale in cookie
                languageService.persistLocale(detectedLocale as AvailableLocale);
                
                // For development, check if we're on the correct port
                if (isDev) {
                    const correctPort = detectedLocale === 'en' ? '3001' : '3000';
                    const currentPort = window.location.port;
                    
                    if (currentPort && currentPort !== correctPort) {
                        log(`[Locale] Wrong port! Need ${correctPort} for ${detectedLocale}, have ${currentPort}`);
                        
                        // Only redirect if we haven't recently redirected
                        const lastRedirect = localStorage.getItem('locale_last_redirect');
                        if (!lastRedirect || (now - parseInt(lastRedirect)) > 3000) {
                            // Redirect to correct port
                            const correctUrl = window.location.href.replace(`:${currentPort}`, `:${correctPort}`);
                            log(`[Locale] Redirecting to correct port: ${correctUrl}`);
                            localStorage.setItem('locale_last_redirect', now.toString());
                            window.location.href = correctUrl;
                            return;
                        } else {
                            log('[Locale] Skipping redirect - too recent since last redirect');
                        }
                    }
                    
                    // Special check for the English port with throttling
                    if (detectedLocale === 'en' && currentPort === '3001') {
                        // Check translations only if we haven't recently reloaded
                        const lastReload = localStorage.getItem('locale_middleware_last_reload');
                        if (!lastReload || (now - parseInt(lastReload)) > 5000) {
                            log('[Locale] Running English translation verification');
                            
                            // Check test translations
                            const testTranslation = $i18n.t('navigation.dashboard');
                            const expectedTranslation = 'Dashboard'; // Expected English text
                            
                            // If translations look Czech, force a reload but throttle it
                            if (testTranslation !== expectedTranslation && testTranslation.includes('Přehled')) {
                                log('[Locale] Wrong language detected - scheduling reload');
                                localStorage.setItem('locale_middleware_last_reload', now.toString());
                                // Use setTimeout to delay and potentially avoid some race conditions
                                setTimeout(() => window.location.reload(), 100);
                                return;
                            }
                        }
                    }
                }
            }
        }
        
        // Persist locale in cookie for consistency
        languageService.persistLocale(detectedLocale as AvailableLocale);
        
        // Also set Nuxt locale configuration
        nuxtApp.$config.public.i18n = {
            ...nuxtApp.$config.public.i18n,
            defaultLocale: detectedLocale
        };
    } else if (isDashboardRoute && process.client) {
        // Even if no locale change needed, ensure document language is set for dashboard
        document.documentElement.lang = currentLocale;
    }

    // Debug logging for development if not too noisy
    if (isDev && !lastMiddlewareRun) {
        log('[Locale Middleware]', {
            path: to.path,
            isDashboard: isDashboardRoute,
            localeChanged: needsLocaleUpdate,
        });
    }
});