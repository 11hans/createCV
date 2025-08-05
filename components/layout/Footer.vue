<template>
  <footer class="bg-brand-background-secondary py-16">
    <div class="container">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
        <!-- Logo & Company Info -->
        <div class="col-span-2">
          <NuxtLink to="/" class="inline-flex items-center gap-2 mb-4">
            <LogoIcon class="h-8 w-8" />
            <span class="text-xl font-bold text-brand-foreground">QuoteFast</span>
          </NuxtLink>
          <p class="text-brand-neutrals-600 dark:text-brand-neutrals-400 mb-4">
            {{ $t('footer.description', 'Professional quote generation platform for modern businesses') }}
          </p>
        </div>

        <!-- Navigation Links -->
        <div v-for="section in navigation" :key="section.title" class="col-span-1">
          <h3 class="font-semibold text-brand-foreground mb-4">
            {{ section.title }}
          </h3>
          <ul class="space-y-2">
            <li v-for="item in section.items" :key="item.label">
              <NuxtLink
                :to="item.href"
                class="text-brand-neutrals-600 dark:text-brand-neutrals-400 hover:text-brand-primary transition-colors"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Newsletter Signup -->
        <div class="col-span-2">
          <h3 class="font-semibold text-brand-foreground mb-4">
            {{ $t('footer.stayUpdated') }}
          </h3>
          <p class="text-brand-neutrals-600 dark:text-brand-neutrals-400 mb-4">
            {{ $t('footer.subscribeText') }}
          </p>
          
          <!-- Success Message -->
          <div v-if="subscriptionStatus === 'success'" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">
                  {{ $t('footer.subscriptionSuccess') }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Error Message -->
          <div v-if="subscriptionStatus === 'error'" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">
                  {{ subscriptionError || $t('footer.subscriptionError') }}
                </p>
                <button 
                  @click="retrySubscription" 
                  class="mt-2 text-xs font-medium text-red-700 hover:text-red-900 underline"
                >
                  {{ $t('footer.retry') }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Subscription Form -->
          <form v-if="subscriptionStatus !== 'success'" @submit.prevent="subscribeNewsletter" class="flex gap-2">
            <input
              type="email"
              v-model="email"
              :placeholder="$t('footer.emailPlaceholder')"
              :disabled="isSubscribing"
              class="flex-1 px-4 py-2 rounded-lg border border-brand-borders focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white dark:bg-brand-medium-black disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'border-red-500': emailError }"
            />
            <button
              type="submit"
              :disabled="isSubscribing || !email"
              class="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubscribing" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('footer.subscribing') }}
              </span>
              <span v-else>{{ $t('footer.subscribe') }}</span>
            </button>
          </form>
          <p v-if="emailError" class="mt-1 text-xs text-red-500">{{ emailError }}</p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 mt-8 border-t border-brand-borders">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-brand-neutrals-600 dark:text-brand-neutrals-400">
            © {{ new Date().getFullYear() }} QuoteFast. All rights reserved.
          </p>
          <div class="flex gap-6">
            <NuxtLink
              v-for="link in legalLinks"
              :key="link.label"
              :to="link.href"
              class="text-sm text-brand-neutrals-600 dark:text-brand-neutrals-400 hover:text-brand-primary transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LogoIcon from '@/components/icons/LogoIcon.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const email = ref('')
const emailError = ref('')
const isSubscribing = ref(false)
const subscriptionStatus = ref<'idle' | 'success' | 'error'>('idle')
const subscriptionError = ref('')
const lastAttemptedEmail = ref('')

const validateEmail = (email: string): boolean => {
  if (!email) {
    emailError.value = t('footer.emailRequired')
    return false
  }
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailRegex.test(email)) {
    emailError.value = t('footer.emailInvalid')
    return false
  }
  
  emailError.value = ''
  return true
}

const retrySubscription = () => {
  if (lastAttemptedEmail.value) {
    email.value = lastAttemptedEmail.value
  }
  subscriptionStatus.value = 'idle'
  subscriptionError.value = ''
}

const subscribeNewsletter = async () => {
  // Reset status
  subscriptionStatus.value = 'idle'
  subscriptionError.value = ''
  
  // Validate email
  if (!validateEmail(email.value)) {
    return
  }
  
  // Additional check to ensure email is not empty
  if (!email.value.trim()) {
    emailError.value = t('footer.emailRequired')
    return
  }
  
  // Store the email for potential retry
  lastAttemptedEmail.value = email.value
  
  try {
    isSubscribing.value = true
    
    // Prepare the email
    const emailValue = email.value.trim()
    
    // Submit the email address to our API
    const response = await fetch('/api/newsletter-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailValue })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error('Failed to subscribe: ' + (response.statusText || 'Unknown error'))
    }
    
    // Success
    subscriptionStatus.value = 'success'
    email.value = ''
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      if (subscriptionStatus.value === 'success') {
        subscriptionStatus.value = 'idle'
      }
    }, 5000)
    
  } catch (error: any) {
    logError('Newsletter subscription error:', error)
    subscriptionStatus.value = 'error'
    subscriptionError.value = error.message || t('footer.subscriptionError')
  } finally {
    isSubscribing.value = false
  }
}

const navigation = [
  {
    title: t('footer.product'),
    items: [
      { label: t('footer.features'), href: '#features' },
      { label: t('footer.about'), href: '#about' },
      { label: t('footer.benefits'), href: '#benefits' }
    ]
  },
  {
    title: t('footer.company'),
    items: [
      { label: t('footer.contact'), href: '/public/contact' }
    ]
  },
  {
    title: t('footer.support'),
    items: [
      { label: t('footer.email'), href: 'mailto:support@qfast.co' }
    ]
  }
]

const legalLinks = [
  { label: t('footer.termsOfService'), href: '/public/terms' }
]
</script> 