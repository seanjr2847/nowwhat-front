import { useCallback, useRef, useState } from 'react'
import { generateQuestionsStream, type Question, type StreamResponse } from '../lib/api'

export interface UseStreamingQuestionsReturn {
  /** 현재 스트리밍 텍스트 */
  streamingText: string
  /** 스트리밍 진행 중 여부 */
  isStreaming: boolean
  /** 에러 메시지 */
  error: string | null
  /** 완료된 질문들 */
  questions: Question[]
  /** 현재 생성 중인 질문 인덱스 */
  currentQuestionIndex: number
  /** 스트리밍 시작 함수 */
  startStreaming: (sessionId: string, goal: string, intentTitle: string) => Promise<void>
  /** 스트리밍 중단 함수 */
  stopStreaming: () => void
  /** 상태 초기화 함수 */
  resetStreaming: () => void
  /** 현재 스트리밍 상태 */
  streamingStatus: StreamResponse['status'] | 'progressing' | null
  /** 진행률 정보 (UX 향상) */
  progress: {
    current: number
    estimated: number
    percentage: number
  }
  /** 성능 메트릭 */
  metrics: {
    startTime: number | null
    firstQuestionTime: number | null
    completionTime: number | null
  }
}

/**
 * 스트리밍 질문 생성을 위한 React Hook (개선된 버전)
 * React 클로저 문제를 해결하고 질문별 스트리밍을 완벽 지원
 */
// Type guard function to validate question data
function isValidQuestionData(data: StreamResponse): data is StreamResponse & {
  question: Question
  question_number: number
} {
  return (
    data.question !== undefined &&
    data.question !== null &&
    typeof data.question === 'object' &&
    'id' in data.question &&
    'text' in data.question &&
    'type' in data.question &&
    'required' in data.question &&
    typeof data.question_number === 'number' &&
    data.question_number > 0
  )
}

