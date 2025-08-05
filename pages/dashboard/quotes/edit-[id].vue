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
          <!-- Loading state -->
          <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
            <Loader2 class="h-8 w-8 animate-spin" />
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <AlertCircle class="h-8 w-8 text-red-500" />
            <p class="text-red-500">{{ error }}</p>
            <Button variant="outline" @click="fetchQuote">Try Again</Button>
          </div>

          <!-- Form Steps -->
          <form v-else @submit.prevent="handleSubmit" class="flex flex-col flex-1">
            <!-- Form Header with Title and Progress Indicator -->
            <div class="mb-6">
              <!-- Step title with better visual hierarchy -->
              <div class="flex justify-between items-center mb-1">
                <h2 class="text-xl font-semibold text-gray-800">
                  {{ store.currentStep === 1 ? $t('quote.steps.company') : $t(`quote.steps.${store.steps[store.currentStep-1]}`) }}
                </h2>
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
import { ref, onMounted, provide, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, useSupabaseClient } from '#imports'
import { useQuoteStore } from '~/stores/quote'
import { useToast } from '@/components/ui/toast/use-toast'
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

definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const store = useQuoteStore()
const { toast } = useToast()
const quoteState = useQuoteState(QuoteMode.EDIT)
const isSubmitted = ref(false)

// Provide quote mode to components
provide('quoteMode', QuoteMode.EDIT)

// Use our simplified window switching detection composable
const { isSwitchingWindows } = useWindowSwitching({
  pageId: 'quote-edit',
  itemId: String(route.params.id)
})

const isLoading = ref(true)
const error = ref<string | null>(null)

// Function to initialize store and load quote
const initializeQuoteEdit = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Initialize the store first
    await quoteState.initializeStore()
    
    // Extract the quote ID directly from route params
    const quoteId = String(route.params.id)
    log('Loading quote with ID:', quoteId)
    
    if (!quoteId) {
      throw new Error('Quote ID is missing from the URL')
    }
    
    // Load the quote data
    const quoteData = await store.loadQuote(quoteId)
    log('Quote data loaded successfully:', quoteData)
    
    // Ensure the items are properly loaded
    if (store.items.length === 0 && quoteData && quoteData.items && quoteData.items.length > 0) {
      console.warn('Items not loaded into store, manually updating')
      store.updateItems(quoteData.items)
    }
  } catch (err) {
    logError('Error initializing quote:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load quote'
  } finally {
    isLoading.value = false
  }
}

// Initialize store and load quote on mount
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  initializeQuoteEdit()
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

async function fetchQuote() {
  try {
    error.value = null
    isLoading.value = true
    
    // Extract the quote ID directly from route params
    const quoteId = String(route.params.id)
    log('Fetching quote with ID:', quoteId)
    
    if (!quoteId) {
      throw new Error('Quote ID not found in URL parameters')
    }
    
    // Load the quote data
    const quoteData = await store.loadQuote(quoteId)
    log('Quote data loaded successfully:', quoteData)
    
    // Ensure the items are properly loaded
    if (store.items.length === 0 && quoteData && quoteData.items && quoteData.items.length > 0) {
      console.warn('Items not loaded into store, manually updating')
      store.updateItems(quoteData.items)
    }
  } catch (e) {
    logError('Error in fetchQuote:', e)
    error.value = e instanceof Error ? e.message : 'Failed to load quote'
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    if (store.currentStep === 5) {
      // On the review step, save the quote
      // Extract the quote ID directly from route params
      const quoteId = String(route.params.id)
      
      if (!quoteId) {
        throw new Error('Quote ID is missing from the URL')
      }
      
      await store.updateQuote(quoteId, user.id)
      
      // Mark as submitted so we don't clear data
      isSubmitted.value = true
      
      toast({
        title: "Success",
        description: "Quote updated successfully",
      })
      
      router.push('/dashboard/quotes')
    } else {
      // Otherwise just move to next step
      store.nextStep()
    }
  } catch (error) {
    logError('Error updating quote:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update quote",
      variant: "destructive",
    })
  }
}
</script>

<style>
@import '@/assets/css/variables.css';
@import '@/assets/css/forms.css';
@import '@/assets/css/components/quote.css';
</style> 