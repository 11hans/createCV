import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app/**/*.{ts,tsx}',
    './composables/**/*.{js,ts}',
    './constants/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
  ],
  darkMode: 'class', // Enable class-based dark mode if you plan to use it
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.75rem',
        'xxxs': '0.625rem',
      },
      colors: {
        // Brand Colors - Directly using CSS variables
        'brand-primary': 'var(--brand-primary)',
        'brand-primary-dark': 'var(--brand-primary-dark)',
        'brand-background': 'var(--brand-background)',
        'brand-background-secondary': 'var(--brand-background-secondary)',
        'brand-background-tertiary': 'var(--brand-background-tertiary)',
        'brand-foreground': 'var(--brand-foreground)',
        'brand-neutrals': {
          200: 'var(--brand-neutrals-200)',
          400: 'var(--brand-neutrals-400)',
          600: 'var(--brand-neutrals-600)',
          700: 'var(--brand-neutrals-700)'
        },
        'brand-borders': 'var(--brand-borders)',
        'brand-borders-hover': 'var(--brand-borders-hover)',

        // Form Colors - Directly using CSS variables
        form: {
          bg: 'var(--form-bg)',
          text: 'var(--form-text)',
          label: 'var(--form-label)',
          border: 'var(--form-border)',
          'border-hover': 'var(--form-border-hover)',
          'border-focus': 'var(--form-border-focus)',
          placeholder: 'var(--form-placeholder)',
          disabled: 'var(--form-disabled)', // Add disabled color
          caret: 'var(--form-caret)', // Add caret color
        },
        muted: { // Muted colors palette
          foreground: 'var(--form-placeholder)', // muted-foreground uses form placeholder
          DEFAULT: 'var(--brand-borders)', // Example muted background/border color
        },
        ring: { // Ring colors palette - **CORRECTED: Only one definition**
          DEFAULT: 'var(--brand-primary-dark)', // ring-ring uses brand primary dark
        },

        // Quote Colors - Directly using CSS variables
        quote: {
          light: 'var(--quote-light)',
          dark: 'var(--quote-dark)'
        },
        destructive: { // Destructive colors (consistent with Shadcn UI)
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        popover: { // Popover colors (consistent with Shadcn UI - adjust if needed)
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: { // Card colors (consistent with Shadcn UI - adjust if needed)
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popoverForeground: 'hsl(var(--popover-foreground))', // Example, adjust if needed
        cardForeground: 'hsl(var(--card-foreground))', // Example, adjust if needed
        background: 'hsl(var(--background))', // Ensure background is defined
        foreground: 'hsl(var(--foreground))', // Ensure foreground is defined
        accent: 'hsl(var(--accent))', // Ensure accent is defined
        accentForeground: 'hsl(var(--accent-foreground))', // Ensure accent-foreground is defined
        input: 'hsl(var(--input))', // Ensure input is defined
        secondary: 'hsl(var(--secondary))', // Ensure secondary is defined
        secondaryForeground: 'hsl(var(--secondary-foreground))', // Ensure secondary-foreground is defined,
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        mono: 'var(--font-mono)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: '0' },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config

export default config