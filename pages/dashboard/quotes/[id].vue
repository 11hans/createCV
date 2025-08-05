<template>
  <main class="relative flex h-screen w-full flex-col lg:flex-row overflow-hidden bg-[#FDFDFD]">
    <!-- Left Section -->
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

      <!-- Actions Content -->
      <div class="flex min-w-full max-w-[calc(100%-3rem)] flex-1 justify-center overflow-y-auto border-r border-black/[0.07] bg-[#FDFDFD] p-6 lg:h-[calc(100%-4rem)] shadow-[0px_0px_0px_1px,0px_-1px_1px_-0.5px,0px_-3px_3px_-1.5px,0px_-6px_6px_-3px,0px_-12px_12px_-6px,0px_-24px_24px_-12px] shadow-black/[0.04]">
        <div class="flex h-full w-full max-w-[405px] flex-col">
          <!-- Loading state -->
          <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
            <Loader2 class="h-8 w-8 animate-spin text-gray-600" />
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <AlertCircle class="h-8 w-8 text-red-500" />
            <p class="text-red-500">{{ error }}</p>
            <Button variant="outline" @click="fetchQuote" class="text-gray-900">{{ $t('common.retry') }}</Button>
          </div>

          <div v-else-if="quote" class="space-y-6">
            <!-- Quote Header -->
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('quote.preview.title') }}</h2>
              <div class="flex items-center space-x-2 mb-4">
                <Badge :variant="getStatusVariant(quote.status)" :class="statusColors[quote.status]">
                  {{ $t(`quotes.status.${quote.status}`) }}
                </Badge>
              </div>
            </div>

            <!-- Quote Info -->
            <div class="space-y-5 bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
              <div>
                <p class="text-sm text-gray-500 mb-1">{{ $t('quote.preview.quoteNo') }}</p>
                <p class="font-medium text-gray-900">{{ quote.number }}</p>
              </div>
              <div class="flex justify-between">
                <div>
                  <p class="text-sm text-gray-500 mb-1">{{ $t('quote.preview.issued') }}</p>
                  <p class="font-medium text-gray-900">{{ formatDate(quote.issue_date) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">{{ $t('quote.preview.dueDate') }}</p>
                  <p class="font-medium text-gray-900">{{ formatDate(quote.valid_until) }}</p>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">{{ $t('quote.preview.total') }}</p>
                <p class="font-medium text-gray-900 text-lg">{{ formatCurrency(quote.total) }}</p>
              </div>
            </div>

            <!-- Client Info -->
            <div class="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
              <p class="text-sm font-medium text-gray-700 mb-3">{{ $t('quote.preview.to') }}</p>
              <p class="font-medium text-gray-900 mb-1">{{ quote.client?.company_name || $t('quote.form.client.companyNamePlaceholder') }}</p>
              <p class="text-sm text-gray-500 mb-1">{{ quote.client?.email || $t('quote.form.client.emailPlaceholder') }}</p>
              <p class="text-sm text-gray-500 mb-1">{{ quote.client?.street || $t('quote.form.client.addressPlaceholder') }}</p>
              <p class="text-sm text-gray-500">
                {{ quote.client?.city || $t('quote.form.client.cityPlaceholder') }}{{ quote.client?.city && quote.client?.state ? ', ' : '' }}{{ quote.client?.state }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3 mt-6">
              <Button 
                @click="editQuote" 
                class="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Pencil1Icon class="h-4 w-4 mr-2" />
                {{ $t('quotes.actions.edit') }}
              </Button>
              <Button 
                variant="outline" 
                @click="downloadPdf" 
                :disabled="isGenerating"
                class="w-full border-gray-300 hover:bg-gray-50"
              >
                <span v-if="!isGenerating" class="flex items-center justify-center">
                  <DownloadIcon class="h-4 w-4 mr-2" />
                  {{ $t('quote.form.review.downloadButton') }}
                </span>
                <span v-else class="flex items-center justify-center">
                  <Loader2 class="h-4 w-4 mr-2 animate-spin" />
                  {{ $t('quote.form.review.generatingPDF') }}
                </span>
              </Button>
              <Button 
                @click="confirmDelete"
                variant="outline"
                class="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2Icon class="h-4 w-4 mr-2" />
                {{ $t('quotes.actions.delete') }}
              </Button>
              
              <!-- Success Message -->
              <div 
                v-if="pdfUrl" 
                class="success-message mt-3 flex items-center justify-center rounded-lg bg-green-50 p-4 text-sm text-green-600 border border-green-200 animate-fadeIn"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="relative z-0 w-full h-auto lg:h-screen overflow-y-auto lg:w-[70%] flex-1 flex flex-col items-center p-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
        <Loader2 class="h-8 w-8 animate-spin text-gray-600" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle class="h-8 w-8 text-red-500" />
        <p class="text-red-500">{{ error }}</p>
        <Button variant="outline" @click="fetchQuote" class="text-gray-900">{{ $t('common.retry') }}</Button>
      </div>

      <!-- Quote Preview -->
      <div id="container" v-else-if="quote" class="relative">
        <QuotePreview />
        
        <!-- Floating Download Button (Desktop Only) -->
        <div class="absolute top-4 right-4 hidden lg:block">
          <Button 
            variant="default" 
            @click="downloadPdf" 
            :disabled="isGenerating"
            class="bg-blue-600 hover:bg-blue-700 shadow-md"
          >
            <span v-if="!isGenerating" class="flex items-center">
              <DownloadIcon class="h-4 w-4 mr-2" />
              {{ $t('quote.form.review.downloadButton') }}
            </span>
            <span v-else class="flex items-center">
              <Loader2 class="h-4 w-4 mr-2 animate-spin" />
              {{ $t('quote.form.review.generatingPDF') }}
            </span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent class="bg-white">
        <DialogHeader>
          <DialogTitle class="text-gray-900">{{ $t('quote.delete.title') }}</DialogTitle>
          <DialogDescription class="text-gray-500">
            {{ $t('quote.delete.description') }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="isDeleteDialogOpen = false" class="text-gray-900">
            {{ $t('common.cancel') }}
          </Button>
          <Button variant="destructive" @click="deleteQuote" class="bg-red-600 hover:bg-red-700">
            {{ $t('common.delete') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeUnmount, provide } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useSupabaseClient } from '#imports'
import { useQuoteStore } from '~/stores/quote'
import { useI18n } from 'vue-i18n'
import { useCurrency } from '~/composables/useCurrency'
import type {QuoteWithClient, QuoteStatus } from '@/types/database.types'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, AlertCircle, Trash2Icon, Share2Icon } from 'lucide-vue-next'
import { DownloadIcon, Pencil1Icon } from '@radix-icons/vue'
import { useToast } from '@/components/ui/toast/use-toast'
import QuotePreview from '~/components/QuotePreview.vue'
import { useWindowSwitching } from '@/composables/useWindowSwitching'
import { useQuoteState, QuoteMode } from '@/composables/useQuoteState'
import { generatePDF } from '~/services/pdfService'

definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const { toast } = useToast()
const { t, locale } = useI18n()
const { formatCurrency } = useCurrency()

// Use our simplified window switching detection composable
const { isSwitchingWindows } = useWindowSwitching({
  pageId: 'quote-detail',
  itemId: String(route.params.id)
})

const quote = ref<QuoteWithClient | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isDeleteDialogOpen = ref(false)
const isGenerating = ref(false)
const pdfUrl = ref<string | null>(null)

const store = useQuoteStore()
const quoteState = useQuoteState(QuoteMode.PUBLIC)

// Provide quote mode to components
provide('quoteMode', QuoteMode.PUBLIC)

// Status configuration
const statusColors: Record<QuoteStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
} as const

// Store the channel reference outside of hooks
let channel: any = null

// Function to initialize data and set up realtime updates
const initializeQuote = async () => {
  await fetchQuote()
  
  // Initialize the store for the preview
  await quoteState.initializeStore()
  
  // Setup realtime updates
  channel = supabase
    .channel('quote-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quotes',
        filter: `id=eq.${route.params.id}`
      },
      () => {
        log('Quote updated, refreshing...')
        fetchQuote()
      }
    )
    .subscribe()
}

// Register lifecycle hooks
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  initializeQuote()
})

