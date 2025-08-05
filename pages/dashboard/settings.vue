<template>
  <div class="space-y-6 max-w-5xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-800" @dblclick="runLanguageDebug">{{ t('settings.title') }}</h1>
    </div>

    <!-- Company Settings Card -->
    <UiCard class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <UiCardHeader class="border-b border-gray-100 pb-4 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                <path d="M20 7h-9"></path>
                <path d="M14 17H5"></path>
                <circle cx="17" cy="17" r="3"></circle>
                <circle cx="7" cy="7" r="3"></circle>
              </svg>
            </div>
            <div>
              <UiCardTitle class="text-xl font-semibold text-gray-800">{{ t('settings.company.title') }}</UiCardTitle>
              <p class="text-sm text-gray-500 mt-1">{{ t('settings.company.description') || 'Manage your company information' }}</p>
            </div>
          </div>
          
          <!-- Success Message Toast -->
          <UiAlert 
            v-if="showSuccess" 
            variant="default" 
            class="flex items-center gap-2 py-2 px-4 bg-green-50 border border-green-100 text-green-700 rounded-lg shadow-sm"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-sm font-medium">{{ t('settings.saveSuccess.title') }}</span>
          </UiAlert>
        </div>
      </UiCardHeader>

      <UiCardContent class="p-6 space-y-6">
        <form @submit.prevent="handleSubmit">
          <!-- Basic Information Section -->
          <div class="mb-8">
            <h3 class="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">{{ t('settings.company.basicInfo') || 'Basic Information' }}</h3>
            
            <!-- Email Field -->
            <div class="space-y-2 mb-6">
              <UiLabel for="company-email" class="text-gray-700 font-medium">{{ t('quote.form.company.email') }}</UiLabel>
              <UiInput 
                id="company-email" 
                type="email" 
                :model-value="email"
                disabled
                class="bg-gray-50 border-gray-200"
              />
              <p class="text-sm text-gray-500">{{ t('settings.emailFromAccount') }}</p>
            </div>

            <!-- Company Name -->
            <div class="space-y-2">
              <UiLabel for="company-name" class="text-gray-700 font-medium">{{ t('quote.form.company.companyName') }}</UiLabel>
              <UiInput 
                id="company-name" 
                v-model="name"
                :disabled="loading"
                class="bg-white border-gray-200 focus:border-blue-500"
              />
              <p class="text-sm text-gray-500">{{ t('settings.company.nameHelp') || 'Your company name as it will appear on quotes' }}</p>
            </div>
          </div>

          <!-- Address Section -->
          <div class="mb-8">
            <h3 class="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">{{ t('settings.company.addressInfo') || 'Address Information' }}</h3>
            
            <!-- Street and City -->
            <div class="grid gap-6 md:grid-cols-2 mb-6">
              <div class="space-y-2">
                <UiLabel for="company-street" class="text-gray-700 font-medium">{{ t('quote.form.company.address') }}</UiLabel>
                <UiInput 
                  id="company-street" 
                  v-model="street"
                  :disabled="loading"
                  class="bg-white border-gray-200 focus:border-blue-500"
                />
              </div>
              <div class="space-y-2">
                <UiLabel for="company-city" class="text-gray-700 font-medium">{{ t('quote.form.company.city') }}</UiLabel>
                <UiInput 
                  id="company-city" 
                  v-model="city"
                  :disabled="loading"
                  class="bg-white border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>

            <!-- State and ZIP -->
            <div class="grid gap-6 md:grid-cols-2 mb-6">
              <!-- State -->
              <div class="space-y-2">
                <UiLabel for="company-state" class="text-gray-700 font-medium">{{ stateLabel }}</UiLabel>
                <UiInput 
                  id="company-state" 
                  v-model="state"
                  :class="{ 'border-red-500 focus:border-red-500': stateError, 'border-gray-200 focus:border-blue-500': !stateError }"
                  :disabled="loading"
                  @input="(e: Event) => validateState((e.target as HTMLInputElement).value)"
                />
                <p v-if="stateError" class="text-sm text-red-600">{{ stateError }}</p>
                <p v-else class="text-sm text-gray-500">{{ isUS ? 'Use 2-letter state code (e.g., CA)' : 'Enter your state or region' }}</p>
              </div>

              <!-- ZIP -->
              <div class="space-y-2">
                <UiLabel for="company-zip" class="text-gray-700 font-medium">{{ zipLabel }}</UiLabel>
                <UiInput 
                  id="company-zip" 
                  v-model="zip"
                  :class="{ 'border-red-500 focus:border-red-500': zipError, 'border-gray-200 focus:border-blue-500': !zipError }"
                  :disabled="loading"
                  @input="(e: Event) => validateZip((e.target as HTMLInputElement).value)"
                />
                <p v-if="zipError" class="text-sm text-red-600">{{ zipError }}</p>
                <p v-else class="text-sm text-gray-500">{{ isUS ? 'Format: 12345 or 12345-6789' : 'Format: xxxxx' }}</p>
              </div>
            </div>

            <!-- Country -->
            <div class="space-y-2">
              <UiLabel for="company-country" class="text-gray-700 font-medium">{{ t('quote.form.company.country') }}</UiLabel>
              <UiInput 
                id="company-country" 
                v-model="country"
                :disabled="loading"
                class="bg-white border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Tax Information Section -->
          <div class="mb-8">
            <h3 class="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">{{ t('settings.company.taxInfo') || 'Tax Information' }}</h3>
            
            <!-- Tax ID -->
            <div class="space-y-2 mb-6">
              <UiLabel for="company-tax-id" class="text-gray-700 font-medium">{{ t('quote.form.company.taxId') }}</UiLabel>
              <UiInput 
                id="company-tax-id" 
                v-model="taxId"
                :disabled="loading"
                :class="{ 'border-red-500 focus:border-red-500': taxIdError, 'border-gray-200 focus:border-blue-500': !taxIdError }"
              />
              <p v-if="taxIdError" class="text-sm text-red-600">{{ taxIdError }}</p>
              <p v-else class="text-sm text-gray-500">{{ isUS ? 'Format: XX-XXXXXXX' : 'Format: CZ12345678' }}</p>
            </div>

            <!-- Tax Payer Checkbox -->
            <!-- Temporarily hidden tax payer functionality
            <div class="mb-6">
              <div class="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <UiCheckbox 
                  id="is-tax-payer"
                  :checked="isTaxPayer"
                  @update:checked="handleTaxPayerChange"
                  :disabled="loading"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <UiLabel for="is-tax-payer" class="text-gray-700 font-medium">{{ t('quote.form.company.isTaxPayer') || 'I am a tax payer' }}</UiLabel>
                  <p class="text-sm text-gray-500 mt-1">{{ t('settings.company.taxPayerHelp') || 'Check this if your company is registered for VAT/sales tax' }}</p>
                </div>
              </div>
            </div>

            <!-- Tax Number
            <div v-if="isTaxPayer" class="space-y-2">
              <UiLabel for="company-tax-number" class="text-gray-700 font-medium">{{ t('quote.form.company.taxNumber') }}</UiLabel>
              <UiInput 
                id="company-tax-number" 
                v-model="taxNumber"
                :disabled="loading"
                :class="{ 'border-red-500 focus:border-red-500': taxNumberError, 'border-gray-200 focus:border-blue-500': !taxNumberError }"
              />
              <p v-if="taxNumberError" class="text-sm text-red-600">{{ taxNumberError }}</p>
              <p v-else class="text-sm text-gray-500">{{ t('settings.company.taxNumberHelp') || 'Your VAT/sales tax registration number' }}</p>
            </div>
            -->
          </div>

          <div class="mt-8 flex items-center justify-end pt-4 border-t border-gray-100">
            <UiButton 
              type="submit" 
              class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 px-6"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('common.saving') }}
              </span>
              <span v-else>{{ t('settings.saveChanges') }}</span>
            </UiButton>
          </div>

          <!-- Error Message -->
          <UiAlert v-if="error" variant="destructive" class="mt-4 bg-red-50 border border-red-100 text-red-700 rounded-lg">
            <UiAlertTitle class="font-medium">{{ t('common.error') }}</UiAlertTitle>
            <UiAlertDescription>{{ error }}</UiAlertDescription>
          </UiAlert>
        </form>
      </UiCardContent>
    </UiCard>

    <!-- Quote Settings Card -->
    <UiCard class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <UiCardHeader class="border-b border-gray-100 pb-4 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div>
              <UiCardTitle class="text-xl font-semibold text-gray-800">{{ t('settings.quote.title') }}</UiCardTitle>
              <p class="text-sm text-gray-500 mt-1">{{ t('settings.quote.description') || 'Configure your quote defaults and templates' }}</p>
            </div>
          </div>
          
          <!-- Success Message Toast -->
          <UiAlert 
            v-if="showQuoteSuccess" 
            variant="default" 
            class="flex items-center gap-2 py-2 px-4 bg-green-50 border border-green-100 text-green-700 rounded-lg shadow-sm"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-sm font-medium">{{ t('settings.saveSuccess.title') }}</span>
          </UiAlert>
        </div>
      </UiCardHeader>
      <UiCardContent class="p-6 space-y-6">
        <form @submit.prevent="saveQuoteSettings">
          <!-- Quote Settings Section -->
          <div class="mb-8">
            <h3 class="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">{{ t('settings.quote.basicSettings') || 'Basic Settings' }}</h3>
            
            <!-- Quote Prefix -->
            <div class="space-y-2 mb-6">
              <UiLabel for="quote-prefix" class="text-gray-700 font-medium">{{ t('settings.quote.prefix') }}</UiLabel>
              <UiInput 
                id="quote-prefix" 
                v-model="quotePrefix"
                :placeholder="t('settings.quote.prefixPlaceholder')"
                :disabled="quoteStore.loading"
                class="bg-white border-gray-200 focus:border-blue-500"
              />
              <p class="text-sm text-gray-500">{{ t('settings.quote.prefixHelp') || 'This prefix will be added to all quote numbers (e.g., "Q-" for Q-001)' }}</p>
            </div>
          </div>

          <!-- Quote Terms Section -->
          <div class="mb-8">
            <h3 class="text-md font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">{{ t('settings.quote.termsSection') || 'Terms & Conditions' }}</h3>
            
            <!-- Quote Terms Intro -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p class="text-sm text-gray-700">{{ t('settings.quote.termsIntro') || 'Define the standard terms and conditions that will appear on your quotes. These will be displayed at the bottom of each quote document.' }}</p>
            </div>
            
            <!-- Quote Terms Header -->
            <div class="space-y-2 mb-6">
              <UiLabel for="quote-terms-header" class="text-gray-700 font-medium">{{ t('settings.quote.termsHeader') || 'Terms Header' }}</UiLabel>
              <UiInput 
                id="quote-terms-header" 
                v-model="quoteTermsHeader"
                :placeholder="t('settings.quote.termsHeaderPlaceholder') || 'Terms and Conditions'"
                :disabled="quoteStore.loading"
                class="bg-white border-gray-200 focus:border-blue-500"
              />
              <p class="text-sm text-gray-500">{{ t('settings.quote.termsHeaderHelp') || 'The header text that will appear above your terms and conditions' }}</p>
            </div>
            
            <!-- Quote Terms Content -->
            <div class="space-y-2">
              <UiLabel for="quote-terms" class="text-gray-700 font-medium">{{ t('settings.quote.terms') }}</UiLabel>
              <UiTextarea 
                id="quote-terms" 
                v-model="quoteTerms"
                :placeholder="t('settings.quote.termsPlaceholder')"
                :disabled="quoteStore.loading"
                class="bg-white border-gray-200 focus:border-blue-500 min-h-[120px] rounded-lg"
              />
              <p class="text-sm text-gray-500">{{ t('settings.quote.termsHelp') || 'These terms will appear at the bottom of all quotes' }}</p>
            </div>
            
            <!-- Quote Instructions -->
            <div class="space-y-2 mt-6">
              <UiLabel for="quote-instructions" class="text-gray-700 font-medium">{{ t('settings.quote.instructions') || 'Payment Instructions' }}</UiLabel>
              <UiTextarea 
                id="quote-instructions" 
                v-model="quoteInstructions"
                :placeholder="t('settings.quote.instructionsPlaceholder') || 'Add payment instructions or reference information'"
                :disabled="quoteStore.loading"
                class="bg-white border-gray-200 focus:border-blue-500 min-h-[120px] rounded-lg"
              />
              <p class="text-sm text-gray-500">{{ t('settings.quote.instructionsHelp') || 'These instructions will appear alongside your terms and conditions' }}</p>
            </div>
          </div>

          <div class="mt-8 flex items-center justify-end pt-4 border-t border-gray-100">
            <UiButton 
              type="submit" 
              class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 px-6"
              :disabled="quoteStore.loading"
            >
              <span v-if="quoteStore.loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('common.saving') }}
              </span>
              <span v-else>{{ t('settings.saveChanges') }}</span>
            </UiButton>
          </div>

          <!-- Error Message -->
          <UiAlert v-if="quoteStore.error" variant="destructive" class="mt-4 bg-red-50 border border-red-100 text-red-700 rounded-lg">
            <UiAlertTitle class="font-medium">{{ t('common.error') }}</UiAlertTitle>
            <UiAlertDescription>{{ quoteStore.error }}</UiAlertDescription>
          </UiAlert>
        </form>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, nextTick } from 'vue'
