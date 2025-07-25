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

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        })

        const data: unknown = await response.json()

        if (!response.ok) {
            return {
                success: false,
                error: (data as { message?: string }).message || `HTTP ${response.status}`,
            }
        }

        return {
            success: true,
            data: data as T,
        }
    } catch (error) {
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

    return apiRequest<T>(endpoint, {
        ...options,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    })
}

export { apiRequest, authenticatedRequest }

