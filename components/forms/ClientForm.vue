<template>
  <div class="client-form-container">
    <h3 class="form-section-title">{{ $t('quote.form.client.title') }}</h3>

    <!-- Client List Section -->
    <div v-if="showClientList" class="space-y-4">
      <button
        @click="showClientList = false"
        class="back-button flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ $t('quote.form.client.backToForm') }}
      </button>
      
      <div class="client-list-container">
        <div v-for="client in clients" :key="client.id" 
             @click="handleClientSelect(client)"
             class="client-card p-4 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-sm">
          <div class="font-medium text-gray-800">{{ client.company_name }}</div>
          <div class="text-sm text-gray-600">{{ client.email }}</div>
          <div class="text-sm text-gray-600">{{ client.phone }}</div>
        </div>
        
        <div v-if="clients.length === 0" class="empty-state text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p>No clients found. Please create a new one.</p>
        </div>
      </div>
    </div>

    <!-- Existing Client Modal -->
    <div v-if="existingClientFound" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ $t('quote.form.client.emailExists') }}</h3>
        <div class="mb-4 p-4 border border-gray-200 rounded-lg">
          <div class="font-medium text-gray-800">{{ existingClientFound.company_name }}</div>
          <div class="text-sm text-gray-600">{{ existingClientFound.email }}</div>
          <div v-if="existingClientFound.phone" class="text-sm text-gray-600">{{ existingClientFound.phone }}</div>
        </div>
        <div class="flex justify-end space-x-3">
          <button 
            @click="existingClientFound = null" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            @click="useExistingClient" 
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {{ $t('common.use') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div v-else>
      <div class="pt-2 flex space-x-4 mb-6">
        <button
          @click="addUserFromDatabase"
          type="button"
          class="action-button flex items-center px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          {{ $t('quote.form.client.addUserFromDatabase') }}
        </button>
      </div>

      <!-- Email Field -->
      <label class="form-field">
        <p class="form-label">{{ $t('quote.form.client.email') }}</p>
        <div class="relative flex w-full items-center">
          <input 
            :value="form.email ?? ''"
            @input="e => form.email = (e.target as HTMLInputElement).value || null"
            class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': emailError }"
            id="client-email" 
            :placeholder="$t('quote.form.client.emailPlaceholder')" 
            type="email"
            @change="validateEmail"
          >
          <span v-if="emailError" class="absolute right-3 text-xs text-red-500">
            {{ emailError }}
          </span>
        </div>
      </label>

      <!-- Gradient Line -->
      <div class="relative h-[1px] w-full -translate-y-[1px] overflow-hidden my-4">
        <div id="gradient" class="absolute h-[1px] w-[200px] bg-[linear-gradient(90deg,rgba(36,176,255,0.00)_0%,#24B0FF_48.96%,rgba(36,176,255,0.00)_100%)] opacity-0"></div>
      </div>
      
      <h3 class="pb-4 text-s font-bold text-label">{{ $t('quote.form.client.Details') }}</h3>

      <!-- Company Name -->
      <label class="form-field">
        <p class="form-label">{{ $t('quote.form.client.companyName') }}</p>
        <div class="relative flex w-full items-center">
          <input 
            :value="form.company_name"
            @input="e => form.company_name = (e.target as HTMLInputElement).value"
            class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            id="client-name" 
            :placeholder="$t('quote.form.client.companyNamePlaceholder')" 
            type="text"
          >
        </div>
      </label>

      <!-- Address -->
      <label class="form-field">
        <p class="form-label">{{ $t('quote.form.client.address') }}</p>
        <div class="relative flex w-full items-center">
          <input 
            :value="form.street ?? ''"
            @input="e => form.street = (e.target as HTMLInputElement).value || null"
            class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            id="client-address-street" 
            :placeholder="$t('quote.form.client.addressPlaceholder')" 
            type="text"
          >
        </div>
      </label>

      <!-- City -->
      <label class="form-field">
        <p class="form-label">{{ $t('quote.form.client.city') }}</p>
        <div class="relative flex w-full items-center">
          <input 
            :value="form.city ?? ''"
            @input="e => form.city = (e.target as HTMLInputElement).value || null"
            class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            id="client-address-city" 
            :placeholder="$t('quote.form.client.cityPlaceholder')" 
            type="text"
          >
        </div>
      </label>

      <!-- State -->
      <label class="form-field">
        <p class="form-label">{{ $t('quote.form.client.state') }}</p>
        <div class="relative flex w-full items-center">
          <input 
            :value="form.state ?? ''"
            @input="e => form.state = (e.target as HTMLInputElement).value || null"
            class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': stateError }"
            id="client-address-state" 
            :placeholder="$t('quote.form.client.statePlaceholder')" 
            type="text"
            @change="validateState"
          >
          <span v-if="stateError" class="absolute right-3 text-xs text-red-500">
            {{ stateError }}
          </span>
        </div>
      </label>

      <!-- ZIP Code -->
      <label class="form-field">
        <p class="form-label">{{ $t('quote.form.client.zip') }}</p>
        <div class="relative flex w-full items-center">
          <input 
            :value="form.zip ?? ''"
            @input="e => form.zip = (e.target as HTMLInputElement).value || null"
            class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            id="client-address-zip" 
            :placeholder="$t('quote.form.client.zipPlaceholder')" 
            type="text"
          >
        </div>
      </label>

      <!-- Country 
      <label class="form-field">
        <p class="form-label">{{ $t('quote.form.client.country') }}</p>
        <div class="relative flex w-full items-center">
          <input 
            :value="form.country ?? ''"
            @input="e => form.country = (e.target as HTMLInputElement).value || null"
            class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            id="client-address-country" 
            :placeholder="$t('quote.form.client.countryPlaceholder')" 
            type="text"
          >
        </div>
      </label> -->

      <div class="mt-8 flex justify-end">
        <button
          @click="createNewUser"
          type="button"
          :disabled="loading"
          class="primary-button flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ $t('quote.form.client.createUser') }}
        </button>
      </div>

      <div 
        v-if="saveSuccess" 
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
        {{ $t('quote.form.client.saveSuccess') }}
      </div>
      
      <div 
        v-if="error" 
        class="error-message mt-6 flex items-center justify-center rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 animate-fadeIn"
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
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormState } from '~/composables/useFormState'
import { languageService } from '~/language/service'
import type { AvailableLocale } from '~/language/types'
import { ref, computed, onMounted, watch } from 'vue'
import { useQuoteStore } from '~/stores/quote'
import { useI18n } from 'vue-i18n'
import { useClient } from '~/composables/useClient'
import type { Client, ClientFormData } from '~/types/client'
import { validateClientForm } from '~/types/client'

const { t } = useI18n()
const quoteStore = useQuoteStore()
const { clients, fetchClients, selectClient, createClient, loading, error } = useClient()
const showClientList = ref(false)

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

const { state: form, formData } = useFormState<ClientFormData>('clientForm', {
  company_name: '',
  contact_name: null,
  email: null,
  phone: null,
  street: null,
  city: null,
  state: null,
  zip: null,
  country: null
})

const emailError = ref<string | null>(null)
const stateError = ref<string | null>(null)

const saveSuccess = ref(false)
const existingClientFound = ref<Client | null>(null)

// Function to check if a client with the given email already exists
const checkExistingClientByEmail = (email: string | null): Client | null => {
  if (!email) return null
  
  const existingClient = clients.value.find(client => 
    client.email && client.email.toLowerCase() === email.toLowerCase()
  )
  
  return existingClient || null
}

// Function to use the existing client
const useExistingClient = () => {
  if (existingClientFound.value) {
    handleClientSelect(existingClientFound.value)
    existingClientFound.value = null
  }
}

const createNewUser = async () => {
  try {
    // Validate form data
    const validation = validateClientForm(form.value)
    if (!validation.isValid) {
      // Handle validation errors
      logError('Validation errors:', validation.errors)
      return
    }

    // Check if a client with this email already exists
    if (form.value.email) {
      const existingClient = checkExistingClientByEmail(form.value.email)
      if (existingClient) {
        // Client with this email already exists - show modal
        existingClientFound.value = existingClient
        return
      }
    }

    // Create client in database
    const newClient = await createClient(form.value)
    if (newClient) {
      // Update the form with the new client ID
      form.value.id = newClient.id
      
      // Update the quote store with the complete client data including the ID
      quoteStore.updateClient({
        id: newClient.id,
        company_name: form.value.company_name,
        contact_name: form.value.contact_name,
        email: form.value.email,
        phone: form.value.phone,
        street: form.value.street,
        city: form.value.city,
        state: form.value.state,
        zip: form.value.zip,
        country: form.value.country
      })
      
      saveSuccess.value = true
      // Optionally reset after a delay
      setTimeout(() => saveSuccess.value = false, 3000)
    }
  } catch (err) {
    logError('Error creating client:', err)
  }
}

// Function to load client data
const loadClientData = async () => {
  await fetchClients()
  if (quoteStore.client) {
    form.value = {
      id: quoteStore.client.id,
      company_name: quoteStore.client.company_name,
      contact_name: quoteStore.client.contact_name ?? null,
      email: quoteStore.client.email ?? null,
      phone: quoteStore.client.phone ?? null,
      street: quoteStore.client.street ?? null,
      city: quoteStore.client.city ?? null,
      state: quoteStore.client.state ?? null,
      zip: quoteStore.client.zip ?? null,
      country: quoteStore.client.country ?? null
    }
  }
}

// Register lifecycle hooks before any await statements
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  loadClientData()
})

