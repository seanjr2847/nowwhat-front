// API 클라이언트 설정
const API_BASE_URL = 'https://nowwhat-back.vercel.app'

// API 응답 타입 정의
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    message?: string
    error?: string
    status?: number  // HTTP 상태 코드 추가
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
                status: response.status,  // 상태 코드 포함
                error: (data as { message?: string }).message || `HTTP ${response.status}`,
            }
        }

        console.log('✅ API 요청 성공')
        return {
            success: true,
            status: response.status,
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

// 토큰 갱신 함수 (순환 참조 방지를 위해 여기서 정의)
async function refreshTokenRequest(): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    const refreshTokenValue = localStorage.getItem('refreshToken')

    if (!refreshTokenValue) {
        return {
            success: false,
            error: 'No refresh token available',
        }
    }

    const response = await apiRequest<{ accessToken: string }>('/api/v1/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
    })

    if (response.success && response.data) {
        // 새 토큰 저장
        localStorage.setItem('accessToken', response.data.accessToken)
        return {
            success: true,
            accessToken: response.data.accessToken
        }
    }

    return {
        success: false,
        error: response.error || 'Token refresh failed'
    }
}

// 인증된 요청을 위한 헬퍼 함수 (토큰 자동 갱신 포함)
async function authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('accessToken')
    console.log('🔐 인증된 요청:', { endpoint, hasToken: !!token, retryCount })

    if (!token) {
        console.error('❌ 토큰이 없습니다. 로그인이 필요합니다.')
        return {
            success: false,
            error: '인증이 필요합니다. 로그인 후 다시 시도해주세요.',
        }
    }

    const response = await apiRequest<T>(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',  // 기본 Content-Type 보장
            Authorization: `Bearer ${token}`,
            ...options.headers,  // 사용자 정의 헤더가 있으면 덮어씀
        },
    })

    // 401 에러 처리 (토큰 만료)
    if (!response.success && response.status === 401) {
        console.log('🔄 401 에러 감지, 토큰 갱신 시도...')

        if (retryCount === 0) {
            const refreshResult = await refreshTokenRequest()

            if (refreshResult.success) {
                console.log('✅ 토큰 갱신 성공, 요청 재시도')
                // 토큰 갱신 성공 시 재시도
                return authenticatedRequest<T>(endpoint, options, retryCount + 1)
            } else {
                console.log('❌ 토큰 갱신 실패, 로그인 필요')
                // 토큰 갱신 실패 시 로그아웃 처리
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')

                // 로그인 페이지로 리다이렉트
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }

                return {
                    success: false,
                    status: 401,
                    error: '인증이 만료되었습니다. 다시 로그인해주세요.',
                }
            }
        } else {
            console.log('❌ 토큰 갱신 후에도 401 에러, 로그인 필요')
            // 토큰 갱신 후에도 실패하면 로그아웃
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }

            return {
                success: false,
                status: 401,
                error: '인증에 실패했습니다. 다시 로그인해주세요.',
            }
        }
    }

    // 403 에러 처리 (권한 부족)
    if (!response.success && response.status === 403) {
        console.error('❌ 403 권한 부족 에러')
        return {
            success: false,
            status: 403,
            error: '접근 권한이 없습니다. 관리자에게 문의하세요.',
        }
    }

    return response
}

// Intent 관련 타입 정의
export interface Intent {
    id: string
    title: string
    description: string
    icon: string
}

export interface Question {
    id: string
    text: string
    type: "single" | "multiple"
    options: string[]
}

export interface IntentAnalysisResponse {
    sessionId: string
    intents: Intent[]
}

export interface QuestionGenerationResponse {
    questionSetId: string
    questions: Question[]
}

export interface ChecklistCreationResponse {
    checklistId: string
    redirectUrl?: string
}

// Intent 분석 API
export async function analyzeIntents(goal: string): Promise<ApiResponse<IntentAnalysisResponse>> {
    console.log('🧠 의도 분석 API 호출:', { goal })

    return authenticatedRequest<IntentAnalysisResponse>('/api/v1/intents/analyze', {
        method: 'POST',
        body: JSON.stringify({ goal })
    })
}

// 질문 생성 API
export async function generateQuestions(
    sessionId: string,
    goal: string,
    intentTitle: string
): Promise<ApiResponse<QuestionGenerationResponse>> {
    console.log('❓ 질문 생성 API 호출:', { sessionId, goal, intentTitle })

    return authenticatedRequest<QuestionGenerationResponse>('/api/v1/questions/generate', {
        method: 'POST',
        body: JSON.stringify({
            sessionId,
            goal,
            intentTitle
        })
    })
}

// 체크리스트 생성 API
export async function createChecklist(
    sessionId: string,
    questionSetId: string,
    goal: string,
    selectedIntent: string,
    answers: { questionId: string, questionText: string, questionType: string, answer: string | string[] }[]
): Promise<ApiResponse<ChecklistCreationResponse>> {
    console.log('✅ 체크리스트 생성 API 호출:', { sessionId, questionSetId, goal, selectedIntent, answersCount: answers.length })

    return authenticatedRequest<ChecklistCreationResponse>('/api/v1/questions/answer', {
        method: 'POST',
        body: JSON.stringify({
            sessionId,
            questionSetId,
            goal,
            selectedIntent,
            answers
        })
    })
}

export { apiRequest, authenticatedRequest }

