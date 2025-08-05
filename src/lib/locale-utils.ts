// 언어/지역 자동 감지 및 관리 유틸리티

export interface UserLocale {
  language: string
  region: string
  timezone: string
  fullLocale: string
}

// REST Countries API 응답 타입
interface CountryApiResponse {
  cca2: string // 2자리 국가 코드
  name: {
    common: string
    official: string
    nativeName?: Record<string, { official: string; common: string }>
  }
  currencies?: Record<string, { name: string; symbol: string }>
  flag: string // 이모지 플래그
  translations?: Record<string, { official: string; common: string }>
}

// 지역 정보 타입
export interface RegionInfo {
  name: string
  flag: string
  currency: string
}

// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES = {
  'ko': { name: '한국어', flag: '🇰🇷' },
  'en': { name: 'English', flag: '🇺🇸' },
} as const

// Fallback 지역 목록 (API 실패 시 사용)
const FALLBACK_REGIONS: Record<string, RegionInfo> = {
  'KR': { name: '대한민국', flag: '🇰🇷', currency: 'KRW' },
  'US': { name: 'United States', flag: '🇺🇸', currency: 'USD' },
  'JP': { name: '日本', flag: '🇯🇵', currency: 'JPY' },
  'CN': { name: '中国', flag: '🇨🇳', currency: 'CNY' },
  'GB': { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  'DE': { name: 'Deutschland', flag: '🇩🇪', currency: 'EUR' },
  'FR': { name: 'France', flag: '🇫🇷', currency: 'EUR' },
  'ES': { name: 'España', flag: '🇪🇸', currency: 'EUR' },
}

// 동적으로 로드된 모든 지역 목록
let SUPPORTED_REGIONS: Record<string, RegionInfo> = { ...FALLBACK_REGIONS }

// 캐시 설정
const COUNTRIES_CACHE_KEY = 'countries_cache'
const CACHE_EXPIRY_KEY = 'countries_cache_expiry'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7일

/**
 * REST Countries API에서 모든 국가 정보 가져오기
 */
export async function fetchAllCountries(): Promise<Record<string, RegionInfo>> {
  try {
    // 캐시 확인
    const cached = localStorage.getItem(COUNTRIES_CACHE_KEY)
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY)

    if (cached !== null && cached.length > 0 && cacheExpiry !== null && cacheExpiry.length > 0) {
      const expiryTime = parseInt(cacheExpiry, 10)
      if (Date.now() < expiryTime) {
        console.log('🌍 캐시된 국가 정보 사용')
        return JSON.parse(cached) as Record<string, RegionInfo>
      }
    }

    console.log('🌍 REST Countries API에서 국가 정보 가져오는 중...')

    // REST Countries API 호출
    const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name,currencies,flag,translations')

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`)
    }

    const countries = await response.json() as CountryApiResponse[]
    const regionsMap: Record<string, RegionInfo> = {}

    for (const country of countries) {
      const countryCode = country.cca2
      const currencies = country.currencies ? Object.values(country.currencies) : []
      const mainCurrency = currencies[0]?.name || 'USD'

      // 한국어 이름 우선, 없으면 영어 이름 사용
      let countryName = country.name.common
      if (country.translations?.kor) {
        countryName = country.translations.kor.common
      }

      regionsMap[countryCode] = {
        name: countryName,
        flag: country.flag,
        currency: mainCurrency.split(' ')[0] || 'USD' // 통화 코드만 추출
      }
    }

    // 캐시 저장
    localStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(regionsMap))
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString())

    console.log(`🌍 ${Object.keys(regionsMap).length}개 국가 정보 로드 완료`)
    return regionsMap

  } catch (error) {
    console.warn('🌍 국가 정보 가져오기 실패, fallback 사용:', error)
    return FALLBACK_REGIONS
  }
}

/**
 * 지원되는 지역 목록 초기화
 */
export async function initializeRegions(): Promise<void> {
  const regions = await fetchAllCountries()
  SUPPORTED_REGIONS = regions
}

/**
 * 현재 지원되는 지역 목록 반환
 */
export function getSupportedRegions(): Record<string, RegionInfo> {
  return SUPPORTED_REGIONS
}

/**
 * 국가 검색 함수
 */
export function searchCountries(query: string): Array<{ code: string; info: RegionInfo }> {
  const regions = getSupportedRegions()
  const queryLower = query.toLowerCase()

  return Object.entries(regions)
    .filter(([code, info]) => {
      const codeMatch = code.toLowerCase().includes(queryLower)
      const nameMatch = info.name.toLowerCase().includes(queryLower)
      const currencyMatch = info.currency.toLowerCase().includes(queryLower)
      return codeMatch || nameMatch || currencyMatch
    })
    .map(([code, info]) => ({ code, info }))
    .slice(0, 20) // 최대 20개 결과
}

/**
 * 인기 있는 국가들 반환 (fallback 국가들 + 몇 개 추가)
 */
export function getPopularCountries(): Array<{ code: string; info: RegionInfo }> {
  const regions = getSupportedRegions()
  const popularCodes = ['KR', 'US', 'JP', 'CN', 'GB', 'DE', 'FR', 'ES', 'CA', 'AU', 'IN', 'BR']

  return popularCodes
    .filter(code => regions[code])
    .map(code => ({ code, info: regions[code] }))
}

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
  if (!Object.keys(getSupportedRegions()).includes(region)) {
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
      (position) => {
        (async () => {
          try {
            const { latitude, longitude } = position.coords

            // Reverse geocoding API 호출 (무료 서비스 사용)
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )

            if (response.ok) {
              const data = await response.json() as { countryCode?: string }
              const countryCode = data.countryCode

              // 지원하는 지역인지 확인
              if (typeof countryCode === 'string' && countryCode.length > 0 && Object.keys(getSupportedRegions()).includes(countryCode)) {
                resolve(countryCode)
                return
              }
            }
          } catch (error) {
            console.warn('위치 기반 지역 감지 실패:', error)
          }

          resolve(null)
        })().catch((error) => {
          console.warn('위치 기반 지역 감지 실패:', error)
          resolve(null)
        })
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
  userLanguage: string
  userCountry: string
  autoDetect: boolean
  country_option: boolean
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
    if (stored !== null && stored.length > 0) {
      return JSON.parse(stored) as UserLocaleSettings
    }
  } catch (error) {
    console.warn('사용자 설정 불러오기 실패:', error)
  }

  // 기본값으로 자동 감지된 값 사용
  const detected = detectUserLocale()
  return {
    userLanguage: detected.language,
    userCountry: detected.region,
    autoDetect: true,
    country_option: true, // 기본값: 국가별 맞춤화 활성화
    lastUpdated: new Date().toISOString()
  }
}

// 초기화 함수 - 앱 시작 시 호출
export async function initializeUserLocale(): Promise<UserLocaleSettings> {
  // 지역 정보를 먼저 초기화 (백그라운드에서 실행)
  initializeRegions().catch(error => {
    console.warn('지역 정보 초기화 실패:', error)
  })

  const settings = getUserLocaleSettings()

  // 자동 감지가 활성화된 경우
  if (settings.autoDetect) {
    const detected = detectUserLocale()

    // 위치 기반 지역 감지 시도 (선택적)
    const locationBasedRegion = await detectLocationBasedRegion()

    const updatedSettings: UserLocaleSettings = {
      ...settings,
      userLanguage: detected.language,
      userCountry: locationBasedRegion || detected.region,
      lastUpdated: new Date().toISOString()
    }

    // 변경사항이 있으면 저장
    if (updatedSettings.userLanguage !== settings.userLanguage || updatedSettings.userCountry !== settings.userCountry) {
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

  return texts[key]?.[currentLocale.userLanguage] || texts[key]?.['en'] || key
}

// ============================================================================
// API 개인화 설정 관련
// ============================================================================

const API_PERSONALIZATION_SETTINGS_KEY = 'api_personalization_settings'

export interface ApiPersonalizationSettings {
  /** API 호출 시 국가/언어 정보 전송 여부 */
  enabled: boolean
  /** 사용자 국가 코드 */
  userCountry?: string
  /** 사용자 언어 코드 */
  userLanguage?: string
  /** 마지막 업데이트 시간 */
  lastUpdated: string
}

/**
 * 지원되는 국가 목록 (API 문서 기준)
 */
export const SUPPORTED_API_COUNTRIES = {
  "KR": "한국",
  "US": "미국",
  "JP": "일본",
  "CN": "중국"
} as const

/**
 * 지원되는 언어 목록 (API 문서 기준)
 */
export const SUPPORTED_API_LANGUAGES = {
  "ko": "한국어",
  "en": "English",
  "ja": "日本語",
  "zh": "中문",
  "es": "Español",
  "fr": "Français"
} as const

/**
 * 브라우저에서 사용자 언어 코드 감지
 */
export function detectUserLanguage(): string | null {
  try {
    const browserLang = navigator.language.split('-')[0] // 'ko-KR' -> 'ko'
    const supportedLangs = Object.keys(SUPPORTED_API_LANGUAGES)
    return supportedLangs.includes(browserLang) ? browserLang : null
  } catch {
    return null
  }
}

/**
 * 브라우저에서 사용자 국가 코드 감지
 */
export function detectUserCountry(): string | null {
  try {
    const locale = navigator.language // 'ko-KR', 'en-US' 등
    if (locale.includes('-')) {
      const countryCode = locale.split('-')[1] // 'KR', 'US' 등
      const supportedCountries = Object.keys(SUPPORTED_API_COUNTRIES)
      return supportedCountries.includes(countryCode) ? countryCode : null
    }
    return null
  } catch {
    return null
  }
}

/**
 * API 개인화 설정 불러오기
 */
export function getApiPersonalizationSettings(): ApiPersonalizationSettings {
  try {
    const stored = sessionStorage.getItem(API_PERSONALIZATION_SETTINGS_KEY)
    if (stored !== null && stored.length > 0) {
      return JSON.parse(stored) as ApiPersonalizationSettings
    }
  } catch (error) {
    console.warn('API 개인화 설정 불러오기 실패:', error)
  }

  // 기본값 - 자동 감지된 값으로 초기화하고 기본적으로 활성화
  const detectedLanguage = detectUserLanguage()
  const detectedCountry = detectUserCountry()

  const defaultSettings: ApiPersonalizationSettings = {
    enabled: true, // 기본적으로 활성화
    userLanguage: detectedLanguage || undefined,
    userCountry: detectedCountry || undefined,
    lastUpdated: new Date().toISOString()
  }

  // 기본값 저장
  saveApiPersonalizationSettings(defaultSettings)
  return defaultSettings
}

/**
 * API 개인화 설정 저장
 */
export function saveApiPersonalizationSettings(settings: ApiPersonalizationSettings): void {
  try {
    const updatedSettings = {
      ...settings,
      lastUpdated: new Date().toISOString()
    }
    sessionStorage.setItem(API_PERSONALIZATION_SETTINGS_KEY, JSON.stringify(updatedSettings))
    console.log('✅ API 개인화 설정 저장:', updatedSettings)
  } catch (error) {
    console.error('API 개인화 설정 저장 실패:', error)
  }
}

/**
 * API 호출용 사용자 정보 반환 (설정이 활성화된 경우에만)
 */
export function getApiUserInfo(): { userCountry?: string; userLanguage?: string } {
  const settings = getApiPersonalizationSettings()

  if (!settings.enabled) {
    return {} // 비활성화된 경우 빈 객체 반환
  }

  const result: { userCountry?: string; userLanguage?: string } = {}

  if (settings.userCountry !== undefined && settings.userCountry.length > 0) {
    result.userCountry = settings.userCountry
  }

  if (settings.userLanguage !== undefined && settings.userLanguage.length > 0) {
    result.userLanguage = settings.userLanguage
  }

  return result
}

// ============================================================================
// 사용법 예시 및 도우미 함수들
// ============================================================================

/**
 * 사용법 예시 - 앱 초기화 시 호출
 */
export async function exampleUsage(): Promise<void> {
  console.log('🌍 지역 정보 시스템 초기화 예시')

  // 1. 지역 정보 초기화 (모든 국가 정보 로드)
  await initializeRegions()
  console.log('✅ 지역 정보 초기화 완료')

  // 2. 전체 국가 목록 확인
  const allRegions = getSupportedRegions()
  console.log(`📍 총 ${Object.keys(allRegions).length}개 국가 지원`)

  // 3. 인기 국가 목록
  const popularCountries = getPopularCountries()
  console.log('🔥 인기 국가들:', popularCountries.slice(0, 5))

  // 4. 국가 검색
  const koreaResults = searchCountries('korea')
  console.log('🔍 "korea" 검색 결과:', koreaResults)

  // 5. 사용자 로케일 초기화
  const userLocale = await initializeUserLocale()
  console.log('👤 사용자 로케일:', userLocale)
}

/**
 * 국가 정보 새로고침 (캐시 무시)
 */
export async function refreshCountries(): Promise<void> {
  // 캐시 삭제
  localStorage.removeItem(COUNTRIES_CACHE_KEY)
  localStorage.removeItem(CACHE_EXPIRY_KEY)

  // 새로 로드
  await initializeRegions()

  // 사용자 설정 검증 및 자동 수정
  validateAndFixUserSettings()

  console.log('🔄 국가 정보 새로고침 완료')
}

/**
 * 사용자 설정이 새로운 국가 목록에서 유효한지 검증하고 수정
 */
export function validateAndFixUserSettings(): void {
  const supportedRegions = getSupportedRegions()

  // 1. 사용자 로케일 설정 검증
  const userSettings = getUserLocaleSettings()
  if (!Object.keys(supportedRegions).includes(userSettings.userCountry)) {
    console.warn(`⚠️ 설정된 지역 '${userSettings.userCountry}'이 더 이상 지원되지 않습니다. 기본값으로 변경합니다.`)

    // 자동 감지 시도, 실패하면 US로 fallback
    const detected = detectUserLocale()
    const fallbackRegion = Object.keys(supportedRegions).includes(detected.region) ? detected.region : 'US'

    saveUserLocaleSettings({
      userCountry: fallbackRegion
    })
  }

  // 2. API 개인화 설정 검증
  const apiSettings = getApiPersonalizationSettings()
  if (apiSettings.userCountry !== undefined && apiSettings.userCountry.length > 0 && !Object.keys(supportedRegions).includes(apiSettings.userCountry)) {
    console.warn(`⚠️ API 설정의 국가 '${apiSettings.userCountry}'이 더 이상 지원되지 않습니다. 초기화합니다.`)

    const updatedApiSettings: ApiPersonalizationSettings = {
      ...apiSettings,
      userCountry: undefined, // 초기화하여 자동 감지하도록
      lastUpdated: new Date().toISOString()
    }
    saveApiPersonalizationSettings(updatedApiSettings)
  }
}