import { useProfile } from '~/composables/useProfile'
import { useI18n } from 'vue-i18n'
import { languageService } from '~/language/service'
import { useDashboardLocale } from '@/composables/useDashboardLocale'
import { useLanguageDebug } from '@/composables/useLanguageDebug'
import type { ProfileFormData } from '@/types/profile'
import type { QuoteSettings } from '~/types/quote'
import { useQuoteSettings } from '~/composables/useQuoteSettings'
import { useProfileStore } from '~/stores/profile'
import { storeToRefs } from 'pinia'
import { useToast } from '@/components/ui/toast'
import { useFormState } from '@/composables/useFormState'
import type { Ref } from 'vue'
import { useSupabaseClient } from '#imports'

// UI Components imports
import { Card as UiCard, CardHeader as UiCardHeader, CardTitle as UiCardTitle, CardContent as UiCardContent } from '@/components/ui/card'
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import { Textarea as UiTextarea } from '@/components/ui/textarea'
import { Alert as UiAlert, AlertTitle as UiAlertTitle, AlertDescription as UiAlertDescription } from '@/components/ui/alert'
import { Checkbox as UiCheckbox } from '@/components/ui/checkbox'

definePageMeta({
  layout: 'dashboard'
})

// Setup language detection
const { t, locale } = useI18n()
const { forceLocaleUpdate } = useDashboardLocale()
const supabase = useSupabaseClient()

