<template>
  <section class="container-full max-h-[90vh] sm:max-h-[140vh] min-h-[40rem] sm:min-h-[58rem] md:max-h-[min(90rem,250vw)] md:min-h-[66rem] px-4 pb-4 pt-[calc(var(--navbar-height)+32px)] text-gray-900 md:px-6 md:pb-6 mb-4 md:mb-8">
    <div class="relative flex flex-col justify-start mx-auto h-full max-w-[1808px] overflow-hidden rounded-2xl text-center md:justify-between md:px-6">
      <!-- Modern Light Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <!-- Subtle Dot Pattern -->
        <div 
          class="absolute inset-0"
          :style="{
            backgroundImage: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.1) 2px, transparent 2px)',
            backgroundSize: '30px 30px',
            maskImage: 'radial-gradient(circle at center, black, transparent)'
          }"
        ></div>

        <!-- Light Vignette Effect -->
        <div 
          class="absolute inset-0"
          style="background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.8) 100%)"
        ></div>
      </div>

      <!-- Content Section -->
      <div class="flex flex-col items-center mt-12 md:mt-24 relative z-10">
        <!-- Heading -->
        <div class="relative px-4 md:px-0 mb-8 md:mb-12">
          <h1 
            class="text-[clamp(3rem,_1.4rem_+_5.5vw,_6rem)] font-semibold leading-[1.125] -tracking-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            {{ $t('hero.title') }}
          </h1>
        </div>

        <!-- Description -->
        <div class="relative px-6 md:px-0 mb-8 md:mb-12 max-w-3xl mx-auto">
          <p 
            class="[&_b]:md:font-semibold font-mono text-base/[1.6] sm:text-lg/[1.7] md:text-xl/[1.8] !text-pretty [&>br]:hidden sm:[&>br]:inline text-gray-700"
          >
            {{ $t('hero.description') }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-12">
          <NuxtLink
            to="/public/new"
            class="group relative rounded-xl"
          >
            <span class="relative inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg uppercase shadow-lg transition-all duration-300 motion-reduce:transition-none px-5 py-3.5 font-medium md:px-6 md:py-4 md:text-lg/[1.3] md:tracking-wide bg-indigo-600 hover:bg-indigo-700 text-white">
              <span class="flex items-center gap-2 md:gap-3">
                {{ $t('hero.createQuote') }}
              </span>
            </span>
          </NuxtLink>
        </div>

        <!-- Quote Preview -->
        <div class="relative z-10 hidden sm:flex items-center justify-center w-full overflow-hidden mt-8">
          <div id="container" class="w-full max-w-[min(95vw,1000px)] mx-auto max-h-[700px] overflow-hidden">
            <div class="transform scale-[0.85] sm:scale-90 md:scale-100 origin-top overflow-hidden">
              <div class="max-h-[600px] overflow-hidden">
                <HeroQuotePreview />
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import HeroQuotePreview from '~/components/HeroQuotePreview.vue'

const showDemo = () => {
  log('Show demo clicked')
}
</script>

<style scoped>
@keyframes gradient {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-gradient {
  animation: gradient 3s ease infinite;
}

/* Ensure smooth transitions */
* {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.quote-preview {
  transform-origin: top;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
}
</style>