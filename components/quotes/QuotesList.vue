<template>
  <div class="min-h-screen bg-gray-50 p-2 md:p-4">
    <!-- Header Section with Dynamic Stats - Responsive Grid -->
    <div class="mb-4 md:mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
      <!-- Summary Card - Simplified for Mobile -->
      <Card class="bg-white rounded-lg shadow-sm h-full">
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-gray-500">{{ $t('quotes.list.summary') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3 md:space-y-4">
            <!-- Simple Quote Count -->
            <div>
              <p class="text-xl md:text-2xl font-bold text-gray-800">{{ filteredQuotes.length }}</p>
              <p class="text-xs text-gray-500">{{ $t('quotes.list.filtered') }} {{ quotes.length }} {{ $t('quotes.list.total') }}</p>
            </div>
            
            <!-- Status List - Horizontal on Mobile -->
            <div class="border-t pt-3">
              <div class="flex flex-wrap gap-8">
                <div v-for="status in QUOTE_STATUSES" :key="status" class="flex items-center mr-3">
                  <div class="w-2 h-2 md:w-3 md:h-3 rounded-full mr-1 md:mr-2" :class="`bg-${getStatusColor(status)}-500`"></div>
                  <div class="flex flex-col">
                    <span class="text-xs md:text-sm font-medium" :class="`text-${getStatusColor(status)}-700`">{{ getStatusCount(status) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <!-- Financial Overview - Hidden on Small Mobile, Visible on Larger Screens -->
      <Card class="bg-white rounded-lg shadow-sm h-full hidden sm:block">
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-gray-500">{{ $t('quotes.list.financialOverview') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3 md:space-y-4">
            <div>
              <p class="text-sm text-gray-500">{{ $t('quotes.list.filteredTotal') }}</p>
              <p class="text-xl md:text-2xl font-bold text-green-600">{{ formatCurrency(filteredTotal) }}</p>
            </div>
            <div class="text-sm">
              <p class="text-gray-500">{{ $t('quotes.list.averageValue') }}</p>
              <p class="font-medium text-base md:text-lg">{{ formatCurrency(averageQuoteValue) }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Search and Filter Card - Simplified for Mobile -->
      <Card class="bg-white rounded-lg shadow-sm h-full col-span-1 sm:col-span-1 md:col-span-1">
        <CardContent class="pt-4 md:pt-6">
          <div class="space-y-3 md:space-y-4">
            <!-- Search Input - Simplified -->
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                v-model="search"
                :placeholder="$t('quotes.list.search')"
                class="pl-9 bg-gray-50 border-gray-200 rounded-full text-sm"
              />
            </div>
            
            <!-- Quick Filters - Horizontal Scrollable on Mobile -->
            <div>
              <label class="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2 block">
                {{ $t('quotes.list.quickFilters') }}
              </label>
              <div class="flex gap-1 md:gap-2 overflow-x-auto pb-1 -mx-1 px-1 md:flex-wrap">
                <Button
                  v-for="status in statusOptions"
                  :key="status"
                  :variant="statusFilter === status ? 'default' : 'outline'"
                  size="sm"
                  @click="statusFilter = status"
                  :class="[
                    'rounded-full text-xs whitespace-nowrap',
                    statusFilter === status ? (
                      status === 'All' ? 'bg-blue-500 hover:bg-blue-600' : 
                      status === 'accepted' ? 'bg-green-500 hover:bg-green-600' : 
                      status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 
                      status === 'sent' ? 'bg-blue-500 hover:bg-blue-600' : 
                      'bg-gray-500 hover:bg-gray-600'
                    ) : ''
                  ]"
                >
                  <div class="flex items-center">
                    <div 
                      v-if="status !== 'All'" 
                      class="w-2 h-2 rounded-full mr-1" 
                      :class="`bg-${getStatusColor(status)}-500`"
                    ></div>
                    {{ $t(`quotes.status.${status.toLowerCase()}`) }}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quotes List - Card View for Mobile, Table for Desktop -->
    <div class="md:hidden space-y-3">
      <!-- Mobile Card View -->
      <Card 
        v-for="quote in filteredQuotes" 
        :key="quote.id"
        class="bg-white rounded-lg shadow-sm overflow-hidden"
        @click="viewQuote(quote)"
      >
        <CardContent class="p-3">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-medium text-sm">#{{ quote.number }}</p>
              <p class="text-xs text-gray-500">{{ quote.client?.company_name || '-' }}</p>
            </div>
            
            <!-- Status Badge - Tappable -->
            <div @click.stop>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" class="h-7 px-2 py-1">
                    <Badge
                      :variant="getStatusVariant(quote.status)"
                      :class="[
                        quote.status ? statusColors[quote.status] : 'bg-gray-100 text-gray-800', 
                        'px-2 py-0.5 rounded-full text-xs'
                      ]"
                    >
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-full mr-1" :class="`bg-${getStatusColor(quote.status || 'draft')}-500`"></div>
                        {{ $t(`quotes.status.${quote.status || 'draft'}`) }}
                        <ChevronDownIcon class="h-3 w-3 ml-1 inline-block" />
                      </div>
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-32 dropdown-menu-content">
                  <DropdownMenuItem 
                    v-for="status in QUOTE_STATUSES"
                    :key="status"
                    @click.stop="updateQuoteStatus(quote.id, status)"
                    :class="[
                      'cursor-pointer text-sm',
                      quote.status === status ? 'bg-gray-100' : ''
                    ]"
                  >
                    <div class="flex items-center">
                      <div class="w-2 h-2 rounded-full mr-2" :class="`bg-${getStatusColor(status)}-500`"></div>
                      {{ $t(`quotes.status.${status}`) }}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-3">
            <div>
              <p class="text-xs text-gray-500">{{ $t('quotes.list.validUntil') }}</p>
              <p class="text-sm">{{ formatDate(quote.valid_until) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">{{ $t('quotes.list.totalAmount') }}</p>
              <p class="text-sm font-semibold text-green-600">{{ formatCurrency(quote.total) }}</p>
            </div>
          </div>
          
          <!-- Action Buttons - Compact for Mobile -->
          <div class="flex justify-end gap-1 mt-3 border-t pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              class="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100" 
              @click.stop="editQuote(quote)"
              :title="$t('quotes.actions.edit')"
            >
              <Pencil1Icon class="h-4 w-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              class="h-8 w-8 rounded-full bg-red-50 hover:bg-red-100" 
              @click.stop="confirmDelete(quote.id)"
              :title="$t('quotes.actions.delete')"
            >
              <TrashIcon class="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <!-- Empty State for Mobile -->
      <div v-if="filteredQuotes.length === 0" class="bg-white rounded-lg shadow-sm p-6 text-center">
        <MagnifyingGlassIcon class="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <h3 class="text-base font-medium text-gray-900">{{ $t('quotes.empty.title') }}</h3>
        <p class="text-gray-500 text-sm mt-1">
          {{ $t('quotes.empty.filterMessage') }}
        </p>
      </div>
    </div>

    <!-- Desktop Table View - Hidden on Mobile -->
    <Card class="bg-white overflow-hidden rounded-lg shadow-sm hidden md:block">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="bg-gray-50 hover:bg-gray-50 border-b">
                <TableHead class="w-[150px] whitespace-nowrap text-gray-500 font-medium">{{ $t('quote.form.terms.number') }}</TableHead>
                <TableHead class="whitespace-nowrap text-gray-500 font-medium">{{ $t('clients.title') }}</TableHead>
                <TableHead class="whitespace-nowrap text-gray-500 font-medium">{{ $t('quotes.list.status') || 'Status' }}</TableHead>
                <TableHead class="whitespace-nowrap text-gray-500 font-medium">{{ $t('quotes.list.totalAmount') }}</TableHead>
                <TableHead class="whitespace-nowrap text-gray-500 font-medium">{{ $t('quotes.list.validUntil') }}</TableHead>
                <TableHead class="text-center whitespace-nowrap text-gray-500 font-medium">{{ $t('common.actions') || 'Actions' }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="quote in filteredQuotes" 
                :key="quote.id"
                class="hover:bg-gray-50 cursor-pointer border-b"
                @click="viewQuote(quote)"
              >
                <TableCell class="font-medium whitespace-nowrap py-4">#{{ quote.number }}</TableCell>
                <TableCell class="whitespace-nowrap py-4">{{ quote.client?.company_name || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild @click.stop>
                      <Button variant="ghost" class="h-7 px-3 rounded-full">
                        <Badge
                          :variant="getStatusVariant(quote.status)"
                          :class="[
                            quote.status ? statusColors[quote.status] : 'bg-gray-100 text-gray-800', 
                            'px-3 py-1 rounded-full'
                          ]"
                        >
                          <div class="flex items-center">
                            <div class="w-2 h-2 rounded-full mr-1" :class="`bg-${getStatusColor(quote.status || 'draft')}-500`"></div>
                            {{ $t(`quotes.status.${quote.status || 'draft'}`) }}
                            <ChevronDownIcon class="h-3 w-3 ml-1 inline-block" />
                          </div>
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" class="w-32 dropdown-menu-content">
                      <DropdownMenuItem 
                        v-for="status in QUOTE_STATUSES"
                        :key="status"
                        @click.stop="updateQuoteStatus(quote.id, status)"
                        :class="[
                          'cursor-pointer',
                          quote.status === status ? 'bg-gray-100' : ''
                        ]"
                      >
                        <div class="flex items-center">
                          <div class="w-2 h-2 rounded-full mr-2" :class="`bg-${getStatusColor(status)}-500`"></div>
                          {{ $t(`quotes.status.${status}`) }}
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell class="font-semibold text-green-600 whitespace-nowrap py-4">
                  {{ formatCurrency(quote.total) }}
                </TableCell>
                <TableCell class="whitespace-nowrap py-4">{{ formatDate(quote.valid_until) }}</TableCell>
                <TableCell class="text-center whitespace-nowrap py-4">
                  <div class="flex items-center justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      class="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100" 
                      @click.stop="viewQuote(quote)"
                      :title="$t('quotes.actions.view')"
                    >
                      <EyeOpenIcon class="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      class="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100" 
                      @click.stop="editQuote(quote)"
                      :title="$t('quotes.actions.edit')"
                    >
                      <Pencil1Icon class="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      class="h-8 w-8 rounded-full bg-red-50 hover:bg-red-100" 
                      @click.stop="confirmDelete(quote.id)"
                      :title="$t('quotes.actions.delete')"
                    >
                      <TrashIcon class="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              
              <!-- Empty State -->
              <TableRow v-if="filteredQuotes.length === 0">
                <TableCell colspan="6">
                  <div class="flex flex-col items-center justify-center py-12 px-4">
                    <MagnifyingGlassIcon class="h-12 w-12 text-gray-400 mb-4" />
                    <h3 class="text-lg font-medium text-gray-900">{{ $t('quotes.empty.title') }}</h3>
                    <p class="text-gray-500 text-center mt-2">
                      {{ $t('quotes.empty.filterMessage') }}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent class="bg-white max-w-md">
        <DialogHeader>
          <div class="flex flex-col items-center text-center mb-4">
            <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertTriangle class="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle class="text-xl font-semibold text-gray-800">{{ $t('quotes.modal.deleteTitle') }}</DialogTitle>
            <DialogDescription class="text-gray-500 mt-2">
              {{ $t('quotes.modal.deleteDescription') }}
            </DialogDescription>
          </div>
          <div v-if="quoteToDelete" class="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <p class="font-medium text-gray-800">
              {{ quotes.find(q => q.id === quoteToDelete)?.number || '#' }}
            </p>
            <p class="text-sm text-gray-500">
              {{ quotes.find(q => q.id === quoteToDelete)?.client?.company_name || '-' }}
            </p>
            <p class="text-sm font-medium text-green-600 mt-1">
              {{ formatCurrency(quotes.find(q => q.id === quoteToDelete)?.total || 0) }}
            </p>
          </div>
        </DialogHeader>
        <DialogFooter class="mt-6 pt-4 border-t flex gap-3 justify-center sm:justify-end">
          <Button type="button" variant="outline" @click="isDeleteDialogOpen = false" class="rounded-lg min-w-24">
            {{ $t('common.cancel') }}
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            @click="deleteQuote" 
            :disabled="isLoading" 
            class="rounded-lg min-w-24 bg-red-600 hover:bg-red-700"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ $t('common.delete') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useSupabaseClient, useRouter, useRoute } from '#imports'
import { QUOTE_STATUSES } from '@/types/database.types'
import type { 
  Quote, 
  QuoteStatus, 
  QuoteWithClient,
  QuoteStatusOption
} from '@/types/database.types'
import { QuoteService } from '@/services/quoteService'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  MagnifyingGlassIcon, 
  EyeOpenIcon, 
  Pencil1Icon, 
  TrashIcon,
  ChevronDownIcon
} from '@radix-icons/vue'
import { AlertTriangle, Loader2 } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import { useI18n } from 'vue-i18n'
import { languageService } from '@/language/service'
import { useCurrency } from '@/composables/useCurrency'
import { log } from '~/utils/logger'

const { t, locale } = useI18n()

// Function to check and set the correct language
const checkAndSetLanguage = async () => {
  if (process.client) {
    // Check for recent reloads to prevent infinite loops
    const lastQuotesReload = localStorage.getItem('quotes_list_last_reload');
    const now = Date.now();
    const reloadThreshold = 2000; // 2 seconds
    
    if (lastQuotesReload && (now - parseInt(lastQuotesReload)) < reloadThreshold) {
      log('[QuotesList] Preventing reload loop - too soon since last reload');
      document.documentElement.lang = locale.value;
      return;
    }
    
    const hostname = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    const detectedLocale = languageService.detectLocale(hostname);
    
    log(`[QuotesList] Language check - Current: ${locale.value}, Detected: ${detectedLocale}`);
    
    // If locale doesn't match the domain, force it
    if (locale.value !== detectedLocale) {
      log(`[QuotesList] Locale mismatch: ${locale.value} vs ${detectedLocale}`);
      
      // Set locale and update document
      locale.value = detectedLocale;
      document.documentElement.lang = detectedLocale;
      
      // Persist the change
      languageService.persistLocale(detectedLocale);
      
      // Test if translations are working
      await nextTick();
      const testKey = 'quotes.title';
      const testTranslation = t(testKey);
      const expectedTranslation = detectedLocale === 'en' ? 'Quotes' : 'Nabídky';
      
      if (testTranslation !== expectedTranslation) {
        log(`[QuotesList] Translation test failed! Got "${testTranslation}" but expected "${expectedTranslation}"`);
        localStorage.setItem('quotes_list_last_reload', now.toString());
        window.location.reload();
        return;
      } else {
        log('[QuotesList] Translation test passed - no reload needed');
      }
    }
  }
}

// Ensure correct language on component mount
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  checkAndSetLanguage()
  fetchQuotes()
  setupRealtimeUpdates()
})

