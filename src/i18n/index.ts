import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 번역 파일들 import
import koCommon from './locales/ko/common.json'
import koHome from './locales/ko/home.json'

import enCommon from './locales/en/common.json'
import enHome from './locales/en/home.json'

// 언어별 리소스 구성
const resources = {
  ko: {
    common: koCommon,
    home: koHome,
  },
  en: {
    common: enCommon,
    home: enHome,
  },
}

// 브라우저에서 언어 감지
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0]
  return ['ko', 'en'].includes(browserLang) ? browserLang : 'ko' // 기본값은 한국어
}

// i18next 초기화
void i18n
  .use(initReactI18next) // react-i18next와 연결
  .init({
    resources,
    lng: getBrowserLanguage(), // 초기 언어 설정
    fallbackLng: 'ko', // 폴백 언어
    debug: process.env.NODE_ENV === 'development', // 개발 모드에서만 디버그
    
    // namespace 설정
    defaultNS: 'common',
    ns: ['common', 'home'],
    
    interpolation: {
      escapeValue: false, // React에서는 XSS 보호가 기본 제공됨
    },
    
    // 번역이 없을 때 키를 그대로 표시
    returnEmptyString: false,
    
    // localStorage에 언어 설정 저장
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n