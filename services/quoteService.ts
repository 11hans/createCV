import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'
import type { 
  QuoteWithClient, 
  QuoteForm,
  Client,
  Quote
} from '~/types/database.types'
import { DatabaseError } from '~/types/errors'
import { safeGetUser } from '~/utils/supabase-auth'

export class QuoteService {
  private supabase = useSupabaseClient<Database>()

  /**
   * Get all quotes for the current user
   */
  async getAllQuotes() {
    try {
      // First ensure we have a valid session
      const { user, error: userError } = await safeGetUser()
      
      if (userError) {
        logError('Auth error in getAllQuotes:', userError.message)
        throw new DatabaseError('Authentication error: ' + userError.message)
      }
      
      if (!user) {
        throw new DatabaseError('User not authenticated')
      }
      
      // Use a simpler query approach without explicit foreign key names
      const { data, error } = await this.supabase
        .from('quotes')
        .select(`
          id,
          number,
          status,
          total,
          valid_until,
          created_at,
          updated_at,
          client_id
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw new DatabaseError(error.message)
      
      // If we have quotes, fetch the clients separately
      if (data && data.length > 0) {
        // Get unique client IDs
        const clientIds = [...new Set(data.map(quote => quote.client_id))]
        
        // Fetch clients
        const { data: clients, error: clientsError } = await this.supabase
          .from('clients')
          .select('id, company_name, email')
          .in('id', clientIds)
        
        if (clientsError) throw new DatabaseError(clientsError.message)
        
        // Create a map of clients by ID for quick lookup
        const clientMap = (clients || []).reduce((map, client) => {
          map[client.id] = client
          return map
        }, {} as Record<string, any>)
        
        // Join the data manually
        const quotesWithClients = data.map(quote => ({
          ...quote,
          client: clientMap[quote.client_id] || null
        }))
        
        return quotesWithClients
      }
      
      return data || []
    } catch (error) {
      logError('Error fetching quotes:', error)
      throw error
    }
  }

  async getQuote(id: string): Promise<Quote | null> {
    // Get the current user
    const { data: { user }, error: userError } = await this.supabase.auth.getUser()

    if (userError) {
      logError('Auth error in getQuote:', userError.message)
      throw userError
    }

    if (!user) {
      throw new Error('Not authenticated')
    }

    try {
      // Get the quote
      const { data: quote, error: quoteError } = await this.supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (quoteError) {
        logError('Error fetching quote:', quoteError)
        throw quoteError
      }

      if (!quote) {
        logError('Quote not found with ID:', id)
        return null
      }

      // Parse items from JSON string if needed
      let parsedItems = quote.items
      if (typeof quote.items === 'string') {
        try {
          parsedItems = JSON.parse(quote.items)
        } catch (e) {
          logError('Error parsing items:', e)
          parsedItems = []
        }
      } else if (!Array.isArray(quote.items)) {
        logError('Items is not an array or string:', quote.items)
        parsedItems = []
      }

      // Get the client
      let client = null
      if (quote.client_id) {
        const { data: clientData, error: clientError } = await this.supabase
          .from('clients')
          .select('*')
          .eq('id', quote.client_id)
          .eq('user_id', user.id)
          .single()

        if (clientError) {
          logError('Error fetching client:', clientError)
        } else if (!clientData) {
          logError('Client not found with ID:', quote.client_id)
        } else {
          client = clientData
        }
      }

      // Return the result with the client
      const result = {
        ...quote,
        items: parsedItems,
        client
      }

      return result
    } catch (error) {
      logError('Error fetching quote:', error)
      throw error
    }
  }

  // Přidáme chybějící metodu
  private async findOrCreateClient(client: QuoteForm['client'], userId: string): Promise<string> {
    // First check if a client with the same company name already exists (case insensitive)
    const { data: existingClient, error: searchError } = await this.supabase
      .from('clients')
      .select('id')
      .eq('user_id', userId)
      .ilike('company_name', client.company_name)
      .maybeSingle()

    if (searchError) {
      logError('Error searching for existing client:', searchError)
      throw searchError
    }

    if (existingClient) {
      log('Found existing client with ID:', existingClient.id)
      return existingClient.id
    }

    // If no existing client found, create a new one
    log('Creating new client:', client.company_name)
    const { data: newClient, error: clientError } = await this.supabase
      .from('clients')
      .insert({
        company_name: client.company_name,
        email: client.email,
        street: client.street,
        city: client.city,
        state: client.state,
        zip: client.zip,
        country: client.country,
        user_id: userId
      })
      .select('id')
      .single()

    if (clientError) {
      logError('Error creating client:', clientError)
      throw clientError
    }
    
    if (!newClient) {
      throw new Error('Failed to create client')
    }
    
    log('Created new client with ID:', newClient.id)
    return newClient.id
  }

  async saveQuoteWithClient(quote: QuoteForm, userId: string) {
    try {
      // Handle client - if client has an ID, use it directly, otherwise find or create
      let clientId: string;
      
      if (quote.client.id) {
        // Client already exists, use its ID
        clientId = quote.client.id;
      } else {
        // Find or create client
        clientId = await this.findOrCreateClient(quote.client, userId);
      }

      const { data, error } = await this.supabase
        .from('quotes')
        .insert({
          number: quote.number,
          client_id: clientId,
          items: quote.items,
          total: quote.total,
          subtotal: quote.subtotal,
          tax_total: quote.tax_total,
          tax_rate: quote.tax_rate,
          tax_included: quote.tax_included,
          valid_until: quote.valid_until,
          notes: quote.notes,
          issue_date: quote.issue_date,
          due_date: quote.due_date,
          status: quote.status || 'draft',
          user_id: userId,
        })
        .select()
        .single()

      if (error) throw new DatabaseError(error.message)
      return data
    } catch (error) {
      logError('Error saving quote:', error)
      throw error
    }
  }

  async updateQuote(quote: QuoteForm & { id: string, user_id: string }) {
    try {
      const { data, error } = await this.supabase
        .from('quotes')
        .update({
          number: quote.number,
          client_id: quote.client.id,
          items: quote.items,
          total: quote.total,
          subtotal: quote.subtotal,
          tax_total: quote.tax_total,
          tax_rate: quote.tax_rate,
          tax_included: quote.tax_included,
          valid_until: quote.valid_until,
          notes: quote.notes,
          issue_date: quote.issue_date,
          due_date: quote.due_date,
          status: quote.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', quote.id)
        .eq('user_id', quote.user_id)
        .select()
        .single()

      if (error) throw new DatabaseError(error.message)
      return data
    } catch (error) {
      logError('Error updating quote:', error)
      throw error
    }
  }
}