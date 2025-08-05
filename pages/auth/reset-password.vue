<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4">
    <!-- Loading State -->
    <div v-if="isCheckingSession" class="text-center">
      <div class="animate-spin h-8 w-8 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      <p class="text-gray-600">Verifying session...</p>
    </div>

    <!-- Main Form -->
    <div v-else class="w-full max-w-md space-y-8 bg-white rounded-xl shadow-lg p-8">
      <!-- Logo and Title -->
      <div class="text-center">
        <NuxtLink to="/" class="inline-block">
          <div class="mx-auto h-12 w-12 bg-blue-600 rounded-full"></div>
        </NuxtLink>
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Reset Password
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="form-field">
        <!-- Password Requirements -->
        <div v-if="password.length > 0" class="space-y-2">
          <div class="text-sm font-medium text-gray-700">Password Requirements:</div>
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

        <div class="space-y-4">
          <!-- Password Field -->
          <div class="input-group">
            <label class="form-label" for="password">New Password</label>
            <div class="flex items-center w-full">
              <input
                v-model="password"
                id="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                required
                class="form-input"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="flex items-center text-gray-400 hover:text-gray-500 ml-2"
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
          <div class="input-group">
            <label class="form-label" for="confirmPassword">Confirm Password</label>
            <div class="flex items-center w-full">
              <input
                v-model="confirmPassword"
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                name="confirmPassword"
                required
                class="form-input"
                placeholder="Re-enter your new password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="flex items-center text-gray-400 hover:text-gray-500 ml-2"
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
        </div>

        <!-- Error Message -->
        <div v-if="errorMsg" class="p-3 rounded-md bg-red-50 text-sm text-red-600" role="alert">
          {{ errorMsg }}
        </div>

        <!-- Success Message -->
        <div v-if="successMsg" class="p-3 rounded-md bg-green-50 text-sm text-green-600" role="alert">
          {{ successMsg }}
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="group relative flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                v-if="isLoading"
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ isLoading ? 'Updating...' : 'Reset Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/components/ui/toast'

const client = useSupabaseClient()
const router = useRouter()
const { toast } = useToast()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const isCheckingSession = ref(true)
const hasSession = ref(false)

// Form validation
const passwordRequirements = computed(() => [
  { text: 'At least 8 characters', met: password.value.length >= 8 },
  { text: 'One uppercase letter', met: /[A-Z]/.test(password.value) },
   { text: 'One lowercase letter', met: /[a-z]/.test(password.value) },
   { text: 'One number', met: /[0-9]/.test(password.value) },
])

const isFormValid = computed(() => {
  return passwordRequirements.value.every(requirement => requirement.met) && 
         password.value === confirmPassword.value
})

const checkSession = async () => {
  try {
    log('Checking session...')
    const { data: { session }, error: sessionError } = await client.auth.getSession()
    
    log('Session check result:', { 
      hasSession: !!session, 
      error: sessionError 
    })

    if (sessionError) {
      logError('Session error:', sessionError)
      toast({
        variant: "destructive",
        title: "Session Error",
        description: sessionError.message,
        duration: 5000,
      })
      router.push('/auth/login')
      return
    }

    if (!session) {
      log('No session found, redirecting to login')
      router.push('/auth/login')
      return
    }

    // Session exists, user is authenticated
    hasSession.value = true
  } catch (err) {
    logError('Error checking session:', err)
    router.push('/auth/login')
  }
}

onMounted(() => {
  checkSession()
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMsg.value = 'Please ensure your password meets all requirements'
    return
  }
  
  try {
    isLoading.value = true
    errorMsg.value = ''
    successMsg.value = ''
    
    const { error } = await client.auth.updateUser({
      password: password.value
    })

      if (error) {
         logError('Password reset error:', error);
        errorMsg.value = error.message || 'Password update failed';
         toast({
            variant: "destructive",
            title: "Error",
            description: errorMsg.value,
            duration: 5000,
         })
        return;
      }


    successMsg.value = 'Password updated successfully';
      toast({
          title: "Success",
          description: "Your password has been updated successfully. Please log in with your new password.",
          duration: 5000,
      });


    await new Promise(resolve => setTimeout(resolve, 1000));
    await client.auth.signOut();
    await router.replace('/auth/login?reset_success=true');

  } catch (error: any) {
    logError('Password reset error:', error);
    errorMsg.value = error.message || 'Password update failed';
    toast({
       variant: "destructive",
       title: "Error",
       description: errorMsg.value,
       duration: 5000,
    });
  } finally {
    isLoading.value = false;
  }
}
</script>