<template>
  <div class="absolute inset-0 opacity-40">
    <svg 
      class="h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern 
          id="grid" 
          width="10" 
          height="10" 
          patternUnits="userSpaceOnUse"
        >
          <path 
            d="M 10 0 L 0 0 0 10" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="0.5" 
            class="text-brand-borders"
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
    </svg>
  </div>
</template> 