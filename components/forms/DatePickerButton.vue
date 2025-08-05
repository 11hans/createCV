<template>
  <div>
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="cn(
            'w-full justify-start text-left font-normal md:w-auto md:min-w-[280px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-200',
            !value && 'text-gray-500'
          )"
        >
          <CalendarIcon class="mr-2 h-4 w-4 text-blue-600" />
          {{ formattedDate }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg">
        <Calendar v-model="selectedDate" class="p-3 bg-white rounded-lg" />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date'
import { CalendarIcon } from '@radix-icons/vue'
import { ref, computed } from 'vue'
import { useFormatting } from '~/composables/useFormatting'

const props = defineProps<{
  label: string
  value: Date
}>()

const emit = defineEmits<{
  'update:value': [date: Date]
}>()

const { formatDate, config } = useFormatting()

const formattedDate = computed(() => props.value ? formatDate(props.value) : props.label)

const selectedDate = computed<DateValue>({
  get() {
    // Použití lokálních metod místo `toISOString()`
    const year = props.value.getFullYear()
    const month = props.value.getMonth() + 1 // getMonth() je 0-indexované
    const day = props.value.getDate()

    return parseDate(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)
  },
  set(value) {
    emit('update:value', value.toDate(getLocalTimeZone()))
  },
})
</script>

<style scoped>
:deep(.calendar) {
  --accent-color: #3b82f6;
  --accent-color-hover: #2563eb;
}

:deep(.calendar-cell[data-selected]) {
  background-color: #3b82f6 !important;
}

:deep(.calendar-cell[data-today]) {
  border-color: #3b82f6 !important;
}

:deep(.calendar-cell:hover:not([data-disabled])) {
  background-color: #eff6ff !important;
}
</style>