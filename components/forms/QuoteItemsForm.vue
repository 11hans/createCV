<template>
  <div>
    <h2 class="form-section-title">{{ $t('quote.form.items.title') }}</h2>

    <!-- Kontejner pro jednotlivé položky -->
    <div class="-ml-12 w-[calc(100%+96px)] px-12 overflow-auto scrollbar-hide">
      <div class="mt-10">
        <div class="flex w-full pb-2">
          <div class="w-full max-w-[405px]">
            <p class="text-s font-bold text-gray-700">
              {{ $t('quote.form.items.description') }}
            </p>
          </div>
          <div class="w-8"></div>
        </div>

        <div class="h-full transition-all duration-500 ease-out">
          <!-- Jednotlivé položky (fieldset) -->
          <fieldset
            v-for="(item, index) in items"
            :key="item.id"
            class="group relative flex items-center transition-all duration-500 ease-out mb-4"
          >
            <div class="flex w-full items-center">
              <!-- Popis -->
              <div class="w-full max-w-[405px]">
                <input
                  v-model="item.description"
                  type="text"
                  :name="`items.${index}.description`"
                  :id="`items.${index}.description`"
                  :placeholder="$t('quote.form.items.descriptionPlaceholder')"
                  class="w-full h-12 px-3 border-b border-gray-300 bg-transparent text-sm text-gray-800 
                         focus:border-blue-500 focus:outline-none transition-colors"
                  @input="updateStore(true)"
                  @change="updateStore(false)"
                />
              </div>

              <!-- Množství -->
              <div class="w-[92px] px-2">
                <input
                  v-model.number="item.quantity"
                  type="number"
                  :name="`items.${index}.quantity`"
                  :id="`items.${index}.quantity`"
                  min="1"
                  step="1"
                  :placeholder="$t('quote.form.items.quantityPlaceholder')"
                  class="w-full h-12 border-b border-gray-300 bg-transparent text-sm text-gray-800 text-right
                         focus:border-blue-500 focus:outline-none transition-colors"
                  @input="handleQuantityChange($event, item)"
                  @change="updateStore(false)"
                />
              </div>

              <!-- Jednotková cena -->
              <div class="w-[122px] pl-3">
                <input
                  v-model.number="item.unitPrice"
                  type="number"
                  :name="`items.${index}.price`"
                  :id="`items.${index}.price`"
                  min="0"
                  step="0.01"
                  :placeholder="$t('quote.form.items.pricePlaceholder')"
                  class="w-full h-12 border-b border-gray-300 bg-transparent text-sm text-gray-800 text-right
                         focus:border-blue-500 focus:outline-none transition-colors"
                  @input="handlePriceChange($event, item)"
                  @change="updateStore(false)"
                />
              </div>

              <!-- Tlačítko smazat položku -->
              <div class="ml-1 grid translate-x-2 place-items-center">
                <button
                  @click="removeItem(index)"
                  class="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 
                         transition-colors duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4
                         a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <!-- Tlačítko pro přidání nové položky -->
      <button
        type="button"
        @click="addItem"
        class="flex h-12 w-full items-center border-b border-gray-300 py-2 text-left text-sm
               font-medium text-blue-600 hover:text-blue-700 hover:border-blue-500 focus:outline-none
               focus:border-blue-500 transition-all"
      >
        <svg class="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        <span>{{ $t('quote.form.items.addItem') }}</span>
      </button>

      <!-- Souhrn (subtotal, tax, total) -->
      <div class="grid grid-cols-[calc(20%+34px),1fr]">
        <div class="py-3 pr-6"></div>
        <div>
          <!-- Subtotal -->
          <div class="grid min-h-[49px] grid-cols-3 items-center border-b border-gray-300 py-3 pl-3">
            <div class="text-xs font-medium text-gray-600">
              {{ $t('quote.form.items.subtotal') }}
            </div>
            <p class="col-span-2 flex justify-end truncate text-xs font-medium text-gray-800">
              {{ formatNumber(subtotal) }}
            </p>
          </div>

          <!-- DPH row -->
          <div class="grid min-h-[49px] grid-cols-3 items-center border-b border-gray-300 py-3 pl-3">
            <div class="text-xs font-medium text-gray-600">
              {{ $t('quote.form.items.tax') }}
            </div>
            <div class="col-span-2 flex flex-col items-end">
              <!-- Informace k základu daně a částce DPH -->
              <div class="mt-2 flex flex-col space-y-2 w-full max-w-[240px] p-3 bg-gray-50 rounded-md border border-gray-100">
                <!-- Tax rate selection in one row -->
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-600">{{ $t('quote.form.items.taxRate') }}:</span>
                  <Select v-model="taxRateString" class="w-[80px]">
                    <SelectTrigger class="h-7 text-xs text-gray-900 hover:border-blue-500 transition-colors">
                      <SelectValue placeholder="%" />
                    </SelectTrigger>
                    <SelectContent class="bg-white text-gray-900">
                      <SelectGroup>
                        <SelectItem
                          v-for="rate in availableTaxRates"
                          :key="rate"
                          :value="rate.toString()"
                          class="text-gray-900 hover:bg-blue-50"
                        >
                          {{ rate }}%
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <!-- Net amount in one row -->
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-600">{{ $t('quote.form.items.netAmount') }}:</span>
                  <span class="text-xs font-medium text-gray-800">{{ formatNumber(subtotal) }}</span>
                </div>
                
                <!-- Tax amount in one row -->
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-600">{{ $t('quote.form.items.taxAmount') }}:</span>
                  <span class="text-xs font-medium text-gray-800">{{ formatNumber(displayTaxAmount) }}</span>
                </div>

                <!-- Checkbox in one row -->
                <div class="flex justify-between items-center border-t border-gray-100 pt-2 mt-1">
                  <span class="text-xs text-gray-600">{{ $t('quote.form.items.pricesIncludeTax') }}:</span>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="priceIncludesTax"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      @change="updateTaxSettings()"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="grid min-h-[49px] grid-cols-3 items-center py-3 pl-3 bg-blue-50">
            <div class="text-xs font-medium text-gray-900">
              {{ $t('quote.form.items.total') }}
            </div>
            <p class="col-span-2 flex justify-end truncate font-medium text-blue-700">
              {{ formatNumber(total) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useFormState } from '@/composables/useFormState'
import { useQuoteStore } from '@/stores/quote'
import type { QuoteItemForm } from '@/types/quote'
import { useI18n } from 'vue-i18n'
import { useQuoteFormLogic } from '@/composables/useQuoteFormLogic'
import { useRoute } from 'vue-router'
import { useFormatting } from '~/composables/useFormatting'

/**
 * Lokální proměnné, store a kontext
 */
const { t, locale } = useI18n()
const quoteStore = useQuoteStore()
const route = useRoute()
const { formatCurrency } = useFormatting()

/**
 * Režim: edit x new
 */
const isEditMode = computed(() => route.path.includes('/edit') && route.params.id)
const isNewMode = computed(() => route.path.includes('/dashboard/quotes/new'))

/**
 * Pro edit mode: použijeme přímo store. Pro new mode: použijeme session-based useFormState.
 */
const items = computed<QuoteItemForm[]>({
  get: () => {
    if (isEditMode.value) {
      return quoteStore.items
    } else {
      // Check if the force=true parameter is present in the URL
      const forceNewQuote = route.query.force === 'true'
      
      // If force parameter is present, always use the store items
      if (forceNewQuote) {
        log('Force parameter detected, using store items directly')
        return quoteStore.items
      } else {
        // Otherwise use the session storage as before
        const sessionKey = 'quoteItems_new'
        const { state } = useFormState<QuoteItemForm[]>(sessionKey, [])
        return state.value
      }
    }
  },
  set: (newItems) => {
    if (isEditMode.value) {
      quoteStore.updateItems(JSON.parse(JSON.stringify(newItems)))
    } else {
      // Check if the force=true parameter is present in the URL
      const forceNewQuote = route.query.force === 'true'
      
      // If force parameter is present, always update the store directly
      if (forceNewQuote) {
        quoteStore.updateItems(JSON.parse(JSON.stringify(newItems)))
      } else {
        // Otherwise use the session storage as before
        const sessionKey = 'quoteItems_new'
        const { state } = useFormState<QuoteItemForm[]>(sessionKey, [])
        state.value = newItems
      }
    }
  }
})

/**
 * Získáme logiku výpočtů z `useQuoteFormLogic`.
 */
const {
  updateQuoteItems,
  calculateNetPrice,
  calculateTotalPrice,
  calculateTotals,
  calculateActualTax
} = useQuoteFormLogic()

/**
 * Příznak, zda ceny obsahují DPH (napojený na quoteStore.taxIncluded).
 */
const priceIncludesTax = ref(false)

/**
 * Příprava pro lokalizaci sazeb DPH.
 */
const czTaxRates = [21, 15]
const availableTaxRates = computed(() => {
  return locale.value === 'cs' ? [15, 21] : [5, 10, 15, 20]
})

/**
 * Interní proměnná pro sazbu DPH (navázaná na quoteStore.taxRate).
 */
const taxRate = computed<number>({
  get: () => quoteStore.taxRate,
  set: (val) => {
    const numericVal = Number(val)
    if (isNaN(numericVal)) return
    if (locale.value === 'cs') {
      quoteStore.taxRate = czTaxRates.includes(numericVal) ? numericVal : 21
    } else {
      quoteStore.taxRate = numericVal || 15
    }
  }
})

/**
 * String reprezentace taxRate pro <Select>.
 */
const taxRateString = computed<string>({
  get: () => taxRate.value.toString(),
  set: (value) => {
    taxRate.value = Number(value)
    
    // Update the tax total override immediately
    quoteStore.$patch({
      _taxTotalOverride: taxAmount.value
    })
    
    updateTaxSettings() // Po změně sazby hned aktualizujeme
  }
})

/**
 * Formátování čísel (napojené na useFormatting -> formatCurrency).
 */
const formatNumber = (num: number) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return formatCurrency(0)
  }
  return formatCurrency(num)
}

