<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4">
    <div class="w-full max-w-md space-y-8 bg-white rounded-xl shadow-lg p-8">
      <!-- Logo and Title -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          {{ $t('auth.createAccount') }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ $t('auth.registerDescription') }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="auth-form space-y-6">
        <!-- Error and Success Messages -->
        <div v-if="errorMsg || successMsg" class="mb-4">
          <div v-if="errorMsg" class="p-3 rounded-md bg-red-50 text-sm text-red-600" role="alert">
            {{ errorMsg }}
          </div>
          <div v-if="successMsg" class="p-3 rounded-md bg-green-50 text-sm text-green-600" role="alert">
            {{ successMsg }}
          </div>
        </div>

        <div class="space-y-4">
          <!-- Name Field -->
          <div class="form-group">
            <label class="form-label" for="name">{{ $t('auth.name') }}</label>
            <input
              v-model="name"
              id="name"
              name="name"
              type="text"
              required
              class="form-input"
              :placeholder="$t('auth.namePlaceholder')"
              :disabled="isLoading"
            />
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label" for="email">{{ $t('auth.email') }}</label>
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              required
              class="form-input"
              :placeholder="$t('auth.emailPlaceholder')"
              :disabled="isLoading"
            />
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label" for="password">{{ $t('auth.password') }}</label>
            <div class="relative">
              <input
                v-model="password"
                id="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                required
                class="form-input pr-10"
                :placeholder="$t('auth.passwordPlaceholder')"
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
                  :class="{ 'hidden': !showPassword, 'block': showPassword }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg
                  class="h-5 w-5"
                  :class="{ 'hidden': showPassword, 'block': !showPassword }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-group">
            <label class="form-label" for="confirmPassword">{{ $t('auth.confirmPassword') }}</label>
            <div class="relative">
              <input
                v-model="confirmPassword"
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                name="confirmPassword"
                required
                class="form-input pr-10"
                :placeholder="$t('auth.confirmPasswordPlaceholder')"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                :disabled="isLoading"
              >
                <svg
                  class="h-5 w-5"
                  :class="{ 'hidden': !showConfirmPassword, 'block': showConfirmPassword }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg
                  class="h-5 w-5"
                  :class="{ 'hidden': showConfirmPassword, 'block': !showConfirmPassword }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Password match indicator -->
          <div v-if="confirmPassword" class="text-sm">
            <p :class="password === confirmPassword ? 'text-green-600' : 'text-red-600'">
              {{ password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match' }}
            </p>
          </div>

          <!-- Password Requirements -->
          <ClientOnly>
            <div v-if="password.length > 0" class="space-y-2">
              <div class="text-sm font-medium text-gray-700">{{ $t('auth.passwordRequirements') }}:</div>
              <div class="grid grid-cols-1 gap-2">
                <div v-for="(requirement, index) in passwordRequirements" :key="index"
                  class="flex items-center space-x-2 text-sm"
                  :class="requirement.met ? 'text-green-600' : 'text-gray-500'"
                >
                  <span v-if="requirement.met" class="flex-shrink-0">✓</span>
                  <span v-else class="flex-shrink-0">·</span>
                  <span>{{ requirement.text }}</span>
                </div>
              </div>
            </div>
          </ClientOnly>

          <!-- Terms Checkbox -->
          <div class="form-group">
            <div class="flex items-start">
              <input
                v-model="acceptTerms"
                id="accept-terms"
                name="accept-terms"
                type="checkbox"
                required
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                :disabled="isLoading"
              />
              <label for="accept-terms" class="ml-2 block text-sm text-gray-700">
                {{ $t('auth.acceptTerms') }}
                <button 
                  type="button"
                  @click="showTermsModal = true"
                  class="font-medium text-blue-600 hover:text-blue-500"
                  :class="{ 'pointer-events-none opacity-50': isLoading }"
                >
                  {{ $t('auth.termsAndConditions') }}
                </button>
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-6">
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="auth-submit-btn"
          >
            {{ isLoading ? $t('auth.loading') : $t('auth.signUp') }}
          </button>
        </div>

        <!-- Sign In Link -->
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.haveAccount') }}
          <NuxtLink
            to="/auth/login"
            class="font-medium text-blue-600 hover:text-blue-500"
            :class="{ 'pointer-events-none opacity-50': isLoading }"
          >
            {{ $t('auth.signIn') }}
          </NuxtLink>
        </p>
      </form>

      <!-- Terms Modal -->
      <TermsModal :is-open="showTermsModal" @close="showTermsModal = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'nuxt/app'
import { useToast } from '@/components/ui/toast'
import { useSupabaseClient, useI18n } from '#imports'
import { useNuxtApp } from '#app'
import TermsModal from '@/components/TermsModal.vue'

const router = useRouter()
const supabase = useSupabaseClient()
const { toast } = useToast()
const { t } = useI18n()
const { $i18n } = useNuxtApp()

// Form state
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Password requirements
const passwordRequirements = computed(() => [
  {
    text: t('auth.minLength'),
    met: password.value.length >= 8
  },
  {
    text: t('auth.hasNumber'),
    met: /\d/.test(password.value)
  },
  {
    text: t('auth.hasLetter'),
    met: /[a-zA-Z]/.test(password.value)
  },
  {
    text: t('auth.hasSpecial'),
    met: /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
  }
])

// Form validation
const isPasswordValid = computed(() => 
  passwordRequirements.value.every(req => req.met)
)

const isFormValid = computed(() => 
  name.value.length > 0 &&
  email.value.length > 0 &&
  isPasswordValid.value &&
  password.value === confirmPassword.value &&
  acceptTerms.value
)

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  try {
    isLoading.value = true
    errorMsg.value = ''
    successMsg.value = ''

    // Store email for potential resend
    if (process.client) {
      window.localStorage.setItem('confirmEmail', email.value)
    }

    // Get the site URL from runtime config
    const currentDomain = $i18n.differentDomains ? window.location.origin : useRuntimeConfig().public.siteUrl

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value,
        },
        emailRedirectTo: `${currentDomain}/api/auth/confirm`
      }
    })

    if (error) throw error

    if (data?.user) {
        toast({
          title: t('auth.success'),
          description: t('auth.checkEmailConfirm'),
          duration: 5000,
        });
         await router.replace('/auth/login?registration=success')
        return;
    }
  } catch (error: any) {
    logError('Registration error:', error);
    errorMsg.value = error.message || t('auth.genericError');
    toast({
        variant: "destructive",
        title: t('auth.error'),
        description: error.message || t('auth.genericError'),
        duration: 5000,
    });
  } finally {
    isLoading.value = false
  }
}

// Check for existing session
const checkExistingSession = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    // If user exists, redirect to dashboard
    if (user) {
      await router.push('/dashboard')
    }
    // No need to handle the "no session" case as an error - it's expected on the register page
  } catch (error: any) {
    // Only log real errors, not the "Auth session missing" which is expected
    if (error.message !== "Auth session missing!") {
      logError('Session check error:', error)
      toast({
        variant: "destructive",
        title: t('auth.error'),
        description: t('auth.sessionCheckError'),
        duration: 5000,
      })
    }
  }
}

// Mount hook
onMounted(() => {
  checkExistingSession()
})

// Terms modal state
const showTermsModal = ref(false)
</script>