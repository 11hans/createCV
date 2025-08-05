<template>
  <div class="quote-terms-container">
    <h3 class="form-section-title">{{ $t('quote.form.terms.title') }}</h3>
    
    <!-- Quote Number -->
    <div class="form-field">
      <label class="form-label" for="number">{{ $t('quote.form.terms.number') }}</label>
      <input 
        v-model="number"
        class="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        id="number"
        :placeholder="$t('quote.form.terms.numberPlaceholder')"
        type="text"
      />
    </div>

    <!-- Issue Date -->
    <div class="form-field">
      <label class="form-label">{{ $t('quote.form.terms.issueDate') }}</label>
      <div class="form-datepicker">
        <DatePickerButton
          :value="issueDateJS"
          @update:value="handleIssueDateChange"
          :label="$t('quote.form.terms.issueDateLabel')"
          class="date-picker-button"
        />
      </div>
    </div>

    <!-- Due Date -->
    <div class="form-field">
      <label class="form-label">{{ $t('quote.form.terms.dueDate') }}</label>
      <div class="form-datepicker">
        <DatePickerButton
          :value="dueDateJS"
          @update:value="handleDueDateChange"
          :label="$t('quote.form.terms.dueDateLabel')"
          class="date-picker-button"
        />
      </div>
    </div>

    <!-- Note -->
    <div class="note-field mt-4">
      <label class="form-label" for="note">{{ $t('quote.form.terms.note') }}</label>
      <textarea
        v-model="note"
        class="form-input h-48 resize-none py-2 px-3 leading-normal focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        id="note"
        name="notes"
        rows="10"
        :placeholder="$t('quote.form.terms.notePlaceholder')"
      ></textarea>
    </div>
    
    <!-- Instructions -->
    <div class="note-field mt-4">
      <label class="form-label" for="instructions">{{ $t('quote.form.terms.instructions') }}</label>
      <textarea
        v-model="instructions"
        class="form-input h-48 resize-none py-2 px-3 leading-normal focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        id="instructions"
        name="instructions"
        rows="14"
        :placeholder="$t('quote.form.terms.instructionsPlaceholder')"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuoteTerms } from '@/composables/useQuoteTerms'
import DatePickerButton from '@/components/DatePickerButton.vue'
import { CalendarDate, parseDate } from '@internationalized/date'
import { computed, watch, onMounted } from 'vue'
import { useQuoteStore } from '@/stores/quote'
import { useRoute } from 'vue-router'

// Types
interface QuoteTerms {
  number: string
  issueDate: CalendarDate
  dueDate: CalendarDate
  note: string
  instructions: string
}

// Props & Emits
const props = defineProps<{
  modelValue?: QuoteTerms
}>()

const emit = defineEmits<{
  'update:modelValue': [value: QuoteTerms]
}>()

// Use the quote terms composable and store
const terms = useQuoteTerms()
const quoteStore = useQuoteStore()
const route = useRoute()

// Load quote data if we have an ID
onMounted(() => {
  // Initialize with store data
  terms.number.value = quoteStore.terms.number
  terms.note.value = quoteStore.terms.note
  terms.issueDate.value = quoteStore.terms.issueDate ? parseDate(new Date(quoteStore.terms.issueDate).toISOString().split('T')[0]) : parseDate(new Date().toISOString().split('T')[0])
  terms.dueDate.value = quoteStore.terms.dueDate ? parseDate(new Date(quoteStore.terms.dueDate).toISOString().split('T')[0]) : parseDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
})

// Initialize with store data
watch(() => quoteStore.terms, (newTerms) => {
  if (newTerms) {
    terms.number.value = newTerms.number || ''
    terms.note.value = newTerms.note || ''
    terms.issueDate.value = newTerms.issueDate ? parseDate(new Date(newTerms.issueDate).toISOString().split('T')[0]) : parseDate(new Date().toISOString().split('T')[0])
    terms.dueDate.value = newTerms.dueDate ? parseDate(new Date(newTerms.dueDate).toISOString().split('T')[0]) : parseDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  }
}, { immediate: true })

// Helper function to convert CalendarDate to Date
const toJSDate = (calendarDate: unknown): Date => {
  if (calendarDate instanceof CalendarDate) {
    return new Date(calendarDate.toString())
  }
  return new Date()
}

// Helper function to ensure we have a CalendarDate
const ensureCalendarDate = (value: unknown): CalendarDate => {
  if (value instanceof CalendarDate) {
    return value
  }
  return parseDate(new Date().toISOString().split('T')[0])
}

// Convert CalendarDate to JS Date for DatePickerButton
const issueDateJS = computed(() => toJSDate(terms.issueDate.value))
const dueDateJS = computed(() => toJSDate(terms.dueDate.value))

// Handle date changes from DatePickerButton
const handleIssueDateChange = (date: Date) => {
  const calendarDate = parseDate(date.toISOString().split('T')[0])
  issueDate.value = calendarDate
}

const handleDueDateChange = (date: Date) => {
  const calendarDate = parseDate(date.toISOString().split('T')[0])
  dueDate.value = calendarDate
}

// Computed values for v-model bindings
const number = computed({
  get: () => terms.number.value,
  set: (val: string) => {
    terms.number.value = val
    quoteStore.updateTerms({
      ...quoteStore.terms,
      number: val
    })
  }
})

const note = computed({
  get: () => terms.note.value,
  set: (val: string) => {
    terms.note.value = val
    quoteStore.updateTerms({
      ...quoteStore.terms,
      note: val
    })
  }
})

const issueDate = computed<CalendarDate>({
  get: () => ensureCalendarDate(terms.issueDate.value),
  set: (val: CalendarDate) => {
    terms.issueDate.value = val
    quoteStore.updateTerms({
      ...quoteStore.terms,
      issueDate: toJSDate(val)
    })
  }
})

const dueDate = computed<CalendarDate>({
  get: () => ensureCalendarDate(terms.dueDate.value),
  set: (val: CalendarDate) => {
    terms.dueDate.value = val
    quoteStore.updateTerms({
      ...quoteStore.terms,
      dueDate: toJSDate(val)
    })
  }
})

const instructions = computed({
  get: () => quoteStore.instructions ?? '',
  set: (val: string) => {
    quoteStore.instructions = val || null
  }
})

// Watch for changes and emit updates
watch(
  () => ({
    number: terms.number.value,
    issueDate: ensureCalendarDate(terms.issueDate.value),
    dueDate: ensureCalendarDate(terms.dueDate.value),
    note: terms.note.value,
    instructions: quoteStore.instructions ?? ''
  }),
  (newValue) => {
    emit('update:modelValue', {
      number: newValue.number,
      issueDate: ensureCalendarDate(newValue.issueDate),
      dueDate: ensureCalendarDate(newValue.dueDate),
      note: newValue.note,
      instructions: newValue.instructions
    })
  },
  { deep: true }
)

// Update due date when issue date changes
watch(() => terms.issueDate.value, (newIssueDate) => {
  if (newIssueDate) {
    const newDueDate = new Date(ensureCalendarDate(newIssueDate).toString())
    newDueDate.setDate(newDueDate.getDate() + 14)
    terms.dueDate.value = parseDate(newDueDate.toISOString().split('T')[0])
  }
})
</script>

<style scoped>
.quote-terms-container {
  max-width: 100%;
}

:deep(.date-picker-button button) {
  border-color: #e5e7eb;
  transition: all 0.2s ease;
}

:deep(.date-picker-button button:hover) {
  border-color: #3b82f6;
}

:deep(.date-picker-button button:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>