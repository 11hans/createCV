<template>
  <section id="about" class="pt-[calc(var(--navbar-height)+32px)] lg:pt-[calc(var(--navbar-height)+48px)] mb-4 md:mb-8">
    <div class="optimized-render-block flex flex-col gap-6 md:gap-14 container mx-auto">
      <!-- Text Content -->
      <div class="flex flex-col gap-4 text-center">
        <!-- Heading -->
        <div class="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <h2 class="text-[clamp(1.875rem,_0.975rem_+_3vw,_3rem)] font-semibold leading-tight -tracking-2 text-gray-900">
            {{ $t('about.title') }}
          </h2>
        </div>

        <!-- Introduction -->
        <div class="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 max-w-4xl mx-auto">
          <p class="font-mono text-lg/[1.625rem] md:text-2xl/[2.19375rem] !text-pretty text-gray-600">
            {{ $t('about.introduction') }}
          </p>
        </div>
      </div>

      <!-- Background Box Section -->
      <div class="container-full px-4 pb-4 md:px-6 md:pb-6">
        <div class="relative flex flex-col justify-start mx-auto max-w-[1808px] overflow-hidden rounded-2xl text-center md:justify-between md:px-6 py-16 md:py-24">
          <!-- Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
            <!-- Dot Pattern -->
            <div 
              class="absolute inset-0"
              :style="{
                backgroundImage: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.1) 2px, transparent 2px)',
                backgroundSize: '30px 30px',
                maskImage: 'radial-gradient(circle at center, black, transparent)'
              }"
            ></div>

            <!-- Vignette Effect -->
            <div 
              class="absolute inset-0"
              style="background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.8) 100%)"
            ></div>
          </div>

          <!-- Content Section -->
          <div class="flex flex-col items-center relative z-10">
            <!-- Features Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4 md:px-8 mb-12">
              <!-- Challenge -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-left border border-blue-100 hover:border-blue-200 transition-all duration-300 shadow-lg hover:shadow-xl">
                <h3 class="text-2xl font-bold mb-6 text-blue-600">{{ $t('about.challenge.title') }}</h3>
                <p class="text-gray-600 mb-4">{{ $t('about.challenge.subtitle') }}</p>
                <ul class="space-y-4">
                  <li class="flex items-start gap-3">
                    <span class="text-blue-500 flex items-center justify-center w-4 h-4 mt-1">•</span>
                    <span class="text-gray-700">{{ $t('about.challenge.points.time') }}</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-blue-500 flex items-center justify-center w-4 h-4 mt-1">•</span>
                    <span class="text-gray-700">{{ $t('about.challenge.points.errors') }}</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-blue-500 flex items-center justify-center w-4 h-4 mt-1">•</span>
                    <span class="text-gray-700">{{ $t('about.challenge.points.adjustments') }}</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-blue-500 flex items-center justify-center w-4 h-4 mt-1">•</span>
                    <span class="text-gray-700">{{ $t('about.challenge.points.followUp') }}</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-blue-500 flex items-center justify-center w-4 h-4 mt-1">•</span>
                    <span class="text-gray-700">{{ $t('about.challenge.points.focus') }}</span>
                  </li>
                </ul>
              </div>

              <!-- Solution -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-left border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-lg hover:shadow-xl">
                <h3 class="text-2xl font-bold mb-6 text-emerald-600">{{ $t('about.solution.title') }}</h3>
                <p class="text-gray-600 mb-6">
                  {{ $t('about.solution.description') }}
                </p>
                <h4 class="text-xl font-semibold mb-4 text-emerald-600">{{ $t('about.solution.subtitle') }}</h4>
                <p class="text-gray-600 mb-4">{{ $t('about.solution.subDescription') }}</p>
                <ul class="space-y-4">
                  <li class="flex items-start gap-3">
                    <span class="text-emerald-500 flex items-center justify-center w-4 h-4 mt-1">•</span>
                    <span class="text-gray-700">{{ $t('about.solution.points.speed') }}</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-emerald-500 flex items-center justify-center w-4 h-4 mt-1">•</span>
                    <span class="text-gray-700">{{ $t('about.solution.points.pdf') }}</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-emerald-500 flex items-center justify-center w-4 h-4 mt-1">•</span>
                    <span class="text-gray-700">{{ $t('about.solution.points.workflow') }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Looking Forward -->
            <div class="relative max-w-5xl w-full px-4 md:px-8">
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-left border border-violet-100 hover:border-violet-200 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div class="max-w-4xl mx-auto">
                  <h3 class="text-2xl font-bold mb-6 text-violet-600">{{ $t('about.lookingForward.title') }}</h3>
                  <div class="space-y-6">
                    <p class="text-gray-600 text-lg leading-relaxed">
                      {{ $t('about.lookingForward.description') }}
                    </p>
                    <p class="text-gray-600 text-lg leading-relaxed">
                      {{ $t('about.lookingForward.subDescription') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Gradient -->
          <div class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-white/40"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style scoped>
/* Ensure smooth transitions */
* {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
</style>