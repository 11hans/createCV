import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import fs from 'fs'
import path from 'path'

// Helper function for logging errors
function logError(message: string, error: any) {
  console.error(`[${new Date().toISOString()}] ${message}`, error)
  // Also log to file for production debugging
  try {
    const logDir = path.resolve(process.cwd(), 'logs')
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
    const errorLog = path.join(logDir, 'error.log')
    fs.appendFileSync(errorLog, `${new Date().toISOString()} - ${message} - ${JSON.stringify(error)}\n`)
  } catch (e) {
    console.error('Failed to write to error log:', e)
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Get the raw request body as a string
    const rawBody = await getRawBody(event)
    
    // Try to extract email from the raw body
    const email = extractEmailFromRawBody(rawBody)
    
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }
    
    // Simple validation
    if (!isValidEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email address format'
      })
    }
    
    // Create subscription data
    const subscriptionData = {
      email,
      is_active: true,
      subscription_date: new Date().toISOString(),
      source: 'website_footer',
      last_updated: new Date().toISOString()
    }
    
    // Try to save to Supabase
    let dbSuccess = false
    
    try {
      // Get Supabase client
      const client = await serverSupabaseClient(event)
      if (!client) {
        throw new Error('Failed to initialize Supabase client')
      }

      // Check if email already exists
      const { data: existingData, error: selectError } = await client
        .from('email_subscriptions')
        .select('id')
        .eq('email', email)
        .limit(1)
      
      if (selectError) {
        throw new Error(`Failed to check existing email: ${selectError.message}`)
      }

      if (existingData && existingData.length > 0) {
        dbSuccess = true
        logError('Email already exists:', { email })
      } else {
        // Insert the new record
        const { error: insertError } = await client
          .from('email_subscriptions')
          .insert([subscriptionData])
        
        if (insertError) {
          throw new Error(`Failed to insert email: ${insertError.message}`)
        } else {
          dbSuccess = true
        }
      }
    } catch (dbError) {
      logError('Database error:', dbError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save subscription to database'
      })
    }
    
    // Return success
    return {
      success: true,
      dbSaved: dbSuccess,
      message: dbSuccess ? 'Subscription saved successfully' : 'Failed to save subscription'
    }
  } catch (error: any) {
    logError('Newsletter subscription error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'An error occurred while processing your subscription'
    })
  }
})

// Helper function to get raw body
async function getRawBody(event: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    
    event.node.req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })
    
    event.node.req.on('end', () => {
      resolve(body)
    })
    
    event.node.req.on('error', (err: Error) => {
      reject(err)
    })
  })
}

// Helper function to extract email from raw body
function extractEmailFromRawBody(rawBody: string): string | null {
  // Try to extract from URL-encoded form data
  if (rawBody.includes('email=')) {
    const match = rawBody.match(/email=([^&]+)/)
    if (match && match[1]) {
      return decodeURIComponent(match[1])
    }
  }
  
  // Try to extract from JSON
  try {
    const jsonBody = JSON.parse(rawBody)
    if (jsonBody && jsonBody.email) {
      return jsonBody.email
    }
  } catch (e) {
    // Not JSON, continue
  }
  
  // Plain text email
  if (rawBody.includes('@') && isValidEmail(rawBody.trim())) {
    return rawBody.trim()
  }
  
  // Try to find any email-like pattern in the body
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const match = rawBody.match(emailRegex)
  if (match) {
    return match[0]
  }
  
  return null
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
} 