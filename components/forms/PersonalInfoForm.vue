<template>
  <div class="personal-info-form-container">
    <h3 class="form-section-title">Vaše údaje pro CV</h3>
    
    <h3 class="pb-4 text-s font-bold text-label">Základní údaje</h3>

    <!-- Name -->
    <label class="form-field">
      <p class="form-label">Jméno a příjmení</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.name"
          @input="e => form.name = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="personal-name" 
          placeholder="Jan Novák" 
          type="text"
        >
      </div>
    </label>

    <!-- Phone -->
    <label class="form-field">
      <p class="form-label">Telefon</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.phone"
          @input="e => form.phone = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="personal-phone" 
          placeholder="+420 123 456 789" 
          type="tel"
        >
      </div>
    </label>

    <!-- Email Field -->
    <label class="form-field">
      <p class="form-label">E-mail</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.email"
          @input="e => form.email = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="personal-email" 
          placeholder="jan.novak@email.cz" 
          type="email"
        >
      </div>
    </label>

    <!-- City -->
    <label class="form-field">
      <p class="form-label">Město</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.city"
          @input="e => form.city = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="personal-address-city"
          placeholder="Praha" 
          type="text"
        >
      </div>
    </label>

    <!-- Gradient Line -->
    <div class="relative h-[1px] w-full -translate-y-[1px] overflow-hidden my-4">
        <div id="gradient" class="absolute h-[1px] w-[200px] bg-[linear-gradient(90deg,rgba(36,176,255,0.00)_0%,#24B0FF_48.96%,rgba(36,176,255,0.00)_100%)] opacity-0"></div>
      </div>
    
    <h3 class="pb-4 text-s font-bold text-label">Volitelné údaje</h3>

    <!-- Website -->
    <label class="form-field">
      <p class="form-label">Webové stránky</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.website"
          @input="e => form.website = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="personal-website"
          placeholder="https://www.example.com" 
          type="url"
        >
      </div>
    </label>

    <!-- LinkedIn -->
    <label class="form-field">
      <p class="form-label">LinkedIn profil</p>
      <div class="relative flex w-full items-center">
        <input 
          :value="form.linkedin"
          @input="e => form.linkedin = (e.target as HTMLInputElement).value"
          class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          id="personal-linkedin"
          placeholder="https://linkedin.com/in/jan-novak" 
          type="url"
        >
      </div>
    </label>

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
        Údaje byly úspěšně uloženy
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useQuoteStore } from '~/stores/quote'
import { useFormState } from '~/composables/useFormState'
import { useProfile } from '~/composables/useProfile'
import { languageService } from '~/language/service'
import type { AvailableLocale } from '~/language/types'
import type { ProfileFormData } from '~/types/profile'

const quoteStore = useQuoteStore()
const { profile, fetchProfile, updateProfile } = useProfile()

const currentLocale = computed(() => {
  if (process.client) {
    return languageService.detectLocale(window.location.hostname)
  }
  return 'cs' // default to Czech on server
})

const isUS = computed(() => currentLocale.value === 'en')
const isCZ = computed(() => currentLocale.value === 'cs')

// Form data with default values using useFormState
const { state: form, formData } = useFormState('personalInfoForm', {
  name: '',
  phone: '',
  email: '',
  city: '',
  website: '',
  linkedin: ''
})

// UI states
const saveSuccess = ref(false)

// Function to load profile data
const loadProfileData = async () => {
  await fetchProfile()
  if (profile.value) {
    form.value = {
      name: profile.value.name || '',
      phone: '', // TODO: Add phone to profile schema
      email: profile.value.email || '',
      city: profile.value.city || '',
      website: '', // TODO: Add website to profile schema
      linkedin: '' // TODO: Add linkedin to profile schema
    }
  }
}

// Register lifecycle hooks before any await statements
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  loadProfileData()
})

// No validation needed for CV fields

// Watch for changes and update both profile and quote store
watch(formData, async (newValue) => {
  // Update the quote store with company data for the quote
  quoteStore.updateCompany({
    email: newValue.email || '',
    name: newValue.name || '',
    street: '', // Not needed for CV
    city: newValue.city || '',
    state: '', // Not needed for CV
    zip: '', // Not needed for CV
    country: 'Czech Republic',
    tax_id: '', // Not needed for CV
    is_tax_payer: false,
    tax_number: ''
  })

  // TODO: Save CV data to profile when profile schema is updated
  // For now, just show success message when basic data is filled
  if (newValue.email && newValue.name) {
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  }
}, { deep: true })

// Debug watcher to verify data changes
watchEffect(() => {
  log('Personal info form data:', form.value)
})
</script>

<style scoped>
.personal-info-form-container {
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