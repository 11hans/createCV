import { z } from 'zod'

// Define environment schema
export const envSchema = z.object({
  // Required variables with defaults for development
  SUPABASE_URL: z.string().url().default('http://localhost:54321'),
  SUPABASE_ANON_KEY: z.string().min(1),
  
  // Optional variables
  RESEND_API_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables
export function validateEnv(): Env {
  try {
    // Get runtime config
    const config = useRuntimeConfig()
    
    // Parse with runtime config values
    const parsed = envSchema.safeParse({
      SUPABASE_URL: config.public.supabase.url,
      SUPABASE_ANON_KEY: config.public.supabase.key,
      RESEND_API_KEY: config.resendApiKey,
      NODE_ENV: process.env.NODE_ENV
    })

    if (!parsed.success) {
      // In development, use defaults
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Using development defaults for environment variables')
        return envSchema.parse({})
      }
      
      logError('❌ Invalid environment variables:', parsed.error.format())
      throw new Error('Invalid environment variables')
    }

    return parsed.data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Using development defaults for environment variables')
      return envSchema.parse({})
    }
    
    logError('❌ Error validating environment variables:', error)
    throw error
  }
} 