type BadgeVariant = 'secondary' | 'destructive' | 'default' | 'outline'

const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient()
const { toast } = useToast()

// Get currency formatting functions
const { formatCurrency } = useCurrency()

// Add new type definition
type FilteredQuote = {
  id: string
  number: string
  status: QuoteStatus
  total: number
  valid_until: string | null
  client?: {
    company_name: string
    email: string
    id: string
  } | null
}

// State
const quotes = ref<FilteredQuote[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isDeleteDialogOpen = ref(false)
const quoteToDelete = ref<string | null>(null)
const search = ref('')
const statusFilter = ref<QuoteStatusOption>('All')
const isFilterMenuOpen = ref(false)
const statusOptions = ["All", ...QUOTE_STATUSES] as const
const isStatusDialogOpen = ref(false)
const selectedQuote = ref<QuoteWithClient | null>(null)
const quoteService = new QuoteService()

// Enhanced computed properties
const filteredTotal = computed(() => 
  filteredQuotes.value.reduce((sum, quote) => sum + (quote.total || 0), 0)
)

const averageQuoteValue = computed(() => 
  filteredQuotes.value.length > 0 
    ? filteredTotal.value / filteredQuotes.value.length 
    : 0
)

// New methods
function getStatusCount(status: QuoteStatus | 'All'): number {
  if (status === 'All') return quotes.value.length
  return quotes.value.filter(quote => quote.status === status).length
}

function openStatusMenu(quote: QuoteWithClient) {
  selectedQuote.value = quote
  isStatusDialogOpen.value = true
}

// Status configuration
const statusColors: Record<QuoteStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-50 text-blue-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700"
} as const