const addUserFromDatabase = (event: Event) => {
  event.preventDefault() // Prevent default form submission
  showClientList.value = true
}

const handleClientSelect = (client: Client) => {
  selectClient(client)
  form.value = {
    id: client.id,
    company_name: client.company_name,
    contact_name: client.contact_name ?? null,
    email: client.email ?? null,
    phone: client.phone ?? null,
    street: client.street ?? null,
    city: client.city ?? null,
    state: client.state ?? null,
    zip: client.zip ?? null,
    country: client.country ?? null
  }
  // Update quote store with complete client data
  quoteStore.updateClient({
    id: client.id,
    company_name: client.company_name,
    contact_name: client.contact_name ?? null,
    email: client.email ?? null,
    phone: client.phone ?? null,
    street: client.street ?? null,
    city: client.city ?? null,
    state: client.state ?? null,
    zip: client.zip ?? null,
    country: client.country ?? null
  })
  showClientList.value = false
}

// Validation functions
const validateEmail = () => {
  const email = form.value.email
  if (!email || email.trim() === '') {
    emailError.value = null
    form.value.email = null
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailError.value = t('quote.form.client.emailInvalid')
  } else {
    emailError.value = null
  }
}

const validateState = () => {
  const state = form.value.state
  if (!state || state.trim() === '') {
    form.value.state = null
    stateError.value = null
    return
  }
  
  if (isUS.value) {
    const usStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
    if (!usStates.includes(state.toUpperCase())) {
      stateError.value = t('quote.form.client.stateInvalid')
    } else {
      stateError.value = null
    }
  } else {
    stateError.value = null
  }
}

watch(formData, (newValue) => {
  log('Form data changed:', newValue)
  quoteStore.updateClient({
    id: newValue.id,
    company_name: newValue.company_name || '',
    contact_name: newValue.contact_name || null,
    email: newValue.email || null,
    phone: newValue.phone || null,
    street: newValue.street || null,
    city: newValue.city || null,
    state: newValue.state || null,
    zip: newValue.zip || null,
    country: newValue.country || null
  })
}, { deep: true })
</script>

<style scoped>
.client-form-container {
  max-width: 100%;
}

.client-list-container {
  display: grid;
  gap: 0.75rem;
}

.client-card {
  position: relative;
  overflow: hidden;
}

.client-card:hover {
  transform: translateY(-1px);
}

.client-card:active {
  transform: translateY(0);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>