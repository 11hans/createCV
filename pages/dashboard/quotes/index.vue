<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold tracking-tight">
        {{ $t('quotes.title', 'Quotes') }}
      </h1>
      
      <NuxtLink 
        to="/dashboard/quotes/new?force=true"
        class="btn-primary inline-flex items-center gap-2"
      >
        <PlusIcon class="h-4 w-4" />
        {{ $t('quotes.actions.new', 'New Quote') }}
      </NuxtLink>
    </div>

    <!-- Quotes List -->
    <QuotesList />
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@radix-icons/vue'
import { useDashboardLocale } from '@/composables/useDashboardLocale'
import { log } from '~/utils/logger'

// Force correct locale for this dashboard page
const { forceLocaleUpdate } = useDashboardLocale()

// Make sure locale is correct when component is mounted
onMounted(() => {
  forceLocaleUpdate()
  log('[Dashboard/Quotes] Locale enforced on page mount')
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<style>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-400 transition-colors;
}
</style>