/**
 * Subtotal, taxAmount, total se berou ze store (nebo z compute v store), pro konzistenci s `calculateTotals`.
 */
const subtotal = computed(() => quoteStore.subtotal)

// Přímo počítáme taxAmount z položek, bez ohledu na taxIncluded
const taxAmount = computed({
  get: () => {
    return quoteStore.items.reduce((sum, item) => {
      if (item.isTaxExempt) return sum;
      const basePrice = item.quantity * item.unitPrice;
      return sum + (basePrice * (item.taxRate / 100));
    }, 0);
  },
  set: (value) => {
    // This is just for reactivity, we don't actually set the value directly
  }
})

// Display tax amount - returns 0 when priceIncludesTax is false
const displayTaxAmount = computed(() => {
  return priceIncludesTax.value ? taxAmount.value : 0;
})

// Ensure the store's taxTotal is updated when taxAmount changes
watch(taxAmount, (newValue) => {
  // We need to update the store's taxTotal value for QuotePreview to see it
  // This is a workaround since we can't directly modify the store's getter
  quoteStore.$patch({
    _taxTotalOverride: priceIncludesTax.value ? newValue : 0
  })
}, { immediate: true })

const total = computed(() => quoteStore.total)

/**
 * Při namontování komponenty nastavíme počáteční hodnoty (priceIncludesTax, taxRate, atd.).
 */