// Function to handle language setup
const setupLanguage = async () => {
  if (process.client) {
    // Check for recent reloads to prevent infinite loops
    const lastSettingsReload = localStorage.getItem('settings_last_reload');
    const now = Date.now();
    const reloadThreshold = 2000; // 2 seconds
    
    if (lastSettingsReload && (now - parseInt(lastSettingsReload)) < reloadThreshold) {
      log('[Settings] Preventing reload loop - too soon since last reload');
      // Still ensure document language is correct
      document.documentElement.lang = locale.value;
      return;
    }
    
    // Get current domain and detect correct locale
    const hostname = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    const detectedLocale = languageService.detectLocale(hostname);
    
    log(`[Settings] Language check - Current: ${locale.value}, Detected: ${detectedLocale}`);
    
    // Force set locale in all possible ways
    if (locale.value !== detectedLocale) {
      log(`[Settings] Locale mismatch: ${locale.value} vs ${detectedLocale}`);
      
      // Update i18n locale and document
      locale.value = detectedLocale;
      document.documentElement.lang = detectedLocale;
      
      // Persist the change
      languageService.persistLocale(detectedLocale);
      
      // Check translations before deciding to reload
      await nextTick();
      
      // Test if translations are working
      const testTranslation = t('settings.title');
      const expectedTranslation = detectedLocale === 'en' ? 'Settings' : 'Nastavení';
      
      if (testTranslation !== expectedTranslation) {
        log(`[Settings] Translation test failed! Got "${testTranslation}" but expected "${expectedTranslation}"`);
        localStorage.setItem('settings_last_reload', now.toString());
        window.location.reload();
        return;
      } else {
        log('[Settings] Translation test passed - no reload needed');
        forceLocaleUpdate();
      }
    } else {
      // ALWAYS force a refresh of translations even if locale is correct
      await nextTick();
      forceLocaleUpdate();
      
      // Test multiple translations to verify they're working
      log('[Settings] Translation verification with current language:', locale.value);
      log(`- "settings.title" = "${t('settings.title')}"`);
    }
  }
}