// Helper function to get status color
function getStatusColor(status: QuoteStatus | 'All'): string {
  if (status === 'All') return 'gray'
  
  switch(status) {
    case 'draft': return 'gray'
    case 'sent': return 'blue'
    case 'accepted': return 'green'
    case 'rejected': return 'red'
    default: return 'gray'
  }
}

// Lifecycle
onMounted(() => {
  fetchQuotes()
  setupRealtimeUpdates()
})

async function fetchQuotes() {
  isLoading.value = true
  error.value = null
  
  try {
    // Use the improved QuoteService instead of direct Supabase calls
    const data = await quoteService.getAllQuotes()
    
    quotes.value = data.map((quote: any) => ({
      id: quote.id,
      number: quote.number,
      status: quote.status,
      total: quote.total,
      valid_until: quote.valid_until,
      client: quote.client
    })) as FilteredQuote[]
  } catch (e: any) {
    error.value = t('errors.load.quotes')
    logError('Error fetching quotes:', e)
    toast({
      title: t('common.error'),
      description: e.message || t('errors.load.quotes'),
      variant: 'destructive'
    })
    
    // If it's an authentication error, redirect to login
    if (e.message && e.message.includes('Authentication error')) {
      router.push('/auth/login')
    }
  } finally {
    isLoading.value = false
  }
}