onMounted(() => {
  // Nastavení z store
  priceIncludesTax.value = quoteStore.taxIncluded
  if (locale.value === 'cs') {
    taxRate.value = czTaxRates.includes(quoteStore.taxRate) ? quoteStore.taxRate : 21
  } else {
    taxRate.value = quoteStore.taxRate || 15
  }

  // Always ensure there's at least one blank row
  if (quoteStore.items.length === 0) {
    const newItem: QuoteItemForm = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      price: 0,
      amount: 0,
      taxRate: taxRate.value,
      priceIncludesTax: priceIncludesTax.value,
      isTaxExempt: false,
      sortOrder: 0
    }
    quoteStore.updateItems([newItem])
  }

  // Initialize the tax total override - use 0 if tax is not included
  quoteStore.$patch({
    _taxTotalOverride: priceIncludesTax.value ? taxAmount.value : 0
  })

  // Menší delay, aby se počáteční hodnoty správně propsaly
  setTimeout(() => {
    updateStore(true)
  }, 100)
})

/**
 * Handler při změně množství (quantity).
 */
const handleQuantityChange = (event: Event, item: QuoteItemForm) => {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value) || 1
  if (item.quantity === value) return

  item.quantity = value
  updateItemTotals(item)
  updateStore(true)
}

/**
 * Handler při změně ceny (unitPrice).
 */
