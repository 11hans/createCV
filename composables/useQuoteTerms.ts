import { ref } from 'vue'
import { addDays } from 'date-fns'
import { CalendarDate, parseDate, today, getLocalTimeZone } from '@internationalized/date'

export function useQuoteTerms() {
  const issueDate = ref<CalendarDate>(today(getLocalTimeZone()))
  const dueDate = ref<CalendarDate>(parseDate(addDays(new Date(), 14).toISOString().split('T')[0]))
  const number = ref('')
  const note = ref('')

  const toJSDate = (date: CalendarDate) => {
    return new Date(date.toString())
  }

  const setDefaultDates = () => {
    issueDate.value = today(getLocalTimeZone())
    dueDate.value = parseDate(addDays(new Date(), 14).toISOString().split('T')[0])
  }

  return {
    issueDate,
    dueDate,
    number,
    note
  }
} 