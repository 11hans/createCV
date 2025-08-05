<template>
  <div v-if="isDev" class="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 transition-all duration-200">
    <div class="flex flex-col gap-2">
      <!-- Loading overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
      </div>
      
      <!-- Header with debug toggle -->
      <div class="flex items-center justify-between">
        <div class="text-sm font-medium text-gray-600 dark:text-gray-300">
          Development Language Tools
        </div>
        <button 
          @click="showDebug = !showDebug" 
          class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {{ showDebug ? 'Hide Debug' : 'Debug' }}
        </button>
      </div>

      <!-- Debug information -->
      <div v-if="showDebug" class="text-xs dark:bg-gray-100/80 p-2 rounded space-y-1">
        <div>Current Path: {{ route.path }}</div>
        <div>Locale: {{ currentLocale }}</div>
        <div>Domain: {{ currentDomain }}</div>
        <div>Current Port: {{ currentPort }}</div>
        <div>Dev Mode: {{ isDev }}</div>
      </div>

      <!-- Language buttons -->
      <div class="flex items-center gap-2">
        <button
            @click="switchToCzech"
            :disabled="isLoading || currentPort === '3000'"
            :class="[
            buttonClasses,
            currentPort === '3000'
                ? 'bg-gray-800 dark:bg-gray-900 text-white font-medium shadow-sm'
                : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
        >
            🇨🇿 Czech (3000)
        </button>
        
        <button
            @click="switchToEnglish"
            :disabled="isLoading || currentPort === '3001'"
            :class="[
            buttonClasses,
            currentPort === '3001'
                ? 'bg-gray-800 dark:bg-gray-900 text-white font-medium shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
        >
            🇺🇸 English (3001)
        </button>
        </div>

      <!-- Current domain display -->
      <div class="text-xs text-gray-500 dark:text-gray-400">
        Current: {{ currentDomain }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isDev = import.meta.env.DEV
const { currentLocale } = useLanguage()
const route = useRoute()
const isLoading = ref(false)
const showDebug = ref(false)

const buttonClasses = computed(() => [
  'px-3 py-1 rounded text-sm transition-colors duration-200',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'focus:outline-none focus:ring-2 focus:ring-primary/50'
])

const currentDomain = computed(() => {
  return window?.location.host || ''
})

const currentPort = computed(() => {
  const match = currentDomain.value.match(/:(\d+)$/)
  return match ? match[1] : ''
})

const getBaseUrl = () => {
  const protocol = window.location.protocol
  const hostname = window.location.hostname
  return `${protocol}//${hostname}`
}

const switchLanguage = async (targetPort: string) => {
  if (isLoading.value || currentPort.value === targetPort) return
  
  isLoading.value = true
  try {
    // Construct new URL with target port
    const baseUrl = getBaseUrl()
    const newUrl = `${baseUrl}:${targetPort}${route.fullPath}`
    
    // Log for debugging
    if (showDebug.value) {
      // log('Switching language:', {
      //   from: window.location.href,
      //   to: newUrl,
      //   currentPort: currentPort.value,
      //   targetPort
      // })
    }

    // Navigate to new URL
    window.location.href = newUrl
  } catch (error) {
    logError('Error switching language:', error)
  } finally {
    // Reset loading after navigation or error
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

const switchToCzech = () => switchLanguage('3000')
const switchToEnglish = () => switchLanguage('3001')

// Watch for port changes in debug mode
watch(currentPort, (newPort) => {
  if (showDebug.value) {
    // log('Port changed:', newPort)
  }
})
</script> 