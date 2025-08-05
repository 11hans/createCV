<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 overflow-y-auto" 
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
        @keydown.esc="close"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="close"></div>

          <!-- Modal panel -->
          <div 
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
            ref="modalPanel"
            tabindex="-1"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ $t('terms.title') }}
                  </h3>
                  <div class="mt-4 max-h-[70vh] overflow-y-auto prose prose-blue max-w-none">
                    <div v-if="isLoading" class="flex justify-center py-8">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <div v-else-if="error" class="text-red-600 py-4">
                      {{ error }}
                    </div>
                    <div v-else v-html="formattedTerms"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                @click="close"
                ref="closeButton"
              >
                {{ $t('common.close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from '#imports'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const { locale } = useI18n()
const termsContent = ref('')
const isLoading = ref(false)
const error = ref('')
const modalPanel = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

// Format the terms content with proper HTML
const formattedTerms = computed(() => {
  if (!termsContent.value) return ''
  
  // Replace markdown-style headers with HTML
  let formatted = termsContent.value
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/### (.*?)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-2">$1</h3>')
    .replace(/---/g, '<hr class="my-6">')
    
  // Convert paragraphs (lines with content)
  const paragraphs = formatted.split('\n')
  formatted = paragraphs
    .map(p => {
      p = p.trim()
      if (p && !p.startsWith('<h') && !p.startsWith('<hr')) {
        return `<p class="mb-4">${p}</p>`
      }
      return p
    })
    .join('\n')
    
  return formatted
})

// Load terms content when modal is opened
const loadTerms = async () => {
  if (!props.isOpen) return
  
  isLoading.value = true
  error.value = ''
  termsContent.value = ''
  
  try {
    // Still determine the file based on locale - server will handle Vercel cases
    const termsFile = locale.value === 'cs' ? 'cs-terms.txt' : 'en-terms.txt'
    console.log(`Terms modal: Using locale ${locale.value}, requesting ${termsFile}`);
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    // Fetch the terms content
    const response = await fetch(`/api/terms?file=${encodeURIComponent(termsFile)}&t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to load terms: ${response.statusText || 'Unknown error'}`)
    }
    
    // Log headers for debugging
    console.log('Terms modal headers:', {
      file: response.headers.get('X-Terms-File'),
      vercel: response.headers.get('X-Vercel-Env')
    });
    
    const content = await response.text()
    termsContent.value = content
  } catch (err: any) {
    error.value = err.message || 'Failed to load terms'
  } finally {
    isLoading.value = false
  }
}

// Close the modal
const close = () => {
  emit('close')
}

// Focus trap for accessibility
const focusModal = async () => {
  await nextTick()
  if (closeButton.value) {
    closeButton.value.focus()
  } else if (modalPanel.value) {
    modalPanel.value.focus()
  }
}

// Watch for changes in isOpen prop
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadTerms()
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden'
    // Focus the modal for accessibility
    focusModal()
  } else {
    // Restore body scrolling when modal is closed
    document.body.style.overflow = ''
  }
})

// Clean up on unmount
onMounted(() => {
  if (props.isOpen) {
    loadTerms()
    document.body.style.overflow = 'hidden'
    focusModal()
  }
  
  // Add global event listener for ESC key
  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.isOpen) {
      close()
    }
  }
  
  window.addEventListener('keydown', handleEscKey)
  
  // Clean up event listener on component unmount
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscKey)
  })
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.prose h3 {
  color: #1e40af;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose hr {
  margin: 2rem 0;
  border-color: #e5e7eb;
}
</style> 