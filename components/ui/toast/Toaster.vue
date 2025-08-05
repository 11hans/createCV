<script setup lang="ts">
import { isVNode } from 'vue'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '.'
import { useToast } from './use-toast'
import type { ToastVariants } from '.'

const { toasts } = useToast()

// Helper function to get the appropriate icon for each toast type
const getToastIcon = (variant: ToastVariants['variant']) => {
  switch (variant) {
    case 'success':
      return 'check-circle'
    case 'warning':
      return 'alert-triangle'
    case 'info':
      return 'info'
    case 'destructive':
      return 'alert-octagon'
    default:
      return null
  }
}

// Helper function to get background color class
const getBackgroundClass = (variant: ToastVariants['variant']) => {
  switch (variant) {
    case 'success':
      return 'bg-green-100 dark:bg-green-900 bg-opacity-100 dark:bg-opacity-100'
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900 bg-opacity-100 dark:bg-opacity-100'
    case 'info':
      return 'bg-blue-100 dark:bg-blue-900 bg-opacity-100 dark:bg-opacity-100'
    case 'destructive':
      return 'bg-red-100 dark:bg-red-900 bg-opacity-100 dark:bg-opacity-100'
    default:
      return 'bg-white dark:bg-gray-800 bg-opacity-100 dark:bg-opacity-100'
  }
}
</script>

<template>
  <ToastProvider>
    <Toast v-for="toast in toasts" :key="toast.id" v-bind="toast" class="radix-toast backdrop-blur-none !bg-opacity-100 dark:!bg-opacity-100">
      <div :class="['flex items-start gap-3 w-full', getBackgroundClass(toast.variant)]">
        <div v-if="getToastIcon(toast.variant)" class="flex-shrink-0 mt-0.5">
          <div v-if="toast.variant === 'success'" class="w-5 h-5 text-green-600 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div v-else-if="toast.variant === 'warning'" class="w-5 h-5 text-yellow-600 dark:text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div v-else-if="toast.variant === 'info'" class="w-5 h-5 text-blue-600 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <div v-else-if="toast.variant === 'destructive'" class="w-5 h-5 text-red-600 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
        </div>
        
        <div class="grid gap-1 flex-1">
          <ToastTitle v-if="toast.title" class="font-semibold">
            {{ toast.title }}
          </ToastTitle>
          <template v-if="toast.description">
            <ToastDescription v-if="isVNode(toast.description)">
              <component :is="toast.description" />
            </ToastDescription>
            <ToastDescription v-else>
              {{ toast.description }}
            </ToastDescription>
          </template>
          <component v-if="toast.action" :is="toast.action" class="mt-2" />
        </div>
        
        <ToastClose class="self-start" />
      </div>
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
