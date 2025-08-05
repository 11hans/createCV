// pages/auth/callback.vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
    <div class="text-center p-8 bg-white rounded-xl shadow-lg">
      <div v-if="!error">
        <div class="animate-spin h-8 w-8 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <h2 class="text-2xl font-bold mb-2">{{ t('auth.verifyingEmail') }}</h2>
        <p class="text-gray-600">{{ t('auth.pleaseWait') }}</p>
      </div>
      <div v-else>
        <div class="text-red-500 mb-4">
          <h2 class="text-2xl font-bold mb-2">{{ t('auth.verificationFailed') }}</h2>
          <p class="text-gray-600">{{ error }}</p>
          <button 
            v-if="showResend"
            @click="handleResendConfirmation"
            :disabled="isLoading"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
          >
            {{ isLoading ? t('auth.sending') : t('auth.resendConfirmation') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast'
import { useNuxtApp } from '#app'
import { useSupabaseClient, useRouter, useRoute, useI18n } from '#imports'
import { ref } from 'vue'

const client = useSupabaseClient()
const router = useRouter()
const route = useRoute()
const { toast } = useToast()
const { t } = useI18n()
const { $i18n } = useNuxtApp()

const error = ref<string | null>(null)
const isLoading = ref(false)
const showResend = ref(false)

// Handle the verification on mount
const handleVerification = async () => {
  try {
    const token_hash = route.query.token_hash as string;
    const type = route.query.type as 'signup' | 'recovery' | 'invite' | 'magiclink';

    if (!token_hash || !type) {
      if (route.query.email) {
        window.localStorage.setItem('confirmEmail', route.query.email as string);
      }
      throw new Error(t('auth.invalidVerificationLink'));
    }

    // First verify the OTP
    const { error: verifyError } = await client.auth.verifyOtp({
      token_hash,
      type,
      options: {
        redirectTo: undefined
      }
    });

    if (verifyError) {
      logError('Verification error:', verifyError);
      error.value = verifyError.message || t('auth.verificationFailedMessage');
      showResend.value = true;
      return;
    }

    // If verification was successful, redirect to the appropriate page
    if (type === 'recovery') {
      // For password reset, redirect to reset password page
      router.push({ path: '/auth/reset-password' });
    } else {
      // For other verifications, redirect to dashboard
      router.push({ path: '/dashboard' });
    }
  } catch (err: any) {
    logError('Error during verification:', err);
    error.value = err.message || t('auth.verificationFailedMessage');
    showResend.value = true;
  }
};

if (process.client) {
  onMounted(() => {
    handleVerification()
  })
}

const handleResendConfirmation = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    const storedEmail = window.localStorage.getItem('confirmEmail')
    
    if (!storedEmail) {
      throw new Error(t('auth.emailNotFound'))
    }

    const currentDomain = $i18n.differentDomains ? window.location.origin : useRuntimeConfig().public.siteUrl

    const { error: resendError } = await client.auth.resend({
      type: 'signup',
      email: storedEmail,
      options: {
        emailRedirectTo: `${currentDomain}/auth/callback`
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
        title: t('auth.newConfirmationSent'),
        description: t('auth.checkEmailForNewConfirmation'),
        duration: 5000,
      });

    // Redirect back to login after showing the message
      setTimeout(() => {
          router.replace('/auth/login');
      }, 3000);

  } catch (err: any) {
    logError('Error resending confirmation:', err);
      toast({
        variant: "destructive",
        title: t('auth.error'),
          description: err.message || t('auth.errorResendingEmail'),
        duration: 5000,
      });
  } finally {
      isLoading.value = false;
  }
}
</script>