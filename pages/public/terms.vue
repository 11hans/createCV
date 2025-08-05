<template>
  <div class="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('terms.title') }}</h1>
        <p class="mt-2 text-gray-600">{{ $t('terms.subtitle') }}</p>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 my-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading terms</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="prose prose-blue max-w-none">
        <div class="terms-content">
          <template v-for="(section, index) in formattedSections" :key="index">
            <div class="terms-section">
              <div v-if="section.title" class="section-title text-xl font-bold text-gray-900 mb-4">{{ section.title }}</div>
              <div v-for="(subsection, subIndex) in section.content" :key="`${index}-${subIndex}`" class="mb-6">
                <h3 v-if="subsection.title" class="text-lg font-semibold text-blue-700 mb-2">{{ subsection.title }}</h3>
                <div v-for="(paragraph, pIndex) in subsection.paragraphs" :key="`${index}-${subIndex}-${pIndex}`" 
                     class="mb-3 text-gray-700" 
                     :class="{'pl-6': paragraph.startsWith('•')}">
                  {{ paragraph }}
                </div>
              </div>
              <div v-if="index < formattedSections.length - 1" class="my-8 border-t border-gray-200"></div>
            </div>
          </template>
        </div>
      </div>

      <div class="mt-8 text-center">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ $t('terms.backToHome') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '#imports'

// Define types for our data structure
interface Subsection {
  title: string;
  paragraphs: string[];
}

interface Section {
  title: string;
  content: Subsection[];
}

const { locale } = useI18n()

// State variables
const termsContent = ref('')
const isLoading = ref(true)
const error = ref('')

// Parse the terms content into structured sections
const formattedSections = computed<Section[]>(() => {
  if (!termsContent.value) return []
  
  const sections: Section[] = []
  let currentSection: Section = { title: '', content: [] }
  let currentSubsection: Subsection = { title: '', paragraphs: [] }
  
  // Split the content by the section separator
  const parts = termsContent.value.split('⸻')
  
  parts.forEach((part, index) => {
    const lines = part.trim().split('\n').filter(line => line.trim() !== '')
    
    if (lines.length === 0) return
    
    // For the first part (intro)
    if (index === 0) {
      currentSection = { 
        title: '', 
        content: [{ title: '', paragraphs: lines }] 
      }
      sections.push(currentSection)
      return
    }
    
    // For numbered sections
    const sectionLines = [...lines]
    const sectionTitle = sectionLines.shift() || ''
    currentSection = { title: sectionTitle, content: [] }
    
    let currentParagraphs: string[] = []
    
    sectionLines.forEach(line => {
      // Check if this is a subsection title (e.g., "1.1. Beta Version")
      if (/^\d+\.\d+\./.test(line)) {
        // If we have paragraphs from a previous subsection, save them
        if (currentParagraphs.length > 0) {
          currentSubsection = { title: '', paragraphs: currentParagraphs }
          currentSection.content.push(currentSubsection)
          currentParagraphs = []
        }
        
        currentSubsection = { title: line, paragraphs: [] }
        currentSection.content.push(currentSubsection)
      } else {
        // Regular paragraph
        currentParagraphs.push(line)
      }
    })
    
    // Add any remaining paragraphs
    if (currentParagraphs.length > 0) {
      currentSubsection = { title: '', paragraphs: currentParagraphs }
      currentSection.content.push(currentSubsection)
    }
    
    sections.push(currentSection)
  })
  
  return sections
})

// Function to load terms content
const loadTermsContent = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    // Still determine the file based on locale - server will handle Vercel cases
    const termsFile = locale.value === 'cs' ? 'cs-terms.txt' : 'en-terms.txt'
    console.log(`Terms page: Using locale ${locale.value}, requesting ${termsFile}`);
    
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
    console.log('Terms headers:', {
      file: response.headers.get('X-Terms-File'),
      vercel: response.headers.get('X-Vercel-Env')
    });
    
    const content = await response.text()
    termsContent.value = content
  } catch (error: any) {
    error.value = error.message || 'Failed to load terms'
  } finally {
    isLoading.value = false
  }
}

// Load terms content on mount
onMounted(() => {
  // Call the async function without awaiting it in onMounted
  loadTermsContent()
})
</script>

<style scoped>
.terms-content {
  line-height: 1.6;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Add responsive styling */
@media (max-width: 640px) {
  .section-title {
    font-size: 1.25rem;
  }
}
</style> 