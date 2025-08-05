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
              aria-label="Back to home page"
            >
              <svg 
                width="10" 
                height="10" 
                viewBox="0 0 10 10" 
                aria-hidden="true" 
                class="stroke-black/60 rotate-180"
              >
                <g fill-rule="evenodd">
                  <path d="M0 5h7" class="stroke-[1.5px] opacity-0 transition-all group-hover:opacity-100"></path>
                  <path d="M1 1l4 4-4 4" class="fill-none stroke-[1.5px] transition-all group-hover:translate-x-[3px]"></path>
                </g>
              </svg>
              <span>{{ t('contact.form.back') }}</span>
            </NuxtLink>

            <div class="h-5 w-px bg-black/[0.07]"></div>

            <NuxtLink 
              to="/" 
              class="flex items-center space-x-2 pointer-events-auto"
              aria-label="QFast homepage"
            >
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
          <!-- Form Progress Indicator -->
          <div class="mb-4">
            <div class="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                :style="{ width: `${formProgress}%` }"
                aria-hidden="true"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1" aria-live="polite">{{ formProgressText }}</p>
          </div>
          
          <!-- Contact Form -->
          <form @submit.prevent="handleSubmit" class="pointer-events-auto flex flex-1 flex-col">
            <h3 class="form-section-title mb-6">{{ t('contact.title') }}</h3>
            <p class="text-gray-600 mb-6">{{ t('contact.form.subtitle', 'We value your feedback. Fill out the form below to get in touch with our team.') }}</p>
            
            <!-- First Name -->
            <div class="form-field mb-4">
              <label for="first-name" class="form-label">
                {{ t('contact.form.firstName') }}
                <span class="text-red-500" aria-hidden="true">*</span>
                <span class="sr-only">{{ t('required', 'required') }}</span>
              </label>
              <input 
                v-model="form.firstName"
                :class="['form-input focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40', {'ring-1 ring-red-500': validationErrors.firstName}]"
                id="first-name" 
                :placeholder="t('contact.form.firstNamePlaceholder')" 
                type="text"
                required
                @blur="validateField('firstName')"
                @focus="fieldFocused = 'firstName'"
                aria-required="true"
                :aria-invalid="!!validationErrors.firstName"
                :aria-describedby="validationErrors.firstName ? 'first-name-error' : undefined"
              >
              <p v-if="validationErrors.firstName" id="first-name-error" class="text-red-500 text-xs mt-1" aria-live="assertive">
                {{ validationErrors.firstName }}
              </p>
            </div>

            <!-- Last Name -->
            <div class="form-field mb-4">
              <label for="last-name" class="form-label">
                {{ t('contact.form.lastName') }}
                <span class="text-red-500" aria-hidden="true">*</span>
                <span class="sr-only">{{ t('required', 'required') }}</span>
              </label>
              <input 
                v-model="form.lastName"
                :class="['form-input focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40', {'ring-1 ring-red-500': validationErrors.lastName}]"
                id="last-name" 
                :placeholder="t('contact.form.lastNamePlaceholder')" 
                type="text"
                required
                @blur="validateField('lastName')"
                @focus="fieldFocused = 'lastName'"
                aria-required="true"
                :aria-invalid="!!validationErrors.lastName"
                :aria-describedby="validationErrors.lastName ? 'last-name-error' : undefined"
              >
              <p v-if="validationErrors.lastName" id="last-name-error" class="text-red-500 text-xs mt-1" aria-live="assertive">
                {{ validationErrors.lastName }}
              </p>
            </div>

            <!-- Company Name -->
            <div class="form-field mb-4">
              <label for="company" class="form-label">{{ t('contact.form.company') }}</label>
              <input 
                v-model="form.company"
                class="form-input focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                id="company" 
                :placeholder="t('contact.form.companyPlaceholder')" 
                type="text"
                @focus="fieldFocused = 'company'"
              >
            </div>

            <!-- Email -->
            <div class="form-field mb-6">
              <label for="email" class="form-label">
                {{ t('contact.form.email') }}
                <span class="text-red-500" aria-hidden="true">*</span>
                <span class="sr-only">{{ t('required', 'required') }}</span>
              </label>
              <input 
                v-model="form.email"
                :class="['form-input focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40', {'ring-1 ring-red-500': validationErrors.email}]"
                id="email" 
                :placeholder="t('contact.form.emailPlaceholder')" 
                type="email"
                required
                @blur="validateField('email')"
                @focus="fieldFocused = 'email'"
                aria-required="true"
                :aria-invalid="!!validationErrors.email"
                :aria-describedby="validationErrors.email ? 'email-error' : undefined"
                autocomplete="email"
              >
              <p v-if="validationErrors.email" id="email-error" class="text-red-500 text-xs mt-1" aria-live="assertive">
                {{ validationErrors.email }}
              </p>
            </div>
            
            <!-- Success Message -->
            <div v-if="showSuccess" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-md animate-fade-in" role="alert" aria-live="polite">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">{{ t('contact.form.successMessage', 'Thank you! Your message has been sent successfully.') }}</p>
                  <p class="text-xs text-green-700 mt-1">{{ t('contact.form.successDetail', 'We\'ll get back to you as soon as possible.') }}</p>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md animate-fade-in" role="alert" aria-live="assertive">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800">{{ error }}</p>
                  <p class="text-xs text-red-700 mt-1">{{ t('contact.form.errorDetail', 'Please try again or contact us directly.') }}</p>
                </div>
              </div>
            </div>

            <!-- Required Fields Note -->
            <p class="text-xs text-gray-500 mb-6">
              <span class="text-red-500" aria-hidden="true">*</span> {{ t('requiredFields', 'Required fields') }}
            </p>

            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="isSubmitting || !isFormValid"
              :class="[
                'mt-auto group relative flex justify-between items-center rounded-md px-4 py-3 outline-none transition-all border',
                isSubmitting ? 'bg-blue-50 border-blue-200 cursor-wait' : 
                !isFormValid ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' : 
                'bg-blue-50 border-blue-200 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-blue-700'
              ]"
              :aria-busy="isSubmitting"
            >
              <span class="text-sm font-medium">
                {{ isSubmitting ? t('contact.form.sending', 'Sending...') : t('contact.form.submit') }}
              </span>
              <div v-if="isSubmitting" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status" aria-hidden="true">
                <span class="sr-only">Loading...</span>
              </div>
              <svg v-else width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" class="stroke-current">
                <g fill-rule="evenodd">
                  <path d="M8 0l8 8-8 8-1.5-1.5L13 8 6.5 1.5z" class="fill-current"></path>
                </g>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Right Section with Message -->
    <div class="relative z-0 w-full h-auto lg:h-screen overflow-y-auto lg:w-[70%] flex-1 flex flex-col items-center p-6">
      <div class="w-full max-w-3xl mx-auto h-full flex flex-col">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-black/[0.07] flex-1 flex flex-col h-full min-h-[calc(100vh-3rem)]">
          <h3 class="form-section-title mb-4">{{ t('contact.message.title') }}</h3>
          <div class="flex-1 flex flex-col h-full">
            <div class="flex justify-between items-center mb-2">
              <label for="message" class="form-label">
                {{ t('contact.message.label') }}
                <span class="text-red-500" aria-hidden="true">*</span>
                <span class="sr-only">{{ t('required', 'required') }}</span>
              </label>
              <span :class="['text-xs', messageLength > maxMessageLength * 0.8 ? 'text-amber-500' : 'text-gray-500']">
                {{ messageLength }}/{{ maxMessageLength }} {{ t('contact.message.characters', 'characters') }}
              </span>
            </div>
            <div class="flex-1 relative h-[calc(100%-2rem)]">
              <textarea
                id="message"
                v-model="form.message"
                :class="[
                  'form-input w-full h-full resize-none py-4 px-4 !min-h-[calc(100vh-12rem)] focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40', 
                  {'ring-1 ring-red-500': validationErrors.message}
                ]"
                :placeholder="t('contact.message.placeholder')" 
                required
                @blur="validateField('message')"
                @focus="fieldFocused = 'message'"
                :maxlength="maxMessageLength"
                aria-required="true"
                :aria-invalid="!!validationErrors.message"
                :aria-describedby="validationErrors.message ? 'message-error' : undefined"
              ></textarea>
              <p v-if="validationErrors.message" id="message-error" class="text-red-500 text-xs mt-1 absolute bottom-[-1.5rem]" aria-live="assertive">
                {{ validationErrors.message }}
              </p>
              <div class="absolute bottom-3 right-3 flex space-x-2">
                <button 
                  v-if="!isSubmitting && form.message.length > 0"
                  type="button" 
                  @click="form.message = ''"
                  class="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded px-2 py-1"
                  :aria-label="t('contact.message.clearAria', 'Clear message text')"
                >
                  {{ t('contact.message.clear', 'Clear') }}
                </button>
                <button 
                  type="button" 
                  @click="insertTemplateText"
                  class="text-xs text-blue-500 hover:text-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1"
                  :aria-label="t('contact.message.useTemplateAria', 'Insert feedback template')"
                >
                  {{ t('contact.message.useTemplate', 'Use template') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Helper tooltip that follows focus -->
    <div 
      v-if="fieldFocused && fieldHelpers[fieldFocused as keyof typeof fieldHelpers]" 
      class="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 p-3 rounded-lg shadow-lg max-w-xs animate-fade-in z-50"
      role="status"
      aria-live="polite"
    >
      <p class="text-sm text-blue-700 font-medium">{{ fieldHelpers[fieldFocused as keyof typeof fieldHelpers].title }}</p>
      <p v-if="fieldHelpers[fieldFocused as keyof typeof fieldHelpers].description" class="text-xs text-blue-600 mt-1">
        {{ fieldHelpers[fieldFocused as keyof typeof fieldHelpers].description }}
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

definePageMeta({
  middleware: ['contact-domain']
})

// Get translation function
const { t } = useI18n()

const isSubmitting = ref(false)
const showSuccess = ref(false)
const error = ref('')
const maxMessageLength = 2000
const fieldFocused = ref<string | null>(null)

const form = ref({
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  message: ''
})

// Define validation errors type to include all form fields
const validationErrors = ref<{
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  message: string;
}>({
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  message: ''
})

// Define the type for helper field entry
type FieldHelper = {
  title: string;
  description: string;
}

// Define the type for helper fields map
type FieldHelpers = {
  firstName: FieldHelper;
  lastName: FieldHelper;
  company: FieldHelper;
  email: FieldHelper;
  message: FieldHelper;
}

// Helper text for form fields
const fieldHelpers: FieldHelpers = {
  firstName: {
    title: t('contact.helpers.firstName.title', 'Your First Name'),
    description: t('contact.helpers.firstName.description', 'Please provide your personal first name, not your company name.')
  },
  lastName: {
    title: t('contact.helpers.lastName.title', 'Your Last Name'),
    description: t('contact.helpers.lastName.description', 'Your family name or surname.')
  },
  company: {
    title: t('contact.helpers.company.title', 'Company Name (Optional)'),
    description: t('contact.helpers.company.description', 'If you\'re contacting us on behalf of a company, please provide its name.')
  },
  email: {
    title: t('contact.helpers.email.title', 'Your Email Address'),
    description: t('contact.helpers.email.description', 'We\'ll use this to respond to your message. We won\'t share it with third parties.')
  },
  message: {
    title: t('contact.helpers.message.title', 'Your Message'),
    description: t('contact.helpers.message.description', 'Please be as specific as possible about what you want to share with us.')
  }
}

// Form completion progress
const formProgress = computed(() => {
  let filledFields = 0
  let totalRequiredFields = 4 // First name, last name, email, message
  
  if (form.value.firstName) filledFields++
  if (form.value.lastName) filledFields++
  if (form.value.email) filledFields++
  if (form.value.message) filledFields++
  
  return Math.round((filledFields / totalRequiredFields) * 100)
})

const formProgressText = computed(() => {
  if (formProgress.value === 0) return t('contact.form.progress.start', 'Start filling out the form')
  if (formProgress.value < 50) return t('contact.form.progress.filling', 'Filling out the form...')
  if (formProgress.value < 100) return t('contact.form.progress.almostDone', 'Almost done...')
  return t('contact.form.progress.complete', 'Form complete!')
})

const messageLength = computed(() => form.value.message.length)

const isFormValid = computed(() => {
  return (
    form.value.firstName.trim() !== '' &&
    form.value.lastName.trim() !== '' &&
    form.value.email.trim() !== '' &&
    form.value.message.trim() !== '' &&
    Object.values(validationErrors.value).every(error => error === '')
  )
})

const validateField = (field: keyof typeof form.value) => {
  validationErrors.value[field] = ''
  
  switch (field) {
    case 'firstName':
      if (!form.value.firstName.trim()) {
        validationErrors.value.firstName = t('contact.validation.firstName', 'First name is required')
      }
      break
      
    case 'lastName':
      if (!form.value.lastName.trim()) {
        validationErrors.value.lastName = t('contact.validation.lastName', 'Last name is required')
      }
      break
      
    case 'email':
      if (!form.value.email.trim()) {
        validationErrors.value.email = t('contact.validation.emailRequired', 'Email is required')
      } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        validationErrors.value.email = t('contact.validation.emailInvalid', 'Please enter a valid email address')
      }
      break
      
    case 'message':
      if (!form.value.message.trim()) {
        validationErrors.value.message = t('contact.validation.message', 'Message is required')
      } else if (form.value.message.length < 10) {
        validationErrors.value.message = t('contact.validation.messageLength', 'Message must be at least 10 characters')
      }
      break
    
    case 'company':
      // No validation required for company as it's optional
      break
  }
}

const validateForm = () => {
  validateField('firstName')
  validateField('lastName')
  validateField('email')
  validateField('message')
  
  return Object.values(validationErrors.value).every(error => error === '')
}

const insertTemplateText = () => {
  form.value.message = t('contact.message.template', 
    "Hi there,\n\nI'd like to provide feedback about QFast. \n\nI've been using the application for [time period], and I wanted to share my experience with:\n\n1. What I like:\n- \n- \n\n2. What could be improved:\n- \n- \n\nThank you for your consideration.\n\nBest regards,\n[Your Name]"
  )
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    isSubmitting.value = true
    error.value = ''

    // Create a clean form data object with more explicit formatting
    const formData = {
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      company: form.value.company.trim() || undefined,
      email: form.value.email.trim(),
      message: form.value.message.trim()
    }

    // Use our working contact endpoint with the reliable body parsing approach
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/contact-simple', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          
          if (result.success) {
            // Show success message
            showSuccess.value = true;
            
            // Reset form
            form.value = {
              firstName: '',
              lastName: '',
              company: '',
              email: '',
              message: ''
            };
            
            // Clear validation errors
            Object.keys(validationErrors.value).forEach(key => {
              validationErrors.value[key as keyof typeof validationErrors.value] = '';
            });
            
            // Remove focus
            fieldFocused.value = null;
            
            // Auto scroll to see success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Hide success message after delay
            setTimeout(() => {
              showSuccess.value = false;
            }, 6000);
          } else {
            error.value = result.message || t('contact.errors.generic', 'Failed to send message');
          }
        } catch (err) {
          error.value = t('contact.errors.generic', 'Invalid response from server');
        }
      } else {
        error.value = t('contact.errors.generic', 'Failed to send message');
      }
      
      isSubmitting.value = false;
    };
    
    xhr.onerror = function() {
      error.value = t('contact.errors.generic', 'Network error occurred');
      isSubmitting.value = false;
    };
    
    xhr.send(JSON.stringify(formData));
    
  } catch (err: any) {
    error.value = err.message || t('contact.errors.generic', 'Failed to send message. Please try again.');
    
    // Scroll to see error message
    window.scrollTo({ top: 0, behavior: 'smooth' });
    isSubmitting.value = false;
  }
}

// Auto-save form data to localStorage
watch(form, (newValue) => {
  localStorage.setItem('contactFormData', JSON.stringify(newValue))
}, { deep: true })

// Clear focused field when user clicks outside form elements
onMounted(() => {
  const savedData = localStorage.getItem('contactFormData')
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData)
      // Only restore if the user hasn't started typing yet
      if (!form.value.firstName && !form.value.lastName && !form.value.email && !form.value.message) {
        form.value = { ...parsedData }
      }
    } catch (e) {
      logError('Error parsing saved form data', e)
    }
  }
  
  // Add event listener to clear fieldFocused when clicking outside form fields
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('input, textarea, button, label')) {
      fieldFocused.value = null
    }
  })
})
</script>

<style>
@import '@/assets/css/forms.css';

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Improve focus states for all interactive elements */
button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Add transition to form inputs for smoother interactions */
.form-input {
  transition: all 0.2s ease-in-out;
}

/* Add keyboard focus styles */
.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}
</style>