// Clean up the subscription when the component is unmounted
onUnmounted(() => {
  if (channel) {
    channel.unsubscribe()
  }
})

async function fetchQuote() {
  isLoading.value = true
  error.value = null

  try {
    const { data, error: dbError } = await supabase
      .from('quotes')
      .select(`
        *,
        client:clients!fk_quotes_client (
          id,
          company_name,
          email,
          street,
          city,
          state,
          zip,
          country,
          phone,
          contact_name
        )
      `)
      .eq('id', route.params.id)
      .single()

    if (dbError) {
      logError('Supabase error details:', dbError)
      throw dbError
    }

    if (!data) {
      error.value = 'Quote not found'
      return
    }

    // Debug log to check the data
    log('Quote data:', data)
    log('Client data:', data.client)

    quote.value = {
      ...data,
      items: data.items || []
    } as QuoteWithClient

    // Update the store with the quote data for the preview
    store.updateCompany({
      name: data.company_name || '',
      email: data.company_email || '',
      street: data.company_street || '',
      city: data.company_city || '',
      state: data.company_state || '',
      zip: data.company_zip || '',
      country: data.company_country || '',
      tax_id: '',
      is_tax_payer: false
    })

    store.updateClient({
      id: data.client?.id || '',
      company_name: data.client?.company_name || '',
      email: data.client?.email || '',
      street: data.client?.street || '',
      city: data.client?.city || '',
      state: data.client?.state || '',
      zip: data.client?.zip || '',
      country: data.client?.country || '',
      phone: data.client?.phone || '',
      contact_name: data.client?.contact_name || '',
    })

    store.updateItems(data.items || [])
    
    store.updateTerms({
      number: data.number || '',
      issueDate: data.issue_date || new Date().toISOString().split('T')[0],
      dueDate: data.valid_until || '',
      note: data.note || '',
    })

    // Debug log to check the transformed data
    log('Transformed quote:', quote.value)
  } catch (e) {
    logError('Error fetching quote:', e)
    
    // Provide more specific error message based on the error type
    if (e && typeof e === 'object' && 'code' in e) {
      const supabaseError = e as { code: string; message: string }
      error.value = `Database error: ${supabaseError.message}`
      
      toast({
        title: 'Database Error',
        description: supabaseError.message,
        variant: 'destructive'
      })
    } else {
      error.value = 'Failed to load quote'
      
      toast({
        title: 'Error',
        description: 'Failed to load quote',
        variant: 'destructive'
      })
    }
  } finally {
    isLoading.value = false
  }
}

