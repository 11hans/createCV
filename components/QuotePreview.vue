<template>
  <div class="relative z-10 flex items-center">
    <div id="container" class="quote-preview">
      <!-- Quote Header -->
      <div class="border-b border-invoice px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xxs font-semibold uppercase text-invoice-light">{{ $t('quote.preview.quoteNo') }}</p>
            <p class="text-xs font-medium text-invoice-dark">{{ terms?.number || 'QT-0001'}}</p>
          </div>
          <div class="flex min-w-[44%] pl-0">
            <div class="min-w-[60px]">
              <p class="pb-0.5 text-xxs font-semibold uppercase tracking-wider text-invoice-light">{{ $t('quote.preview.issued') }}</p>
              <p class="text-xs font-medium text-invoice-dark">{{ formatDate(terms?.issueDate) }}</p>
            </div>
            <div class="ml-6 min-h-[34.5px]">
              <p class="pb-0.5 text-xxs font-semibold uppercase tracking-wider text-invoice-light">{{ $t('quote.preview.dueDate') }}</p>
              <p class="text-xs font-medium text-invoice-dark">{{ formatDate(terms?.dueDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Company and Client Info -->
      <div class="grid grid-cols-2 divide-x divide-invoice border-b border-invoice">
        <!-- Company Info -->
        <div class="p-8">
          <p class="pb-2.5 text-xxs font-semibold uppercase text-invoice-light">{{ $t('quote.preview.from') }}</p>
          <p class="mb-1.5 text-sm font-medium text-invoice-dark">{{ company?.name || $t('quote.form.company.companyNamePlaceholder') }}</p>
          <p class="mb-1.5 text-xs text-invoice-light">{{ company?.email || $t('quote.form.company.emailPlaceholder') }}</p>
          <p class="mb-1.5 text-xs text-invoice-light">{{ company?.street || $t('quote.form.company.addressPlaceholder') }}</p>
          <p class="mb-1.5 text-xs text-invoice-light">
            {{ company?.city || $t('quote.form.company.cityPlaceholder') }}{{ company?.city && company?.state ? ', ' : '' }}{{company?.state}}
          </p>
          <p class="mb-1.5 text-xs text-invoice-light">{{ company?.zip || $t('quote.form.company.zipPlaceholder') }}</p>
          <!-- <p class="text-xs text-invoice-light">{{ company?.country || $t('quote.form.company.countryPlaceholder') }}</p> -->
        </div>

        <!-- Client Info -->
        <div class="p-8">
          <p class="pb-2.5 text-xxs font-semibold uppercase text-invoice-light">{{ $t('quote.preview.to') }}</p>
          <p class="mb-1.5 text-sm font-medium text-invoice-dark">{{ client?.company_name || $t('quote.form.client.companyNamePlaceholder') }}</p>
          <p class="mb-1.5 text-xs text-invoice-light">{{ client?.email || $t('quote.form.client.emailPlaceholder') }}</p>
          <p class="mb-1.5 text-xs text-invoice-light">{{ client?.street || $t('quote.form.client.addressPlaceholder') }}</p>
          <p class="mb-1.5 text-xs text-invoice-light">
            {{ client?.city || $t('quote.form.client.cityPlaceholder') }}{{ client?.city && client?.state ? ', ' : '' }}{{client?.state}}
          </p>
          <p class="mb-1.5 text-xs text-invoice-light">{{ client?.zip || $t('quote.form.client.zipPlaceholder') }}</p>
          <!-- <p class="text-xs text-invoice-light">{{ client?.country || $t('quote.form.client.countryPlaceholder') }}</p> -->
        </div>
      </div>

      <!-- Quote Items -->
<div 
  data-active="false" 
  class="group w-full hover:data-[active=false]:bg-black/[0.02] max-w relative z-10 flex grow flex-col overflow-hidden invoice:z-0" 
  role="button"
>
  <div class="flex grow flex-col overflow-auto p-3 px-8 py-6 scrollbar-hide">
    <!-- Items Header -->
    <div class="grid grid-cols-2 text-xxs font-semibold uppercase tracking-wider text-invoice-light">
      <div>{{ $t('quote.preview.description') }}</div>
      <div class="grid grid-cols-[85px,1fr,1fr]">
        <div>{{ $t('quote.preview.quantity') }}</div>
        <div>{{ $t('quote.preview.price') }}</div>
        <div>{{ $t('quote.preview.amount') }}</div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-if="!items.length" 
      class="grid grid-cols-2 min-h-[49px] border-b border-invoice py-4 text-xs"
    >
      <p class="max-w-[280px] truncate font-medium text-invoice-light">
        {{ $t('quote.preview.noData') }}
      </p>
      <div class="grid grid-cols-[85px,1fr,1fr]">
        <p class="truncate font-medium text-invoice-light">0</p>
        <p class="truncate font-medium text-invoice-light">
          {{ formatNumber(0) }}
        </p>
        <p class="truncate font-medium text-invoice-light">
          {{ formatNumber(0) }}
        </p>
      </div>
    </div>

          <!-- Items List -->
          <div class="mt-4 space-y-3">
            <div v-for="(item, index) in items" :key="index" class="grid grid-cols-2 text-xs">
              <div class="pr-4 text-invoice-dark">{{ item.description || $t('quote.preview.itemDescriptionPlaceholder') }}</div>
              <div class="grid grid-cols-[85px,1fr,1fr]">
                <div class="text-invoice-light">{{ item.quantity || '0' }}</div>
                <div class="text-invoice-light">{{ formatNumber(item.unitPrice) }}</div>
                <div class="text-invoice-light">{{ formatNumber(item.quantity * item.unitPrice) }}</div>
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div class="border-t border-invoice p-8">
            <div class="flex justify-end">
              <div class="w-[240px] space-y-3">
                <!-- Subtotal -->
                <div class="flex justify-between">
                  <span class="text-xs text-invoice-light">{{ $t('quote.preview.subtotal') }}</span>
                  <span class="text-xs font-medium text-invoice-dark">{{ formatNumber(subtotal) }}</span>
                </div>

                <!-- Tax - only show when tax amount is not 0 -->
                <div v-if="taxAmount > 0" class="flex justify-between">
                  <span class="text-xs text-invoice-light">{{ taxDisplay }}</span>
                  <span class="text-xs font-medium text-invoice-dark">{{ formatNumber(taxAmount) }}</span>
                </div>

                <!-- Total -->
                <div class="flex justify-between border-t border-invoice pt-3">
                  <span class="text-xs font-medium text-invoice-dark">{{ $t('quote.preview.total') }}</span>
                  <span class="text-xs font-medium text-invoice-dark">{{ formatNumber(total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Terms -->
      <div data-active="false" style="--height: 156px;" class="group w-full hover:data-[active=false]:bg-black/[0.02] relative flex h-[var(--height)] min-h-[var(--height)] flex-col border-t border-invoice transition-all duration-300" role="button">
        <div class="">
          <div class="grid grid-cols-2 pt-[3px]">
            <p class="p-8 py-6 pb-0 text-xxs font-semibold uppercase tracking-wider text-invoice-light">{{ termsHeader || $t('quote.preview.terms') }}</p>
            <p class="p-8 py-6 pb-0 text-xxs font-semibold uppercase tracking-wider text-invoice-light">{{ $t('quote.preview.instructions') }}</p>
          </div>
          <div class="grid grid-cols-2">
            <div class="p-8 pb-6 pt-4">
              <p class="text-xs text-invoice-dark">{{ terms.note || $t('quote.preview.termsPlaceholder') }}</p>
            </div>
            <div class="p-8 pb-6 pt-4">
              <p class="text-xs text-invoice-dark">{{ instructions || $t('quote.preview.instructionsPlaceholder') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="fixed bottom-6 left-6 flex items-center group hover:bg-black/5 rounded-full px-3 py-1.5 transition-all duration-300">
        <div class="flex items-center gap-2">
          <p class="text-xs text-invoice-light">{{ $t('quote.preview.createdWith') }}</p>
          <a href="https://qfast.cz" target="_blank" class="text-xs font-semibold text-blue-500 hover:underline">
            qfast.cz
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from '~/stores/quote'
import { useFormatting } from '~/composables/useFormatting'
import { useLanguage } from '~/composables/useLanguage'
import { computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { log, error as logError } from '~/utils/logger'

const quoteStore = useQuoteStore()
const route = useRoute()

// Wrap useLanguage in a try-catch block to handle potential errors
let currentLocale
try {
  const { currentLocale: locale } = useLanguage()
  currentLocale = locale
  log('QuotePreview setup: currentLocale =', currentLocale.value)
} catch (e) {
  console.warn('QuotePreview: Error using useLanguage composable', e)
  // Provide a fallback value for currentLocale
  currentLocale = ref('cs')
}

const { formatCurrency, formatDate, getTaxLabel } = useFormatting()

// Load quote data if we have an ID
const loadQuoteData = async () => {
  log('loadQuoteData called, route.params.id:', route.params.id)
  if (route.params.id) {
    try {
      await quoteStore.loadQuote(route.params.id as string)
    } catch (error) {
      logError('Failed to load quote:', error)
    }
  }
}

// Register lifecycle hooks before any await statements
onMounted(() => {
  log('QuotePreview mounted, route.path:', route.path)
  // Only attempt to load quote data if we're on a page that should have an ID
  // This prevents issues when the component is used in the "new" page
  if (route.path.includes('/edit-') || route.path.includes('/quotes/') && !route.path.includes('/new')) {
    log('Loading quote data for path:', route.path)
    // Call the async function without awaiting it in onMounted
    loadQuoteData()
  } else {
    log('Skipping quote data loading for path:', route.path)
  }
})

// Add an onUnmounted hook to help diagnose if the component is being unmounted prematurely
onUnmounted(() => {
  log('QuotePreview unmounted, route.path:', route.path)
})

// Store refs - using storeToRefs for reactivity
const { items, terms } = storeToRefs(quoteStore)

// Company and client data need to be computed to ensure proper reactivity and separation
const company = computed(() => quoteStore.$state.company)
const client = computed(() => quoteStore.$state.client)
const termsHeader = computed(() => quoteStore.$state.termsHeader)
const instructions = computed(() => quoteStore.$state.instructions)

// Country detection
const isUS = computed(() => {
  // Safely access currentLocale.value
  try {
    return currentLocale.value === 'en'
  } catch (e) {
    console.warn('QuotePreview: Error accessing currentLocale.value', e)
    return false
  }
})

// Computed properties for display
const vatLabel = computed(() => getTaxLabel())
const subtotal = computed(() => quoteStore.subtotal)
const total = computed(() => quoteStore.total)
const taxAmount = computed(() => {
  // If tax is not included, return 0
  if (!quoteStore.taxIncluded) {
    return 0;
  }
  
  // Otherwise use the override value if available
  if (quoteStore._taxTotalOverride !== null) {
    return quoteStore._taxTotalOverride;
  }
  
  return quoteStore.taxTotal;
})

// Format number with proper currency
const formatNumber = (num: number) => {
  if (typeof num !== 'number' || isNaN(num)) return formatCurrency(0)
  return formatCurrency(num)
}

// Format date using country-specific format
const formatDateUtil = (date: Date | string | null | undefined) => {
  if (!date) return ''
  if (typeof date === 'string') {
    return formatDate(new Date(date))
  }
  return formatDate(date)
}

// Computed for tax display
const taxDisplay = computed(() => {
  if (isUS.value) {
    const rate = subtotal.value > 0 ? ((taxAmount.value / subtotal.value) * 100).toFixed(1) : quoteStore.taxRate.toString();
    return `Sales Tax (${rate}%)`
  }
  return `${vatLabel.value} (${quoteStore.taxRate}%)`
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.quote-preview {
  border: 1px solid var(--invoice-border);
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

/* Invoice Border Colors */
.border-invoice {
  border-color: var(--invoice-border);
}

.divide-invoice > * {
  border-color: var(--invoice-border);
}

/* Invoice Text Colors */
.text-invoice-dark {
  color: var(--invoice-dark) !important;
}

.text-invoice-light {
  color: var(--invoice-light) !important;
}
</style>