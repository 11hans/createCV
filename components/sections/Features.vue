<template>
  <section 
    id="features" 
    class="pt-[calc(var(--navbar-height)+32px)] lg:pt-[calc(var(--navbar-height)+48px)] mb-4 md:mb-8"
  >
    <div class="optimized-render-block flex flex-col gap-6 md:gap-14 container mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-4 text-center">
        <div class="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <h2 class="text-[clamp(1.875rem,_0.975rem_+_3vw,_3rem)] font-semibold leading-tight -tracking-2 text-gray-900">
            {{ $t('features.title') }}
          </h2>
        </div>

        <div class="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 max-w-2xl mx-auto">
          <p class="font-mono text-lg/[1.625rem] md:text-xl/[1.9rem] text-gray-600">
            {{ $t('features.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Enhanced Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6">
        <template v-for="(feature, index) in features" :key="feature.title">
          <div
            :class="[
              'rounded-2xl p-6 backdrop-blur-sm border transition-all duration-500 ease-out group relative overflow-hidden',
              'hover:shadow-xl hover:shadow-gray-100/50',
              getColSpan(index),
              {
                'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-200': index === 0,
                'bg-gradient-to-tr from-purple-50 to-pink-50 border-purple-100 hover:border-purple-200': index === 1,
                'bg-gradient-to-bl from-pink-50 to-rose-50 border-pink-100 hover:border-pink-200': index === 2,
                'bg-gradient-to-tr from-indigo-50 to-violet-50 border-indigo-100 hover:border-indigo-200': index === 3
              }
            ]"
          >
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Content Container -->
            <div class="relative z-10">
              <div class="flex items-start justify-between">
                <h3 
                  class="font-semibold text-gray-900 transition-all duration-300 group-hover:scale-105"
                  :class="isLargeCard(index) ? 'text-xl' : 'text-lg'"
                >
                  {{ $t(feature.title) }}
                </h3>
                <component
                  :is="feature.icon"
                  class="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                  :class="isLargeCard(index) ? 'text-blue-600' : 'text-indigo-600'"
                  aria-hidden="true"
                />
              </div>

              <!-- Feature Content -->
              <div :class="getContentClass(feature)">
                <!-- Bullet Points -->
                <template v-if="feature.items">
                  <p 
                    v-for="item in feature.items" 
                    :key="item"
                    class="text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  >
                    • {{ $t(item) }}
                  </p>
                </template>
                
                <!-- Single Description -->
                <p 
                  v-else-if="feature.description" 
                  class="text-gray-600 transition-colors duration-300 group-hover:text-gray-900"
                >
                  {{ $t(feature.description) }}
                </p>
                
                <!-- Sub-features Grid -->
                <template v-else-if="feature.subFeatures">
                  <div 
                    v-for="subFeature in feature.subFeatures" 
                    :key="subFeature.title"
                    class="text-gray-600"
                  >
                    <p class="font-semibold mb-2 transition-colors duration-300 group-hover:text-gray-900">
                      {{ $t(subFeature.title) }}
                    </p>
                    <p class="transition-colors duration-300 group-hover:text-gray-700">
                      {{ $t(subFeature.description) }}
                    </p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PlusIcon, DownloadIcon, LayoutIcon, BackpackIcon } from '@radix-icons/vue';

interface SubFeature {
  title: string;
  description: string;
}

interface Feature {
  icon: any; 
  title: string;
  items?: string[];
  description?: string;
  subFeatures?: SubFeature[];
}

// Features data with proper typing
const features = ref<Feature[]>([
  {
    icon: PlusIcon,
    title: 'features.smartQuoteBuilder.title',
    items: [
      'features.smartQuoteBuilder.simplicity',
      'features.smartQuoteBuilder.autoCalculator',
      'features.smartQuoteBuilder.saveDrafts',
      'features.smartQuoteBuilder.livePreview'
    ]
  },
  {
    icon: DownloadIcon,
    title: 'features.export.title',
    description: 'features.export.description'
  },
  {
    icon: LayoutIcon,
    title: 'features.template.title',
    description: 'features.template.description'
  },
  {
    icon: BackpackIcon,
    title: 'features.business.title',
    subFeatures: [
      {
        title: 'features.business.setup.title',
        description: 'features.business.setup.description'
      },
      {
        title: 'features.business.devices.title',
        description: 'features.business.devices.description'
      },
      {
        title: 'features.business.security.title',
        description: 'features.business.security.description'
      }
    ]
  }
]);

// Helper functions
const getColSpan = (index: number): string => {
  if (index === 0) return 'col-span-1 md:col-span-2 lg:col-span-2';
  if (index === 3) return 'col-span-1 md:col-span-2 lg:col-span-3';
  return '';
};

const isLargeCard = (index: number): boolean => index === 0 || index === 3;

const getContentClass = (feature: Feature): string => {
  if (feature.subFeatures) return 'mt-4 grid grid-cols-1 md:grid-cols-3 gap-4';
  if (feature.items) return 'mt-4 space-y-2';
  return 'mt-4';
};
</script>