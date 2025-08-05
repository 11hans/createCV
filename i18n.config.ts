// i18n.config.ts
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'cs',
  fallbackLocale: 'cs',
  availableLocales: ['cs', 'en'],
  sync: true,
  silentTranslationWarn: true
}))