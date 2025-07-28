import { apiRequest, authenticatedRequest, type LoginResponse, type User } from './api'

// 구글 로그인 (ID 토큰 사용)
export async function loginWithGoogle(googleToken: string) {
    const deviceInfo = navigator.userAgent
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    return apiRequest<LoginResponse>('/api/v1/auth/google', {
        method: 'POST',
        body: JSON.stringify({
            googleToken, // 이제 ID 토큰입니다
            deviceInfo,
            timezone
        }),
    })
}

// 로그아웃
export async function logout() {
    console.log('🌐 서버 로그아웃 API 호출')
    const result = await authenticatedRequest('/api/v1/auth/logout', {
        method: 'POST',
    })
    console.log('📡 서버 로그아웃 응답:', result)
    return result
}

// 현재 사용자 정보 가져오기
export async function getCurrentUser() {
    return authenticatedRequest<User>('/api/v1/auth/me')
}

// 토큰 갱신
export async function refreshToken() {
    const refreshTokenValue = localStorage.getItem('refreshToken')

    if (!refreshTokenValue) {
        console.log('❌ Refresh token이 없습니다')
        return {
            success: false,
            error: 'No refresh token available',
        }
    }

    console.log('🔄 토큰 갱신 요청 시작')
    const response = await apiRequest<{ accessToken: string }>('/api/v1/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
    })

    if (response.success && response.data) {
        console.log('✅ 토큰 갱신 성공')
        // 새 토큰 자동 저장
        localStorage.setItem('accessToken', response.data.accessToken)
        return {
            success: true,
            data: response.data,
        }
    } else {
        console.log('❌ 토큰 갱신 실패:', response.error)
        // 갱신 실패 시 기존 토큰들 제거
        clearTokens()
        return {
            success: false,
            error: response.error || 'Token refresh failed',
        }
    }
}

// 토큰 저장
export function saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
}

// 토큰 제거
export function clearTokens() {
    console.log('🧹 로컬 토큰 삭제 중...')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    console.log('✅ 로컬 토큰 삭제 완료')
}

// 로그인 상태 확인
export function isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken')
}

// 구글 OAuth URL 생성 (웹 기반 OAuth 플로우용)
export function getGoogleOAuthUrl() {
    const clientId = (import.meta.env as { VITE_GOOGLE_CLIENT_ID?: string }).VITE_GOOGLE_CLIENT_ID || ''
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${window.location.origin}/auth/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
} 