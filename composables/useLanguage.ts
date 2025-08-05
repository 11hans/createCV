// composables/useLanguage.ts
import type { AvailableLocale } from '../language/types';
import { languageService } from '../language/service';
import { useI18n } from 'vue-i18n'
import { log } from '~/utils/logger';

export const useLanguage = () => {
    const { locale } = useI18n();
    const router = useRouter();
    
    // Computed property for current locale
    const currentLocale = computed(() => locale.value as AvailableLocale);
    
    // Function to redirect to the appropriate domain based on locale
    const switchLanguage = async (newLocale: AvailableLocale) => {
        // Only handle switching through domain change
        if (process.client) {
            const targetDomain = languageService.getTargetDomain(newLocale);
            const currentHostname = window.location.hostname;
            
            // Only redirect if we're on a different domain
            if (currentHostname !== targetDomain) {
                const protocol = window.location.protocol;
                const currentPath = router.currentRoute.value.fullPath;
                
                // Log the redirect
                log(`[Language] Redirecting to ${newLocale} domain:`, {
                    from: window.location.href,
                    to: `${protocol}//${targetDomain}${currentPath}`,
                    newLocale
                });
                
                // Redirect to the new domain with the same path
                window.location.href = `${protocol}//${targetDomain}${currentPath}`;
                return;
            } else {
                // If we're already on the correct domain, just update the locale
                if (locale.value !== newLocale) {
                    log(`[Language] Setting locale to ${newLocale} (already on correct domain)`);
                    locale.value = newLocale;
                    document.documentElement.lang = newLocale;
                }
            }
        }
    };

    // Detect the locale from the hostname and set it
    const detectAndSetLocale = () => {
        if (process.client) {
            const hostname = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            const detectedLocale = languageService.detectLocale(hostname);
            
            log(`[Language] Detected locale from hostname ${hostname}: ${detectedLocale}`);
            
            if (locale.value !== detectedLocale) {
                log(`[Language] Updating locale from ${locale.value} to ${detectedLocale}`);
                locale.value = detectedLocale;
                document.documentElement.lang = detectedLocale;
                // Also make sure the cookie is set
                languageService.persistLocale(detectedLocale);
            }
            
            return detectedLocale;
        }
        return locale.value;
    };

    // Run detection immediately for client-side
    if (process.client) {
        const detected = detectAndSetLocale();
        log(`[Language] Initial locale detection: ${detected}`);
    }

    // Make sure language is updated on client route changes
    if (process.client) {
        const route = useRoute();
        watch(() => route.fullPath, () => {
            log(`[Language] Route changed to ${route.fullPath}, re-detecting locale`);
            detectAndSetLocale();
        });
    }

    return {
        currentLocale,
        switchLanguage,
        detectLocale: (hostname: string) => languageService.detectLocale(hostname),
        detectAndSetLocale
    };
};