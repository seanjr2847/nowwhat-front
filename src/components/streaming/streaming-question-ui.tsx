import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import type { Question } from "../../lib/api"
import { cn } from "../../lib/utils"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

interface StreamingQuestionUIProps {
  questions: Question[]
  isStreaming: boolean
  currentQuestionIndex: number
  className?: string
}

/**
 * 스트리밍 중인 질문들을 UI 형태로 보여주는 컴포넌트
 * 질문이 하나씩 순차적으로 나타나는 애니메이션 효과 제공
 */
export function StreamingQuestionUI({
  questions,
  isStreaming,
  currentQuestionIndex,
  className
}: StreamingQuestionUIProps) {
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([])

  // 질문이 추가될 때마다 순차적으로 보이게 하는 효과
  useEffect(() => {
    if (questions.length > visibleQuestions.length) {
      const timer = setTimeout(() => {
        setVisibleQuestions(prev => [...prev, prev.length])
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [questions.length, visibleQuestions.length])

  const renderQuestionInput = (question: Question, index: number) => {
    const isCurrentStreaming = isStreaming && index === currentQuestionIndex
    const isVisible = visibleQuestions.includes(index)

    switch (question.type) {
      case "single":
        return (
          <RadioGroup disabled className="space-y-2 mt-2">
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`preview-${question.id}-${option.id}`} />
                <Label 
                  htmlFor={`preview-${question.id}-${option.id}`}
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-not-allowed"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "multiple":
        return (
          <div className="space-y-2 mt-2">
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`preview-${question.id}-${option.id}`}
                  disabled
                />
                <Label 
                  htmlFor={`preview-${question.id}-${option.id}`}
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-not-allowed"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        )

      case "text":
        return (
          <Textarea
            placeholder="답변을 입력하세요..."
            disabled
            className="mt-2 resize-none h-20 opacity-50"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {questions.map((question, index) => {
        const isCurrentStreaming = isStreaming && index === currentQuestionIndex
        const isVisible = visibleQuestions.includes(index)
        const isComplete = index < currentQuestionIndex || (!isStreaming && isVisible)

        return (
          <div
            key={question.id}
            className={cn(
              "transition-all duration-500 ease-out",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
          >
            <div className={cn(
              "bg-white dark:bg-gray-900 rounded-xl border p-6 shadow-sm",
              isCurrentStreaming && "border-blue-500 shadow-blue-100 dark:shadow-blue-900/20",
              !isCurrentStreaming && "border-gray-200 dark:border-gray-700"
            )}>
              {/* 질문 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCurrentStreaming ? (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    ) : isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-500">
                        질문 {index + 1}
                      </span>
                      {question.required && (
                        <span className="text-xs text-red-500">필수</span>
                      )}
                    </div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {question.text}
                    </h3>
                  </div>
                </div>
              </div>

              {/* 질문 입력 필드 (미리보기) */}
              <div className={cn(
                "transition-opacity duration-300",
                isCurrentStreaming ? "opacity-50" : "opacity-100"
              )}>
                {renderQuestionInput(question, index)}
              </div>

              {/* 로딩 애니메이션 */}
              {isCurrentStreaming && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" 
                         style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" 
                         style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" 
                         style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>질문 생성 중...</span>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* 스트리밍 중 다음 질문 스켈레톤 */}
      {isStreaming && (
        <div className="animate-pulse">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}