const handlePriceChange = (event: Event, item: QuoteItemForm) => {
  const input = event.target as HTMLInputElement
  const value = parseFloat(input.value) || 0
  if (item.unitPrice === value) return

  item.unitPrice = value
  updateItemTotals(item)
  updateStore(true)
}

/**
 * Propočítá cenu (price, amount) na jedné položce.
 */
const updateItemTotals = (item: QuoteItemForm) => {
  // Základní cena bez daně
  item.price = calculateNetPrice(item)
  
  // Celková cena (s daní nebo bez, podle taxIncluded)
  item.amount = calculateTotalPrice(item)
}

/**
 * Aktualizuje store (a případně DB). 
 * @param skipDatabaseUpdate - Pokud true, neukládáme do DB (zabrání to nadměrným update během psaní).
 */
const updateStore = async (skipDatabaseUpdate = false) => {
  // Pokud jsme v chráněné (dashboard) route a je to edit mode, teprve update do DB
  const isProtectedRoute = route.path.startsWith('/dashboard')
  if (!isProtectedRoute && !route.path.startsWith('/public')) return

  // Ensure there's always at least one item
  if (items.value.length === 0) {
    const newItem: QuoteItemForm = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      price: 0,
      amount: 0,
      taxRate: taxRate.value,
      priceIncludesTax: priceIncludesTax.value,
      isTaxExempt: false,
      sortOrder: 0
    }
    items.value = [newItem]
  }

  // Vytvoříme kopii, abychom zabránili problémům s reaktivitou
  const storeItems = items.value.map(item => {
    const updatedItem = {
      ...item,
      taxRate: taxRate.value,
      priceIncludesTax: priceIncludesTax.value
    };
    
    // Přepočítáme ceny
    updatedItem.price = calculateNetPrice(updatedItem);
    updatedItem.amount = calculateTotalPrice(updatedItem);
    
    return updatedItem;
  })

  // Update store (relevantní pro lokální i edit mode)
  quoteStore.updateItems(JSON.parse(JSON.stringify(storeItems)))
  
  // Update the tax total override - use 0 if tax is not included
  quoteStore.$patch({
    _taxTotalOverride: priceIncludesTax.value ? taxAmount.value : 0
  })

  // Pokud máme ID (edit mode) a nechceme skipovat DB
  if (isEditMode.value && route.params.id && !skipDatabaseUpdate) {
    try {
      await updateQuoteItems(route.params.id as string, storeItems, true)
    } catch (error) {
      logError('Failed to update items:', error)
    }
  }
}

/**
 * Přidání nové položky.
 */
const addItem = async () => {
  const newItem: QuoteItemForm = {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unitPrice: 0,
    price: 0,
    amount: 0,
    taxRate: taxRate.value,
    priceIncludesTax: priceIncludesTax.value,
    isTaxExempt: false,
    sortOrder: items.value.length
  }

  const newItems = [...items.value, newItem]
  items.value = newItems
  updateStore(false)

  // Pokud je edit mode, ukládáme také do DB
  if (isEditMode.value && route.params.id) {
    try {
      await updateQuoteItems(route.params.id as string, newItems, false)
    } catch (error) {
      logError('Failed to update items:', error)
    }
  }
}

