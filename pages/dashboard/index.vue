<template>
  <div class="space-y-6">
    <!-- Header with Logout -->
    <h1 class="scroll-m-20 text-3xl font-bold tracking-tight flex justify-between items-center">
      {{ $t('navigation.dashboard') }}
      <div class="flex gap-2">
        <Button variant="outline" @click="handleContactSupport" class="gap-2">
          <HelpCircleIcon class="h-4 w-4" />
          {{ $t('navigation.contactSupport') }}
        </Button>
        <Button variant="outline" @click="handleLogout" class="gap-2">
          <LogOutIcon class="h-4 w-4" />
          {{ $t('navigation.signOut') }}
        </Button>
      </div>
    </h1>
    
    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-3">
      <!-- Loading State -->
      <template v-if="quoteStats.isLoading">
        <Card v-for="i in 3" :key="i">
          <CardContent class="p-6">
            <div class="animate-pulse space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </template>

      <!-- Error State -->
      <template v-else-if="quoteStats.error">
        <Card class="col-span-3">
          <CardContent class="p-6 text-center text-red-500">
            {{ quoteStats.error }}
            <Button variant="link" @click="refreshStats" class="ml-2">
              {{ $t('common.error') }}
            </Button>
          </CardContent>
        </Card>
      </template>

      <!-- Stats Display -->
      <template v-else>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">{{ $t('dashboard.totalQuotes') }}</CardTitle>
            <FileTextIcon class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ quoteStats.totalQuotes }}</div>
            <p class="text-xs text-muted-foreground">{{ $t('dashboard.allTimeQuotes') }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">{{ $t('dashboard.activeQuotes') }}</CardTitle>
            <ActivityIcon class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ quoteStats.activeQuotes }}</div>
            <p class="text-xs text-muted-foreground">{{ $t('dashboard.draftAndSentQuotes') }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">{{ $t('dashboard.acceptedRate') }}</CardTitle>
            <TrendingUpIcon class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ quoteStats.acceptedRate }}%</div>
            <p class="text-xs text-muted-foreground">{{ $t('dashboard.allTimeStats') }}</p>
          </CardContent>
        </Card>
      </template>
    </div>

    <!-- Recent Quotes -->
    <Card>
      <CardHeader>
        <CardTitle>{{ $t('dashboard.recentActivity') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <QuotesList />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOutIcon, FileTextIcon, ActivityIcon, TrendingUpIcon, HelpCircleIcon } from 'lucide-vue-next'
import QuotesList from "./quotes/index.vue"
import { useRouter } from 'vue-router'
import { useSupabaseClient } from '#imports'
import { useToast } from '@/components/ui/toast'
import { useDashboardStats } from '@/composables/useDashboardStats'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const supabase = useSupabaseClient()
const toast = useToast()
const { quoteStats, refreshStats } = useDashboardStats()

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    localStorage.removeItem('token')
    await router.push('/')
  } catch (err) {
    logError('Error during logout:', err)
  }
}

const handleContactSupport = () => {
  window.location.href = 'mailto:support@qfast.co'
}
</script>