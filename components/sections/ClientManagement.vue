<template>
  <section id="client-management" class="pt-[calc(var(--navbar-height)+32px)] lg:pt-[calc(var(--navbar-height)+48px)] mb-4 md:mb-8">
    <div class="optimized-render-block flex flex-col gap-6 md:gap-14 container mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-4 text-center">
        <div class="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <h2 class="text-[clamp(1.875rem,_0.975rem_+_3vw,_3rem)] font-semibold leading-tight -tracking-2 text-gray-900">
            {{ $t('clientManagement.title') }}
          </h2>
        </div>

        <div class="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 max-w-2xl mx-auto">
          <p class="font-mono text-lg/[1.625rem] md:text-xl/[1.9rem] text-gray-600">
            {{ $t('clientManagement.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Background Box Section -->
      <div class="container-full px-4 pb-4 md:px-6 md:pb-6">
        <div class="relative flex flex-col justify-start mx-auto max-w-[1808px] overflow-hidden rounded-2xl text-center md:justify-between md:px-6 py-16 md:py-24">
          <!-- Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
            <!-- Dot Pattern -->
            <div 
              class="absolute inset-0 opacity-20"
              :style="{
                backgroundImage: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }"
            ></div>

            <!-- Glow Effects -->
            <div class="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-100/50 rounded-full blur-[128px] mix-blend-multiply"></div>
            <div class="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-pink-100/50 rounded-full blur-[128px] mix-blend-multiply"></div>

            <!-- Vignette Effect -->
            <div 
              class="absolute inset-0"
              style="background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.8) 100%)"
            ></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 mx-auto">
            <!-- Client Management Content -->
            <div class="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <!-- Dashboard Preview -->
              <div class="relative aspect-square lg:aspect-auto order-2 lg:order-1">
                <img 
                  src="/images/client-management-preview.svg" 
                  alt="QuoteFast Client Management Preview"
                  class="rounded-xl shadow-lg w-full h-auto backdrop-blur-sm bg-white/80 p-2 border border-gray-100"
                />
              </div>

              <div class="space-y-8 order-1 lg:order-2">
                <div class="space-y-6">
                  <div 
                    v-for="feature in clientFeatures" 
                    :key="feature.title"
                    class="flex gap-4"
                  >
                    <div class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg 
                        class="w-4 h-4 text-purple-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="flex font-semibold text-lg items-start text-gray-900 mb-1">
                        {{ $t('clientManagement.' + feature.title + '.title') }}
                      </h3>
                      <p class="text-gray-600 text-left">
                        {{ $t('clientManagement.' + feature.title + '.description') }}
                      </p>
                    </div>
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
const clientFeatures = [
  {
    title: 'quickSearch',
    description: 'Find clients in 3 keystrokes: Search through thousands of records faster than typing "Smith".'
  },
  {
    title: 'duplicateDetection',
    description: 'Duplicate Force Field: Get real-time alerts that prevent accidental client clones.'
  },
  {
    title: 'pdfExport',
    description: '1-Click Export: Download client-ready PDFs with perfect formatting every time.'
  },
]
</script>
