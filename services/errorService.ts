// Core error types
export type AppErrorCode =
  | 'AUTH/UNAUTHORIZED'
  | 'VALIDATION/INVALID_INPUT'
  | 'I18N/MISSING_TRANSLATION'

export class AppError extends Error {
  constructor(
    public code: AppErrorCode,
    message: string,
    public meta?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Error normalization utilities
export const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) return error
  return new AppError('VALIDATION/INVALID_INPUT', 'Unknown error occurred')
}

import { useToast } from '@/components/ui/toast'

export class ErrorService {
  static handleError(error: unknown) {
    logError('Application error:', error)
    
    const { toast } = useToast()
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    })
    
    return errorMessage
  }

  static isQuoteError(error: unknown): error is Error {
    return error instanceof Error
  }
}