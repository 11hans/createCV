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
              to="/" 
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

            <NuxtLink to="/" class="flex items-center space-x-2 pointer-events-auto">
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
          <!-- Form Steps -->
          <form @submit.prevent="handleSubmit" class="flex flex-col flex-1">
            <PersonalInfoForm v-if="store.currentStep === 1" />
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

    <!-- Preview Section - Hidden on mobile -->
    <div class="hidden lg:flex relative z-0 w-full h-auto lg:h-screen overflow-y-auto lg:w-[70%] flex-1 flex-col items-center p-6">
      <QuotePreview />
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  auth: false,
  meta: {
    public: true
  }
})

import { useQuoteStore } from '~/stores/quote'
import PersonalInfoForm from '~/components/forms/PersonalInfoForm.vue'
import ClientForm from '~/components/forms/ClientForm.vue'
import QuoteItemsForm from '~/components/forms/QuoteItemsForm.vue'
import QuoteTermsForm from '~/components/forms/QuoteTermsForm.vue'
import QuoteReviewForm from '~/components/forms/QuoteReviewForm.vue'
import QuotePreview from '~/components/QuotePreview.vue'
import { useQuoteState, QuoteMode } from '~/composables/useQuoteState'
import { provide } from 'vue'

const store = useQuoteStore()
const quoteState = useQuoteState(QuoteMode.PUBLIC)

// Provide quote mode to components
provide('quoteMode', QuoteMode.PUBLIC)

// Initialize store on mount
onMounted(() => {
  quoteState.initializeStore()
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  
  // In public mode, we don't need to load profile data
  if (store.currentStep < 5) {
    // If we're on the items step, make sure to update the tax calculations
    if (store.currentStep === 3) {
      // Force an update of the tax calculations
      const taxAmount = store.items.reduce((sum, item) => {
        if (item.isTaxExempt) return sum;
        const basePrice = item.quantity * item.unitPrice;
        return sum + (basePrice * (item.taxRate / 100));
      }, 0);
      
      store.$patch({
        _taxTotalOverride: store.taxIncluded ? taxAmount : 0
      });
    }
    
    store.currentStep++
  }
}
</script>

<style>
@import '@/assets/css/variables.css';
@import '@/assets/css/forms.css';
</style>