<template>
  <div class="min-h-screen bg-background">
      <slot />
      <ClientOnly>
      <DevLanguageSwitcher v-if="isDev" />
      </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const isDev = import.meta.env.DEV
</script>