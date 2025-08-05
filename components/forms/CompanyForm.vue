<template>
  <div class="company-form-container">
    <h3 class="form-section-title">{{ $t('quote.form.company.title') }}</h3>
    
    <!-- Email Field -->
    <label class="form-field">
      <p class="form-label">{{ $t('quote.form.company.email') }}</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.email"
          @input="e => form.email = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="company-email" 
          :placeholder="$t('quote.form.company.emailPlaceholder')" 
          type="email"
        >
      </div>
    </label>

    <!-- Gradient Line -->
    <div class="relative h-[1px] w-full -translate-y-[1px] overflow-hidden my-4">
        <div id="gradient" class="absolute h-[1px] w-[200px] bg-[linear-gradient(90deg,rgba(36,176,255,0.00)_0%,#24B0FF_48.96%,rgba(36,176,255,0.00)_100%)] opacity-0"></div>
      </div>
    
    <h3 class="pb-4 text-s font-bold text-label">{{ $t('quote.form.company.Details') }}</h3>

    <!-- Company Name -->
    <label class="form-field">
      <p class="form-label">{{ $t('quote.form.company.companyName') }}</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.name"
          @input="e => form.name = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="company-name" 
          :placeholder="$t('quote.form.company.companyNamePlaceholder')" 
          type="text"
        >
      </div>
    </label>

    <!-- Address (Street) -->
    <label class="form-field">
      <p class="form-label">{{ $t('quote.form.company.address') }}</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.street"
          @input="e => form.street = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="company-address-street"
          :placeholder="$t('quote.form.company.addressPlaceholder')" 
          type="text"
        >
      </div>
    </label>

    <!-- City -->
    <label class="form-field">
      <p class="form-label">{{ $t('quote.form.company.city') }}</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.city"
          @input="e => form.city = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="company-address-city"
          :placeholder="$t('quote.form.company.cityPlaceholder')" 
          type="text"
        >
      </div>
    </label>

    <!-- State -->
    <label class="form-field">
      <p class="form-label">{{ $t('quote.form.company.state') }}</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.state"
          @input="e => {
            const value = (e.target as HTMLInputElement).value
            form.state = value
            validateState(value)
          }"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': stateError }"
          id="company-address-state"
          :placeholder="$t('quote.form.company.statePlaceholder')" 
          type="text"
        >
        <span v-if="stateError" class="absolute right-3 text-xs text-red-500">
          {{ stateError }}
        </span>
      </div>
    </label>
    
    <!-- ZIP -->
    <label class="form-field">
      <p class="form-label">{{ $t('quote.form.company.zip') }}</p>
      <div class="relative flex w-full items-center">
      <input 
        :value="form.zip"
        @input="e => {
          const value = (e.target as HTMLInputElement).value
          form.zip = value
          validateZip(value)
        }"
        class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': zipError }"
        id="company-address-zip"
        :placeholder="$t('quote.form.company.zipPlaceholder')" 
        type="text"
      >
        <span v-if="zipError" class="absolute right-3 text-xs text-red-500">
          {{ zipError }}
        </span>
      </div>
    </label>

    <!-- Country
    <label class="form-field">
      <p class="form-label">{{ $t('quote.form.company.country') }}</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.country"
          @input="e => form.country = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="company-address-country"
          :placeholder="$t('quote.form.company.countryPlaceholder')" 
          type="text"
        >
      </div>
    </label> -->

    <!-- Tax ID 
    <label class="form-field">
      <p class="form-label">{{ $t('quote.form.company.taxId') }}</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.tax_id"
          @input="e => {
            const value = (e.target as HTMLInputElement).value
            form.tax_id = value
            validateTaxId(value)
          }"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': taxIdError }"
          id="company-tax-id"
          :placeholder="$t('quote.form.company.taxIdPlaceholder')" 
          type="text"
        >
        <span v-if="taxIdError" class="absolute right-3 text-xs text-red-500">
          {{ taxIdError }}
        </span>
      </div>
    </label> -->

    <!-- Tax Payer 
    <label class="form-field">
      <div class="flex items-center">
        <input
          :checked="form.is_tax_payer"
          @change="e => handleTaxPayerChange(e)"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          type="checkbox"
          id="company-is-tax-payer"
        >
        <span class="ml-2 text-sm text-gray-900">{{ $t('quote.form.company.isTaxPayer') }}</span>
      </div>
    </label> -->

    <!-- Tax Number
    <label v-if="form.is_tax_payer" class="form-field">
      <p class="form-label">{{ $t('quote.form.company.taxNumber') }}</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.tax_number"
          @input="e => form.tax_number = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="company-tax-number"
          :placeholder="$t('quote.form.company.taxNumberPlaceholder')" 
          type="text"
        >
      </div>
    </label> -->

    <div v-if="saveSuccess" 
        class="success-message mt-6 flex items-center justify-center rounded-lg bg-green-50 p-4 text-sm text-green-600 border border-green-200 animate-fadeIn"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="mr-2"
        >
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        {{ $t('quote.form.company.saveSuccess') }}
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuoteStore } from '~/stores/quote'
import { useFormState } from '~/composables/useFormState'
import { useProfile } from '~/composables/useProfile'
import { languageService } from '~/language/service'
import type { AvailableLocale } from '~/language/types'
import type { QuoteCompany } from '~/types/quote'

