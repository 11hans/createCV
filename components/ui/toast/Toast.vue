<script setup lang="ts">
import { cn } from '@/lib/utils'
import { ToastRoot, type ToastRootEmits, useForwardPropsEmits } from 'radix-vue'
import { computed } from 'vue'
import { type ToastProps, toastVariants } from '.'

const props = defineProps<ToastProps>()

const emits = defineEmits<ToastRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToastRoot
    v-bind="forwarded"
    :class="cn(toastVariants({ variant }), 'relative', props.class)"
    @update:open="onOpenChange"
  >
    <!-- Enhanced background layer with solid colors -->
    <div class="absolute inset-0 -z-10 opacity-100 shadow-md" :class="{
      'bg-white dark:bg-gray-800': variant === 'default',
      'bg-red-100 dark:bg-red-900': variant === 'destructive',
      'bg-green-100 dark:bg-green-900': variant === 'success',
      'bg-yellow-100 dark:bg-yellow-900': variant === 'warning',
      'bg-blue-100 dark:bg-blue-900': variant === 'info',
    }"></div>
    <slot />
  </ToastRoot>
</template>
