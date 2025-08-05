<template>
  <main class="relative flex h-screen w-full flex-col lg:flex-row overflow-hidden bg-[#FDFDFD]">
    <!-- Left Section with Form -->
    <div class="relative z-10 h-auto lg:h-full w-full overflow-y-auto bg-black bg-opacity-0 lg:min-w-[502px] lg:max-w-[30%] lg:animate-none lg:overflow-visible lg:!bg-opacity-0">
      <!-- Header with Branding -->
      <div class="sticky top-0 z-20 border-b border-black/[0.07] bg-white/80 backdrop-blur-sm">
        <div class="flex h-16 items-center px-6">
          <!-- Left side: Home Link & Branding -->
          <div class="flex items-center space-x-6">
            <NuxtLink 
              to="/dashboard/quotes" 
              class="group flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-black/60 hover:bg-black/[0.02] transition-all pointer-events-auto"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="stroke-black/60 rotate-180">
                <g fill-rule="evenodd">
                  <path d="M0 5h7" class="stroke-[1.5px] opacity-0 transition-all group-hover:opacity-100"></path>
                  <path d="M1 1l4 4-4 4" class="fill-none stroke-[1.5px] transition-all group-hover:translate-x-[3px]"></path>
                </g>
              </svg>
              <span>{{ $t('quote.navigation.back') }}</span>
            </NuxtLink>

            <div class="h-5 w-px bg-black/[0.07]"></div>

            <NuxtLink to="/dashboard/" class="flex items-center space-x-2 pointer-events-auto">
              <span class="text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Quotefast
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="flex min-w-full max-w-[calc(100%-3rem)] flex-1 justify-center overflow-y-auto border-r border-black/[0.07] bg-[#FDFDFD] p-6 lg:h-[calc(100%-4rem)] shadow-[0px_0px_0px_1px,0px_-1px_1px_-0.5px,0px_-3px_3px_-1.5px,0px_-6px_6px_-3px,0px_-12px_12px_-6px,0px_-24px_24px_-12px] shadow-black/[0.04]">
        <div class="flex h-full w-full max-w-[405px] flex-col">
          <!-- Form Header with Title and Reset Button -->
          <div class="mb-6">
            <!-- Step title with better visual hierarchy -->
            <div class="flex justify-between items-center mb-1">
              <h2 class="text-xl font-semibold text-gray-800">
                {{ store.currentStep === 1 ? $t('quote.steps.company') : $t(`quote.steps.${store.steps[store.currentStep-1]}`) }}
              </h2>
              
              <!-- Actions menu dropdown -->
              <div class="relative">
                <button
                  type="button"
                  @click="showActionsMenu = !showActionsMenu"
                  class="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Quote actions"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                <!-- Dropdown menu -->
                <div v-if="showActionsMenu" class="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div class="py-1">
                    <button
                      @click="handleForceNewQuote(); showActionsMenu = false"
                      type="button"
                      class="flex w-full items-center px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {{ $t('quote.navigation.forceNew') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Progress indicator -->
            <div class="flex items-center text-sm text-gray-500 mt-1 mb-4">
              <span>{{ $t('quote.form.progressStep', { current: store.currentStep, total: store.steps.length }) }}</span>
              <div class="ml-3 flex-1 bg-gray-200 h-1 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-blue-500 rounded-full" 
                  :style="{ width: `${(store.currentStep / store.steps.length) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- Form Steps -->
          <form @submit.prevent="handleSubmit" class="flex flex-col flex-1">
            <CompanyForm v-if="store.currentStep === 1" @save="store.updateCompany" />
            <ClientForm v-if="store.currentStep === 2" @save="store.updateClient" />
            <QuoteItemsForm v-if="store.currentStep === 3" />
            <QuoteTermsForm v-if="store.currentStep === 4" />
            <QuoteReviewForm 
              v-if="store.currentStep === 5" 
              @create-new="store.resetForm"
            />

            <!-- Navigation -->
            <div class="-mb-2 mt-auto grid grid-cols-2 justify-between gap-3 py-8 text-sm">
              <!-- Back Button -->
              <button 
                v-if="store.currentStep !== 1"
                type="button"
                @click="store.previousStep"
                class="group relative flex translate-x-3 flex-col items-start space-y-1 rounded-md px-3 py-2 outline-none transition-all after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-md after:border-[1.5px] after:border-[#0094FF]/0 hover:bg-black/[0.02] focus-visible:after:border-[#0094FF]"
              >
                <span class="-ml-1 flex items-center space-x-2">
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="stroke-black/60 rotate-180">
                    <g fill-rule="evenodd">
                      <path d="M0 5h7" class="stroke-[1.5px] opacity-0 transition-all group-hover:opacity-100"></path>
                      <path d="M1 1l4 4-4 4" class="fill-none stroke-[1.5px] transition-all group-hover:translate-x-[3px]"></path>
                    </g>
                  </svg>
                  <span class="text-black/60">{{ $t('quote.navigation.back') }}</span>
                </span>
                <span class="font-medium text-black/40">{{ $t(`quote.steps.${store.steps[store.currentStep - 2]}`) }}</span>
              </button>
              <span v-else></span>

              <!-- Next/Submit Button -->
              <button 
                v-if="store.currentStep !== 5"
                type="submit"
                class="group relative flex translate-x-3 flex-col items-end space-y-1 rounded-md px-3 py-2 outline-none transition-all after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-md after:border-[1.5px] after:border-[#0094FF]/0 hover:bg-black/[0.02] focus-visible:after:border-[#0094FF]"
              >
                <span class="-mr-1 flex items-center space-x-2">
                  <span class="text-black/60">{{ $t('quote.navigation.next') }}</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="stroke-black/60">
                    <g fill-rule="evenodd">
                      <path d="M0 5h7" class="stroke-[1.5px] opacity-0 transition-all group-hover:opacity-100"></path>
                      <path d="M1 1l4 4-4 4" class="fill-none stroke-[1.5px] transition-all group-hover:translate-x-[3px]"></path>
                    </g>
                  </svg>
                </span>
                <span class="font-medium text-black/40">{{ $t(`quote.steps.${store.steps[store.currentStep]}`) }}</span>
              </button>
              <span v-else></span>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="relative z-0 w-full h-auto lg:h-screen overflow-y-auto lg:w-[70%] flex-1 flex flex-col items-center p-6">
      <QuotePreview />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useSupabaseClient, useState } from '#imports'
