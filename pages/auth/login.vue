<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4">
    <div class="w-full max-w-md space-y-8 bg-white rounded-xl shadow-lg p-8">
      <!-- Logo and Title -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          {{ t('auth.welcome') }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ t('auth.loginDescription') }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="auth-form space-y-6">
        <!-- Error and Success Messages -->
        <div v-if="errorMsg || successMsg" class="mb-4">
          <div v-if="errorMsg" class="p-3 rounded-md bg-red-50 text-sm text-red-600" role="alert">
            <p>{{ errorMsg }}</p>
             <button
              v-if="needsEmailConfirmation"
              @click="handleResendConfirmation"
              :disabled="isLoading"
              class="mt-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? t('auth.sending') : t('auth.resendConfirmation') }}
            </button>
          </div>
           <div v-if="successMsg" class="p-3 rounded-md bg-green-50 text-sm text-green-600" role="alert">
            {{ successMsg }}
          </div>
        </div>

        <div class="space-y-4">
          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label" for="email">{{ t('auth.email') }}</label>
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              required
              class="form-input"
              :placeholder="t('auth.emailPlaceholder')"
              :disabled="isLoading"
            />
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label" for="password">{{ t('auth.password') }}</label>
             <div class="relative">
              <input
                v-model="password"
                id="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                required
                class="form-input pr-10"
                :placeholder="t('auth.passwordPlaceholder')"
                :disabled="isLoading"
              />
               <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                :disabled="isLoading"
              >
                 <svg
                  class="h-5 w-5"
                  :style="{ display: showPassword ? 'block' : 'none' }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                 <svg
                  class="h-5 w-5"
                  :style="{ display: showPassword ? 'none' : 'block' }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Remember me and Forgot password -->
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center">
            <input
              v-model="rememberMe"
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :disabled="isLoading"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              {{ t('auth.rememberMe') }}
            </label>
          </div>

          <div class="text-sm">
            <NuxtLink 
              to="/auth/forgot-password" 
              class="font-medium text-blue-600 hover:text-blue-500"
              :class="{ 'pointer-events-none opacity-50': isLoading }"
            >
              {{ t('auth.forgotPassword') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-6">
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="auth-submit-btn"
          >
            {{ isLoading ? t('auth.loading') : t('auth.signIn') }}
          </button>
        </div>

        <!-- Sign up link -->
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.noAccount') }}
          <NuxtLink
            to="/auth/register"
            class="font-medium text-blue-600 hover:text-blue-500"
            :class="{ 'pointer-events-none opacity-50': isLoading }"
          >
            {{ t('auth.signUp') }}
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'nuxt/app'
import { useToast } from '@/components/ui/toast'
import { useSupabaseClient, useI18n } from '#imports'
import { safeSignIn } from '~/utils/supabase-auth'

const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient()
const { toast } = useToast()
const { t } = useI18n()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const needsEmailConfirmation = ref(false)

// Validation
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const isFormValid = computed(() => {
  return isEmailValid.value && password.value.length >= 6
})

// Watch for error changes to handle email confirmation state
watch(errorMsg, (newError) => {
  needsEmailConfirmation.value = newError?.includes('Email not confirmed') || false
})

// Separate function to check for existing session and confirmation status
const checkSession = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error && error.name !== 'AuthSessionMissingError') {
        throw error;
    }

      if (user) {
        await router.replace('/dashboard')
        return
    }


    if (route.query.email_confirmed) {
      toast({
        title: t('auth.emailVerified'),
        description: t('auth.emailVerifiedMessage'),
        duration: 5000,
      })
      await router.replace({ path: '/auth/login', query: {} })
    }
    if (route.query.reset_success) {
      toast({
        title: t('auth.passwordReset'),
        description: t('auth.passwordResetMessage'),
        duration: 5000,
      })
        await router.replace({ path: '/auth/login', query: {} })
    }
  } catch (error: any) {
    logError('Session check error:', error)
    toast({
      variant: "destructive",
      title: t('auth.error'),
      description: t('auth.sessionCheckError'),
      duration: 5000,
    });
  }
};

type ErrorMessages = 'Email not confirmed' | 'Invalid login credentials'
type ErrorHandlers = Record<ErrorMessages, () => void>

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    isLoading.value = true
    errorMsg.value = ''
    successMsg.value = ''
    
    // Use our safer sign in method
    const { data, error } = await safeSignIn(email.value, password.value)

    if (error) {
      const errorHandlers: ErrorHandlers = {
        'Email not confirmed': () => {
          errorMsg.value = t('auth.emailNotConfirmed');
          needsEmailConfirmation.value = true;
          toast({
            variant: "destructive",
            title: t('auth.emailNotConfirmedTitle'),
            description: t('auth.emailNotConfirmedMessage'),
            duration: 10000,
          })
        },
        'Invalid login credentials': () => {
          errorMsg.value = t('auth.invalidCredentials');
          toast({
            variant: "destructive",
            title: t('auth.loginFailed'),
            description: t('auth.invalidCredentials'),
            duration: 5000,
          });
        }
      }

      if (error.message in errorHandlers) {
        errorHandlers[error.message as ErrorMessages]();
        return;
      }

      errorMsg.value = error.message || t('auth.genericError')
      toast({
        variant: "destructive",
        title: t('auth.loginFailed'),
        description: errorMsg.value,
        duration: 5000,
      })
      return;
    }

    if (data?.user) {
      toast({
        title: t('auth.welcome'),
        description: t('auth.loginSuccessMessage'),
        duration: 3000,
      })
      await router.replace('/dashboard')
    }
  } catch (error: any) {
    logError('Login error:', error)
    errorMsg.value = error.message || t('auth.genericError')
    toast({
      variant: "destructive",
      title: t('auth.loginFailed'),
      description: errorMsg.value,
      duration: 5000,
    })
  } finally {
    isLoading.value = false
    return
  }
}

const handleResendConfirmation = async () => {
  if(isLoading.value) return

  try {
    isLoading.value = true;
      const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email.value,
          options: {
              emailRedirectTo: `${process.client ? window.location.origin : useRuntimeConfig().public.siteUrl}/auth/callback?next=/auth/login`
          }
        })

      if (resendError) {
          logError('Error resending confirmation:', resendError);
          toast({
              variant: "destructive",
              title: t('auth.error'),
              description: resendError.message || t('auth.errorResendingEmail'),
              duration: 5000,
          });
          return
      }

      toast({
        title: t('auth.confirmationEmailResent'),
        description: t('auth.checkYourEmail'),
        duration: 5000,
      })
    } catch (err: any) {
      logError('Error resending confirmation:', err);
      toast({
          variant: "destructive",
          title: t('auth.error'),
          description: err.message || t('auth.errorResendingEmail'),
        duration: 5000,
      })
    } finally {
        isLoading.value = false
    }
}

// Mount hook
onMounted(() => {
  checkSession()
})
</script>