/**
 * Odebrání položky.
 */
const removeItem = async (index: number) => {
  const newItems = [...items.value]
  newItems.splice(index, 1)

  // Pokud by se vymazaly všechny, založíme aspoň jednu prázdnou položku
  if (newItems.length === 0) {
    newItems.push({
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      price: 0,
      amount: 0,
      taxRate: taxRate.value,
      priceIncludesTax: priceIncludesTax.value,
      isTaxExempt: false,
      sortOrder: 0
    })
  }

  // Přenastavíme sortOrder
  newItems.forEach((item, idx) => {
    item.sortOrder = idx
  })

  items.value = newItems
  updateStore(false)

  // Pokud je edit mode, ukládáme do DB
  if (isEditMode.value && route.params.id) {
    try {
      await updateQuoteItems(route.params.id as string, newItems, false)
    } catch (error) {
      logError('Failed to update items:', error)
    }
  }
}

/**
 * Přepnutí "tax included" a update výpočtů.
 */
const updateTaxSettings = () => {
  // Aktualizujeme store
  quoteStore.taxIncluded = priceIncludesTax.value
  quoteStore.taxRate = taxRate.value
  
  // Update the tax total override - use 0 if tax is not included
  quoteStore.$patch({
    _taxTotalOverride: priceIncludesTax.value ? taxAmount.value : 0
  })

  // Provedeme re-aplikaci nastavení na všechny položky
  const updatedItems = items.value.map(item => {
    const updatedItem = {
      ...item,
      taxRate: quoteStore.taxRate,
      priceIncludesTax: quoteStore.taxIncluded
    };
    
    // Přepočítáme ceny
    updatedItem.price = calculateNetPrice(updatedItem);
    updatedItem.amount = calculateTotalPrice(updatedItem);
    
    return updatedItem;
  })

  items.value = updatedItems

  // Uložíme do store i DB (nechceme skipovat, protože to je zásadní změna)
  updateStore(false)
}

/**
 * Sledování změn v `items.value` s debounce (aby se výpočty nespustily stokrát).
 */
let updateDebounceTimeout: ReturnType<typeof setTimeout> | null = null
watch(
  () => items.value,
  (newItems) => {
    if (newItems.length === 0) return

    if (updateDebounceTimeout) clearTimeout(updateDebounceTimeout)
    updateDebounceTimeout = setTimeout(() => {
      // Update the tax total override - use 0 if tax is not included
      quoteStore.$patch({
        _taxTotalOverride: priceIncludesTax.value ? taxAmount.value : 0
      })
      
      updateStore(true)
    }, 100)
  },
  { deep: true }
)

// Také sledujeme changes v `priceIncludesTax` => zavoláme updateTaxSettings()
watch(priceIncludesTax, () => {
  updateTaxSettings()
}, { immediate: false })
</script>

<style scoped>
.quote-items-container {
  max-width: 100%;
}

.group:hover .quote-summary {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.action-button {
  position: relative;
  overflow: hidden;
}
.action-button:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(59, 130, 246, 0.3);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}
.action-button:focus:not(:active):after {
  animation: ripple 1s ease-out;
}

.delete-button {
  position: relative;
  overflow: hidden;
}
.delete-button:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(239, 68, 68, 0.3);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}
.delete-button:focus:not(:active):after {
  animation: ripple-red 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

@keyframes ripple-red {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Custom styling for the tax select dropdown */
:deep(.tax-select .select-trigger) {
  border-color: #e5e7eb;
  transition: all 0.2s ease;
}
:deep(.tax-select .select-trigger:hover) {
  border-color: #3b82f6;
}
:deep(.tax-select .select-trigger:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>