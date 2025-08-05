import { useState, useCallback, useRef } from 'react'
import { generateQuestionsStream, type StreamResponse, type Question } from '../lib/api'

interface UseStreamingQuestionsReturn {
  /** 현재 스트리밍 텍스트 */
  streamingText: string
  /** 스트리밍 진행 중 여부 */
  isStreaming: boolean
  /** 에러 메시지 */
  error: string | null
  /** 완료된 질문들 */
  questions: Question[]
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
  const [streamingStatus, setStreamingStatus] = useState<StreamResponse['status'] | null>(null)
  
  // 스트리밍 중단을 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null)

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
    setQuestions(completedQuestions)
    setIsStreaming(false)
    setStreamingStatus('completed')
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
    setIsStreaming(true)
    setStreamingStatus('started')

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
    setStreamingStatus(null)
    console.log('🔄 스트리밍 상태 초기화됨')
  }, [stopStreaming])

  return {
    streamingText,
    isStreaming,
    error,
    questions,
    startStreaming,
    stopStreaming,
    resetStreaming,
    streamingStatus
  }
}

export default useStreamingQuestions