async function deleteQuote() {
  try {
    const { error: deleteError } = await supabase
      .from('quotes')
      .delete()
      .eq('id', route.params.id)
    
    if (deleteError) throw deleteError
    
    isDeleteDialogOpen.value = false
    router.push('/dashboard/quotes')
    
    toast({
      title: t('common.success'),
      description: t('quote.messages.deleted.description'),
    })
  } catch (e) {
    toast({
      title: t('common.error'),
      description: t('quote.messages.deleted.error'),
      variant: 'destructive'
    })
  }
}

function confirmDelete() {
  isDeleteDialogOpen.value = true
}

async function downloadPdf() {
  try {
    // Show loading state
    isGenerating.value = true
    pdfUrl.value = null
    
    toast({
      title: t('common.loading'),
      description: t('quote.form.review.generatingPDF'),
    })
    
    // Generate file name based on quote number
    const fileName = `Quote-${quote.value?.number || 'QT-000001'}.pdf`
    
    // Generate PDF from the container element
    const url = await generatePDF('container')
    
    // If PDF was generated successfully, trigger download
    if (url) {
      pdfUrl.value = url
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: t('common.success'),
        description: t('quote.form.review.pdfSuccess'),
      })
      
      // Clear the URL after 5 seconds
      setTimeout(() => {
        pdfUrl.value = null
      }, 5000)
    }
  } catch (error) {
    logError('Failed to generate PDF:', error)
    toast({
      title: t('common.error'),
      description: t('errors.save.quote'),
      variant: "destructive",
    })
  } finally {
    isGenerating.value = false
  }
}

function getStatusVariant(status: QuoteStatus): 'secondary' | 'destructive' | 'default' | 'outline' {
  const variants = {
    draft: 'secondary',
    sent: 'default',
    accepted: 'default',
    rejected: 'destructive'
  } as const
  return variants[status]
}

function formatAmount(amount: number | null): string {
  if (amount === null) return '-'
  return formatCurrency(amount)
}

function formatDate(date: string | null): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

function editQuote() {
  if (!quote.value?.id) return
  router.push(`/dashboard/quotes/edit-${quote.value.id}`)
}
</script>

<style>
@import '@/assets/css/variables.css';
@import '@/assets/css/forms.css';
@import '@/assets/css/components/quote.css';

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>