function setupRealtimeUpdates() {
  const channel = supabase
    .channel('quote-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quotes'
      },
      () => {
        log('Quote change detected, refreshing...')
        fetchQuotes()
      }
    )
    .subscribe()

  onUnmounted(() => {
    channel.unsubscribe()
  })
}

async function deleteQuote() {
  if (!quoteToDelete.value) return
  
  try {
    isLoading.value = true
    const { error: deleteError } = await supabase
      .from('quotes')
      .delete()
      .eq('id', quoteToDelete.value)
    
    if (deleteError) throw deleteError
    
    quotes.value = quotes.value.filter(q => q.id !== quoteToDelete.value)
    isDeleteDialogOpen.value = false
    
    toast({
      title: t('common.success'),
      description: t('quotes.messages.deleted'),
    })
  } catch (e) {
    toast({
      title: t('common.error'),
      description: t('errors.delete.quote'),
      variant: 'destructive'
    })
  } finally {
    quoteToDelete.value = null
    isLoading.value = false
  }
}

async function updateQuoteStatus(quoteId: string | undefined, newStatus: QuoteStatus) {
  if (!quoteId) return
  
  try {
    const { error: updateError } = await supabase
      .from('quotes')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', quoteId)
    
    if (updateError) throw updateError
    
    const quoteIndex = quotes.value.findIndex(q => q.id === quoteId)
    if (quoteIndex !== -1) {
      quotes.value[quoteIndex].status = newStatus
    }
    
    isStatusDialogOpen.value = false
    selectedQuote.value = null
    
    toast({
      title: t('common.success'),
      description: t('quotes.messages.updated'),
    })
  } catch (e) {
    toast({
      title: t('common.error'),
      description: t('errors.save.quote'),
      variant: 'destructive'
    })
  }
}


