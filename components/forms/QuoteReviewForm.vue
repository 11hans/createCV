<template>
  <div class="quote-review-container">
    <h3 class="form-section-title">{{ $t('quote.form.review.title') }}</h3>
    <p class="text-sm text-gray-600 mb-6">
      {{ $t('quote.form.review.subtitle') }}
    </p>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message py-4 px-4 bg-red-50 text-red-600 rounded-lg border border-red-200 mb-6 animate-fadeIn">
      <div class="flex items-center">
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

    <!-- Content -->
    <div v-else class="animate-fadeIn">
      <!-- Quote Info -->
      <div class="quote-info divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <!-- Quote Number -->
        <div class="py-4 px-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200">
          <span class="text-sm text-gray-600">{{ $t('quote.form.review.quoteNumber') }}</span>
          <span class="text-sm font-medium text-gray-900">{{ terms?.number }}</span>
        </div>

        <!-- Quote Date -->
        <div class="py-4 px-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200">
          <span class="text-sm text-gray-600">{{ $t('quote.form.review.quoteDueDate') }}</span>
          <span class="text-sm font-medium text-gray-900">{{ formattedDueDate }}</span>
        </div>

        <!-- Subtotal -->
        <div class="py-4 px-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200">
          <span class="text-sm text-gray-600">{{ $t('quote.form.review.quoteSubtotal') }}</span>
          <span class="text-sm font-medium text-gray-900 tabular-nums">{{ formattedSubtotal }}</span>
        </div>

        <!-- Tax -->
        <div class="py-4 px-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200">
          <span class="text-sm text-gray-600">{{ $t('quote.form.review.quoteTax') }}</span>
          <span class="text-sm font-medium text-gray-900 tabular-nums">{{ formattedTax }}</span>
        </div>

        <!-- Total -->
        <div class="py-4 px-4 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
          <span class="text-sm font-medium text-gray-900">{{ $t('quote.form.review.quoteTotal') }}</span>
          <span class="text-base font-semibold text-blue-700 tabular-nums">{{ formattedTotal }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 space-y-3">
        <!-- Save Quote Button -->
        <button 
          @click="saveQuote"
          type="button"
          :disabled="isSaving"
          class="primary-button flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isSaving" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ $t('quote.form.review.saveQuote') }}
        </button>

        <!-- Generate PDF Button -->
        <button 
          @click="generateQuotePDF"
          type="button"
          :disabled="isGenerating || isSaving"
          class="action-button flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isGenerating" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isGenerating ? $t('quote.form.review.generatingPDF') : $t('quote.form.review.downloadButton') }}
        </button>

        <!-- Create New Button -->
        <button 
          @click="handleCreateNew"
          type="button"
          class="back-button flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t('quote.form.review.createNewButton') }}
        </button>
      </div>

      <!-- Success Message -->
      <div 
        v-if="pdfUrl" 
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
        {{ $t('quote.form.review.pdfSuccess') }}
      </div>

      <!-- Preview Modal - Mobile Only -->
      <div 
        v-if="showPreview" 
        class="fixed inset-0 z-50 lg:hidden overflow-y-auto bg-white"
      >
        <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <h3 class="text-lg font-medium">{{ $t('quote.form.review.previewTitle') }}</h3>
          <button 
            @click="showPreview = false"
            class="rounded-md p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="p-4">
          <QuotePreview />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuoteStore } from '@/stores/quote'
import { useProfileStore } from '@/stores/profile'
import type { QuoteItem } from '@/types/quote'
import { useSupabaseClient, useRouter, useRoute } from '#imports'
import { useToast } from '@/components/ui/toast'
import { useFormatting } from '~/composables/useFormatting'
import { useLanguage } from '~/composables/useLanguage'
import { generatePDF } from '~/services/pdfService'
import { QuoteService } from '~/services/quoteService' 
import { QuoteValidation } from '~/services/quoteValidation'  
import type { ValidationError } from '~/types/errors'    
import { ErrorService } from '~/services/errorService'
import { useQuoteFormLogic } from '~/composables/useQuoteFormLogic'
import { Button } from '@/components/ui/button'
import { useUser } from '~/composables/useUser'

const quoteStore = useQuoteStore()
const profileStore = useProfileStore()
const supabase = useSupabaseClient()
const { toast } = useToast()
const router = useRouter()
const route = useRoute()
const { currentLocale } = useLanguage()
const { formatCurrency, formatDate, getTaxLabel } = useFormatting()
const { user } = useUser()
const isSaving = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Function to load profile data
const loadProfileData = async () => {
  // Only try to load profile in authenticated mode
  if (!window.location.pathname.startsWith('/public/')) {
    isLoading.value = true
    try {
      await profileStore.fetchProfile()
      
      // Update company info from profile if available
      if (profileStore.profile) {
        quoteStore.updateCompany({
          email: profileStore.profile.email || '',
          name: profileStore.profile.name || '',
          street: profileStore.profile.street || '',
          city: profileStore.profile.city || '',
          state: profileStore.profile.state || '',
          zip: profileStore.profile.zip || '',
          country: profileStore.profile.country || '',
          tax_id: profileStore.profile.tax_id || '',
          is_tax_payer: profileStore.profile.is_tax_payer || false,
          tax_number: profileStore.profile.tax_number || ''
        })
      }
    } catch (err) {
      logError('Error loading profile:', err)
      error.value = 'Failed to load profile data'
    } finally {
      isLoading.value = false
    }
  }
}

