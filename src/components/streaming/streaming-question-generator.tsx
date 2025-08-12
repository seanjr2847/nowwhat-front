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
    streamingStatus,
    progress,
    metrics
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
      // 접근성 향상: 에러 시 포커스를 에러 메시지로 이동
      const errorElement = document.querySelector('[role="alert"]')
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
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
    const progressText = progress.percentage > 0 ? ` (${Math.round(progress.percentage)}%)` : ''
    const questionsText = questions.length > 0 ? ` - ${questions.length}개 완성` : ''
    
    switch (streamingStatus) {
      case 'started':
        return `질문 생성을 시작합니다...${progressText}`
      case 'generating':
        return `AI가 질문을 생성하고 있습니다...${progressText}`
      case 'question_ready':
        return `질문이 실시간으로 생성되고 있습니다${questionsText}${progressText}`
      case 'progressing':
        return `질문이 실시간으로 추가되고 있습니다${questionsText}${progressText}`
      case 'completed':
        const completionTime = metrics.completionTime && metrics.startTime 
          ? Math.round((metrics.completionTime - metrics.startTime) / 1000 * 10) / 10 
          : null
        return `질문 생성이 완료되었습니다! ${completionTime ? `(${completionTime}초)` : ''}`
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
      case 'question_ready':
      case 'progressing':
        return 'text-purple-600 dark:text-purple-400'
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className={cn("space-y-6", className)} role="region" aria-labelledby="question-generator-heading">
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
            <h3 id="question-generator-heading" className="font-semibold text-foreground">AI 질문 생성</h3>
            <p className={cn("text-sm transition-colors duration-300", getStatusColor())} aria-live="polite">
              {getStatusMessage()}
            </p>
            
            {/* 진행률 바 */}
            {isStreaming && progress.percentage > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>진행률</span>
                  <span>{Math.round(progress.percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress.percentage}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(progress.percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="질문 생성 진행률"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex items-center space-x-2">
          {!isStreaming && !questions.length && (
            <Button
              onClick={handleStart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              aria-describedby="question-generator-heading"
            >
              <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
              시작
            </Button>
          )}

          {!isStreaming && (questions.length > 0 || error !== null) && (
            <Button
              onClick={handleReset}
              variant="outline"
              aria-label="질문 생성 다시 시도"
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
            progress={progress}
            className="mt-6"
          />
        </div>
      )}

      {/* 에러 표시 */}
      {error !== null && !isStreaming && (
        <div 
          className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-red-600 dark:text-red-400 text-sm">
            <strong>오류:</strong> {error}
          </div>
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            다시 시도
          </Button>
        </div>
      )}
    </div>
  )
}

export default StreamingQuestionGenerator