<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4">
    <div class="text-center max-w-md">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ errorTitle }}</h1>
      <p class="text-lg text-gray-600 mb-8">{{ errorMessage }}</p>
      
      <div class="space-y-4">
        <div v-if="showError" class="bg-gray-100 p-4 rounded-md text-left overflow-auto max-h-40">
          <pre class="text-sm text-gray-700">{{ error }}</pre>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button @click="handleError" variant="default" size="lg" class="w-full sm:w-auto">
            Try Again
          </Button>
          <Button @click="navigateHome" variant="outline" size="lg" class="w-full sm:w-auto">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '~/components/ui/button'

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()

// Define reactive states
const showError = ref(process.env.NODE_ENV !== 'production')

// Compute friendly error message based on status code
const errorTitle = computed(() => {
  if (!props.error) return t('error.defaultTitle')
  
  switch(props.error.statusCode) {
    case 404:
      return t('error.notFoundTitle')
    case 403:
      return t('error.forbiddenTitle')
    case 500:
      return t('error.serverErrorTitle')
    default:
      return t('error.defaultTitle', { code: props.error.statusCode || '?' })
  }
})

const errorMessage = computed(() => {
  if (!props.error) return t('error.defaultMessage')
  
  switch(props.error.statusCode) {
    case 404:
      return t('error.notFoundMessage')
    case 403:
      return t('error.forbiddenMessage')
    case 500:
      return t('error.serverErrorMessage')
    default:
      return props.error.message || t('error.defaultMessage')
  }
})

// Handle error actions
const handleError = () => {
  clearError({ redirect: currentRoute.value.path })
}

const navigateHome = () => {
  clearError({ redirect: '/' })
}
</script> 