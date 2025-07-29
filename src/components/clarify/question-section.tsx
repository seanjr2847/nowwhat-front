"use client"

import { Check, Circle } from "lucide-react"
import { useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Textarea } from "../ui/textarea"

interface QuestionOption {
  id: string
  text: string
  value: string
}

interface Question {
  id: string
  text: string
  type: "single" | "multiple" | "text"
  options: QuestionOption[] | null
  required: boolean
}

interface QuestionSectionProps {
  questions: Question[]
  answers: Record<string, string | string[]>
  onAnswerChange: (questionId: string, answer: string | string[]) => Promise<void>
}

/**
 * 사용자에게 맞춤 질문을 제시하고 답변을 받는 섹션 컴포넌트입니다.
 * 단일 선택 및 다중 선택 질문 유형을 지원합니다.
 * @param {QuestionSectionProps} props - 질문 섹션 컴포넌트의 props입니다.
 * @param {Question[]} props.questions - 표시할 질문 목록입니다.
 * @param {Record<string, string | string[]>} props.answers - 사용자의 답변 상태입니다.
 * @param {(questionId: string, answer: string | string[]) => void} props.onAnswerChange - 답변 변경 시 호출될 콜백 함수입니다.
 * @returns {JSX.Element} 렌더링된 질문 섹션 컴포넌트입니다.
 */
