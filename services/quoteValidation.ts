import type { QuoteForm } from '~/types/database.types'
import type { ValidationError } from '~/types/errors'

export class QuoteValidation {
  validateQuote(quote: QuoteForm): string[] {
    const errors: string[] = []

    // Validate quote number
    if (!quote.number) {
      errors.push('Quote number is required')
    }

    // Validate client
    if (!quote.client.company_name) {
      errors.push('Client company name is required')
    }
    if (!quote.client.email) {
      errors.push('Client email is required')
    }

    // Validate items
    if (!quote.items || quote.items.length === 0) {
      errors.push('At least one item is required')
    } else {
      quote.items.forEach((item, index) => {
        if (!item.description) {
          errors.push(`Item ${index + 1}: Description is required`)
        }
        if (item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
        }
        if (item.unit_price < 0) {
          errors.push(`Item ${index + 1}: Unit price cannot be negative`)
        }
      })
    }

    // Validate dates
    if (!quote.issue_date) {
      errors.push('Issue date is required')
    }
    if (!quote.due_date) {
      errors.push('Due date is required')
    }

    return errors
  }
}