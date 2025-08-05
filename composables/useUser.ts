import { ref, onMounted } from 'vue'
import { useSupabaseUser } from '#imports'

export function useUser() {
  const user = useSupabaseUser()

  return {
    user
  }
} 