// Force correct language on component mount
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  setupLanguage()
})

// Composables
const { profile, loading, error, fetchProfile, updateProfile } = useProfile()
const quoteStore = useQuoteSettings()
const profileStore = useProfileStore()
const { toast } = useToast()
const { state: form, updateState } = useFormState<ProfileFormData>('profile-settings', {
  email: null,
  name: null,
  street: null,
  city: null,
  state: null,
  zip: null,
  country: null,
  tax_id: null,
  is_tax_payer: false,
  tax_number: null
})

// Type assertion for form state
const formState = form as Ref<ProfileFormData>

// Locale detection
const currentLocale = computed(() => {
  if (process.client) {
    return languageService.detectLocale(window.location.hostname)
  }
  return 'cs'
})

const isUS = computed(() => (country.value || '').toLowerCase() === 'united states' || (country.value || '').toLowerCase() === 'usa')

// Labels
const stateLabel = computed(() => t('quote.form.company.state') || 'State/Region')
const zipLabel = computed(() => t('quote.form.company.zip') || 'ZIP/Postal Code')
const taxIdLabel = computed(() => isUS.value ? 'EIN (Tax ID)' : 'DIČ')

// Error states
const stateError = ref('')
const zipError = ref('')
const taxIdError = ref('')
const taxNumberError = ref('')

