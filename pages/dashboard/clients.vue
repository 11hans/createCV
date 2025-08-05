<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="scroll-m-20 text-3xl font-bold tracking-tight text-gray-800">{{ $t('clients.title') }}</h1>
      <Button @click="openClientModal()" class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
        <UserPlus class="mr-2 h-4 w-4" />
        {{ $t('clients.actions.new') }}
      </Button>
    </div>

    <!-- Search and Stats Bar -->
    <Card class="bg-white rounded-lg shadow-sm mb-6">
      <CardContent class="p-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Search -->
          <div class="relative flex-grow max-w-md">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('clients.search.placeholder')"
              class="pl-9 bg-gray-50 border-gray-200 rounded-full"
            />
          </div>
          
          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <span>{{ $t('clients.stats.total') }}: </span>
              <span class="font-medium text-gray-700 ml-1">{{ filteredClients.length }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Loading State -->
    <div v-if="loading && !isDatabaseEmpty" class="flex justify-center py-8">
      <Loader2 class="h-8 w-8 animate-spin text-blue-600" />
    </div>

    <!-- Error State -->
    <Alert v-else-if="error" variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>{{ $t('errors.load.clients') }}</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Empty State -->
    <div v-else-if="isDatabaseEmpty" class="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-sm">
      <UserPlus class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-semibold text-gray-800">{{ $t('clients.empty.title') }}</h3>
      <p class="mt-2 text-gray-500 text-center max-w-md">{{ $t('clients.empty.description') }}</p>
      <Button class="mt-6 bg-blue-600 hover:bg-blue-700 text-white" @click="openClientModal()">
        <UserPlus class="mr-2 h-4 w-4" />
        {{ $t('clients.actions.new') }}
      </Button>
    </div>

    <!-- Client List -->
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card v-for="client in filteredClients" :key="client.id" class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <CardHeader class="pb-3 border-b border-gray-100">
          <CardTitle class="text-lg font-semibold text-gray-800 truncate" :title="client.company_name">
            {{ client.company_name }}
          </CardTitle>
        </CardHeader>
        
        <CardContent class="p-4">
          <div class="space-y-3 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <User class="h-4 w-4 text-blue-600" />
              </div>
              <span class="text-gray-700">{{ client.contact_name || $t('clients.messages.noContactName') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail class="h-4 w-4 text-blue-600" />
              </div>
              <span class="text-gray-700 break-all">{{ client.email || $t('clients.messages.noEmail') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Phone class="h-4 w-4 text-blue-600" />
              </div>
              <span class="text-gray-700">{{ client.phone || $t('clients.messages.noPhone') }}</span>
            </div>
            <div class="flex items-start gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin class="h-4 w-4 text-blue-600" />
              </div>
              <span class="text-gray-700">
                {{ formatFullAddress({
                  street: client.street,
                  city: client.city,
                  state: client.state,
                  zip: client.zip,
                  country: client.country
                }) || $t('clients.messages.noAddress') }}
              </span>
            </div>
          </div>
        </CardContent>

        <!-- Footer with buttons -->
        <CardFooter class="flex justify-end gap-2 p-3 border-t bg-gray-50">
          <Button 
            variant="ghost" 
            size="sm"
            @click="editClient(client)"
            class="rounded-full h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100"
            :title="$t('clients.actions.edit')"
          >
            <Pencil class="h-4 w-4 text-blue-600" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            @click="confirmDelete(client)"
            class="rounded-full h-8 w-8 p-0 bg-red-50 hover:bg-red-100"
            :title="$t('clients.actions.delete')"
          >
            <Trash class="h-4 w-4 text-red-600" />
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Client Modal -->
    <Dialog v-model:open="showModal">
      <DialogContent class="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle class="text-xl font-semibold text-gray-800">
            {{ isEditing ? $t('clients.modal.edit') : $t('clients.modal.new') }}
          </DialogTitle>
        </DialogHeader>

        <form @submit.prevent="saveClient" class="grid grid-cols-2 gap-4 mt-2">
          <div class="col-span-2">
            <Label for="company_name" class="text-gray-700">{{ $t('clients.form.companyName') }} *</Label>
            <Input 
              id="company_name" 
              :model-value="formData.company_name ?? ''" 
              @update:model-value="value => formData.company_name = String(value)" 
              required 
              class="mt-1"
            />
          </div>
          <div class="col-span-2">
            <Label for="contact_name" class="text-gray-700">{{ $t('clients.form.contactName') }}</Label>
            <Input 
              id="contact_name" 
              :model-value="formData.contact_name ?? ''" 
              @update:model-value="value => formData.contact_name = value ? String(value) : null" 
              class="mt-1"
            />
          </div>
          <div>
            <Label for="email" class="text-gray-700">{{ $t('clients.form.email') }}</Label>
            <Input 
              id="email" 
              type="email" 
              :model-value="formData.email ?? ''" 
              @update:model-value="value => formData.email = value ? String(value) : null" 
              class="mt-1"
            />
          </div>
          <div>
            <Label for="phone" class="text-gray-700">{{ $t('clients.form.phone') }}</Label>
            <Input 
              id="phone" 
              :model-value="formData.phone ?? ''" 
              @update:model-value="value => formData.phone = value ? String(value) : null" 
              class="mt-1"
            />
          </div>
          <div>
            <Label for="street" class="text-gray-700">{{ $t('clients.form.street') }}</Label>
            <Input 
              id="street" 
              :model-value="formData.street ?? ''" 
              @update:model-value="value => formData.street = value ? String(value) : null" 
              class="mt-1"
            />
          </div>
          <div>
            <Label for="city" class="text-gray-700">{{ $t('clients.form.city') }}</Label>
            <Input 
              id="city" 
              :model-value="formData.city ?? ''" 
              @update:model-value="value => formData.city = value ? String(value) : null" 
              class="mt-1"
            />
          </div>
          <div>
            <Label for="state" class="text-gray-700">{{ $t('clients.form.state') }}</Label>
            <Input 
              id="state" 
              :model-value="formData.state ?? ''" 
              @update:model-value="value => formData.state = value ? String(value) : null" 
              class="mt-1"
            />
          </div>
          <div>
            <Label for="zip" class="text-gray-700">{{ $t('clients.form.zip') }}</Label>
            <Input 
              id="zip" 
              :model-value="formData.zip ?? ''" 
              @update:model-value="value => formData.zip = value ? String(value) : null" 
              class="mt-1"
            />
          </div>
          <div class="col-span-2 flex justify-end gap-4 mt-2 pt-4 border-t">
            <Button type="button" variant="outline" @click="showModal = false" class="rounded-lg">
              {{ $t('common.cancel') }}
            </Button>
            <Button type="submit" :loading="loading" class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              {{ $t('common.save') }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent class="bg-white max-w-md">
        <DialogHeader>
          <div class="flex flex-col items-center text-center mb-4">
            <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertTriangle class="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle class="text-xl font-semibold text-gray-800">{{ $t('clients.modal.deleteTitle') }}</DialogTitle>
            <DialogDescription class="text-gray-500 mt-2">
              {{ $t('clients.modal.deleteDescription') }}
            </DialogDescription>
          </div>
          <div v-if="clientToDelete" class="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <p class="font-medium text-gray-800">{{ clientToDelete.company_name }}</p>
            <p v-if="clientToDelete.contact_name" class="text-sm text-gray-500">{{ clientToDelete.contact_name }}</p>
          </div>
        </DialogHeader>
        <DialogFooter class="mt-6 pt-4 border-t flex gap-3 justify-center sm:justify-end">
          <Button type="button" variant="outline" @click="showDeleteDialog = false" class="rounded-lg min-w-24">
            {{ $t('common.cancel') }}
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            @click="deleteSelectedClient" 
            :disabled="loading" 
            class="rounded-lg min-w-24 bg-red-600 hover:bg-red-700"
          >
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ $t('common.delete') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
// Set dashboard layout
definePageMeta({
  layout: 'dashboard'
})

import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useSupabaseClient } from '#imports'
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, UserPlus, Pencil, User, Mail, Phone, MapPin, AlertCircle, X, Save, Loader2, Trash, AlertTriangle } from 'lucide-vue-next'
import type { Client, ClientFormData } from '~/types/client'
import { formatFullAddress } from '~/types/client'
import { useToast } from '@/components/ui/toast/use-toast'
import { saveClientToDatabase, fetchClients, deleteClient } from '@/services/clients'
import { ClientError } from '@/services/errors'

const { t } = useI18n()
const { toast } = useToast()
const authStore = useAuthStore()
const userId = computed(() => authStore.user?.id)

// State
const searchQuery = ref('')
const showModal = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const clientToDelete = ref<Client | null>(null)
const formErrors = ref<string[]>([])
const loading = ref(false)
const clients = ref<Client[]>([])
const error = ref<string | null>(null)

// Form data
const formData = ref<ClientFormData>({
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

// Computed
const filteredClients = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return clients.value.filter(client => 
    client.company_name.toLowerCase().includes(query) ||
    (client.contact_name?.toLowerCase().includes(query)) ||
    (client.email?.toLowerCase().includes(query)) ||
    (client.phone?.includes(query))
  )
})

const isDatabaseEmpty = computed(() => clients.value.length === 0)

// Methods
const loadClients = async () => {
  try {
    loading.value = true
    if (!userId.value) throw new Error('User not authenticated')
    clients.value = await fetchClients(userId.value)
  } catch (err) {
    logError('Error loading clients:', err)
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

const openClientModal = () => {
  isEditing.value = false
  formErrors.value = []
  formData.value = {
    company_name: '',
    contact_name: null,
    email: null,
    phone: null,
    street: null,
    city: null,
    state: null,
    zip: null,
    country: null
  }
  showModal.value = true
}

const editClient = (client: Client) => {
  isEditing.value = true
  formErrors.value = []
  formData.value = {
    id: client.id,
    company_name: client.company_name,
    contact_name: client.contact_name,
    email: client.email,
    phone: client.phone,
    street: client.street,
    city: client.city,
    state: client.state,
    zip: client.zip,
    country: client.country
  }
  showModal.value = true
}

const saveClient = async () => {
  try {
    if (!userId.value) {
      throw new Error('User not authenticated')
    }

    // Check for duplicates when creating a new client (not when editing)
    if (!isEditing.value) {
      const potentialDuplicate = clients.value.find(
        client => client.company_name.toLowerCase() === formData.value.company_name.toLowerCase()
      )
      
      if (potentialDuplicate) {
        toast({
          title: t('clients.messages.duplicateFound'),
          description: t('clients.messages.duplicateDescription'),
          variant: 'destructive'
        })
        return
      }
    }

    await saveClientToDatabase(formData.value, userId.value)
    showModal.value = false
    await loadClients()
    
    toast({
      title: t(isEditing.value ? 'clients.messages.updated' : 'clients.messages.created'),
      variant: 'default'
    })
  } catch (error) {
    logError('Error saving client:', error)
    
    if (error instanceof ClientError) {
      formErrors.value = [error.message]
      
      // Handle specific duplicate error from the server
      if (error.code === 'CLIENT_DUPLICATE') {
        toast({
          title: t('clients.messages.duplicateFound'),
          description: t('clients.messages.duplicateDescription'),
          variant: 'destructive'
        })
      } else {
        toast({
          title: t('errors.save.client'),
          description: error.message,
          variant: 'destructive'
        })
      }
    } else {
      formErrors.value = [t('errors.save.client')]
      toast({
        title: t('errors.save.client'),
        variant: 'destructive'
      })
    }
  }
}

const confirmDelete = (client: Client) => {
  clientToDelete.value = client
  showDeleteDialog.value = true
}

const deleteSelectedClient = async () => {
  if (!clientToDelete.value || !userId.value) return

  try {
    loading.value = true
    await deleteClient(clientToDelete.value.id, userId.value)
    showDeleteDialog.value = false
    clientToDelete.value = null
    await loadClients()

    toast({
      title: t('clients.messages.deleted'),
      variant: 'default'
    })
  } catch (error) {
    logError('Error deleting client:', error)
    toast({
      title: t('errors.delete.client'),
      variant: 'destructive'
    })
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  loadClients()
})
</script>