import { useQuoteStore } from '~/stores/quote'
import { useToast } from '@/components/ui/toast/use-toast'
import { useI18n } from 'vue-i18n'
import { Loader2, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import CompanyForm from '@/components/forms/CompanyForm.vue'
import ClientForm from '@/components/forms/ClientForm.vue'
import QuoteItemsForm from '@/components/forms/QuoteItemsForm.vue'
import QuoteTermsForm from '@/components/forms/QuoteTermsForm.vue'
import QuoteReviewForm from '@/components/forms/QuoteReviewForm.vue'
import QuotePreview from '@/components/QuotePreview.vue'
import { useQuoteState, QuoteMode } from '@/composables/useQuoteState'
import { useWindowSwitching } from '@/composables/useWindowSwitching'
import { useFormStateReset } from '@/composables/useFormStateReset'
import { useQuoteSettings } from '@/composables/useQuoteSettings'

definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const supabase = useSupabaseClient()
const store = useQuoteStore()
const { toast } = useToast()
const { t } = useI18n()
const quoteState = useQuoteState(QuoteMode.NEW)
const isSubmitted = ref(false)
const showActionsMenu = ref(false)
const quoteSettingsStore = useQuoteSettings()

// Use our simplified window switching detection composable
const { isSwitchingWindows } = useWindowSwitching({
  pageId: 'quote-new'
})

// Function to initialize store and set up initial data
const initializeQuote = async () => {
  log('New quote page mounted, initializing store')
  
  // Check if there's a force=true parameter in the URL
  const forceNewQuote = router.currentRoute.value.query.force === 'true'
  
  // If force parameter is present, always start a fresh quote
  if (forceNewQuote) {
    log('Force parameter detected, initializing with empty form')
    await resetToNewQuote()
  }
  // Otherwise check if we're coming from a direct navigation or a window switch
  else if (isSwitchingWindows.value) {
    log('Detected window switching, attempting to restore previous form data')
    // Attempt to restore any previously saved quote data
    const restored = store.restoreQuoteData()
    if (restored) {
      log('Successfully restored quote data from previous session')
    } else {
      log('No saved data found, initializing with empty form')
      await resetToNewQuote()
    }
  } else {
    log('Fresh page load, clearing any existing form data')
    await resetToNewQuote()
  }
  
  // Set a flag in sessionStorage to indicate we're on the quote creation page
  if (process.client) {
    sessionStorage.setItem('onQuoteCreationPage', 'true')
  }
}

// Helper function to reset to a completely new quote
const resetToNewQuote = async () => {
  log('Resetting to a completely new quote')
  
  // Use our form state reset composable
  const { resetFormState } = useFormStateReset()
  
  // First clear all stored data
  store.clearFormData()
  
  // Then reset the form to initial state
  store.resetForm()
  
  // Explicitly ensure we have at least one empty item in the items array
  if (!store.items.length) {
    log('Adding default empty item to items array')
    store.items = [{
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      price: 0,
      amount: 0,
      taxRate: 21,
      priceIncludesTax: false,
      isTaxExempt: false,
      sortOrder: 0
    }]
  }
  
  // Also reset quoteItems_new state if it exists
  if (process.client) {
    // Clear localStorage items
    localStorage.removeItem('quoteItems_new')
    localStorage.removeItem('quoteItems')
    localStorage.removeItem('quoteItemsDraft')
    
    // CRITICAL: Use our dedicated resetFormState method to clear the useState cache
    resetFormState('quoteItems_new')
    
    // Log the current state of items after reset for debugging
    log('Items after reset:', store.items)
  }
  
  // Initialize the store
  await quoteState.initializeStore()
  
  // Load quote settings and apply them to the new quote
  await loadAndApplyQuoteSettings()
  
  // Double check that items are initialized after initializeStore
  log('Items after initializeStore:', store.items)
}

// Function to load quote settings and apply them to the new quote
const loadAndApplyQuoteSettings = async () => {
  try {
    log('Loading quote settings')
    await quoteSettingsStore.fetchSettings()
    
    if (quoteSettingsStore.settings) {
      log('Applying quote settings to new quote:', quoteSettingsStore.settings)
      
      // Apply prefix to quote number if available
      if (quoteSettingsStore.settings.prefix && store.terms.number) {
        // Check if the number already has the prefix
        if (!store.terms.number.startsWith(quoteSettingsStore.settings.prefix)) {
          // Remove any existing prefix (assuming it's before the first number)
          const numericPart = store.terms.number.replace(/^[^0-9]+/, '')
          store.terms.number = `${quoteSettingsStore.settings.prefix}${numericPart}`
        }
      }
      
      // Apply terms if available
      if (quoteSettingsStore.settings.terms) {
        store.terms.note = quoteSettingsStore.settings.terms
      }
      
      // Apply header if available (this will be used in the QuotePreview component)
      if (quoteSettingsStore.settings.header) {
        // We need to store this in a way that the QuotePreview component can access it
        store.termsHeader = quoteSettingsStore.settings.header
      }
      
      // Apply instructions if available
      if (quoteSettingsStore.settings.instructions) {
        store.instructions = quoteSettingsStore.settings.instructions
      }
      
      log('Quote settings applied successfully')
    } else {
      log('No quote settings found')
    }
  } catch (error) {
    logError('Error loading quote settings:', error)
  }
}

onMounted(() => {
  initializeQuote()
})

// Check if store has data - simple helper function
const hasStoreData = () => {
  return store.currentStep > 1 || 
         store.items.length > 0 || 
         store.company.name.length > 0 ||
         store.client.company_name.length > 0
}

// Clean up resources when component is unmounted
onBeforeUnmount(() => {
  // If we've submitted the form or are just switching windows, no need to warn
  if (isSubmitted.value || isSwitchingWindows.value) return
  
  // Otherwise, persist data in case user is coming back
  if (process.client && hasStoreData()) {
    log('Persisting quote data before unmounting')
    store.persistQuoteData()
  }
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    if (store.currentStep === 5) {
      // On the review step, save the quote
      log('Saving quote with client data:', JSON.stringify(store.client))
      
      // Check if client has an ID before saving
      if (store.client.id) {
        log('Client already has ID, using existing client:', store.client.id)
      } else {
        log('Client has no ID, will be created during quote save')
      }
      
      await store.saveQuote(user.id)
      
      // Mark as submitted so we don't clear data
      isSubmitted.value = true
      
      toast({
        title: "Success",
        description: "Quote created successfully",
      })
      
      router.push('/dashboard/quotes')
    } else {
      // Otherwise just move to next step
      store.nextStep()
    }
  } catch (error) {
    logError('Error creating quote:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create quote",
      variant: "destructive",
    })
  }
}

const handleResetForm = async () => {
  if (confirm(t('quote.messages.confirmNewQuote'))) {
    await resetToNewQuote()
    toast({
      title: t('quote.messages.newQuoteStarted'),
      description: t('quote.messages.formReset'),
    })
  }
}

const handleForceNewQuote = async () => {
  if (confirm(t('quote.messages.confirmForceNewQuote'))) {
    await resetToNewQuote()
    
    // Add a force parameter to the URL without reloading the page
    const currentQuery = { ...router.currentRoute.value.query, force: 'true' }
    router.replace({ query: currentQuery })
    
    toast({
      title: t('quote.messages.newQuoteStarted'),
      description: t('quote.messages.forceNewQuote'),
    })
  }
}
</script>

<style>
@import '@/assets/css/variables.css';
@import '@/assets/css/forms.css';
@import '@/assets/css/components/quote.css';
</style>