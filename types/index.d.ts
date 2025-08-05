import type { Ref, ComputedRef } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'

declare module '#app' {
  interface NuxtApp {
    $mobileMenu: {
      isOpen: ComputedRef<boolean>
      open: () => void
      close: () => void
      toggle: () => void
    }
    $supabase: SupabaseClient
  }
}

export {} 