const showSuccess = ref(false)
const showQuoteSuccess = ref(false)

// Quote settings
const { settings: quoteSettingsRef, loading: quoteLoading, error: quoteError } = storeToRefs(quoteStore)

const quotePrefix = computed({
  get: () => {
    if (!quoteSettingsRef.value) {
      return ''
    }
    return quoteSettingsRef.value.prefix ?? ''
  },
  set: (value: string) => {
    if (!quoteSettingsRef.value) {
      quoteSettingsRef.value = { 
        prefix: value || null,
        terms: null,
        header: null,
        instructions: null
      }
    } else {
      quoteSettingsRef.value = {
        ...quoteSettingsRef.value,
        prefix: value || null
      }
    }
  }
})

const quoteTermsHeader = computed({
  get: () => {
    if (!quoteSettingsRef.value) {
      return ''
    }
    return quoteSettingsRef.value.header ?? 'Terms and Conditions'
  },
  set: (value: string) => {
    if (!quoteSettingsRef.value) {
      quoteSettingsRef.value = { 
        prefix: null,
        terms: null,
        header: value || 'Terms and Conditions',
        instructions: null
      }
    } else {
      quoteSettingsRef.value = {
        ...quoteSettingsRef.value,
        header: value || 'Terms and Conditions'
      }
    }
  }
})

const quoteTerms = computed({
  get: () => {
    if (!quoteSettingsRef.value) {
      return ''
    }
    return quoteSettingsRef.value.terms ?? ''
  },
  set: (value: string) => {
    if (!quoteSettingsRef.value) {
      quoteSettingsRef.value = { 
        prefix: null,
        terms: value || null,
        header: null,
        instructions: null
      }
    } else {
      quoteSettingsRef.value = {
        ...quoteSettingsRef.value,
        terms: value || null
      }
    }
  }
})

const quoteInstructions = computed({
  get: () => {
    if (!quoteSettingsRef.value) {
      return ''
    }
    return quoteSettingsRef.value.instructions ?? ''
  },
  set: (value: string) => {
    if (!quoteSettingsRef.value) {
      quoteSettingsRef.value = { 
        prefix: null,
        terms: null,
        header: null,
        instructions: value || null
      }
    } else {
      quoteSettingsRef.value = {
        ...quoteSettingsRef.value,
        instructions: value || null
      }
    }
  }
})

