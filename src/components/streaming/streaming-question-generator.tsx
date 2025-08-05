import { Brain, Square, Zap } from "lucide-react"
import { useEffect, useRef } from "react"
import { useStreamingQuestions } from "../../hooks/useStreamingQuestions"
import type { Question } from "../../lib/api"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { StreamingText } from "./streaming-text"
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
    startStreaming,
    stopStreaming,
    resetStreaming,
    streamingStatus
  } = useStreamingQuestions()

  const outputRef = useRef<HTMLDivElement>(null)

  // 자동 시작
  useEffect(() => {
    if (autoStart && !isStreaming && !questions.length) {
      void startStreaming(sessionId, goal, intentTitle)
    }
  }, [autoStart, sessionId, goal, intentTitle, startStreaming, isStreaming, questions.length])

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
    void startStreaming(sessionId, goal, intentTitle)
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

          {isStreaming && (
            <Button
              onClick={stopStreaming}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Square className="w-4 h-4 mr-2" />
              중단
            </Button>
          )}

          {!isStreaming && (questions.length > 0 || error) && (
            <Button
              onClick={resetStreaming}
              variant="outline"
            >
              다시 생성
            </Button>
          )}
        </div>
      </div>

      {/* 스트리밍 출력 영역 */}
      {(isStreaming || streamingText || error) && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                실시간 생성 결과
              </span>
              {isStreaming && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>실시간 스트리밍</span>
                </div>
              )}
            </div>
          </div>

          <div
            ref={outputRef}
            className="p-4 max-h-96 overflow-y-auto streaming-scrollbar streaming-scroll"
          >
            {error ? (
              <div className="text-red-600 dark:text-red-400 text-sm">
                <strong>오류:</strong> {error}
              </div>
            ) : (
              <StreamingText
                text={streamingText}
                isStreaming={isStreaming}
                typingSpeed={20}
                showCursor={true}
                className="text-gray-800 dark:text-gray-200"
              />
            )}
          </div>
        </div>
      )}

      {/* 완료된 질문들 미리보기 */}
      {questions.length > 0 && !isStreaming && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              생성 완료 - {questions.length}개의 질문
            </span>
          </div>
          <div className="space-y-2">
            {questions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="text-sm text-green-800 dark:text-green-200">
                {index + 1}. {question.text}
              </div>
            ))}
            {questions.length > 3 && (
              <div className="text-sm text-green-600 dark:text-green-400">
                ...그 외 {questions.length - 3}개 질문
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StreamingQuestionGenerator