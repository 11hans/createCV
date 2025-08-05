import { CalendarDate, today, getLocalTimeZone, parseDate } from '@internationalized/date'
import { addDays } from 'date-fns'

export const toJSDate = (date: CalendarDate) => {
  return new Date(date.toString())
}

export const getDefaultDates = () => {
  return {
    issueDate: today(getLocalTimeZone()),
    dueDate: parseDate(addDays(new Date(), 14).toISOString().split('T')[0])
  }
}
