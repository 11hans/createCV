<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { CalendarCell, type CalendarCellProps, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<CalendarCellProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarCell
    :class="cn(
      'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
      // Simple color-based styling
      '[&:has([data-selected])]:bg-[#3b82f6]/10',
      '[&:has([data-today])]:bg-yellow-100/50',
      '[&:has([data-outside-view])]:bg-gray-50',
      props.class
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCell>
</template>
