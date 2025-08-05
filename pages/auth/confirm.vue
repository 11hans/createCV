<script lang="ts">
definePageMeta({
  auth: false,
  meta: {
    public: true
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
    <div class="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
      <ClientOnly>
        <div v-if="!error && !processed">
          <div class="animate-spin h-8 w-8 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <h2 class="text-2xl font-bold mb-2">{{ $t('auth.verifyingEmail') }}</h2>
          <p class="text-gray-600">{{ $t('auth.pleaseWait') }}</p>
        </div>
        <div v-else-if="processed && !error">
          <div class="text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h2 class="text-2xl font-bold mb-2">{{ $t('auth.verificationSuccessful') }}</h2>
            <p class="text-gray-600">{{ $t('auth.accountVerified') }}</p>
            <NuxtLink 
              to="/auth/login?email_confirmed=true"
              class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              {{ $t('auth.proceedToLogin') }}
            </NuxtLink>
          </div>
        </div>
        <div v-else>
          <div class="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2">{{ $t('auth.verificationFailed') }}</h2>
            <p class="text-gray-600">{{ error }}</p>
            <button 
              v-if="showResend"
              @click="handleResendConfirmation"
              :disabled="isLoading"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
            >
              {{ isLoading ? $t('auth.sending') : $t('auth.resendConfirmation') }}
            </button>
            <div v-else class="mt-4">
              <NuxtLink 
                to="/auth/login"
                class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                {{ $t('auth.backToLogin') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast'
import { useRoute, useRouter } from '#imports'
import { useSupabaseClient } from '#imports'
import type { EmailOtpType } from '@supabase/supabase-js'

const route = useRoute()
const router = useRouter()
const client = useSupabaseClient()
const { toast } = useToast()
const config = useRuntimeConfig()

const error = ref<string | null>(null)
const isLoading = ref(false)
const showResend = ref(false)
const processed = ref(false)

// Function to handle email verification
const handleEmailVerification = async () => {
  try {
    console.info('Confirm page loaded with URL:', window.location.href)
    console.info('Query parameters:', route.query)
    console.info('NOTE: Make sure you have added this domain to the allowed redirect URLs in your Supabase project settings (Auth > URL Configuration > Redirect URLs)')
    
    // We expect the middleware to handle the actual token verification
    // This is a fallback in case the middleware didn't run
    const token_hash = route.query.token_hash as string
    const type = route.query.type as EmailOtpType
    
    // When we arrive from email link directly to this page
    if (token_hash && type) {
      // Store email for potential resend
      if (route.query.email) {
        window.localStorage.setItem('confirmEmail', route.query.email as string)
      }

      const { error: verifyError } = await client.auth.verifyOtp({
        token_hash,
        type,
        options: {
          redirectTo: `${config.public.siteUrl}/auth/login?email_confirmed=true`
        }
      })

      if (verifyError) {
        error.value = verifyError.message
        logError('Verification error details:', JSON.stringify(verifyError))
        showResend.value = verifyError.message?.toLowerCase().includes('expired')
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: error.value
        })
        processed.value = true
        return
      }

      processed.value = true
      toast({
        title: "Success",
        description: "Email verified successfully"
      })

      // Check if user is authenticated after verification
      const { data: { user } } = await client.auth.getUser()
      
      // If authenticated, go to dashboard, otherwise to login
      if (user) {
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setTimeout(() => {
          router.push('/auth/login?email_confirmed=true')
        }, 2000)
      }
    } else {
      // No token hash, the user may have navigated here directly
      error.value = 'Invalid verification link. Please check your email for the correct link.'
      processed.value = true
    }
  } catch (err: any) {
    logError('Verification error:', err)
    error.value = err.message
    showResend.value = true
    processed.value = true
    toast({
      variant: "destructive",
      title: "Error",
      description: err.message
    })
  }
}

onMounted(handleEmailVerification)

const handleResendConfirmation = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    
    const email = window.localStorage.getItem('confirmEmail')
    if (!email) {
      throw new Error('Email not found')
    }

    // Use the runtime config's siteUrl for consistency
    const redirectUrl = `${config.public.siteUrl}/api/auth/confirm`

    const { error: resendError } = await client.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    })

    if (resendError) throw resendError

    toast({
      title: "Success",
      description: "New confirmation email sent"
    })

  } catch (err: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: err.message
    })
  } finally {
    isLoading.value = false
  }
}
</script>