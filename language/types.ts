export type AvailableLocale = 'cs' | 'en';

export interface LanguageConfig {
  defaultLocale: AvailableLocale;
  productionDomains: {
      [key in AvailableLocale]: string;
  };
  devPortMap: {
      [key: string]: AvailableLocale
  }
}