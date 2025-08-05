// types/errors.ts
export interface ValidationError {
    field: string
    message: string
    code?: string
  }
  
  export class QuoteValidationError extends Error {
    constructor(public errors: string[]) {
      super(errors.join(', '))
      this.name = 'QuoteValidationError'
    }
  }

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AppError extends Error {
  constructor(public code: string, message: string) {
    super(message)
    this.name = 'AppError'
  }
}