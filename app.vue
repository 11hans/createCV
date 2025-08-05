<template>
  <div>
    <template v-if="!isLoading">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </template>
    <template v-else>
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    </template>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/toast'
import { useAuth } from '@/composables/useAuth'
import { useLanguage } from '@/composables/useLanguage'
import { languageService } from '@/language/service'
import '@/assets/css/dropdown-fixes.css'
import '@/assets/css/toast-fixes.css'

const auth = useAuth();
const { detectAndSetLocale, currentLocale } = useLanguage();
const isLoading = ref(true);

const initialize = async () => {
    try {
        // First detect and set locale based on domain
        if (process.client) {
            const hostname = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            const detectedLocale = languageService.detectLocale(hostname);
            log(`[App] Initial language detection: ${detectedLocale} (from ${hostname})`);
            
            // Force set the HTML lang attribute
            document.documentElement.lang = detectedLocale;
            
            // Call the composable's detect method to ensure consistency
            detectAndSetLocale();
            log(`[App] Language initialized to: ${currentLocale.value}`);
        }
        
        // Then initialize auth
        await auth.initializeAuth();
    } catch (error) {
        logError('[App] Failed to initialize:', error);
        // Continue even if auth fails - ensures UI is accessible
    } finally {
        isLoading.value = false;
    }
}

// Run initialization
initialize();

// Re-run language detection when the app becomes visible (handles tab switching)
if (process.client) {
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            log('[App] Tab became visible, re-detecting language');
            
            // Check if we're on the quote creation page
            const isQuoteCreationPage = window.location.pathname.includes('/dashboard/quotes/new');
            
            // Only re-detect language if we're not on the quote creation page
            // This prevents any potential redirects or state changes during quote creation
            if (!isQuoteCreationPage) {
                detectAndSetLocale();
            } else {
                log('[App] Skipping language re-detection on quote creation page');
            }
        }
    });
}
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>