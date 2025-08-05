<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4">
    <div class="w-full max-w-md space-y-8 bg-white rounded-xl shadow-lg p-8">
      <!-- Logo and Title -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          {{ t('auth.forgotPassword') }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ t('auth.forgotPasswordDescription') }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="auth-form space-y-6">
        <!-- Error and Success Messages -->
        <div v-if="errorMsg" class="p-3 rounded-md bg-red-50 text-sm text-red-600" role="alert">
          {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="p-3 rounded-md bg-green-50 text-sm text-green-600" role="alert">
          {{ successMsg }}
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
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-6">
          <button
            type="submit"
            :disabled="isLoading || !email"
            class="auth-submit-btn"
          >
            {{ isLoading ? t('auth.loading') : t('auth.resetPassword') }}
          </button>
        </div>

        <!-- Back to Login -->
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.rememberPassword') }}
          <NuxtLink
            to="/auth/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            {{ t('auth.signIn') }}
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'nuxt/app'
import { useToast } from '@/components/ui/toast'
import { useSupabaseClient, useI18n } from '#imports'

const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient()
const { toast } = useToast()
const { t } = useI18n()

const email = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

onMounted(() => {
  // Check if redirected with error
  if (route.query.error === 'session_failed') {
    errorMsg.value = t('auth.resetProcessFailed')
    toast({
      variant: "destructive",
      title: t('auth.error'),
      description: t('auth.resetProcessFailed'),
      duration: 5000,
    })
  }
})

const handleSubmit = async () => {
  if (!email.value) return

  try {
    isLoading.value = true
    errorMsg.value = ''
    successMsg.value = ''
    
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    )

    if (error) throw error

    successMsg.value = t('auth.resetLinkSent')
    toast({
      title: t('auth.success'),
      description: t('auth.resetLinkSent'),
      duration: 5000,
    })
    
  } catch (error: any) {
    logError('Reset error:', error)
    errorMsg.value = error.message
    toast({
      variant: "destructive",
      title: t('auth.error'),
      description: error.message,
      duration: 5000,
    })
  } finally {
    isLoading.value = false
   return
  }
}
</script>