const { t } = useI18n()
const quoteStore = useQuoteStore()
const { profile, fetchProfile } = useProfile()

const currentLocale = computed(() => {
  if (process.client) {
    return languageService.detectLocale(window.location.hostname)
  }
  return 'cs' // default to Czech on server
})

const isUS = computed(() => currentLocale.value === 'en')
const isCZ = computed(() => currentLocale.value === 'cs')

// Computed properties for field labels
const stateLabel = computed(() => isUS.value ? 'State' : 'Kraj')
const zipLabel = computed(() => isUS.value ? 'ZIP Code' : 'PSČ')
const taxIdLabel = computed(() => isUS.value ? 'EIN (Tax ID)' : 'DIČ')

// Form data with default values using useFormState
const { state: form, formData } = useFormState<QuoteCompany>('companyForm', {
  email: '',
  name: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  tax_id: '',
  is_tax_payer: false,
  tax_number: ''
})

// Error states and UI states
const taxIdError = ref<string | null>(null)
const stateError = ref<string | null>(null)
const zipError = ref<string | null>(null)
const saveSuccess = ref(false)

// Function to load profile data
const loadProfileData = async () => {
  await fetchProfile()
  if (profile.value) {
    form.value = {
      email: profile.value.email || '',
      name: profile.value.name || '',
      street: profile.value.street || '',
      city: profile.value.city || '',
      state: profile.value.state || '',
      zip: profile.value.zip || '',
      country: profile.value.country || '',
      tax_id: profile.value.tax_id || '',
      is_tax_payer: profile.value.is_tax_payer || false,
      tax_number: profile.value.tax_number || ''
    }
  }
}

// Register lifecycle hooks before any await statements
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  loadProfileData()
})

const handleTaxPayerChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    form.value.is_tax_payer = target.checked
    // Clear tax number if not a tax payer
    if (!target.checked) {
      form.value.tax_number = ''
    }
  }
}

// Validation functions
const validateZip = (zip: string): boolean => {
  if (!zip) {
    zipError.value = null
    return true
  }
  
  const isValid = isUS.value
    ? /^\d{5}(-\d{4})?$/.test(zip)
    : /^\d{3}\s?\d{2}$/.test(zip)
  
  zipError.value = isValid ? null : t('quote.form.company.invalidZip')
  return isValid
}

const validateState = (state: string): boolean => {
  if (!state) {
    stateError.value = null
    return true
  }
  
  if (isUS.value) {
    const usStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
    const isValid = usStates.includes(state.toUpperCase())
    stateError.value = isValid ? null : t('quote.form.company.invalidState')
    return isValid
  }
  
  stateError.value = state.length > 0 ? null : t('quote.form.company.stateRequired')
  return state.length > 0
}

const validateTaxId = (value: string): boolean => {
  if (!value) {
    taxIdError.value = null
    return true
  }
  
  const isValid = isUS.value
    ? /^\d{2}-\d{7}$/.test(value)
    : /^CZ\d{8,10}$/.test(value)
  
  taxIdError.value = isValid
    ? null
    : isUS.value
      ? t('quote.form.company.invalidEIN')
      : t('quote.form.company.invalidDIC')
  
  return isValid
}

// Watch for changes and update store
watch(formData, (newValue) => {
  quoteStore.updateCompany({
    ...newValue,
    country: newValue.country || (isUS.value ? 'United States' : 'Czech Republic')
  })
}, { deep: true })

// Function to simulate save success 
const saveCompanyProfile = () => {
  // Here you could implement actual save logic
  saveSuccess.value = true
  
  // Hide the success message after 3 seconds
  setTimeout(() => {
    saveSuccess.value = false
  }, 3000)
}

// Debug watcher to verify data changes
watchEffect(() => {
  log('Company form data:', form.value)
})
</script>

<style scoped>
.company-form-container {
  max-width: 100%;
}

.action-button, .primary-button, .back-button {
  position: relative;
  overflow: hidden;
}

.action-button:after, .primary-button:after, .back-button:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.4);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.action-button:focus:not(:active):after, 
.primary-button:focus:not(:active):after,
.back-button:focus:not(:active):after {
  animation: ripple 1s ease-out;
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>