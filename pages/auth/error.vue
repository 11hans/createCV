<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
    <div class="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
      <div class="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 class="text-2xl font-bold mb-2">{{ t('auth.errorTitle') }}</h2>
        <p class="text-gray-600">{{ errorMessage }}</p>
        
        <div class="mt-6 flex flex-col space-y-4">
          <NuxtLink 
            to="/auth/login"
            class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            {{ t('auth.backToLogin') }}
          </NuxtLink>
          
          <NuxtLink 
            to="/"
            class="inline-block px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ t('common.backToHome') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useI18n } from '#imports'

definePageMeta({
  auth: false,
  meta: {
    public: true
  }
})

const route = useRoute()
const { t } = useI18n()

// Get error message from query string
const errorMessage = computed(() => {
  return route.query.message as string || t('auth.genericError')
})
</script> 