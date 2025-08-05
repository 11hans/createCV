import type { ToastRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

export { default as Toast } from './Toast.vue'
export { default as ToastAction } from './ToastAction.vue'
export { default as ToastClose } from './ToastClose.vue'
export { default as ToastDescription } from './ToastDescription.vue'
export { default as Toaster } from './Toaster.vue'
export { default as ToastProvider } from './ToastProvider.vue'
export { default as ToastTitle } from './ToastTitle.vue'
export { default as ToastViewport } from './ToastViewport.vue'
export { toast, useToast } from './use-toast'

import { cva, type VariantProps } from 'class-variance-authority'

export const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-white dark:bg-gray-800 text-foreground backdrop-blur-none !bg-opacity-100 dark:!bg-opacity-100',
        destructive:
                    'destructive group border-destructive bg-destructive text-destructive-foreground backdrop-blur-none !bg-opacity-100',
        success: 'border-green-500 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 backdrop-blur-none !bg-opacity-100 dark:!bg-opacity-100',
        warning: 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 backdrop-blur-none !bg-opacity-100 dark:!bg-opacity-100',
        info: 'border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 backdrop-blur-none !bg-opacity-100 dark:!bg-opacity-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type ToastVariants = VariantProps<typeof toastVariants>

// Export the ToastVariants type
export type { ToastVariants }

export interface ToastProps extends ToastRootProps {
  class?: HTMLAttributes['class']
  variant?: ToastVariants['variant']
  onOpenChange?: ((value: boolean) => void) | undefined
}
