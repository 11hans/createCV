import { defineStore } from 'pinia'
import type { QuoteStore, QuoteState } from './types'
import type { QuoteForm } from '~/types/database.types'
import type { DatabaseQuoteItem, QuoteItemForm, QuoteItemJSON } from '~/types/quote'
import { mapQuoteItemToForm, mapFormToQuoteItem } from '~/types/quote'  // přidáme i mapFormToQuoteItem
import { QuoteValidation } from '~/services/quoteValidation'
import { ErrorService } from '~/services/errorService'
import { QuoteValidationError } from '~/types/errors'
import { ClientService } from '~/services/clientService'
import { QuoteService } from '~/services/quoteService'
import { OfferNumberService } from '~/services/offerNumberService'
import { useProfileStore } from '~/stores/profile'
import { mapProfileToFormData } from '~/types/profile'
import { useQuoteFormLogic } from '~/composables/useQuoteFormLogic'
import { useAuth } from '~/composables/useAuth'

export const useQuoteStore = defineStore('quote', {
  state: (): QuoteState => ({
    company: {
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
    },
    client: {
      id: undefined,
      company_name: '',
      contact_name: null,
      email: null,
      phone: null,
      street: null,
      city: null,
      state: null,
      zip: null,
      country: null
    },
    terms: {
      number: '',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      note: ''
    },
    items: [] as QuoteItemForm[],
    currentStep: 1,
    steps: ['personal', 'client', 'items', 'terms', 'review'],
    taxRate: 21,
    taxIncluded: false,
    _taxTotalOverride: null as number | null,
    termsHeader: null,
    instructions: null
  }),

  getters: {
    subtotal(): number {
      const { calculateNetPrice } = useQuoteFormLogic()
      return this.items.reduce((sum, item) => 
        sum + calculateNetPrice(item), 0)
    },
  
    taxTotal(): number {
      if (this._taxTotalOverride !== null) {
        return this._taxTotalOverride;
      }
      
      const { calculateActualTax } = useQuoteFormLogic()
      return this.items.reduce((sum, item) => 
        sum + calculateActualTax(item), 0)
    },

    total(): number {
      if (this.taxIncluded) {
        return this.subtotal + this.taxTotal;
      }
      return this.subtotal;
    }
  },

  actions: {
    getQuoteData(): QuoteForm {
      return {
        number: this.terms.number,
        client: {
          id: this.client.id,
          company_name: this.client.company_name,
          email: this.client.email,
          street: this.client.street,
          city: this.client.city,
          state: this.client.state,
          zip: this.client.zip,
          country: this.client.country
        },
        items: this.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          tax_rate: item.taxRate,
          price_includes_tax: item.priceIncludesTax,
          is_tax_exempt: item.isTaxExempt,
          price: item.price,
          amount: item.amount
        })),
        total: this.total,
        subtotal: this.subtotal,
        tax_total: this.taxTotal,
        tax_rate: this.taxRate,
        tax_included: this.taxIncluded,
        valid_until: this.terms.dueDate instanceof Date ? this.terms.dueDate.toISOString() : this.terms.dueDate,
        notes: this.terms.note,
        issue_date: this.terms.issueDate instanceof Date ? this.terms.issueDate.toISOString() : this.terms.issueDate,
        due_date: this.terms.dueDate instanceof Date ? this.terms.dueDate.toISOString() : this.terms.dueDate
      }
    },

    updateCompany(company: QuoteState['company']) {
      this.company = company
    },

    updateClient(client: QuoteState['client']) {
      this.client = client
    },

    updateItems(items: QuoteItemForm[]) {
      log('Updating items in store:', items)
      // Create a deep copy to avoid reference issues
      this.items = JSON.parse(JSON.stringify(items))
    },

    updateTerms(terms: QuoteState['terms']) {
      this.terms = terms
    },

    nextStep() {
      log('Moving to next step, current step:', this.currentStep)
      log('Current items in store before step change:', this.items)
      
      // Save current items to ensure they're preserved between steps
      const currentItems = JSON.parse(JSON.stringify(this.items))
      
      if (this.currentStep < this.steps.length + 1) {
        // Only try to load profile in authenticated mode
        if (this.currentStep === 4 && !window.location.pathname.startsWith('/public/')) {
          const profileStore = useProfileStore()
          profileStore.fetchProfile().then(() => {
            if (profileStore.profile) {
              this.updateCompany({
                email: profileStore.profile.email || '',
                name: profileStore.profile.name || '',
                street: profileStore.profile.street || '',
                city: profileStore.profile.city || '',
                state: profileStore.profile.state || '',
                zip: profileStore.profile.zip || '',
                country: profileStore.profile.country || '',
                tax_id: profileStore.profile.tax_id || '',
                is_tax_payer: false,
                tax_number: ''
              })
            }
            this.currentStep++
            
            // Ensure items are preserved after step change
            if (currentItems.length > 0 && this.items.length === 0) {
              this.items = currentItems
            }
            
            log('Moved to next step:', this.currentStep)
            log('Items after step change:', this.items)
          }).catch((error) => {
            logError('Error loading profile:', error)
            // Continue to next step even if profile loading fails
            this.currentStep++
            
            // Ensure items are preserved after step change
            if (currentItems.length > 0 && this.items.length === 0) {
              this.items = currentItems
            }
            
            log('Moved to next step (after error):', this.currentStep)
            log('Items after step change:', this.items)
          })
        } else {
          this.currentStep++
          
          // Ensure items are preserved after step change
          if (currentItems.length > 0 && this.items.length === 0) {
            this.items = currentItems
          }
          
          log('Moved to next step:', this.currentStep)
          log('Items after step change:', this.items)
        }
      }
    },

    previousStep() {
      log('Moving to previous step, current step:', this.currentStep)
      log('Current items in store before step change:', this.items)
      
      // Save current items to ensure they're preserved between steps
      const currentItems = JSON.parse(JSON.stringify(this.items))
      
      if (this.currentStep > 1) {
        this.currentStep--
        
        // Ensure items are preserved after step change
        if (currentItems.length > 0 && this.items.length === 0) {
          this.items = currentItems
        }
        
        log('Moved to previous step:', this.currentStep)
        log('Items after step change:', this.items)
      }
    },

    setStep(step: number) {
      if (step >= 1 && step <= this.steps.length) {
        this.currentStep = step
      }
    },

    async resetForm() {
      log('Resetting form')
      
      // First reset all state to initial values
      this.$reset()
      
      // Initialize with empty state
      this.company = {
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
      }
      
      this.client = {
        id: undefined,
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
      
      this.terms = {
        number: '',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        note: ''
      }
      
      // Initialize termsHeader
      this.termsHeader = null
      
      // Initialize instructions
      this.instructions = null
      
      // Initialize with a default empty item
      const defaultItem = {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        price: 0,
        amount: 0,
        taxRate: 21,
        priceIncludesTax: false,
        isTaxExempt: false,
        sortOrder: 0
      }
      
      // Set items to a single empty item
      this.items = [defaultItem]
      log('Items after reset in store:', this.items)
      
      // Reset tax settings
      this.taxRate = 21
      this.taxIncluded = false
      this.currentStep = 1
      
      try {
        const { user } = useAuth()
        if (user.value) {
          // Get the next quote number
          const offerNumberService = new OfferNumberService()
          const nextNumber = await offerNumberService.getNextQuoteNumber(user.value.id)
          this.terms.number = nextNumber
        }
      } catch (error) {
        logError('Error fetching next quote number:', error)
        // Set fallback values if the service fails
        this.terms.number = 'QF-0001'
      }
    },

    async loadQuote(id: string) {
      try {
        log('Loading quote with ID:', id)
        const quoteService = new QuoteService()
        const quote = await quoteService.getQuote(id)
        
        if (!quote) {
          logError('Quote not found with ID:', id)
          throw new Error('Quote not found')
        }
        
        log('Quote loaded successfully:', quote)
        
        // Load profile data for company info
        const profileStore = useProfileStore()
        await profileStore.fetchProfile()
        
        // Update company info from profile
        if (profileStore.profile) {
          this.company = {
            email: profileStore.profile.email || '',
            name: profileStore.profile.name || '',
            street: profileStore.profile.street || '',
            city: profileStore.profile.city || '',
            state: profileStore.profile.state || '',
            zip: profileStore.profile.zip || '',
            country: profileStore.profile.country || '',
            tax_id: profileStore.profile.tax_id || '',
            is_tax_payer: false,
            tax_number: ''
          }
        }
        
        // Update client info
        this.updateClient({
          id: quote.client?.id,
          company_name: quote.client?.company_name || 'Unknown Client',
          contact_name: quote.client?.contact_name || null,
          email: quote.client?.email || null,
          phone: quote.client?.phone || null,
          street: quote.client?.street || null,
          city: quote.client?.city || null,
          state: quote.client?.state || null,
          zip: quote.client?.zip || null,
          country: quote.client?.country || null
        })

        // Set tax settings from quote
        this.taxRate = quote.tax_rate || 21
        this.taxIncluded = quote.tax_included || false

        // Update items from JSON field with tax settings
        log('Processing quote items:', quote.items)
        
        let items = []
        if (Array.isArray(quote.items)) {
          items = quote.items
        } else if (quote.items && typeof quote.items === 'string') {
          try {
            items = JSON.parse(quote.items)
          } catch (e) {
            logError('Error parsing items JSON:', e)
            items = []
          }
        } else {
          console.warn('Quote items is not an array or string:', quote.items)
          items = []
        }
        
        const mappedItems = items.map((item: any) => ({
          id: item.id || crypto.randomUUID(),
          description: item.description || '',
          quantity: item.quantity || 1,
          unitPrice: item.unit_price || 0,
          price: item.price || (item.quantity * item.unit_price) || 0,
          amount: item.amount || (item.quantity * item.unit_price) || 0,
          taxRate: this.taxRate, // Use the quote's tax rate
          priceIncludesTax: this.taxIncluded, // Use the quote's tax included setting
          isTaxExempt: item.is_tax_exempt || false,
          sortOrder: item.sort_order ?? undefined
        }))
        
        log('Mapped items:', mappedItems)
        this.updateItems(mappedItems)
        
        // Update terms with all available fields including tax
        this.updateTerms({
          number: quote.number || '',
          issueDate: quote.issue_date || new Date().toISOString(),
          dueDate: quote.due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          validUntil: quote.valid_until || quote.due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          note: quote.notes || '',
          status: quote.status || 'draft',
          subtotal: quote.subtotal || 0,
          total: quote.total || 0,
          taxTotal: quote.tax_total || 0
        })

        return quote
      } catch (error) {
        logError('Error loading quote:', error)
        throw error
      }
    },

    async saveQuote(userId: string) {
      try {
        const validator = new QuoteValidation()
        const errors = validator.validateQuote(this.getQuoteData())
        
        if (errors.length > 0) {
          throw new QuoteValidationError(errors)
        }
    
        const quoteService = new QuoteService()
        const savedQuote = await quoteService.saveQuoteWithClient(this.getQuoteData(), userId)
        return savedQuote
      } catch (error) {
        if (error instanceof QuoteValidationError) {
          throw error
        }
        ErrorService.handleError(error)
      }
    },

    async updateQuote(quoteId: string, userId: string) {
      try {
        const validator = new QuoteValidation()
        const errors = validator.validateQuote(this.getQuoteData())
        
        if (errors.length > 0) {
          throw new QuoteValidationError(errors)
        }
    
        const quoteService = new QuoteService()
        const updatedQuote = await quoteService.updateQuote({
          ...this.getQuoteData(),
          id: quoteId,
          user_id: userId
        })
        return updatedQuote
      } catch (error) {
        if (error instanceof QuoteValidationError) {
          throw error
        }
        ErrorService.handleError(error)
      }
    },

    async saveClient(userId: string): Promise<QuoteState['client']> {
      try {
        const clientService = new ClientService()
        const dbClient = await clientService.createClient({
          company_name: this.client.company_name,
          contact_name: this.client.contact_name,
          email: this.client.email,
          phone: this.client.phone,
          street: this.client.street,
          city: this.client.city,
          state: this.client.state,
          zip: this.client.zip,
          country: this.client.country
        }, userId)
        
        this.updateClient({
          ...this.client,
          id: dbClient.id
        })

        return this.client
      } catch (error) {
        ErrorService.handleError(error)
        throw error
      }
    },

    // Add a method to clear the form data when abandoning quote creation
    clearFormData() {
      log('Clearing all form data completely')
      
      // Reset to initial state
      this.$reset()
      
      // Initialize with empty state
      this.company = {
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
      }
      
      this.client = {
        id: undefined,
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
      
      this.terms = {
        number: '',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        note: ''
      }
      
      // Initialize with a default empty item instead of clearing completely
      const defaultItem = {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        price: 0,
        amount: 0,
        taxRate: 21,
        priceIncludesTax: false,
        isTaxExempt: false,
        sortOrder: 0
      }
      
      // Set items to a single empty item
      this.items = [defaultItem]
      log('Items after clearFormData:', this.items)
      
      // Reset tax settings
      this.taxRate = 21
      this.taxIncluded = false
      this.currentStep = 1
      this._taxTotalOverride = null
      
      // Also clear any localStorage data if we're in the browser
      if (process.client) {
        try {
          // Clear any keys that might be related to quotes
          const keysToRemove = [
            'quoteItems',
            'quoteForm',
            'quoteCompany',
            'quoteClient',
            'quoteTerms',
            'quoteState',
            'clientForm',
            'quoteItems_new',
            'personalInfoForm'
          ]
          
          keysToRemove.forEach(key => {
            localStorage.removeItem(key)
          })
          
          // Also try to clear any dynamically generated keys
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && (key.startsWith('quote') || key.includes('client') || key.includes('form') || key.includes('personal'))) {
              localStorage.removeItem(key)
            }
          }
          
          // Clear sessionStorage flags
          sessionStorage.removeItem('onQuoteCreationPage')
          sessionStorage.removeItem('quotePageBlurTime')
          sessionStorage.removeItem('isSwitchingWindows')
          
          log('Cleared all quote-related localStorage and sessionStorage data')
        } catch (e) {
          logError('Error clearing localStorage:', e)
        }
      }
    },
    
    // Add a method to persist quote data to localStorage
    persistQuoteData() {
      if (process.client) {
        try {
          // Save the current state to localStorage
          localStorage.setItem('quoteCompany', JSON.stringify(this.company))
          localStorage.setItem('quoteClient', JSON.stringify(this.client))
          localStorage.setItem('quoteTerms', JSON.stringify({
            ...this.terms,
            // Convert dates to ISO strings for storage
            issueDate: this.terms.issueDate instanceof Date ? this.terms.issueDate.toISOString() : this.terms.issueDate,
            dueDate: this.terms.dueDate instanceof Date ? this.terms.dueDate.toISOString() : this.terms.dueDate
          }))
          localStorage.setItem('quoteItems', JSON.stringify(this.items))
          localStorage.setItem('quoteState', JSON.stringify({
            currentStep: this.currentStep,
            taxRate: this.taxRate,
            taxIncluded: this.taxIncluded,
            termsHeader: this.termsHeader,
            instructions: this.instructions
          }))
          
          // Also set a flag in sessionStorage to indicate we're on the quote creation page
          // This will help us detect if we're returning to this page after switching windows
          sessionStorage.setItem('onQuoteCreationPage', 'true')
          
          log('Persisted quote data to localStorage and sessionStorage')
        } catch (e) {
          logError('Error persisting quote data to localStorage:', e)
        }
      }
    },
    
    // Add a method to restore quote data from localStorage
    restoreQuoteData() {
      if (process.client) {
        try {
          // Check if we have data to restore
          const companyData = localStorage.getItem('quoteCompany')
          const clientData = localStorage.getItem('quoteClient')
          const termsData = localStorage.getItem('quoteTerms')
          const itemsData = localStorage.getItem('quoteItems')
          const stateData = localStorage.getItem('quoteState')
          
          if (companyData) {
            this.company = JSON.parse(companyData)
          }
          
          if (clientData) {
            this.client = JSON.parse(clientData)
          }
          
          if (termsData) {
            const parsedTerms = JSON.parse(termsData)
            // Convert ISO date strings back to Date objects
            if (parsedTerms.issueDate) {
              parsedTerms.issueDate = new Date(parsedTerms.issueDate)
            }
            if (parsedTerms.dueDate) {
              parsedTerms.dueDate = new Date(parsedTerms.dueDate)
            }
            this.terms = parsedTerms
          }
          
          if (itemsData) {
            this.items = JSON.parse(itemsData)
          }
          
          if (stateData) {
            const parsedState = JSON.parse(stateData)
            this.currentStep = parsedState.currentStep || 1
            this.taxRate = parsedState.taxRate || 21
            this.taxIncluded = parsedState.taxIncluded || false
            this.termsHeader = parsedState.termsHeader || null
            this.instructions = parsedState.instructions || null
          }
          
          log('Restored quote data from localStorage')
          return true
        } catch (e) {
          logError('Error restoring quote data from localStorage:', e)
          return false
        }
      }
      return false
    }
  }
})