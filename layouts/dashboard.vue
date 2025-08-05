<template>
  <div class="min-h-screen flex flex-col md:flex-row w-full bg-background">
    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
      <h1 class="text-xl font-bold text-foreground">QuoteManager</h1>
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen" 
        class="p-2 rounded-md hover:bg-accent"
        aria-label="Toggle menu"
      >
        <svg 
          v-if="!isMobileMenuOpen" 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg 
          v-else 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Sidebar - hidden on mobile by default, shown when menu is open -->
    <aside 
      class="w-full md:w-64 border-r border-border bg-card overflow-y-auto transition-all duration-300 ease-in-out flex flex-col"
      :class="[
        isMobileMenuOpen ? 'max-h-[calc(100vh-64px)]' : 'max-h-0 md:max-h-screen',
        'md:h-screen md:sticky md:top-0'
      ]"
    >
      <div class="px-3 py-4 flex-1">
        <h1 class="text-xl font-bold mb-6 px-4 text-foreground hidden md:block">QuoteManager</h1>
        <nav class="space-y-1">
          <NuxtLink
            v-for="item in mainMenuItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md',
              $route.path === item.path
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
      
      <!-- Support button at bottom -->
      <div class="px-3 py-4 border-t border-border mt-auto">
        <button
          @click="handleContactSupport"
          class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md bg-accent/30 hover:bg-accent text-accent-foreground hover:text-accent-foreground transition-colors"
        >
          <HelpCircleIcon class="mr-3 h-5 w-5" />
          {{ t('navigation.contactSupport') }}
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <div class="p-4 md:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useNuxtApp } from 'nuxt/app'
import { useSupabaseClient } from '#imports'
import { HomeIcon, FileTextIcon, PersonIcon, GearIcon } from '@radix-icons/vue'
import { HelpCircleIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useLanguage } from '@/composables/useLanguage'
import { languageService } from '@/language/service'
import { log, error as logError } from '~/utils/logger'

const router = useRouter()
const supabase = useSupabaseClient()
const nuxtApp = useNuxtApp()
const { t, locale } = useI18n()
const { currentLocale, detectAndSetLocale } = useLanguage()
const isMobileMenuOpen = ref(false)

// Handle window resize to auto-close mobile menu on larger screens
const handleResize = () => {
  if (process.client && window.innerWidth >= 768 && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

// Add resize event listener
onMounted(() => {
  if (process.client) {
    window.addEventListener('resize', handleResize)
  }
})

// Remove resize event listener
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize)
  }
})

// Create computed menu items that update when language changes
const mainMenuItems = computed(() => [
  { icon: HomeIcon, label: t('navigation.dashboard'), path: "/dashboard" },
  { icon: FileTextIcon, label: t('navigation.quotes'), path: "/dashboard/quotes" },
  { icon: PersonIcon, label: t('navigation.clients'), path: "/dashboard/clients" },
  { icon: GearIcon, label: t('navigation.settings'), path: "/dashboard/settings" },
].map((item) => ({
  ...item,
  icon: item.icon,
  label: item.label,
  path: item.path
})))

// Handle contact support button click
const handleContactSupport = () => {
  window.location.href = 'mailto:support@qfast.co'
  isMobileMenuOpen.value = false
}

// Function to handle locale detection and potential reload
const checkLocale = async () => {
  if (process.client) {
    // Prevent infinite reload loops by checking when we last reloaded
    const lastReload = localStorage.getItem('dashboard_last_reload')
    const now = Date.now()
    const reloadThreshold = 2000 // 2 seconds
    
    if (lastReload && (now - parseInt(lastReload)) < reloadThreshold) {
      log('[Dashboard Layout] Preventing reload loop - detected recent reload');
      // Still ensure document language is correct
      document.documentElement.lang = locale.value;
      return;
    }
    
    const hostname = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    const detectedLocale = languageService.detectLocale(hostname);
    log(`[Dashboard Layout] Language check - Domain: ${hostname}, Detected: ${detectedLocale}, Current: ${locale.value}`);
    
    // Only force the locale if it's really different
    if (detectedLocale !== locale.value) {
      log(`[Dashboard Layout] Locale mismatch: ${locale.value} vs ${detectedLocale}`);
      
      // Change the locale directly
      locale.value = detectedLocale;
      document.documentElement.lang = detectedLocale;
      
      // Reload i18n instance
      try {
        nuxtApp.$i18n.setLocale(detectedLocale);
      } catch (e) {
        logError('[Dashboard Layout] Error setting locale via Nuxt', e);
      }
      
      // Persist this change
      languageService.persistLocale(detectedLocale);
      
      // Log all menu items to check if they updated
      await nextTick();
      
      // For development, check port - for en we should be on 3001, for cs on 3000
      if (window.location.hostname.includes('localhost')) {
        const currentPort = window.location.port;
        const correctPort = detectedLocale === 'en' ? '3001' : '3000';
        
        if (currentPort !== correctPort) {
          log(`[Dashboard Layout] Wrong port! You're on port ${currentPort} but should be on ${correctPort} for ${detectedLocale}`);
          const newUrl = window.location.href.replace(`:${currentPort}`, `:${correctPort}`);
          window.location.href = newUrl;
        }
      }
    }
  }
}
</script>