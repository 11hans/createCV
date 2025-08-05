<template>
    <div class="relative z-10 flex items-center">
      <div id="container" class="quote-preview">
        <!-- Quote Header -->
        <div data-active="false" class="group w-full hover:data-[active=false]:bg-black/[0.02] relative isolate flex h-full max-h-[56px] flex-col border-invoice transition-all duration-500" role="button">
          <div class="pointer-events-none absolute inset-[8px]"></div>
          <div class="flex h-full items-center justify-between border-b border-invoice px-8">
            <div>
              <p class="text-xxs font-semibold uppercase text-invoice-light">{{ $t('quote.preview.quoteNo') }}</p>
              <p class="text-xs font-medium text-invoice-dark">{{ quote?.number }}</p>
            </div>
            <div class="flex min-w-[44%] pl-0">
              <div class="min-w-[60px]">
                <p class="pb-0.5 text-xxs font-semibold uppercase tracking-wider text-invoice-light">{{ $t('quote.preview.issued') }}</p>
                <p class="text-xs font-medium text-invoice-dark">{{ formatDate(quote?.issue_date) }}</p>
              </div>
              <div class="ml-6 min-h-[34.5px]">
                <p class="pb-0.5 text-xxs font-semibold uppercase tracking-wider text-invoice-light">{{ $t('quote.preview.dueDate') }}</p>
                <p class="text-xs font-medium text-invoice-dark">{{ formatDate(quote?.valid_until) }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Company and Client Info -->
        <div class="relative z-10 grid cursor-pointer grid-cols-2 items-center justify-between divide-x divide-invoice border-b border-invoice invoice:z-0">
          <!-- Company Info -->
          <div data-active="false" class="group w-full hover:data-[active=false]:bg-black/[0.02] relative flex h-full flex-1 flex-col border-r border-invoice" role="button">
            <div class="p-8 py-6">
              <p class="pb-2.5 text-xxs font-semibold uppercase text-invoice-light">{{ $t('quote.preview.from') }}</p>
              <p class="mb-1.5 text-sm font-medium text-invoice-dark">{{ profile?.name || $t('quote.form.company.companyNamePlaceholder') }}</p>
              <p class="mb-1.5 text-xs text-invoice-light">{{ profile?.email || $t('quote.form.company.emailPlaceholder') }}</p>
              <p class="mb-1.5 text-xs text-invoice-light">{{ profile?.street || $t('quote.form.company.addressPlaceholder') }}</p>
              <p class="mb-1.5 text-xs text-invoice-light">
                {{ profile?.city || $t('quote.form.client.cityPlaceholder') }}{{ profile?.city && profile?.state ? ', ' : '' }}{{profile?.state}}
              </p>
              <p class="mb-1.5 text-xs text-invoice-light">{{ profile?.zip || $t('quote.form.company.zipPlaceholder') }}</p>
              <p class="text-xs text-invoice-light">{{ profile?.country || $t('quote.form.company.countryPlaceholder') }}</p>
            </div>
          </div>
  
          <!-- Client Info -->
          <div data-active="false" class="group w-full hover:data-[active=false]:bg-black/[0.02] relative flex h-full flex-1 flex-col border-l border-invoice" role="button">
            <div class="p-8 py-6">
              <p class="pb-2.5 text-xxs font-semibold uppercase text-invoice-light">{{ $t('quote.preview.to') }}</p>
              <p class="mb-1.5 text-sm font-medium text-invoice-dark">{{ quote?.client?.company_name || $t('quote.form.client.companyNamePlaceholder') }}</p>
              <p class="mb-1.5 text-xs text-invoice-light">{{ quote?.client?.email || $t('quote.form.client.emailPlaceholder') }}</p>
              <p class="mb-1.5 text-xs text-invoice-light">{{ quote?.client?.street || $t('quote.form.client.addressPlaceholder') }}</p>
              <p class="mb-1.5 text-xs text-invoice-light">
                {{ quote?.client?.city || $t('quote.form.client.cityPlaceholder') }}{{ quote?.client?.city && quote?.client?.state ? ', ' : '' }}{{quote?.client?.state}}
              </p>
              <p class="mb-1.5 text-xs text-invoice-light">{{ quote?.client?.zip || $t('quote.form.client.zipPlaceholder') }}</p>
              <p class="text-xs text-invoice-light">{{ quote?.client?.country || $t('quote.form.client.countryPlaceholder') }}</p>
            </div>
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
        v-if="!quote?.items?.length" 
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
              <div v-for="item in quote?.items" :key="item.id" class="grid grid-cols-2 text-xs">
                <div class="pr-4 text-invoice-dark">{{ item.description }}</div>
                <div class="grid grid-cols-[85px,1fr,1fr]">
                  <div class="text-invoice-light">{{ item.quantity }}</div>
                  <div class="text-invoice-light">{{ formatNumber(item.unit_price) }}</div>
                  <div class="text-invoice-light">{{ formatNumber(item.amount) }}</div>
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
                    <span class="text-xs font-medium text-invoice-dark">{{ formatNumber(quote?.subtotal) }}</span>
                  </div>
  
                  <!-- Tax -->
                  <div class="flex justify-between">
                    <span class="text-xs text-invoice-light">{{ taxDisplay }}</span>
                    <span class="text-xs font-medium text-invoice-dark">{{ formatNumber(quote?.tax_total) }}</span>
                  </div>
  
                  <!-- Total -->
                  <div class="flex justify-between border-t border-invoice pt-3">
                    <span class="text-xs font-medium text-invoice-dark">{{ $t('quote.preview.total') }}</span>
                    <span class="text-xs font-medium text-invoice-dark">{{ formatNumber(quote?.total) }}</span>
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
              <p class="p-8 py-6 pb-0 text-xxs font-semibold uppercase tracking-wider text-invoice-light">{{ $t('quote.preview.terms') }}</p>
              <p class="p-8 py-6 pb-0 text-xxs font-semibold uppercase tracking-wider text-invoice-light">{{ $t('quote.preview.instructions') }}</p>
            </div>
            <div class="grid grid-cols-2">
              <div class="p-8 pb-6 pt-4">
                <p class="text-xs text-invoice-dark">{{ quote?.notes || $t('quote.preview.termsPlaceholder') }}</p>
              </div>
              <div class="p-8 pb-6 pt-4">
                <p class="text-xs text-invoice-dark">{{ $t('quote.preview.paymentReference') }}</p>
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
  import { ref, computed, onMounted } from 'vue'
  import { useFormatting } from '~/composables/useFormatting'
  import { useLanguage } from '~/composables/useLanguage'
  import { useSupabaseClient } from '#imports'
  import type { QuoteWithClient, Database } from '@/types/database.types'
  
  interface QuoteItem {
    id: string
    description: string
    quantity: number
    unit_price: number
    tax_rate: number
    price_includes_tax: boolean
    is_tax_exempt: boolean
    sort_order: number | null
    price: number
    amount: number
  }
  
  const props = defineProps<{
    quote: (QuoteWithClient & { items?: QuoteItem[] }) | null
  }>()
  
  const supabase = useSupabaseClient<Database>()
  const { currentLocale } = useLanguage()
  const { formatCurrency, formatDate: formatDateUtil, getTaxLabel } = useFormatting()
  
  // Country detection
  const isUS = computed(() => currentLocale.value === 'en')
  
  // Company profile
  const profile = ref<Database['public']['Tables']['profiles']['Row'] | null>(null)
  
  // Load company profile
  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .single()
    
    if (data) {
      profile.value = data
    }
  }
  
  // Register lifecycle hooks before any await statements
  onMounted(() => {
    // Call the async function without awaiting it in onMounted
    loadProfile()
  })
  
  // Format number with proper currency
  const formatNumber = (num: number | undefined | null) => {
    if (typeof num !== 'number' || isNaN(num)) return ''
    return formatCurrency(num)
  }
  
  // Format date using country-specific format
  const formatDate = (date: string | undefined | null) => {
    if (!date) return ''
    return formatDateUtil(new Date(date))
  }
  
  // Computed for tax display
  const taxDisplay = computed(() => {
    if (!props.quote) return getTaxLabel()
    
    if (isUS.value) {
      if (!props.quote.tax_total || !props.quote.subtotal || props.quote.tax_total === 0) {
        return 'No Sales Tax'
      }
      const taxRate = ((props.quote.tax_total / props.quote.subtotal) * 100).toFixed(3)
      return `Sales Tax (${taxRate}%)`
    }
    return getTaxLabel()
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
  