import { defineNuxtRouteMiddleware } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  // This middleware should do nothing but ensure the route exists
  log('Contact domain middleware for route:', to.path)
  
  // No redirects or logic needed
  return
})