/**
 * 카카오톡 인앱 브라우저 관련 유틸리티 함수들
 */

/**
 * 현재 브라우저가 카카오톡 인앱 브라우저인지 확인
 */
export function isKakaoTalkInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  
  // 카카오톡 인앱 브라우저 User-Agent 패턴 확인
  return (
    userAgent.includes('kakaotalk') ||
    userAgent.includes('kakao') ||
    // 카카오톡에서 사용하는 추가 패턴들
    (userAgent.includes('mobile') && userAgent.includes('safari') && userAgent.includes('kakao'))
  )
}

/**
 * 외부 브라우저로 리다이렉트
 * @param url 리다이렉트할 URL (기본값: 현재 URL)
 */
export function redirectToExternalBrowser(url?: string): void {
  const targetUrl = url || window.location.href
  
  try {
    // 카카오톡 외부 브라우저 열기 스키마 사용
    const kakaoUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(targetUrl)}`
    
    console.log('🔗 카카오톡에서 외부 브라우저로 리다이렉트:', targetUrl)
    
    // 즉시 리다이렉트
    window.location.href = kakaoUrl
    
    // 백업: 일정 시간 후에도 리다이렉트되지 않으면 직접 URL로 이동
    setTimeout(() => {
      window.location.href = targetUrl
    }, 1000)
    
  } catch (error) {
    console.error('외부 브라우저 리다이렉트 실패:', error)
    // 실패 시 현재 창에서 그대로 진행
  }
}

/**
 * 카카오톡 인앱 브라우저에서 자동으로 외부 브라우저로 리다이렉트
 * @param url 리다이렉트할 URL (기본값: 현재 URL)
 * @param immediate 즉시 리다이렉트 여부 (기본값: true)
 */
export function autoRedirectFromKakaoTalk(url?: string, immediate: boolean = true): boolean {
  if (!isKakaoTalkInAppBrowser()) {
    return false
  }
  
  console.log('🔍 카카오톡 인앱 브라우저 감지됨')
  
  if (immediate) {
    redirectToExternalBrowser(url)
  }
  
  return true
}

/**
 * 카카오톡 관련 경고 메시지 표시용 텍스트
 */
export const KAKAO_MESSAGES = {
  DETECTED: '카카오톡 인앱 브라우저가 감지되었습니다.',
  REDIRECTING: '더 나은 사용 경험을 위해 외부 브라우저로 이동합니다.',
  MANUAL_REDIRECT: '외부 브라우저에서 열기',
  FAILED: '외부 브라우저로 자동 이동에 실패했습니다. 수동으로 링크를 복사하여 브라우저에서 열어주세요.'
} as const