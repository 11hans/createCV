import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'

export class OfferNumberService {
  private supabase = useSupabaseClient<Database>()

  async getNextQuoteNumber(userId: string): Promise<string> {
    try {
      // Get the latest quote number for the user
      const { data: quotes } = await this.supabase
        .from('quotes')
        .select('number')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      // If no quotes exist, start with QF-0001
      if (!quotes || quotes.length === 0) {
        return 'QF-0001'
      }

      // Extract the number part and increment
      const lastNumber = quotes[0].number
      const numberPart = parseInt(lastNumber.split('-')[1])
      const nextNumber = numberPart + 1

      // Format with leading zeros
      return `QF-${nextNumber.toString().padStart(4, '0')}`
    } catch (error) {
      logError('Error generating next quote number:', error)
      throw error
    }
  }
} 