// Register lifecycle hooks before any await statements
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  loadProfileData()
})

// Computed properties for display
const isUS = computed(() => currentLocale.value === 'en')
const terms = computed(() => quoteStore.terms)
const vatLabel = computed(() => getTaxLabel())

// Formatting computeds
const formattedDate = computed(() => 
  terms.value?.issueDate ? formatDate(new Date(terms.value.issueDate)) : ''
)

const formattedDueDate = computed(() => 
  terms.value?.dueDate ? formatDate(new Date(terms.value.dueDate)) : ''
)

const formattedSubtotal = computed(() => {
  return formatCurrency(quoteStore.subtotal)
})

const formattedTax = computed(() => {
  return formatCurrency(quoteStore.taxTotal)
})

const formattedTotal = computed(() => {
  return formatCurrency(quoteStore.total)
})

// Validation
const validateQuote = () => {
  const validator = new QuoteValidation()
  const errors: string[] = validator.validateQuote(quoteStore.getQuoteData())
  
  if (errors.length > 0) {
    const errorMessages = errors
      .filter(Boolean)
      .join('\n')
    toast({
      title: "Validation Error",
      description: errorMessages,
      variant: "destructive",
    })
    return false
  }
  return true
}

// Generate PDF functionality
const pdfUrl = ref('')
const isGenerating = ref(false)
const showPreview = ref(false)

const generateQuotePDF = async () => {
  if (isGenerating.value) return
  
  // Validate quote before generating PDF
  if (!validateQuote()) return
  
  try {
    isGenerating.value = true
    
    // Generate file name based on locale
    const filePrefix = isUS.value ? 'Quote-' : 'Nabidka-'
    const fileName = `${filePrefix}${terms.value?.number || 'QT-000001'}.pdf`
    
    // Generate PDF from the container element
    pdfUrl.value = await generatePDF('container')
    
    // If PDF was generated successfully, trigger download
    if (pdfUrl.value) {
      const link = document.createElement('a')
      link.href = pdfUrl.value
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Success",
        description: "PDF generated successfully",
      })
    }
  } catch (error) {
    logError('Failed to generate PDF:', error)
    toast({
      title: "Error",
      description: "Failed to generate PDF",
      variant: "destructive",
    })
  } finally {
    isGenerating.value = false
  }
}

const saveQuote = async () => {
  if (!user.value?.id) {
    toast({
      title: 'Error',
      description: 'You must be logged in to save a quote',
      variant: 'destructive'
    })
    return
  }

  // Validate before saving
  if (!validateQuote()) return

  isSaving.value = true
  try {
    // Get profile data for company info
    await profileStore.fetchProfile()
    if (!profileStore.profile) {
      throw new Error('Company profile not found')
    }

    // Update company info from profile
    quoteStore.updateCompany({
      email: profileStore.profile.email || '',
      name: profileStore.profile.name || '',
      street: profileStore.profile.street || '',
      city: profileStore.profile.city || '',
      state: profileStore.profile.state || '',
      zip: profileStore.profile.zip || '',
      country: profileStore.profile.country || '',
      tax_id: profileStore.profile.tax_id || '',
      is_tax_payer: profileStore.profile.is_tax_payer || false,
      tax_number: profileStore.profile.tax_number || ''
    })

    // If no client ID, create the client first
    if (!quoteStore.client.id) {
      const savedClient = await quoteStore.saveClient(user.value.id)
      if (!savedClient.id) {
        throw new Error('Failed to create client')
      }
    }

    // Save or update quote
    if (route.params.id) {
      await quoteStore.updateQuote(route.params.id as string, user.value.id)
    } else {
      await quoteStore.saveQuote(user.value.id)
    }
    
    toast({
      title: 'Success',
      description: 'Quote saved successfully'
    })
    
    // Redirect to quotes list
    router.push('/dashboard/quotes')
  } catch (error) {
    logError('Failed to save quote:', error)
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to save quote',
      variant: 'destructive'
    })
  } finally {
    isSaving.value = false
  }
}

const downloadPdf = async () => {
  toast({
    title: 'Coming Soon',
    description: 'PDF download functionality will be available soon'
  })
}

const handleCreateNew = () => {
  quoteStore.resetForm()
  router.push('/dashboard/quotes/new')
}

// Format helpers
const formatNumber = (num: number) => {
  if (typeof num !== 'number' || isNaN(num)) return formatCurrency(0)
  return formatCurrency(num)
}

defineEmits(['create-new'])
</script>

<style scoped>
.quote-review-container {
  max-width: 100%;
}

.quote-info {
  transition: all 0.2s ease;
}

.quote-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