// Temporarily hidden tax payer functionality
/*
const isTaxPayer = computed({
  get: () => formState.value.is_tax_payer,
  set: (value: boolean) => {
    updateState({ is_tax_payer: value })
    if (!value) {
      updateState({ tax_number: null })
    }
  }
})

const handleTaxPayerChange = (checked: boolean) => {
  isTaxPayer.value = checked
}

const validateTaxNumber = (value: string) => {
  if (!value && isTaxPayer.value) {
    taxNumberError.value = t('quote.form.company.taxNumberRequired')
    return false
  }
  
  // Add your tax number validation logic here
  // This is just a basic example
  if (value && !/^[A-Z0-9]+$/.test(value)) {
    taxNumberError.value = t('quote.form.company.taxNumberInvalid')
    return false
  }

  taxNumberError.value = ''
  return true
}
*/

// Validation functions
const validateZip = (zip: string) => {
  if (!zip) return true
  if (isUS) {
    const usZipRegex = /^\d{5}(-\d{4})?$/
    zipError.value = usZipRegex.test(zip) ? '' : 'Invalid ZIP code format'
    return !zipError.value
  } else {
    const czZipRegex = /^\d{3}\s\d{2}$/
    zipError.value = czZipRegex.test(zip) ? '' : 'Neplatné PSČ - formát: xxx xx'
    return !zipError.value
  }
}

const validateState = (state: string) => {
  if (!state) return true
  if (isUS) {
    const usStateRegex = /^[A-Z]{2}$/
    stateError.value = usStateRegex.test(state) ? '' : 'Use 2-letter state code (e.g., CA)'
    return !stateError.value
  }
  return true
}

const validateTaxId = (value: string) => {
  if (!value) return true
  
  if (isUS) {
    const einRegex = /^\d{2}-\d{7}$/
    taxIdError.value = einRegex.test(value) ? '' : 'Invalid EIN format (XX-XXXXXXX)'
    return !taxIdError.value
  } else {
    // For Czech Republic, DIČ format is CZ + 8-10 digits
    // Most commonly CZ + IČO (8 digits) for businesses
    const dicRegex = /^CZ\d{8,10}$/
    const isValid = dicRegex.test(value)
    taxIdError.value = isValid ? '' : 'Neplatné DIČ (např. CZ12345678)'
    return isValid
  }
}

// Save profile data
const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = null
    showSuccess.value = false

    // Validate required fields
    if (!formState.value.name?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t('settings.errors.nameRequired')
      })
      return
    }

    // Temporarily hidden tax payer validation
    /*
    if (formState.value.is_tax_payer && !formState.value.tax_number) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t('settings.errors.taxNumberRequired')
      })
      return
    }
    */

    const success = await updateProfile(formState.value)
    if (success) {
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    }
  } catch (err) {
    logError('Error saving settings:', err)
    toast({
      variant: "destructive",
      title: "Error",
      description: err instanceof Error ? err.message : 'An error occurred'
    })
  } finally {
    loading.value = false
  }
}

// Save quote settings
const saveQuoteSettings = async () => {
  try {
    showQuoteSuccess.value = false
    const updatedSettings = {
      prefix: quotePrefix.value || null,
      terms: quoteTerms.value || null,
      header: quoteTermsHeader.value || 'Terms and Conditions',
      instructions: quoteInstructions.value || null
    }

    const success = await quoteStore.updateSettings(updatedSettings)
    
    if (success) {
      showQuoteSuccess.value = true
      setTimeout(() => {
        showQuoteSuccess.value = false
      }, 3000)
    } else {
      throw new Error('Failed to save quote settings')
    }
  } catch (err) {
    logError('Error saving quote settings:', err)
    showQuoteSuccess.value = false
  }
}

