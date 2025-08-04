// 언어/지역 자동 감지 및 관리 유틸리티

export interface UserLocale {
  language: string
  region: string
  timezone: string
  fullLocale: string
}

// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES = {
  'ko': { name: '한국어', flag: '🇰🇷' },
  'en': { name: 'English', flag: '🇺🇸' },
  'ja': { name: '日本語', flag: '🇯🇵' },
  'zh': { name: '中文', flag: '🇨🇳' },
  'es': { name: 'Español', flag: '🇪🇸' },
  'fr': { name: 'Français', flag: '🇫🇷' },
} as const

// 지원하는 지역 목록
export const SUPPORTED_REGIONS = {
  'KR': { name: '대한민국', flag: '🇰🇷', currency: 'KRW' },
  'US': { name: 'United States', flag: '🇺🇸', currency: 'USD' },
  'JP': { name: '日本', flag: '🇯🇵', currency: 'JPY' },
  'CN': { name: '中国', flag: '🇨🇳', currency: 'CNY' },
  'GB': { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  'DE': { name: 'Deutschland', flag: '🇩🇪', currency: 'EUR' },
  'FR': { name: 'France', flag: '🇫🇷', currency: 'EUR' },
  'ES': { name: 'España', flag: '🇪🇸', currency: 'EUR' },
} as const

// 브라우저에서 사용자 로케일 정보 자동 감지
export function detectUserLocale(): UserLocale {
  // 브라우저 언어 감지
  const browserLanguage = navigator.language || navigator.languages?.[0] || 'en-US'
  const [detectedLang, detectedRegion] = browserLanguage.split('-')
  
  // 지원하는 언어로 매핑
  const language = Object.keys(SUPPORTED_LANGUAGES).includes(detectedLang.toLowerCase()) 
    ? detectedLang.toLowerCase() 
    : 'en'

  // 지역 정보 감지 (Intl.DateTimeFormat 사용)
  let region = detectedRegion?.toUpperCase() || 'US'
  
  try {
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions()
    const timeZoneRegion = resolvedOptions.timeZone?.split('/')[0]
    
    // 타임존을 기반으로 지역 추측
    if (resolvedOptions.timeZone?.includes('Seoul') || resolvedOptions.timeZone?.includes('Asia/Seoul')) {
      region = 'KR'
    } else if (resolvedOptions.timeZone?.includes('Tokyo') || resolvedOptions.timeZone?.includes('Asia/Tokyo')) {
      region = 'JP'
    } else if (resolvedOptions.timeZone?.includes('Shanghai') || resolvedOptions.timeZone?.includes('Asia/Shanghai')) {
      region = 'CN'
    } else if (resolvedOptions.timeZone?.includes('Europe')) {
      // 유럽 지역은 더 세밀한 감지 필요
      if (resolvedOptions.timeZone?.includes('London')) region = 'GB'
      else if (resolvedOptions.timeZone?.includes('Berlin')) region = 'DE'
      else if (resolvedOptions.timeZone?.includes('Paris')) region = 'FR'
      else if (resolvedOptions.timeZone?.includes('Madrid')) region = 'ES'
    }
  } catch (error) {
    console.warn('지역 감지 실패:', error)
  }

  // 지원하지 않는 지역인 경우 기본값 사용
  if (!Object.keys(SUPPORTED_REGIONS).includes(region)) {
    region = 'US'
  }

  return {
    language,
    region,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    fullLocale: `${language}-${region}`
  }
}

// GPS를 통한 위치 기반 지역 감지 (선택적)
export async function detectLocationBasedRegion(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Reverse geocoding API 호출 (무료 서비스 사용)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          
          if (response.ok) {
            const data = await response.json()
            const countryCode = data.countryCode
            
            // 지원하는 지역인지 확인
            if (Object.keys(SUPPORTED_REGIONS).includes(countryCode)) {
              resolve(countryCode)
              return
            }
          }
        } catch (error) {
          console.warn('위치 기반 지역 감지 실패:', error)
        }
        
        resolve(null)
      },
      (error) => {
        console.warn('GPS 위치 접근 실패:', error)
        resolve(null)
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    )
  })
}

// 사용자 설정 저장/불러오기
const STORAGE_KEY = 'userLocaleSettings'

export interface UserLocaleSettings {
  language: string
  region: string
  autoDetect: boolean
  lastUpdated: string
}

export function saveUserLocaleSettings(settings: Partial<UserLocaleSettings>): void {
  const currentSettings = getUserLocaleSettings()
  const updatedSettings: UserLocaleSettings = {
    ...currentSettings,
    ...settings,
    lastUpdated: new Date().toISOString()
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings))
  console.log('🌍 사용자 언어/지역 설정 저장:', updatedSettings)
}

export function getUserLocaleSettings(): UserLocaleSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('사용자 설정 불러오기 실패:', error)
  }

  // 기본값으로 자동 감지된 값 사용
  const detected = detectUserLocale()
  return {
    language: detected.language,
    region: detected.region,
    autoDetect: true,
    lastUpdated: new Date().toISOString()
  }
}

// 초기화 함수 - 앱 시작 시 호출
export async function initializeUserLocale(): Promise<UserLocaleSettings> {
  const settings = getUserLocaleSettings()
  
  // 자동 감지가 활성화된 경우
  if (settings.autoDetect) {
    const detected = detectUserLocale()
    
    // 위치 기반 지역 감지 시도 (선택적)
    const locationBasedRegion = await detectLocationBasedRegion()
    
    const updatedSettings: UserLocaleSettings = {
      ...settings,
      language: detected.language,
      region: locationBasedRegion || detected.region,
      lastUpdated: new Date().toISOString()
    }
    
    // 변경사항이 있으면 저장
    if (updatedSettings.language !== settings.language || updatedSettings.region !== settings.region) {
      saveUserLocaleSettings(updatedSettings)
      return updatedSettings
    }
  }
  
  return settings
}

// 현재 언어/지역에 맞는 텍스트 반환
export function getLocalizedText(key: string, locale?: UserLocaleSettings): string {
  const currentLocale = locale || getUserLocaleSettings()
  
  // 간단한 다국어 지원 (확장 가능)
  const texts: Record<string, Record<string, string>> = {
    'header.language': {
      'ko': '언어',
      'en': 'Language',
      'ja': '言語',
      'zh': '语言',
      'es': 'Idioma',
      'fr': 'Langue'
    },
    'header.region': {
      'ko': '지역',
      'en': 'Region',
      'ja': '地域',
      'zh': '地区',
      'es': 'Región',
      'fr': 'Région'
    }
  }
  
  return texts[key]?.[currentLocale.language] || texts[key]?.['en'] || key
}