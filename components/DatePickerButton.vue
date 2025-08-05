<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from '@radix-icons/vue'
import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date'
import { cn } from '@/lib/utils'
import { toDate } from 'radix-vue/date'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormatting } from '~/composables/useFormatting'

const props = defineProps<{
  value: Date
  label: string
}>()

const emit = defineEmits<{
  'update:value': [date: Date]
}>()

const { locale } = useI18n()
const { formatDate, config } = useFormatting()

const formattedDate = computed(() => props.value ? formatDate(props.value) : props.label)

const selectedDate = computed<DateValue>({
  get() {
    const year = props.value.getFullYear()
    const month = props.value.getMonth() + 1
    const day = props.value.getDate()

    return parseDate(`${String(year)}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
  },
  set(value) {
     const localDate = value.toDate(getLocalTimeZone())
    // Nastavit čas na 12:00, abychom se vyhnuli posunům kolem půlnoci
    localDate.setHours(12, 0, 0, 0)
    emit('update:value', localDate)
    },
})
</script>

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