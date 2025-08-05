<!-- QuoteFast Logo Component -->
<script setup lang="ts">
const props = defineProps({
  width: {
    type: Number,
    default: 32
  },
  height: {
    type: Number,
    default: 32
  }
})
</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Background -->
    <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
    
    <!-- Q letterform -->
    <path
      d="M16.5 9C20 9 23 12 23 15.5C23 19 20 22 16.5 22C13 22 10 19 10 15.5C10 12 13 9 16.5 9ZM16.5 11.5C14.3 11.5 12.5 13.3 12.5 15.5C12.5 17.7 14.3 19.5 16.5 19.5C18.7 19.5 20.5 17.7 20.5 15.5C20.5 13.3 18.7 11.5 16.5 11.5ZM19 18L21.5 20.5L20 22L17.5 19.5L19 18Z"
      fill="white"
    />

    <!-- Gradient definition -->
    <defs>
      <linearGradient
        id="logoGradient"
        x1="0"
        y1="0"
        x2="32"
        y2="32"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#2563eb" />
        <stop offset="100%" stop-color="#1d4ed8" />
      </linearGradient>
    </defs>
  </svg>
</template>

<style scoped>
svg {
  display: block;
  transition: transform 0.2s ease;
}

svg:hover {
  transform: scale(1.05);
}
</style>