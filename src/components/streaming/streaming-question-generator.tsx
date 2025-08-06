import { Brain, Zap } from "lucide-react"
import { useEffect, useRef } from "react"
import { useStreamingQuestions } from "../../hooks/useStreamingQuestions"
import type { Question } from "../../lib/api"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { StreamingQuestionUI } from "./streaming-question-ui"
import "./streaming.css"

interface StreamingQuestionGeneratorProps {
  /** 세션 ID */
  sessionId: string
  /** 목표 */
  goal: string
  /** 의도 제목 */
  intentTitle: string
  /** 질문 생성 완료 콜백 */
  onQuestionsComplete: (questions: Question[]) => void
  /** 에러 콜백 */
  onError?: (error: string) => void
  /** 자동 시작 여부 */
  autoStart?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 스트리밍 질문 생성기 컴포넌트
 * ChatGPT 스타일의 실시간 질문 생성 UI 제공
 */
export function StreamingQuestionGenerator({
  sessionId,
  goal,
  intentTitle,
  onQuestionsComplete,
  onError,
  autoStart = false,
  className
}: StreamingQuestionGeneratorProps) {
  const {
    streamingText,
    isStreaming,
    error,
    questions,
    currentQuestionIndex,
    startStreaming,
    resetStreaming,
    streamingStatus
  } = useStreamingQuestions()

  const outputRef = useRef<HTMLDivElement>(null)
  const hasStartedRef = useRef(false)

  // 자동 시작
  useEffect(() => {
    if (autoStart && !isStreaming && !questions.length && sessionId && goal && intentTitle && !hasStartedRef.current) {
      console.log('🎬 자동 시작 조건 충족 - API 호출')
      hasStartedRef.current = true
      void startStreaming(sessionId, goal, intentTitle)
    }
  }, [autoStart, sessionId, goal, intentTitle]) // startStreaming과 questions.length 제거로 중복 호출 방지

  // 질문 완료 시 콜백 호출
  useEffect(() => {
    if (questions.length > 0 && !isStreaming) {
      onQuestionsComplete(questions)
    }
  }, [questions, isStreaming, onQuestionsComplete])

  // 에러 처리
  useEffect(() => {
    if (error !== null) {
      onError?.(error)
    }
  }, [error, onError])

  // 스크롤 자동 이동
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [streamingText])

  const handleStart = () => {
    hasStartedRef.current = true
    void startStreaming(sessionId, goal, intentTitle)
  }
  
  const handleReset = () => {
    hasStartedRef.current = false
    resetStreaming()
  }

  const getStatusMessage = () => {
    switch (streamingStatus) {
      case 'started':
        return '질문 생성을 시작합니다...'
      case 'generating':
        return 'AI가 질문을 생성하고 있습니다...'
      case 'completed':
        return '질문 생성이 완료되었습니다!'
      case 'error':
        return '질문 생성 중 오류가 발생했습니다.'
      default:
        return '질문을 생성할 준비가 되었습니다.'
    }
  }

  const getStatusColor = () => {
    switch (streamingStatus) {
      case 'started':
      case 'generating':
        return 'text-blue-600 dark:text-blue-400'
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* 상태 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Brain
              className={cn(
                "w-6 h-6 transition-colors duration-300",
                isStreaming ? "text-blue-500 streaming-pulse" : "text-gray-500"
              )}
            />
            {isStreaming && (
              <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI 질문 생성</h3>
            <p className={cn("text-sm transition-colors duration-300", getStatusColor())}>
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex items-center space-x-2">
          {!isStreaming && !questions.length && (
            <Button
              onClick={handleStart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              시작
            </Button>
          )}

          {!isStreaming && (questions.length > 0 || error !== null) && (
            <Button
              onClick={handleReset}
              variant="outline"
            >
              다시 생성
            </Button>
          )}
        </div>
      </div>

      {/* 스트리밍 질문 UI */}
      {(isStreaming || questions.length > 0) && (
        <div ref={outputRef}>
          <StreamingQuestionUI
            questions={questions}
            isStreaming={isStreaming}
            currentQuestionIndex={typeof currentQuestionIndex === 'number' ? currentQuestionIndex : 0}
            className="mt-6"
          />
        </div>
      )}

      {/* 에러 표시 */}
      {error !== null && !isStreaming && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-4">
          <div className="text-red-600 dark:text-red-400 text-sm">
            <strong>오류:</strong> {error}
          </div>
        </div>
      )}
    </div>
  )
}

export default StreamingQuestionGenerator