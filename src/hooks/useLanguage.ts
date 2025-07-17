import { useTranslation } from 'react-i18next';

export type SupportedLanguage = 'ko' | 'en';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  flag: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
    nativeName: '한국어'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  }
];

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = SUPPORTED_LANGUAGES.find(
    lang => lang.code === i18n.language
  ) || SUPPORTED_LANGUAGES[0];

  const changeLanguage = (languageCode: SupportedLanguage) => {
    i18n.changeLanguage(languageCode);
  };

  const isCurrentLanguage = (languageCode: SupportedLanguage) => {
    return i18n.language === languageCode;
  };

  return {
    currentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
    isCurrentLanguage,
    t,
    i18n
  };
}; 