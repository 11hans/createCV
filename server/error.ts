import { H3Error } from 'h3'
import type { EventHandler } from 'h3'

export default defineEventHandler((event) => {
  const error = event.context.error as H3Error

  // Log error if in development
  if (process.env.NODE_ENV === 'development') {
    logError('Server Error:', error)
  }

  // Set response status
  setResponseStatus(event, error.statusCode || 500)

  // Return structured error response
  return {
    statusCode: error.statusCode || 500,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  }
})