import { ref, onMounted, onUnmounted } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Database } from '@/types/database.types'

interface QuoteStats {
  isLoading: boolean
  error: string | null
  totalQuotes: number
  activeQuotes: number
  acceptedRate: number
}

export const useDashboardStats = () => {
  const supabase = useSupabaseClient<Database>()
  const quoteStats = ref<QuoteStats>({
    isLoading: true,
    error: null,
    totalQuotes: 0,
    activeQuotes: 0,
    acceptedRate: 0
  })

  let channel: ReturnType<typeof setupRealtimeUpdates>

  const calculateStats = async () => {
    try {
      quoteStats.value.isLoading = true
      quoteStats.value.error = null

      // Get total quotes
      const { count: totalQuotes, error: totalError } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      // Get active quotes (draft + sent)
      const { count: activeQuotes, error: activeError } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .in('status', ['draft', 'sent'])

      if (activeError) throw activeError

      // Calculate acceptance rate for all time
      const { data: allQuotes, error: allQuotesError } = await supabase
        .from('quotes')
        .select('status')

      if (allQuotesError) throw allQuotesError

      const acceptedQuotes = allQuotes.filter(q => q.status === 'accepted').length
      const totalQuotesWithStatus = allQuotes.length
      const acceptedRate = totalQuotesWithStatus > 0 
        ? Math.round((acceptedQuotes / totalQuotesWithStatus) * 100) 
        : 0

      quoteStats.value = {
        isLoading: false,
        error: null,
        totalQuotes: totalQuotes || 0,
        activeQuotes: activeQuotes || 0,
        acceptedRate
      }
    } catch (error) {
      logError('Error fetching quote stats:', error)
      quoteStats.value = {
        ...quoteStats.value,
        isLoading: false,
        error: 'Failed to load statistics'
      }
    }
  }

  const setupRealtimeUpdates = () => {
    const channel = supabase
      .channel('dashboard-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes'
        },
        (payload) => {
          // Recalculate stats when any quote changes
          calculateStats()
        }
      )
      .subscribe()

    return channel
  }

  // Function to initialize stats
  const initializeStats = async () => {
    await calculateStats()
    channel = setupRealtimeUpdates()
  }

  // Register lifecycle hooks before any await statements
  onMounted(() => {
    // Call the async function without awaiting it in onMounted
    initializeStats()
  })

  onUnmounted(() => {
    if (channel) {
      channel.unsubscribe()
    }
  })

  return {
    quoteStats,
    refreshStats: calculateStats
  }
} 