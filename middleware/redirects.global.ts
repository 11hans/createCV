import { defineNuxtRouteMiddleware, navigateTo } from '#app'

// Define redirects mapping
const redirects: Record<string, string> = {
  '/terms': '/public/terms'
}

export default defineNuxtRouteMiddleware((to) => {
  // Check if the current path needs to be redirected
  const redirectPath = redirects[to.path]
  
  if (redirectPath) {
    // Preserve query parameters and hash
    return navigateTo({
      path: redirectPath,
      query: to.query,
      hash: to.hash
    }, { redirectCode: 301 })
  }
}) 