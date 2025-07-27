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