// Function to load initial data
const loadInitialData = async () => {
  if (!supabase) {
    logError('Supabase client not initialized')
    error.value = new Error('Supabase client not initialized')
    return
  }

  try {
    loading.value = true
    error.value = null // Clear any previous errors

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // Set the email
    formState.value.email = user.email ?? null

    try {
      // Load profile, quote settings in parallel
      const [profileData, quoteResult] = await Promise.all([
        fetchProfile(),
        quoteStore.fetchSettings(),
      ])

      if (profileData) {
        updateState(mapProfileToFormData(profileData))
      } else {
        // If profileData is null (e.g., user's first time), ensure default isTaxPayer is set
        updateState({ is_tax_payer: false }) // Explicitly set default if no profile data
      }
    } catch (loadErr) {
      logError('Error loading profile or quote settings:', loadErr)
      // Don't throw here, just log the error and continue
      // This allows the page to load even if one of the data fetches fails
      
      // Display a more user-friendly error message
      error.value = new Error(
        loadErr instanceof Error 
          ? loadErr.message 
          : 'Failed to load profile data. Please try refreshing the page.'
      )
    }

  } catch (err) {
    logError('Error loading initial data:', err)
    error.value = new Error(
      err instanceof Error 
        ? err.message 
        : 'Failed to load initial data. Please try refreshing the page.'
    )
  } finally {
    loading.value = false
  }
}

// Load initial data
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  loadInitialData()
})

// Map profile to form data
const mapProfileToFormData = (profile: any) => {
  return {
    email: profile.email,
    name: profile.name,
    street: profile.street,
    city: profile.city,
    state: profile.state,
    zip: profile.zip,
    country: profile.country,
    tax_id: profile.tax_id,
    is_tax_payer: profile.is_tax_payer,
    tax_number: profile.tax_number
  }
}

// Template bindings
const email = computed(() => formState.value.email ?? '')
const name = computed({
  get: () => formState.value.name ?? '',
  set: (value: string) => updateState({ name: value || null })
})
const street = computed({
  get: () => formState.value.street ?? '',
  set: (value: string) => updateState({ street: value || null })
})
const city = computed({
  get: () => formState.value.city ?? '',
  set: (value: string) => updateState({ city: value || null })
})
const state = computed({
  get: () => formState.value.state ?? '',
  set: (value: string) => updateState({ state: value || null })
})
const zip = computed({
  get: () => formState.value.zip ?? '',
  set: (value: string) => updateState({ zip: value || null })
})
const country = computed({
  get: () => formState.value.country ?? '',
  set: (value: string) => updateState({ country: value || null })
})
const taxId = computed({
  get: () => formState.value.tax_id ?? '',
  set: (value: string) => updateState({ tax_id: value || null })
})
const taxNumber = computed({
  get: () => formState.value.tax_number ?? '',
  set: (value: string) => updateState({ tax_number: value || null })
})

// Debug function
const { runDiagnostics, forceReloadTranslations } = useLanguageDebug();

const runLanguageDebug = () => {
  log(`[Settings] Running language diagnostics...`);
  
  // Print current URL and port information
  if (process.client) {
    const url = window.location.href;
    const port = window.location.port;
    const hostname = window.location.hostname;
    log(`[Settings Debug] Current URL: ${url}`);
    log(`[Settings Debug] Hostname: ${hostname}, Port: ${port}`);
    
    // Check if we're on the right port for the language
    const detectedLocale = languageService.detectLocale(hostname + (port ? ':' + port : ''));
    const correctPort = detectedLocale === 'en' ? '3001' : '3000';
    log(`[Settings Debug] Language check - Detected: ${detectedLocale}, Current: ${locale.value}`);
    log(`[Settings Debug] Port check - Current: ${port}, Expected for ${detectedLocale}: ${correctPort}`);
    
    if (port !== correctPort) {
      console.warn(`[Settings Debug] WARNING: You are on the wrong port for ${detectedLocale}!`);
    }
  }
  
  // Run full diagnostics 
  runDiagnostics();
  
  // Test specific settings page translations
  console.group('[Settings Debug] Testing specific settings page translations:');
  const testKeys = [
    'settings.company.description',
    'settings.company.basicInfo',
    'settings.company.addressInfo',
    'settings.company.taxInfo',
    'settings.company.taxPayerHelp',
    'settings.quote.description'
  ];
  
  testKeys.forEach(key => {
    log(`- "${key}" = "${t(key)}"`);
  });
  console.groupEnd();
  
  // Ask if user wants to force reload translations
  const shouldReload = confirm('Run language diagnostics in console. Force reload translations?');
  if (shouldReload) {
    forceReloadTranslations();
  }
}
</script>