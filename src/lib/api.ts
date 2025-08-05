import { getUserLocaleSettings } from './locale-utils'

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

    // 사용자 언어/지역 정보 자동 추가
    const localeSettings = getUserLocaleSettings()

    // Content-Type이 명시적으로 설정되지 않은 경우에만 JSON으로 설정
    const defaultHeaders = {
        'Accept-Language': `${localeSettings.userLanguage}-${localeSettings.userCountry}`,
        'X-User-Locale': localeSettings.userLanguage,
        'X-User-Region': localeSettings.userCountry,
        'X-User-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    // POST/PUT/PATCH 요청이고 body가 있으면 항상 JSON으로 설정
    const method = options.method?.toUpperCase() || 'GET'
    const hasBody = !!options.body

    const enhancedHeaders = {
        ...defaultHeaders,
        ...options.headers,
        // JSON body가 있는 POST/PUT/PATCH 요청에는 강제로 application/json 설정
        ...(hasBody && ['POST', 'PUT', 'PATCH'].includes(method) && {
            'Content-Type': 'application/json'
        })
    }

    console.log('🌐 API 요청 시작:', {
        endpoint,
        method: method,
        url,
        headers: enhancedHeaders,
        locale: localeSettings,
        body: options.body,
        bodyType: typeof options.body,
        hasBody,
        shouldSetContentType: hasBody && ['POST', 'PUT', 'PATCH'].includes(method),
        finalContentType: enhancedHeaders['Content-Type']
    })

    try {
        const response = await fetch(url, {
            ...options,
            headers: enhancedHeaders,
        })

        console.log('📡 API 응답 상태:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            url: response.url
        })

        const data: unknown = await response.json()
        console.log('📄 API 응답 데이터:', data)

        if (!response.ok) {
            console.error('❌ API 요청 실패:', {
                status: response.status,
                statusText: response.statusText,
                data,
                endpoint,
                requestHeaders: options.headers
            })

            // 422 에러의 경우 자세한 validation 에러 정보 출력
            if (response.status === 422 && data && typeof data === 'object') {
                console.error('🔍 Validation 에러 상세:', JSON.stringify(data, null, 2))
            }

            return {
                success: false,
                status: response.status,  // 상태 코드 포함
                error: (data as { message?: string }).message || (data as { detail?: string }).detail || `HTTP ${response.status}`,
            }
        }

        console.log('✅ API 요청 성공')
        return {
            success: true,
            status: response.status,
            data: data as T,
        }
    } catch (error) {
        console.error('💥 API 요청 에러:', {
            error,
            endpoint,
            options,
            message: error instanceof Error ? error.message : 'Unknown error'
        })
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

    const response = await apiRequest<{ accessToken: string; refreshToken: string; user: User }>('/api/v1/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
    })

    if (response.success && response.data) {
        console.log('💾 새 토큰들 저장 중:', {
            hasAccessToken: !!response.data.accessToken,
            hasRefreshToken: !!response.data.refreshToken,
            hasUser: !!response.data.user
        })

        // 새 토큰들 저장
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)  // ← 새로운 refreshToken도 저장!

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
    // 🔍 현재 토큰 상태 상세 체크
    const token = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    console.log('🔐 인증된 요청 시작:', {
        endpoint,
        retryCount,
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        tokenPreview: token ? `${token.substring(0, 20)}...${token.substring(token.length - 10)}` : 'null',
        refreshTokenPreview: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null',
        localStorageKeys: Object.keys(localStorage)
    })

    // JWT 토큰 디코딩해서 만료시간 체크
    if (token) {
        try {
            const tokenParts = token.split('.')
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1])) as { exp?: number; sub?: string; type?: string }
                const now = Math.floor(Date.now() / 1000)
                const exp = payload.exp || 0
                const timeLeft = exp - now

                console.log('🕒 토큰 만료시간 분석:', {
                    exp: exp,
                    now: now,
                    timeLeft: timeLeft,
                    expired: timeLeft <= 0,
                    expiresAt: new Date(exp * 1000).toISOString(),
                    currentTime: new Date(now * 1000).toISOString(),
                    sub: payload.sub,
                    type: payload.type
                })

                if (timeLeft <= 0) {
                    console.error('❌ 토큰이 이미 만료됨!')
                }
            }
        } catch (e) {
            console.error('❌ 토큰 디코딩 실패:', e)
        }
    }

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
            ...options.headers,  // 사용자 정의 헤더를 먼저 적용
            Authorization: `Bearer ${token}`,  // Authorization은 항상 마지막에 설정
        },
    })

    // 401 에러 처리 (토큰 만료)
    if (!response.success && response.status === 401) {
        console.log('🔄 401 에러 감지, 토큰 갱신 시도...')
        console.log('📊 응답 상세 정보:', {
            status: response.status,
            error: response.error,
            endpoint,
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
        })

        if (retryCount === 0) {
            const refreshResult = await refreshTokenRequest()

            if (refreshResult.success) {
                console.log('✅ 토큰 갱신 성공, 요청 재시도')
                // 토큰 갱신 성공 시 재시도
                return authenticatedRequest<T>(endpoint, options, retryCount + 1)
            } else {
                console.log('❌ 토큰 갱신 실패, 로그인 필요')
                console.log('🔍 토큰 갱신 실패 상세:', refreshResult.error)
                // 토큰 갱신 실패 시 로그아웃 처리
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')

                // 🚨 디버깅 목적으로 리다이렉트 임시 비활성화
                console.error('🚨 [디버깅용] 자동 리다이렉트 비활성화됨. 네트워크 탭을 확인하세요!')
                console.error('🚨 원래는 /login으로 리다이렉트됩니다.')

                // TODO: 디버깅 완료 후 아래 주석을 해제하여 자동 리다이렉트 다시 활성화
                // if (typeof window !== 'undefined') {
                //     window.location.href = '/login'
                // }

                return {
                    success: false,
                    status: 401,
                    error: ' [디버깅] 인증이 만료되었습니다. 네트워크 탭을 확인 후 수동으로 로그인해주세요.',
                }
            }
        } else {
            console.log('❌ 토큰 갱신 후에도 401 에러, 로그인 필요')
            console.log('🔍 재시도 후에도 실패 상세:', {
                retryCount,
                status: response.status,
                error: response.error
            })
            // 토큰 갱신 후에도 실패하면 로그아웃
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            // 🚨 디버깅 목적으로 리다이렉트 임시 비활성화
            console.error('🚨 [디버깅용] 자동 리다이렉트 비활성화됨. 네트워크 탭을 확인하세요!')
            console.error('🚨 원래는 /login으로 리다이렉트됩니다.')

            // TODO: 디버깅 완료 후 아래 주석을 해제하여 자동 리다이렉트 다시 활성화
            // if (typeof window !== 'undefined') {
            //     window.location.href = '/login'
            // }

            return {
                success: false,
                status: 401,
                error: '🚨 [디버깅] 인증에 실패했습니다. 네트워크 탭을 확인 후 수동으로 로그인해주세요.',
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

export interface QuestionOption {
    id: string
    text: string
    value: string
}

export interface Question {
    id: string
    text: string
    type: "single" | "multiple" | "text"
    options: QuestionOption[] | null
    required: boolean
}

export interface IntentAnalysisResponse {
    sessionId: string
    intents: Intent[]
}

export interface QuestionGenerationResponse {
    questionSetId?: string  // Optional로 변경
    questions: Question[]
}

export interface ChecklistCreationResponse {
    checklistId: string
    redirectUrl?: string
}

// Intent 분석 API
export async function analyzeIntents(goal: string): Promise<ApiResponse<IntentAnalysisResponse>> {
    const localeSettings = getUserLocaleSettings()
    const requestBody = {
        goal,
        userLanguage: localeSettings.userLanguage,
        userCountry: localeSettings.userCountry,
        countryOption: localeSettings.countryOption
    }
    console.log('🧠 의도 분석 API 호출:', { goal, locale: localeSettings, requestBody })
    console.log('🔍 Request body JSON:', JSON.stringify(requestBody))

    return authenticatedRequest<IntentAnalysisResponse>('/api/v1/intents/analyze', {
        method: 'POST',
        body: JSON.stringify(requestBody)
    })
}

// 질문 생성 API
export async function generateQuestions(
    sessionId: string,
    goal: string,
    intentTitle: string
): Promise<ApiResponse<QuestionGenerationResponse>> {
    // 기존 로케일 설정 (헤더 UI용)
    const localeSettings = getUserLocaleSettings()

    // API 개인화 설정 (API 요청용)
    const { getApiUserInfo } = await import('./locale-utils')
    const apiUserInfo = getApiUserInfo()

    console.log('❓ 질문 생성 API 호출:', {
        sessionId,
        goal,
        intentTitle,
        locale: localeSettings,
        apiUserInfo
    })

    return authenticatedRequest<QuestionGenerationResponse>('/api/v1/questions/generate', {
        method: 'POST',
        body: JSON.stringify({
            sessionId,
            goal,
            intentTitle,
            userLanguage: localeSettings.userLanguage,
            userCountry: localeSettings.userCountry,
            countryOption: localeSettings.countryOption,
            // API 개인화 설정으로 오버라이드 (활성화된 경우)
            ...apiUserInfo
        })
    })
}

// 스트리밍 타입 정의
export interface StreamResponse {
    status: 'started' | 'generating' | 'completed' | 'error'
    message?: string
    chunk?: string
    error?: string
    questions?: Question[]
}

// 스트리밍 질문 생성 API
export async function generateQuestionsStream(
    sessionId: string,
    goal: string,
    intentTitle: string,
    onData: (data: StreamResponse) => void,
    onComplete: (questions: Question[]) => void,
    onError: (error: string) => void
): Promise<void> {
    try {
        // 기존 로케일 설정 (헤더 UI용)
        const localeSettings = getUserLocaleSettings()

        // API 개인화 설정 (API 요청용)
        const { getApiUserInfo } = await import('./locale-utils')
        const apiUserInfo = getApiUserInfo()

        console.log('🔄 스트리밍 질문 생성 API 호출:', {
            sessionId,
            goal,
            intentTitle,
            locale: localeSettings,
            apiUserInfo
        })

        // 토큰 가져오기
        const token = localStorage.getItem('accessToken')
        if (!token || token === null) {
            throw new Error('인증이 필요합니다.')
        }

        const requestBody = {
            sessionId,
            goal,
            intentTitle,
            // 기존 필드 (하위 호환성)
            userLanguage: localeSettings.userLanguage,
            userCountry: localeSettings.userCountry,
            countryOption: localeSettings.countryOption,
            // 새로운 API 필드 (선택적)
            ...apiUserInfo
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/questions/generate/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${localeSettings.userLanguage}-${localeSettings.userCountry}`,
                'X-User-Locale': localeSettings.userLanguage,
                'X-User-Region': localeSettings.userCountry,
                'X-User-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // ReadableStream으로 응답 처리
        const reader = response.body?.getReader()
        if (!reader) {
            throw new Error('스트림을 읽을 수 없습니다.')
        }

        const decoder = new TextDecoder()
        let accumulatedQuestions: Question[] = []

        while (true) {
            const { done, value } = await reader.read()

            if (done) break

            // 청크 데이터 디코딩
            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6) // 'data: ' 제거

                    if (data === '[DONE]') {
                        console.log('✅ 스트리밍 완료')
                        onComplete(accumulatedQuestions)
                        return
                    }

                    try {
                        const parsed = JSON.parse(data) as StreamResponse
                        onData(parsed)

                        // 완료된 질문들 수집
                        if (parsed.status === 'completed' && parsed.questions) {
                            accumulatedQuestions = parsed.questions
                        }
                    } catch {
                        // JSON이 아닌 텍스트 청크 처리 (타이핑 효과용)
                        onData({
                            status: 'generating',
                            chunk: data
                        })
                    }
                }
            }
        }
    } catch (error) {
        console.error('💥 스트리밍 에러:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        onError(errorMessage)
    }
}

// 개별 질문 답변 저장 API
export async function saveQuestionAnswer(
    sessionId: string,
    questionId: string,
    answer: string | string[]
): Promise<ApiResponse<{ success: boolean }>> {
    console.log('💾 개별 답변 저장 API 호출:', { sessionId, questionId, answer })

    return authenticatedRequest<{ success: boolean }>('/api/v1/questions/save-answer', {
        method: 'POST',
        body: JSON.stringify({
            sessionId,
            questionId,
            answer
        })
    })
}

// 체크리스트 생성 API
export async function createChecklist(
    sessionId: string,
    questionSetId: string,
    goal: string,
    selectedIntent: string,
    answers: { questionId: string, questionIndex: number, questionText: string, questionType: string, answer: string | string[] }[]
): Promise<ApiResponse<ChecklistCreationResponse>> {
    // 기존 로케일 설정 (헤더 UI용) 
    const localeSettings = getUserLocaleSettings()

    // API 개인화 설정 (API 요청용)
    const { getApiUserInfo } = await import('./locale-utils')
    const apiUserInfo = getApiUserInfo()

    console.log('✅ 체크리스트 생성 API 호출:', {
        sessionId,
        questionSetId,
        goal,
        selectedIntent,
        answersCount: answers.length,
        locale: localeSettings,
        apiUserInfo
    })

    return authenticatedRequest<ChecklistCreationResponse>('/api/v1/questions/answer', {
        method: 'POST',
        body: JSON.stringify({
            sessionId,
            questionSetId,
            goal,
            selectedIntent,
            answers,
            userLanguage: localeSettings.userLanguage,
            userCountry: localeSettings.userCountry,
            countryOption: localeSettings.countryOption,
            // API 개인화 설정으로 오버라이드 (활성화된 경우)
            ...apiUserInfo
        })
    })
}

// 체크리스트 관련 타입 정의
export interface ChecklistItemData {
    id: string
    title: string
    description: string
    details: {
        tips?: string[]
        contacts?: { name: string; phone: string; email?: string }[]
        links?: { title: string; url: string }[]
        price?: string
        location?: string
    }
    isCompleted: boolean
}

export interface ChecklistData {
    id: string
    title: string
    category: string
    description: string
    totalItems: number
    completedItems: number
    progressPercentage: number
    isCompleted: boolean
    items: ChecklistItemData[]
    createdAt: string
    updatedAt: string
    completedAt: string | null
    // 기존 호환성을 위한 계산된 속성들
    progress: number
    isSaved: boolean
}

export interface ChecklistSummary {
    id: string
    title: string
    createdAt: string
    totalItems: number
    completedItems: number
    progress: number
    lastUpdated: string
    category: string
    description?: string
}

// 체크리스트 상세 조회 API
export async function getChecklist(id: string): Promise<ApiResponse<ChecklistData>> {
    console.log('📋 체크리스트 상세 조회 API 호출:', { id })

    return authenticatedRequest<ChecklistData>(`/api/v1/checklists/${id}`, {
        method: 'GET'
    })
}

// 내 체크리스트 목록 조회 API  
export async function getMyChecklists(): Promise<ApiResponse<{ checklists: ChecklistSummary[] }>> {
    console.log('📑 내 체크리스트 목록 조회 API 호출')

    return authenticatedRequest<{ checklists: ChecklistSummary[] }>('/api/v1/checklists', {
        method: 'GET'
    })
}

// 체크리스트 삭제 API
export async function deleteChecklist(id: string): Promise<ApiResponse<{ success: boolean }>> {
    console.log('🗑️ 체크리스트 삭제 API 호출:', { id })

    return authenticatedRequest<{ success: boolean }>(`/api/v1/checklists/${id}`, {
        method: 'DELETE'
    })
}

// 체크리스트 항목 완료 상태 토글 API
export async function toggleChecklistItem(
    checklistId: string,
    itemId: string,
    isCompleted: boolean
): Promise<ApiResponse<{ success: boolean }>> {
    console.log('✅ 체크리스트 항목 토글 API 호출:', { checklistId, itemId, isCompleted })

    return authenticatedRequest<{ success: boolean }>(`/api/v1/checklists/${checklistId}/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted })
    })
}

// 체크리스트 저장 API
export async function saveChecklist(id: string): Promise<ApiResponse<{ success: boolean }>> {
    console.log('💾 체크리스트 저장 API 호출:', { id })

    return authenticatedRequest<{ success: boolean }>(`/api/v1/checklists/${id}/save`, {
        method: 'POST'
    })
}

// 피드백 제출 API
export async function submitFeedback(
    checklistId: string,
    isPositive: boolean,
    comment?: string
): Promise<ApiResponse<{ success: boolean }>> {
    console.log('📝 피드백 제출 API 호출:', { checklistId, isPositive, comment })

    return authenticatedRequest<{ success: boolean }>('/api/v1/feedback', {
        method: 'POST',
        body: JSON.stringify({
            checklistId,
            isPositive,
            comment
        })
    })
}

// 에러 메시지 포맷팅 유틸리티
export function formatApiError(error: unknown): string {
    if (typeof error === 'string') {
        return error
    }

    if (Array.isArray(error)) {
        // Validation error array
        return error.map(err => {
            if (typeof err === 'object' && err !== null && 'msg' in err) {
                return (err as { msg: string }).msg
            }
            return String(err)
        }).join(', ')
    }

    if (typeof error === 'object' && error !== null) {
        if ('message' in error) {
            return String((error as { message: unknown }).message)
        }
        if ('detail' in error) {
            const detail = (error as { detail: unknown }).detail
            if (typeof detail === 'string') {
                return detail
            }
            if (Array.isArray(detail)) {
                return detail.map(d => {
                    if (typeof d === 'object' && d !== null && 'msg' in d) {
                        return (d as { msg: string }).msg
                    }
                    return String(d)
                }).join(', ')
            }
        }
    }

    return String(error)
}

export { apiRequest, authenticatedRequest }

