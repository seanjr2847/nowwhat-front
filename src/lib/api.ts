// API 클라이언트 설정
const API_BASE_URL = 'https://nowwhat-back.vercel.app'

// API 응답 타입 정의
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    message?: string
    error?: string
}

// 사용자 정보 타입
export interface User {
    id: string
    email: string
    name: string
    avatar?: string
    createdAt: string
}

// 로그인 응답 타입
export interface LoginResponse {
    user: User
    accessToken: string
    refreshToken: string
}

// API 요청 헬퍼 함수
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    console.log('🌐 API 요청 시작:', { endpoint, method: options.method || 'GET', url })

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        })

        console.log('📡 API 응답 상태:', { status: response.status, statusText: response.statusText })

        const data: unknown = await response.json()
        console.log('📄 API 응답 데이터:', data)

        if (!response.ok) {
            console.error('❌ API 요청 실패:', { status: response.status, data })
            return {
                success: false,
                error: (data as { message?: string }).message || `HTTP ${response.status}`,
            }
        }

        console.log('✅ API 요청 성공')
        return {
            success: true,
            data: data as T,
        }
    } catch (error) {
        console.error('💥 API 요청 에러:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

// 인증된 요청을 위한 헬퍼 함수
async function authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('accessToken')
    console.log('🔐 인증된 요청:', { endpoint, hasToken: !!token })

    return apiRequest<T>(endpoint, {
        ...options,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    })
}

export { apiRequest, authenticatedRequest }

