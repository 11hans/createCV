// language/config.ts
import type { LanguageConfig } from './types';

export const languageConfig: LanguageConfig = {
defaultLocale: 'cs',
productionDomains: {
    cs: 'qfast.cz',
    en: 'qfast.co'
},
 devPortMap: {
      '3000': 'cs',
      '3001': 'en'
    }
};