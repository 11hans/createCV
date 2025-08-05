<template>
  <section class="container-full min-h-[40rem] md:min-h-[48rem] px-4 pb-4 pt-[calc(var(--navbar-height)+32px)] md:px-6 md:pb-6 lg:pt-[calc(var(--navbar-height)+48px)] mb-4 md:mb-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50" id="pricing">
    <div class="container">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-[clamp(1.875rem,_0.975rem_+_3vw,_3rem)] font-semibold leading-tight -tracking-2 text-gray-900">
          Simple, Transparent Pricing
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your business needs
        </p>
      </div>

      <!-- Pricing Grid -->
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div 
          v-for="plan in plans" 
          :key="plan.name"
          class="relative p-8 rounded-xl bg-white/80 backdrop-blur-sm border transition-all duration-300"
          :class="{ 
            'ring-2 ring-indigo-500 border-indigo-100 hover:border-indigo-200': plan.popular,
            'border-gray-100 hover:border-gray-200': !plan.popular
          }"
        >
          <!-- Popular Badge -->
          <div 
            v-if="plan.popular"
            class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm rounded-full shadow-lg"
          >
            Most Popular
          </div>

          <!-- Plan Header -->
          <div class="text-center mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ plan.name }}
            </h3>
            <div class="mb-4">
              <span class="text-4xl font-bold text-gray-900">${{ plan.price }}</span>
              <span class="text-gray-600">/month</span>
            </div>
            <p class="text-gray-600">{{ plan.description }}</p>
          </div>

          <!-- Features List -->
          <ul class="space-y-4 mb-8">
            <li 
              v-for="feature in plan.features" 
              :key="feature"
              class="flex items-center gap-3 text-gray-600"
            >
              <svg 
                class="w-5 h-5 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ feature }}
            </li>
          </ul>

          <!-- CTA Button -->
          <button 
            class="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300"
            :class="plan.popular ? 
              'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg' : 
              'border border-gray-200 hover:border-gray-300 text-gray-900 hover:bg-gray-50'"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const plans = [
  {
    name: 'Starter',
    price: '29',
    description: 'Perfect for small businesses',
    popular: false,
    features: [
      'Up to 25 quotes per month',
      'Basic templates',
      'Email support',
      'PDF export',
      'Basic analytics'
    ]
  },
  {
    name: 'Professional',
    price: '79',
    description: 'Best for growing teams',
    popular: true,
    features: [
      'Unlimited quotes',
      'Custom templates',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
      'API access'
    ]
  },
  {
    name: 'Enterprise',
    price: '199',
    description: 'For large organizations',
    popular: false,
    features: [
      'Everything in Professional',
      'Custom branding',
      'Dedicated support',
      'SSO authentication',
      'Advanced security',
      'Custom integrations'
    ]
  }
]
</script> 