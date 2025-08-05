<template>
         <nav class="fixed top-4 z-navbar w-full lg:top-6">
         <div class="container box-border max-w-[1672px] px-4 md:px-9">
         <div class="relative flex h-[var(--navbar-height)] w-full items-center justify-between bg-[var(--brand-background)]/80 backdrop-blur-md border border-brand-borders/30 rounded-xl px-4 py-2 shadow-sm transition-all duration-300">
             <!-- Logo -->
             <NuxtLink to="/" class="relative flex items-center gap-2 group">
             <LogoIcon class="h-8 w-8 transition-transform duration-300 group-hover:rotate-[-5deg]" />
             <span class="text-xl font-bold text-brand-foreground tracking-tight group-hover:text-brand-primary transition-colors">QuoteFast</span>
            </NuxtLink>
            
        <!-- Mobile Menu Button -->
        <button 
          class="lg:hidden flex items-center p-2 rounded-md text-brand-foreground hover:bg-brand-borders/20 transition-all duration-200 hover:scale-105 active:scale-95"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
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
            
        <!-- Desktop Navigation -->
        <ul class="hidden lg:flex items-center gap-6 font-mono font-semibold uppercase text-brand-foreground">
          <template v-for="(item, index) in navigationItems" :key="item.label">
            <li>
              <NuxtLink
                v-if="!item.href.startsWith('#')"
                :to="item.href"
                class="nav-link relative py-2 px-1 transition-all duration-200 hover:text-brand-primary cursor-pointer"
                :class="{ 'text-brand-primary': activeSection === item.href.substring(1) }"
              >
                {{ $t('navigation.' + item.key) }}
                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" 
                      :class="{ 'w-full': activeSection === item.href.substring(1) }"></span>
              </NuxtLink>
              <a
                v-else
                :href="item.href"
                class="nav-link relative py-2 px-1 transition-all duration-200 hover:text-brand-primary cursor-pointer"
                :class="{ 'text-brand-primary': activeSection === item.href.substring(1) }"
                @click.prevent="scrollToSection(item.href)"
              >
                {{ $t('navigation.' + item.key) }}
                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 hover:w-full" 
                      :class="{ 'w-full': activeSection === item.href.substring(1) }"></span>
              </a>
            </li>
            <!-- Add divider after About -->
            <div v-if="item.key === 'about'" class="h-4 w-px bg-brand-borders/70"></div>
          </template>
        </ul>
        <!-- Action Buttons -->
        <div class="hidden lg:flex items-center gap-4">
          <!-- Auth Buttons -->
          <template v-if="user">
            <!-- User Menu -->
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-brand-foreground hover:text-brand-primary bg-brand-background/40 hover:bg-brand-background/60 border border-brand-borders/30 hover:border-brand-borders/60 transition-all duration-200 hover:shadow-sm"
              title="Dashboard"
            >
              <!-- Dashboard icon (Lucide) -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard">
                <rect width="7" height="9" x="3" y="3" rx="1"/>
                <rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/>
                <rect width="7" height="5" x="3" y="16" rx="1"/>
              </svg>
              <span class="font-medium">{{ $t('navigation.dashboard') }}</span>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white bg-brand-primary hover:bg-brand-primary/90 border border-brand-primary/30 transition-all duration-200 shadow-sm hover:shadow font-medium hover:scale-[1.02] active:scale-[0.98]"
              title="Sign In"
            >
              <!-- Login icon (Lucide) -->
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span class="font-semibold text-white">{{ $t('auth.signIn') }}</span>
            </NuxtLink>
          </template>
          <NuxtLink
            to="/public/contact"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-brand-foreground hover:text-brand-primary bg-brand-background/40 hover:bg-brand-background/60 border border-brand-borders/30 hover:border-brand-borders/60 transition-all duration-200 hover:shadow-sm"
            title="Contact Us"
          >
            <!-- Contact icon (Lucide) -->
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span class="font-medium">{{ $t('navigation.contactUs') }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu (Slide Down) -->
    <div 
      class="lg:hidden absolute top-full left-0 w-full bg-[var(--brand-background)]/90 backdrop-blur-md border-x border-b border-brand-borders/30 shadow-lg rounded-b-xl overflow-hidden transition-all duration-300 ease-in-out px-4 mx-4 md:mx-9"
      :class="{ 'max-h-[500px] py-4 opacity-100 translate-y-0': isMobileMenuOpen, 'max-h-0 py-0 opacity-0 -translate-y-2': !isMobileMenuOpen }"
    >
      <!-- Mobile Navigation Links -->
      <ul class="flex flex-col space-y-3 font-mono font-semibold uppercase text-brand-foreground">
        <template v-for="(item, index) in navigationItems" :key="item.label">
          <li class="transform transition-transform duration-200 hover:translate-x-1">
            <NuxtLink
              v-if="!item.href.startsWith('#')"
              :to="item.href"
              class="block py-2 transition-colors hover:text-brand-primary flex items-center"
              :class="{ 'text-brand-primary': activeSection === item.href.substring(1) }"
              @click="isMobileMenuOpen = false"
            >
              <span class="w-1 h-5 rounded-full bg-brand-primary/70 mr-2" 
                    :class="{ 'opacity-100': activeSection === item.href.substring(1), 'opacity-0': activeSection !== item.href.substring(1) }"></span>
              {{ $t('navigation.' + item.key) }}
            </NuxtLink>
            <a
              v-else
              :href="item.href"
              class="block py-2 transition-colors hover:text-brand-primary flex items-center"
              :class="{ 'text-brand-primary': activeSection === item.href.substring(1) }"
              @click.prevent="scrollToSectionMobile(item.href)"
            >
              <span class="w-1 h-5 rounded-full bg-brand-primary/70 mr-2" 
                    :class="{ 'opacity-100': activeSection === item.href.substring(1), 'opacity-0': activeSection !== item.href.substring(1) }"></span>
              {{ $t('navigation.' + item.key) }}
            </a>
          </li>
        </template>
        
        <!-- Mobile Auth Buttons -->
        <div class="pt-4 mt-2 border-t border-brand-borders/50 flex flex-col gap-3">
          <template v-if="user">
            <NuxtLink
              to="/dashboard"
              class="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg text-brand-foreground hover:text-brand-primary bg-brand-background/40 hover:bg-brand-background/60 border border-brand-borders/30 transition-all duration-200"
              @click="isMobileMenuOpen = false"
              title="Dashboard"
            >
              <!-- Dashboard icon (Lucide) -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard">
                <rect width="7" height="9" x="3" y="3" rx="1"/>
                <rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/>
                <rect width="7" height="5" x="3" y="16" rx="1"/>
              </svg>
              <span class="font-medium">{{ $t('navigation.dashboard') }}</span>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg text-white font-medium bg-brand-primary hover:bg-brand-primary/90 border border-brand-primary/30 transition-all duration-200 shadow-sm hover:shadow"
              @click="isMobileMenuOpen = false"
              title="Sign In"
            >
              <!-- Login icon (Lucide) -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span class="font-semibold text-white">{{ $t('auth.signIn') }}</span>
            </NuxtLink>
          </template>
          <NuxtLink
            to="/public/contact"
            class="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg text-brand-foreground hover:text-brand-primary bg-brand-background/40 hover:bg-brand-background/60 border border-brand-borders/30 transition-all duration-200"
            @click="isMobileMenuOpen = false"
            title="Contact Us"
          >
            <!-- Contact icon (Lucide) -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span class="font-medium">{{ $t('navigation.contactUs') }}</span>
          </NuxtLink>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'nuxt/app'
import { useRoute } from '#app'
import { useI18n } from 'vue-i18n'
import { navigateTo } from '#imports'
import LogoIcon from '@/components/icons/LogoIcon.vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useLanguage } from '@/composables/useLanguage'
import type { AvailableLocale } from '@/language/types'

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

const { t } = useI18n()
const { currentLocale, switchLanguage } = useLanguage()

// Computed property for display
const displayLocale = computed(() => currentLocale.value.toUpperCase())

// Switch between languages
const switchToNextLanguage = () => {
  const nextLocale: AvailableLocale = currentLocale.value === 'cs' ? 'en' : 'cs'
  switchLanguage(nextLocale)
  isMobileMenuOpen.value = false
}

// Define navigationItems
const navigationItems = [
  { key: 'features', label: 'Features', href: '#features' },
  { key: 'benefits', label: 'Benefits', href: '#benefits' },
  { key: 'about', label: 'About', href: '#about' },
]

// Smooth scroll function
const scrollToSection = (href: string) => {
  if (href.startsWith('#')) {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    navigateTo(href)
  }
}

// Mobile scroll function (closes menu after scrolling)
const scrollToSectionMobile = (href: string) => {
  if (href.startsWith('#')) {
    const element = document.querySelector(href)
    if (element) {
      isMobileMenuOpen.value = false
      // Small delay to allow menu to close before scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  } else {
    isMobileMenuOpen.value = false
    navigateTo(href)
  }
}

// Active section tracking
const activeSection = ref('')

const checkActiveSection = () => {
  const sections = document.querySelectorAll('section[id]')
  const scrollPosition = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = (section as HTMLElement).offsetTop
    const sectionHeight = (section as HTMLElement).offsetHeight
    const sectionId = section.getAttribute('id')

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      activeSection.value = sectionId || ''
    }
  })
}

// Close mobile menu on resize (if screen becomes large)
const handleResize = () => {
  if (window.innerWidth >= 1024 && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

// Auth handling
const handleSignOut = async () => {
  try {
    await supabase.auth.signOut()
    router.push('/')
  } catch (error) {
    logError('Error signing out:', error)
  }
}

// Close user menu when clicking outside
const closeUserMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    isUserMenuOpen.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', checkActiveSection)
  window.addEventListener('resize', handleResize)
  checkActiveSection()
  document.addEventListener('click', closeUserMenu)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkActiveSection)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', closeUserMenu)
})
</script>

<style scoped>
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: var(--brand-primary);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Add a subtle scale animation to the contact button on hover */
@keyframes subtle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

a[to="/public/contact"]:hover {
  animation: subtle-pulse 1.5s infinite;
}
</style>