export function QuestionSection({ questions, answers, onAnswerChange }: QuestionSectionProps) {
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (questions.length > 0 && questionRefs.current[0]) {
      questionRefs.current[0].focus()
    }
  }, [questions])

  useEffect(() => {
    const scrollToQuestions = () => {
      const questionsElement = document.getElementById("questions-section")
      if (questionsElement) {
        const headerHeight = 100
        const targetPosition = questionsElement.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    }

    const timer = setTimeout(scrollToQuestions, 300)
    return () => clearTimeout(timer)
  }, [])

  const scrollToNextQuestion = (currentQuestionId: string) => {
    const currentIndex = questions.findIndex((q) => q.id === currentQuestionId)
    const nextIndex = currentIndex + 1

    console.log('📜 스크롤 시도:', { currentQuestionId, currentIndex, nextIndex, totalQuestions: questions.length })

    if (nextIndex < questions.length) {
      const nextQuestionElement = questionRefs.current[nextIndex]
      if (nextQuestionElement) {
        const headerHeight = 120
        const targetPosition = nextQuestionElement.offsetTop - headerHeight

        console.log('⬇️ 다음 질문으로 스크롤:', { targetPosition })

        setTimeout(() => {
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }, 200)
      } else {
        console.log('❌ 다음 질문 엘리먼트를 찾을 수 없음')
      }
    } else {
      console.log('✅ 마지막 질문 - 생성 버튼으로 스크롤')
      setTimeout(() => {
        const createButtonElement = document.getElementById("create-button-section")
        if (createButtonElement) {
          const headerHeight = 100
          const targetPosition = createButtonElement.offsetTop - headerHeight

          console.log('🔘 생성 버튼으로 스크롤:', { targetPosition })

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        } else {
          console.log('❌ 생성 버튼 엘리먼트를 찾을 수 없음')
        }
      }, 500)
    }
  }

  const handleSingleAnswer = async (questionId: string, option: string) => {
    await onAnswerChange(questionId, option)
    scrollToNextQuestion(questionId)

    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.className = "sr-only"
    announcement.textContent = `${option} 선택됨`
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  const handleMultipleAnswer = async (questionId: string, option: string) => {
    const currentAnswers = (answers[questionId] as string[]) || []
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((a) => a !== option)
      : [...currentAnswers, option]
    await onAnswerChange(questionId, newAnswers)

    if (currentAnswers.length === 0 && newAnswers.length === 1) {
      scrollToNextQuestion(questionId)
    }

    const isSelected = !currentAnswers.includes(option)
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.className = "sr-only"
    announcement.textContent = `${option} ${isSelected ? "선택됨" : "선택 해제됨"}`
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  const handleTextAnswer = async (questionId: string, value: string) => {
    await onAnswerChange(questionId, value)
    
    // 텍스트가 입력되기 시작하면 다음 질문으로 스크롤 (한 번만)
    const currentAnswer = answers[questionId] as string || ""
    if (currentAnswer.length === 0 && value.length > 0) {
      scrollToNextQuestion(questionId)
    }
  }

  const getAnswerStatus = (questionId: string) => {
    const answer = answers[questionId]
    if (!answer) return "답변하지 않음"
    if (Array.isArray(answer)) {
      return answer.length === 0 ? "답변하지 않음" : `${answer.length}개 선택됨`
    }
    return "답변 완료"
  }

  const isQuestionAnswered = (questionId: string) => {
    const answer = answers[questionId]
    if (Array.isArray(answer)) return answer.length > 0
    return !!answer
  }

  return (
    <section id="questions-section" className="space-y-6 mb-12 animate-slide-up" aria-labelledby="questions-heading">
      <div className="text-center mb-8">
        <h2 id="questions-heading" className="text-2xl font-bold text-foreground mb-2">
          맞춤 질문
        </h2>
      </div>

      <div className="sr-only" aria-live="polite">
        총 {questions.length}개의 질문이 있습니다. 각 질문을 순서대로 답변해주세요.
      </div>

      {questions.map((question, index) => (
        <Card
          key={question.id}
          className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 transition-all duration-300 rounded-2xl ${
            isQuestionAnswered(question.id) ? "border-green-500/50 bg-green-500/10" : "hover:border-blue-500/50"
          }`}
          ref={(el) => {(questionRefs.current[index] = el)}}
          tabIndex={-1}
        >
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4 flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors duration-300 ${
                    isQuestionAnswered(question.id) ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isQuestionAnswered(question.id) ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2" id={`question-${question.id}`}>
                    {question.text}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {question.type === "multiple" ? "여러 개 선택 가능" : 
                     question.type === "single" ? "하나만 선택" : 
                     "텍스트로 답변해주세요"}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isQuestionAnswered(question.id) ? "text-green-400" : "text-muted-foreground"
                  }`}
                >
                  {getAnswerStatus(question.id)}
                </div>
              </div>
            </div>

            <fieldset
              className="space-y-3"
              aria-labelledby={`question-${question.id}`}
              aria-describedby={`question-help-${question.id}`}
            >
              <legend className="sr-only">
                질문 {index + 1}: {question.text}
                {question.type === "multiple" ? " (여러 개 선택 가능)" : " (하나만 선택)"}
              </legend>

              <div id={`question-help-${question.id}`} className="sr-only">
                {question.type === "multiple"
                  ? "체크박스를 사용하여 여러 옵션을 선택할 수 있습니다"
                  : "라디오 버튼을 사용하여 하나의 옵션만 선택할 수 있습니다"}
              </div>

              <div className="grid gap-3">
                {question.type === "text" ? (
                  <Textarea
                    placeholder="답변을 입력해주세요..."
                    value={(answers[question.id] as string) || ""}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    className="min-h-[100px] resize-none"
                    required={question.required}
                  />
                ) : question.options?.map((option, optionIndex) => (
                  <div key={option.id} className="transition-all duration-200">
                    {question.type === "single" ? (
                      <Button
                        variant={answers[question.id] === option.value ? "default" : "outline"}
                        className={`justify-start w-full h-auto p-4 text-left transition-all duration-200 focus-ring rounded-xl ${
                          answers[question.id] === option.value
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-blue-500"
                            : "bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 text-foreground hover:bg-white/80 dark:hover:bg-gray-900/80 hover:border-blue-500/50"
                        }`}
                        onClick={() => handleSingleAnswer(question.id, option.value)}
                        role="radio"
                        aria-checked={answers[question.id] === option.value}
                        aria-describedby={`option-help-${question.id}-${optionIndex}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Circle className={`w-4 h-4 ${answers[question.id] === option.value ? "fill-current" : ""}`} />
                          <span className="font-medium">{option.text}</span>
                        </div>
                      </Button>
                    ) : (
                      <div
                        className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer backdrop-blur-xl ${
                          ((answers[question.id] as string[]) || []).includes(option.value)
                            ? "border-blue-500/50 bg-blue-500/10"
                            : "border-white/40 dark:border-gray-700/40 bg-white/60 dark:bg-gray-900/60 hover:bg-white/80 dark:hover:bg-gray-900/80"
                        }`}
                      >
                        <Checkbox
                          id={`${question.id}-${option.id}`}
                          checked={((answers[question.id] as string[]) || []).includes(option.value)}
                          onCheckedChange={() => handleMultipleAnswer(question.id, option.value)}
                          aria-describedby={`option-help-${question.id}-${optionIndex}`}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <label
                          htmlFor={`${question.id}-${option.id}`}
                          className="text-foreground cursor-pointer flex-1 font-medium"
                        >
                          {option.text}
                        </label>
                      </div>
                    )}
                    <div id={`option-help-${question.id}-${optionIndex}`} className="sr-only">
                      옵션 {optionIndex + 1}: {option.text}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </CardContent>
        </Card>
      ))}

      <div className="text-center mt-6">
        <p className="text-muted-foreground text-sm">
          <kbd className="px-2 py-1 bg-muted rounded text-xs mr-2">Tab</kbd>
          이동 ·<kbd className="px-2 py-1 bg-muted rounded text-xs ml-2 mr-1">Enter</kbd>
          선택
        </p>
      </div>
    </section>
  )
}
