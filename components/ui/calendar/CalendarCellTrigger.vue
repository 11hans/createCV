<script lang="ts" setup>
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarCellTrigger, type CalendarCellTriggerProps, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<CalendarCellTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarCellTrigger
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'h-8 w-8 p-0 font-normal',
      // Today's date - clear color
      '[&[data-today]:not([data-selected])]:bg-yellow-200 [&[data-today]:not([data-selected])]:text-foreground',
      // Selected date - blue color #3b82f6
      'data-[selected]:bg-[#3b82f6] data-[selected]:text-white data-[selected]:opacity-100',
      // Disabled
      'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
      // Unavailable
      'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
      // Outside months
      'data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-[#3b82f6]/50 [&[data-outside-view][data-selected]]:text-white [&[data-outside-view][data-selected]]:opacity-30',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>
