export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  
  // If user is not authenticated and trying to access a protected route
  if (!user.value && !to.path.startsWith('/auth/')) {
    return navigateTo('/auth/login')
  }

  // If user is authenticated and trying to access auth pages
  if (user.value && to.path.startsWith('/auth/') && to.path !== '/auth/logout') {
    return navigateTo('/dashboard')
  }
}) 