// Computed
const filteredQuotes = computed(() => {
  const searchTerm = search.value.toLowerCase()
  
  return quotes.value.filter(quote => {
    if (statusFilter.value !== "All" && quote.status !== statusFilter.value) {
      return false
    }
    
    if (!searchTerm) {
      return true
    }
    
    return (
      quote.number.toLowerCase().includes(searchTerm) ||
      quote.client?.company_name.toLowerCase().includes(searchTerm) ||
      false
    )
  }) as FilteredQuote[]
})

const totalQuoteValue = computed(() => 
  quotes.value.reduce((sum, quote) => sum + (quote.total || 0), 0)
)

// Utility functions
function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

function getStatusVariant(status: QuoteStatus | null): BadgeVariant {
  if (!status) return 'secondary'
  const variants: Record<QuoteStatus, BadgeVariant> = {
    draft: 'secondary',
    sent: 'default',
    accepted: 'default',
    rejected: 'destructive'
  }
  return variants[status]
}

function viewQuote(quote: FilteredQuote) {
  router.push(`/dashboard/quotes/${quote.id}`)
}

function editQuote(quote: FilteredQuote) {
  if (!quote?.id) return
  router.push(`/dashboard/quotes/edit-${quote.id}`)
}

const confirmDelete = (id: string) => {
  quoteToDelete.value = id
  isDeleteDialogOpen.value = true
}
</script>

<style scoped>
/* Mobile optimizations */
@media (max-width: 768px) {
  /* Make horizontal scrolling smooth for filters */
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
  }
  
  .overflow-x-auto::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
}

/* Status badge enhancements - more subtle */
:deep(.bg-green-100) {
  background-color: rgba(34, 197, 94, 0.08) !important;
  border: 1px solid rgba(34, 197, 94, 0.2) !important;
}

:deep(.bg-red-100) {
  background-color: rgba(239, 68, 68, 0.08) !important;
  border: 1px solid rgba(239, 68, 68, 0.2) !important;
}

:deep(.text-green-800) {
  color: rgb(22, 163, 74) !important;
}

:deep(.text-red-800) {
  color: rgb(185, 28, 28) !important;
}

/* Status circle enhancements - more subtle */
:deep(.bg-green-500) {
  background-color: rgb(34, 197, 94) !important;
  box-shadow: none;
}

:deep(.bg-red-500) {
  background-color: rgb(239, 68, 68) !important;
  box-shadow: none;
}

:deep(.bg-blue-500) {
  background-color: rgb(59, 130, 246) !important;
  box-shadow: none;
}

:deep(.bg-gray-500) {
  background-color: rgb(107, 114, 128) !important;
  box-shadow: none;
}

/* Dropdown menu enhancements - solid background */
:deep(.dropdown-menu-content) {
  background-color: white !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Apply this class to all dropdown menu content */
:deep([data-radix-popper-content-wrapper]) {
  background-color: white !important;
}

:deep(.dropdown-menu-content > *) {
  background-color: white !important;
}
</style>