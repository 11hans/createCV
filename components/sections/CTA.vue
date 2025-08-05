<template>
  <section id="contact" class="container-full min-h-[24rem] md:min-h-[18rem] px-4 pb-4 pt-[calc(var(--navbar-height)+32px)] md:px-6 md:pb-6 lg:pt-[calc(var(--navbar-height)+48px)] mb-4 md:mb-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
    <div class="container relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Main Content -->
        <div class="mb-12">
          <h2 class="text-[clamp(1.875rem,_0.975rem_+_3vw,_3rem)] font-semibold leading-tight -tracking-2 text-gray-900">
            {{ $t('cta.title') }}
          </h2>
          <p class="mt-6 font-mono text-lg/[1.625rem] md:text-xl/[1.9rem] max-w-2xl mx-auto text-gray-600">
            {{ $t('cta.description') }}
          </p>
          
          <!-- Action Button -->
          <div class="mt-8">
            <NuxtLink
              to="/public/new"
              class="group relative rounded-xl"
            >
              <span class="relative inline-flex items-center justify-center gap-4.5 whitespace-nowrap rounded-lg uppercase shadow-lg transition-all duration-300 motion-reduce:transition-none md:gap-6 px-3.5 py-[15px] font-mono text-sm/[1rem] font-semibold md:px-4 md:py-4.5 md:text-base/[1.3125rem] md:tracking-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <span class="flex items-center gap-3 md:gap-3.5">
                  {{ $t('cta.button') }}
                </span>
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Background Pattern -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
      <div class="absolute inset-0 opacity-40">
        <svg 
          class="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="radialGradient">
              <stop offset="0%" stop-color="rgb(79, 70, 229)" stop-opacity="0.1" />
              <stop offset="100%" stop-color="transparent" stop-opacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="-50" r="100" fill="url(#radialGradient)" />
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const showDemo = () => {
  // Implement demo scheduling functionality
  // This could open a modal with Calendly integration or similar
}
</script>