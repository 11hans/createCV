// plugins/routes.ts
import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  
  // Configure router scroll behavior
  router.options.scrollBehavior = (
    to: RouteLocationNormalized, 
    from: RouteLocationNormalized, 
    savedPosition: any
  ) => {
    // If the user used browser navigation (back/forward)
    if (savedPosition) {
      return savedPosition
    }

    // If we have a hash in the url
    if (to.hash) {
      // Don't try to scroll to auth-callback
      if (to.hash === '#auth-callback') {
        return { left: 0, top: 0 }
      }
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }

    // Otherwise scroll to top
    return { left: 0, top: 0 }
  }
})