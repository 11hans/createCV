<template>
  <label class="group flex h-[3.375rem] items-center justify-between border-b border-invoice transition-all focus-within:border-[#0094FF] [&:hover:not(:focus-within)]:border-black/20">
    <p class="mr-2 whitespace-nowrap text-sm font-medium">{{ label }}</p>
    <div class="relative flex w-full items-center">
      <input
        :id="name"
        :name="name"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        class="-mb-[5px] origin-[right_top] scale-[0.875] text-base sm:mb-0 sm:scale-100 sm:text-sm h-full w-full bg-[#FDFDFD] text-right caret-[#0094FF] focus-visible:outline-none"
        autocomplete="off"
      >
    </div>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  name: string
  modelValue: string
  placeholder?: string
  type?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script> 