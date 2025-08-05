<template>
  <section id="benefits" class="pt-[calc(var(--navbar-height)+32px)] lg:pt-[calc(var(--navbar-height)+48px)] mb-4 md:mb-8">
    <div class="optimized-render-block flex flex-col gap-6 md:gap-14 container mx-auto">
      <!-- Text Content -->
      <div class="flex flex-col gap-4 text-center">
        <!-- Heading -->
        <div class="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <h2 class="text-[clamp(1.875rem,_0.975rem_+_3vw,_3rem)] font-semibold leading-tight -tracking-2 text-gray-900">
            {{ $t('benefits.title') }}
          </h2>
        </div>
      </div>

      <!-- Background Box Section -->
      <div class="container-full px-4 pb-4 md:px-6 md:pb-6">
        <div class="relative flex flex-col justify-start mx-auto max-w-[1808px] overflow-hidden rounded-2xl text-center md:justify-between md:px-6 py-16 md:py-24">
          <!-- Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
            <!-- Dot Pattern -->
            <div 
              class="absolute inset-0 opacity-20"
              :style="{
                backgroundImage: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }"
            ></div>

            <!-- Glow Effects -->
            <div class="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[128px] mix-blend-multiply"></div>
            <div class="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[128px] mix-blend-multiply"></div>

            <!-- Vignette Effect -->
            <div 
              class="absolute inset-0"
              style="background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.8) 100%)"
            ></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 mx-auto">
            <!-- Benefits Content -->
            <div class="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div class="space-y-8">
                <div class="space-y-6">
                  <div 
                    v-for="benefit in benefits" 
                    :key="benefit.title"
                    class="flex gap-4"
                  >
                    <div class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg 
                        class="w-4 h-4 text-indigo-600"
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
                        {{ $t('benefits.' + benefit.title + '.title') }}
                      </h3>
                      <p class="text-gray-600 text-left">
                        {{ $t('benefits.' + benefit.title + '.description') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dashboard Preview -->
              <div class="relative aspect-square lg:aspect-auto">
                <img 
                  src="/images/dashboard-preview.svg" 
                  alt="QuoteFast Dashboard Preview"
                  class="rounded-xl shadow-lg w-full h-auto backdrop-blur-sm bg-white/80 p-2 border border-gray-100"
                />
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
const stats = [
  {
    value: '100x',
    label: 'Faster Quotes Creation'
  },
  {
    value: '98%',
    label: 'Customer Satisfaction'
  },
  {
    value: '1000h',
    label: 'Saved'
  }
]

const benefits = [
  {
    title: 'streamlinedWorkflow',
    description: 'Automate your quote creation process with our 4-step simplicity approach and reduce manual work by up to 80%.'
  },
  {
    title: 'professionalTemplates',
    description: 'Choose from a variety of professionally designed templates that match your brand with live PDF preview as you type.'
  },
  {
    title: 'continuousWork',
    description: 'Never lose progress with our draft saving feature - save mid-quote and resume later, even on different devices.'
  },
  {
    title: 'clientManagement',
    description: ''
  }
]
</script>