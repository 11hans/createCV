<template>
  <div class="relative z-10 flex items-center">
    <div id="container" class="quote-preview">
      <!-- Quote Header -->
      <div class="group w-full hover:data-[active=false]:bg-black/[0.02] relative isolate flex h-full max-h-[80px] flex-col border-invoice transition-all duration-500" role="button">
        <div class="pointer-events-none absolute inset-[8px]"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 h-full items-center border-b border-invoice">
          <!-- Left Column -->
          <div class="p-4 sm:px-8 flex items-start">
            <div>
              <p class="text-xxs flex items-start font-semibold uppercase text-invoice-light">{{ $t('quote.preview.quoteNo') }}</p>
              <p class="text-xs font-medium text-invoice-dark">QF-2024-001</p>
            </div>
          </div>
          <!-- Right Column -->
          <div class="p-4 sm:px-8 flex justify-end">
            <div class="flex gap-6">
              <div>
                <p class="pb-0.5 text-xxs flex items-start font-semibold uppercase tracking-wider text-invoice-dark">{{ $t('quote.preview.issued') }}</p>
                <p class="text-xs text- start font-medium text-invoice-dark">Mar 15, 2024</p>
              </div>
              <div>
                <p class="pb-0.5 text-xxs flex items-start font-semibold uppercase tracking-wider text-invoice-light">{{ $t('quote.preview.dueDate') }}</p>
                <p class="text-xs text-start font-medium text-invoice-dark">Mar 30, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Company and Client Info -->
      <div class="relative z-10 grid cursor-pointer grid-cols-1 sm:grid-cols-2 items-start justify-between divide-x divide-invoice border-b border-invoice invoice:z-0">
        <!-- Company Info -->
        <div class="group w-full hover:data-[active=false]:bg-black/[0.02] relative flex h-full flex-1 flex-col" role="button">
          <div class="p-4 sm:p-8 sm:py-6 flex flex-col items-start">
            <p class="pb-2.5 text-xs sm:text-xxs flex items-start font-semibold uppercase text-invoice-light">{{ $t('quote.preview.from') }}</p>
            <p class="mb-1.5 text-sm font-medium text-invoice-dark flex items-start">Tech Solutions Inc.</p>
            <p class="mb-1.5 text-xs text-invoice-light flex items-start">contact@techsolutions.com</p>
            <p class="mb-1.5 text-xs text-invoice-light flex items-start">123 Innovation Street</p>
            <p class="mb-1.5 text-xs text-invoice-light flex items-start">San Francisco, CA 94105</p>
            <p class="text-xs text-invoice-light flex items-start">United States</p>
          </div>
        </div>

        <!-- Client Info -->
        <div class="group w-full hover:data-[active=false]:bg-black/[0.02] relative flex h-full flex-1 flex-col" role="button">
          <div class="p-4 sm:p-8 sm:py-6 flex flex-col items-start">
            <p class="pb-2.5 text-xs sm:text-xxs flex items-start font-semibold uppercase text-invoice-light">{{ $t('quote.preview.to') }}</p>
            <p class="mb-1.5 text-sm font-medium text-invoice-dark flex items-start">Global Enterprises Ltd.</p>
            <p class="mb-1.5 text-xs text-invoice-light flex items-start">info@globalenterprises.com</p>
            <p class="mb-1.5 text-xs text-invoice-light flex items-start">456 Corporate Avenue</p>
            <p class="mb-1.5 text-xs text-invoice-light flex items-start">New York, NY 10001</p>
            <p class="text-xs text-invoice-light flex items-start">United States</p>
          </div>
        </div>
      </div>

      <!-- Quote Items -->
      <div class="group w-full hover:data-[active=false]:bg-black/[0.02] relative z-10 flex grow flex-col overflow-hidden invoice:z-0" role="button">
        <div class="flex grow flex-col overflow-auto p-3 px-8 py-8 scrollbar-hide">
          <!-- Items Header -->
          <div class="grid grid-cols-[308px,1fr] text-xxs font-semibold uppercase tracking-wider text-invoice-light mb-2">
            <div class="flex items-start">{{ $t('quote.preview.description') }}</div>
            <div class="grid grid-cols-[85px,1fr,1fr] pl-8">
              <div class="flex items-start">{{ $t('quote.preview.quantity') }}</div>
              <div class="flex items-start">{{ $t('quote.preview.price') }}</div>
              <div class="flex items-start">{{ $t('quote.preview.amount') }}</div>
            </div>
          </div>

          <!-- Items List -->
          <div class="grid min-h-[49px] grid-cols-[308px,1fr] border-b border-invoice py-6 text-xs">
            <p class="max-w-[280px] truncate font-medium text-invoice-dark flex items-start">Web Application Development</p>
            <div class="grid grid-cols-[85px,1fr,1fr] pl-8">
              <p class="truncate font-medium text-invoice-dark flex items-start">1</p>
              <p class="truncate font-medium text-invoice-dark flex items-start">$12,000.00</p>
              <p class="truncate font-medium text-invoice-dark flex items-start">$12,000.00</p>
            </div>
          </div>

          <div class="grid min-h-[49px] grid-cols-[308px,1fr] border-b border-invoice py-6 text-xs">
            <p class="max-w-[280px] truncate font-medium text-invoice-dark flex items-start">UI/UX Design Services</p>
            <div class="grid grid-cols-[85px,1fr,1fr] pl-8">
              <p class="truncate font-medium text-invoice-dark flex items-start">1</p>
              <p class="truncate font-medium text-invoice-dark flex items-start">$5,000.00</p>
              <p class="truncate font-medium text-invoice-dark flex items-start">$5,000.00</p>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-4 flex  gap-3 border-t border-invoice pt-4">
            <div class="grid min-h-[49px] grid-cols-3 items-center py-3">
              <div class="text-xs font-medium text-invoice-light flex items-start">{{ $t('quote.preview.total') }}</div>
              <p class="col-span-2 flex items-start truncate font-medium text-invoice-dark">
                $17,000.00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
</script>

<style scoped>
.quote-preview {
  background-color: white !important;
  border-radius: 0.75rem;
  width: 100%;
}

.border-invoice {
  border-color: #E5E7EB !important;
}

.text-invoice-light {
  color: #6B7280 !important;
}

.text-invoice-dark {
  color: #111827 !important;
}

.text-xxs {
  font-size: 0.65rem !important;
  line-height: 1rem !important;
}

.scrollbar-hide {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none !important;
}

.divide-invoice {
  border-color: #E5E7EB !important;
}

/* Ensure preview content stays light themed */
:deep(.quote-preview *) {
  color: #111827;
}

:deep(.quote-preview p),
:deep(.quote-preview span),
:deep(.quote-preview div) {
  color: inherit;
}
</style>
