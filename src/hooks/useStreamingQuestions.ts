import { useState, useCallback, useRef } from 'react'
import { generateQuestionsStream, type StreamResponse, type Question } from '../lib/api'

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
  streamingStatus: StreamResponse['status'] | null
}

/**
 * 스트리밍 질문 생성을 위한 React Hook
 * ChatGPT 스타일의 실시간 타이핑 효과 제공
 */
export function useStreamingQuestions(): UseStreamingQuestionsReturn {
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [streamingStatus, setStreamingStatus] = useState<StreamResponse['status'] | null>(null)
  
  // 스트리밍 중단을 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null)
  // 질문을 순차적으로 추가하기 위한 타이머
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null)

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

      case 'completed':
        console.log('✅ 스트리밍 완료:', data.message)
        if (data.questions) {
          setQuestions(data.questions)
        }
        setIsStreaming(false)
        break

      case 'error':
        console.error('❌ 스트리밍 에러:', data.error)
        setError(data.error || 'Unknown streaming error')
        setIsStreaming(false)
        break
    }
  }, [])

  const handleStreamComplete = useCallback((completedQuestions: Question[]) => {
    console.log('🎉 스트리밍 완전 완료, 질문 수:', completedQuestions.length)
    
    // 질문을 하나씩 순차적으로 추가
    let currentIndex = 0
    const addQuestionSequentially = () => {
      if (currentIndex < completedQuestions.length) {
        setQuestions(prev => [...prev, completedQuestions[currentIndex]])
        setCurrentQuestionIndex(currentIndex)
        currentIndex++
        
        // 다음 질문을 500ms 후에 추가
        questionTimerRef.current = setTimeout(addQuestionSequentially, 500)
      } else {
        // 모든 질문 추가 완료
        setIsStreaming(false)
        setStreamingStatus('completed')
        setCurrentQuestionIndex(completedQuestions.length - 1)
      }
    }
    
    // 기존 질문 초기화 후 순차적 추가 시작
    setQuestions([])
    setCurrentQuestionIndex(0)
    addQuestionSequentially()
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

    // 기존 타이머 정리
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current)
      questionTimerRef.current = null
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
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current)
      questionTimerRef.current = null
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