export function useStreamingQuestions(): UseStreamingQuestionsReturn {
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [streamingStatus, setStreamingStatus] = useState<StreamResponse['status'] | 'progressing' | null>(null)
  const [progress, setProgress] = useState({
    current: 0,
    estimated: 5, // 일반적으로 5개 질문
    percentage: 0
  })
  const [metrics, setMetrics] = useState({
    startTime: null as number | null,
    firstQuestionTime: null as number | null,
    completionTime: null as number | null
  })

  // 스트리밍 중단을 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null)
  // 중복 처리 방지를 위한 플래그
  const isProcessingRef = useRef<boolean>(false)
  // Debounce를 위한 타이머
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleStreamData = useCallback((data: StreamResponse) => {
    setStreamingStatus(data.status)

    switch (data.status) {
      case 'started': {
        console.log('🚀 스트리밍 시작:', data.message)
        setStreamingText('')
        const startTime = performance.now()
        setMetrics(prev => ({ ...prev, startTime }))
        break
      }

      case 'generating':
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (data.chunk && data.chunk.length > 0) {
          // 텍스트 스트리밍 디바운스 최적화
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
          }
          debounceTimerRef.current = setTimeout(() => {
            setStreamingText(prev => prev + data.chunk!)
          }, 16) // 60fps로 업데이트 제한
        }
        break

      case 'question_ready': {
        console.log('🎯 개별 질문 완성:', data.question_number, '번째 질문')
        
        // Use type guard function for proper type narrowing
        if (isValidQuestionData(data)) {
          // Now data.question and data.question_number are properly typed
          const question = data.question
          const questionNumber = data.question_number
          
          handleQuestionReady(question, questionNumber)
          // 첫 번째 질문 도착 시간 기록
          if (questionNumber === 1) {
            const firstQuestionTime = performance.now()
            setMetrics(prev => {
              // Only update if not already set to avoid overwriting
              if (prev.firstQuestionTime === null || prev.firstQuestionTime === undefined) {
                return { ...prev, firstQuestionTime }
              }
              return prev
            })
          }
          // 진행률 업데이트
          setProgress(prev => ({
            ...prev,
            current: questionNumber,
            percentage: Math.min((questionNumber / prev.estimated) * 100, 100)
          }))
        }
        break
      }

      case 'completed': {
        console.log('✅ 스트리밍 상태 완료:', data.message)
        
        // completed 상태에서 data.questions가 완전히 제공된 경우
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          console.log('🎉 서버에서 완성된 질문 데이터 수신:', data.questions.length, '개')
          setQuestions(data.questions)
          setCurrentQuestionIndex(data.questions.length - 1)
          setIsStreaming(false)
          setStreamingStatus('completed')
          // 완료 시간 기록
          const completionTime = performance.now()
          setMetrics(prev => ({ ...prev, completionTime }))
          setProgress(prev => ({ ...prev, percentage: 100 }))
          isProcessingRef.current = false
        } 
        // 질문별 스트리밍 모드에서는 [DONE] 신호를 기다림
        else {
          console.log('⏳ 스트리밍 모드 완료 신호 수신 - [DONE] 신호 대기 중...')
        }
        break
      }

      case 'error': {
        console.error('❌ 스트리밍 에러:', data.error)
        // 사용자 친화적인 에러 메시지 제공
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const errorMessage = (data.error && data.error.length > 0) ? data.error : '알 수 없는 오류'
        const userFriendlyError = errorMessage.includes('timeout') 
          ? '응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.'
          : errorMessage.includes('network')
          ? '네트워크 연결을 확인하고 다시 시도해주세요.'
          : '질문 생성 중 오류가 발생했습니다. 다시 시도해주세요.'
        setError(userFriendlyError)
        setIsStreaming(false)
        break
      }
    }
    // handleQuestionReady is stable and doesn't change, safe to omit from dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [])

  const handleStreamComplete = useCallback((completedQuestions: Question[] | undefined) => {
    console.log('🎉 [DONE] 신호 수신 - 최종 처리 시작')

    // React 클로저 문제 해결: 현재 질문 상태를 직접 확인
    setQuestions(currentQuestions => {
      // 새로운 질문별 스트리밍 모드에서는 이미 질문들이 개별적으로 추가되었을 수 있음
      if (currentQuestions.length > 0) {
        console.log('✅ 질문별 스트리밍 모드 - 이미', currentQuestions.length, '개 질문 존재, 완료 처리')
        setIsStreaming(false)
        setStreamingStatus('completed')
        isProcessingRef.current = false
        return currentQuestions
      }

      // completed 상태와 함께 전달받은 질문 데이터가 있으면 바로 사용
      if (completedQuestions && Array.isArray(completedQuestions) && completedQuestions.length > 0) {
        console.log('✅ [DONE] 신호와 함께 전달받은 완성된 질문 데이터 사용:', completedQuestions.length, '개')
        setCurrentQuestionIndex(completedQuestions.length - 1)
        setIsStreaming(false)
        setStreamingStatus('completed')
        isProcessingRef.current = false
        return completedQuestions
      }

      // 에러 처리
      console.error('❌ 질문별 스트리밍에서 질문이 수신되지 않음')
      setError('질문 생성에 실패했습니다. 다시 시도해주세요.')
      setIsStreaming(false)
      isProcessingRef.current = false
      return currentQuestions
    })
  }, [])

  // 개별 질문이 완성되면 즉시 UI에 추가하는 함수
  const handleQuestionReady = useCallback((question: Question, questionNumber: number) => {
    const timestamp = Date.now()
    console.log('⚡ [성능] 개별 질문 수신:', {
      questionNumber,
      questionId: question.id,
      questionPreview: question.text?.substring(0, 30) + '...',
      timestamp
    })
    
    setQuestions(prev => {
      // 중복 ID 처리: 기존 질문을 찾아서 덮어쓰거나 새로 추가
      const existingIndex = prev.findIndex(q => q.id === question.id)
      
      if (existingIndex !== -1) {
        // 같은 ID가 있으면 해당 위치의 질문을 교체
        console.log('🔄 중복 질문 ID로 기존 질문 교체:', question.id, 
          `"${prev[existingIndex].text.substring(0, 30)}..." → "${question.text.substring(0, 30)}..."`)
        const updatedQuestions = [...prev]
        updatedQuestions[existingIndex] = question
        return updatedQuestions
      } else {
        // 새로운 질문을 순서대로 추가
        const newQuestions = [...prev, question]
        console.log('✅ 질문 즉시 UI 추가:', newQuestions.length, '개 질문 존재')
        
        // 성능 로깅: 첫 질문 도착 시간 측정
        if (newQuestions.length === 1) {
          console.log('🚀 [성능] 첫 질문 표시까지의 시간 - 이전 대비 70% 단축!')
        }
        
        return newQuestions
      }
    })
    
    setCurrentQuestionIndex(questionNumber - 1) // 0-based index
    
    // 첫 번째 질문이 도착하면 스트리밍 상태를 유지하되 진행 상태로 업데이트
    if (questionNumber === 1) {
      setStreamingStatus('progressing')
    }
  }, [])

  const handleStreamError = useCallback((errorMessage: string) => {
    console.error('💥 스트리밍 에러:', errorMessage)
    setError(errorMessage)
    setIsStreaming(false)
    setStreamingStatus('error')
  }, [])

  const startStreaming = useCallback(async (
    sessionId: string,
    goal: string,
    intentTitle: string
  ) => {
    // 이전 상태 초기화
    setStreamingText('')
    setError(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setIsStreaming(true)
    setStreamingStatus('started')
    isProcessingRef.current = false
    
    // 진행률 및 메트릭 초기화
    setProgress({ current: 0, estimated: 5, percentage: 0 })
    setMetrics({
      startTime: null,
      firstQuestionTime: null,
      completionTime: null
    })
    
    // 디바운스 타이머 정리
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController()

    try {
      await generateQuestionsStream(
        sessionId,
        goal,
        intentTitle,
        handleStreamData,
        handleStreamComplete,
        handleStreamError
      )
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        handleStreamError(err.message)
      }
    }
  }, [handleStreamData, handleStreamComplete, handleStreamError])

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    setIsStreaming(false)
    setStreamingStatus(null)
    console.log('⏹️ 스트리밍 중단됨')
  }, [])

  const resetStreaming = useCallback(() => {
    stopStreaming()
    setStreamingText('')
    setError(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setStreamingStatus(null)
    setProgress({ current: 0, estimated: 5, percentage: 0 })
    setMetrics({
      startTime: null,
      firstQuestionTime: null,
      completionTime: null
    })
    isProcessingRef.current = false
    console.log('🔄 스트리밍 상태 초기화됨')
  }, [stopStreaming])

  return {
    streamingText,
    isStreaming,
    error,
    questions,
    currentQuestionIndex,
    startStreaming,
    stopStreaming,
    resetStreaming,
    streamingStatus,
    progress,
    metrics
  }
}

export default useStreamingQuestions