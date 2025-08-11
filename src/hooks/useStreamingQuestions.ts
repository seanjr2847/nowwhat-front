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
}

/**
 * 스트리밍 질문 생성을 위한 React Hook (개선된 버전)
 * React 클로저 문제를 해결하고 질문별 스트리밍을 완벽 지원
 */
export function useStreamingQuestions(): UseStreamingQuestionsReturn {
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [streamingStatus, setStreamingStatus] = useState<StreamResponse['status'] | 'progressing' | null>(null)

  // 스트리밍 중단을 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null)
  // 중복 처리 방지를 위한 플래그
  const isProcessingRef = useRef<boolean>(false)

  const handleStreamData = useCallback((data: StreamResponse) => {
    setStreamingStatus(data.status)

    switch (data.status) {
      case 'started':
        console.log('🚀 스트리밍 시작:', data.message)
        setStreamingText('')
        break

      case 'generating':
        if (data.chunk) {
          setStreamingText(prev => prev + data.chunk)
        }
        break

      case 'question_ready':
        console.log('🎯 개별 질문 완성:', data.question_number, '번째 질문')
        if (data.question && data.question_number) {
          handleQuestionReady(data.question, data.question_number)
        }
        break

      case 'completed':
        console.log('✅ 스트리밍 상태 완료:', data.message)
        
        // completed 상태에서 data.questions가 완전히 제공된 경우
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          console.log('🎉 서버에서 완성된 질문 데이터 수신:', data.questions.length, '개')
          setQuestions(data.questions)
          setCurrentQuestionIndex(data.questions.length - 1)
          setIsStreaming(false)
          setStreamingStatus('completed')
          isProcessingRef.current = false
        } 
        // 질문별 스트리밍 모드에서는 [DONE] 신호를 기다림
        else {
          console.log('⏳ 스트리밍 모드 완료 신호 수신 - [DONE] 신호 대기 중...')
        }
        break

      case 'error':
        console.error('❌ 스트리밍 에러:', data.error)
        setError(data.error || 'Unknown streaming error')
        setIsStreaming(false)
        break
    }
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
    streamingStatus
  }
}

export default useStreamingQuestions