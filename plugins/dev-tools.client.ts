import { defineNuxtPlugin } from '#app'
import LanguageSwitcher from '~/components/dev/LanguageSwitcher.vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Only register in development
  if (import.meta.env.DEV) {
    nuxtApp.vueApp.component('DevLanguageSwitcher', LanguageSwitcher)
  }
}) 