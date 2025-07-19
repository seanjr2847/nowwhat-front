"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClarifyHeader } from "../components/clarify/clarify-header"
import { ProgressBar } from "../components/clarify/progress-bar"
import { IntentSelection } from "../components/clarify/intent-selection"
import { QuestionSection } from "../components/clarify/question-section"
import { CreateButton } from "../components/clarify/create-button"
import { AdModal } from "../components/clarify/ad-modal"
import { LoadingSpinner } from "../components/clarify/loading-spinner"
import { ErrorMessage } from "../components/clarify/error-message"

interface Intent {
  id: string
  title: string
  description: string
  icon: string
}

interface Question {
  id: string
  text: string
  type: "single" | "multiple"
  options: string[]
}

/**
 * 사용자의 목표를 구체화하기 위한 다단계 페이지 컴포넌트입니다.
 * 의도 선택, 질문 답변 등의 과정을 통해 체크리스트 생성을 준비합니다.
 * @returns {JSX.Element} 목표 구체화 페이지를 렌더링합니다.
 */
export default function ClarifyPage() {
  const router = useNavigate()
  const [goal, setGoal] = useState<string>("")
  const [intents, setIntents] = useState<Intent[]>([])
  const [selectedIntent, setSelectedIntent] = useState<string>("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [showAdModal, setShowAdModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const fetchIntents = async (goalText: string) => {
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // TODO: API 연동 - 'goalText'를 기반으로 실제 의도(intent) 목록을 가져옵니다.
      // 예: const response = await fetch('/api/intents', { method: 'POST', body: JSON.stringify({ goal: goalText }) });
      // const data = await response.json();
      // setIntents(data.intents);

      const mockIntents: Intent[] = [
        {
          id: "1",
          title: "여행 계획 세우기",
          description: "일본 여행의 구체적인 일정과 준비사항을 계획",
          icon: "✈️",
        },
        {
          id: "2",
          title: "예산 관리하기",
          description: "여행 비용을 효율적으로 계획하고 관리",
          icon: "💰",
        },
        {
          id: "3",
          title: "문화 체험하기",
          description: "일본의 전통문화와 현지 체험 활동 탐색",
          icon: "🏮",
        },
        {
          id: "4",
          title: "언어 준비하기",
          description: "여행에 필요한 일본어 기초 학습",
          icon: "🗣️",
        },
      ]

      setIntents(mockIntents)
      setProgress(25)
    } catch (err) {
      setError("의도 분석 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleIntentSelect = async (intentId: string) => {
    setSelectedIntent(intentId)
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // TODO: API 연동 - 'intentId'를 기반으로 실제 질문 목록을 가져옵니다.
      // 예: const response = await fetch(`/api/questions?intentId=${intentId}`);
      // const data = await response.json();
      // setQuestions(data.questions);

      const mockQuestions: Question[] = [
        {
          id: "1",
          text: "여행 기간은 얼마나 되나요?",
          type: "single",
          options: ["3-4일", "5-7일", "1주일 이상", "아직 미정"],
        },
        {
          id: "2",
          text: "관심 있는 지역은 어디인가요?",
          type: "multiple",
          options: ["도쿄", "오사카", "교토", "후쿠오카", "홋카이도"],
        },
        {
          id: "3",
          text: "여행 스타일은 어떤가요?",
          type: "single",
          options: ["자유여행", "패키지여행", "반자유여행", "배낭여행"],
        },
      ]

      setQuestions(mockQuestions)
      setProgress(50)
    } catch (err) {
      setError("질문 생성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))

    const answeredCount = Object.keys({ ...answers, [questionId]: answer }).length
    const totalQuestions = questions.length
    const newProgress = 50 + (answeredCount / totalQuestions) * 40
    setProgress(newProgress)
  }

  const handleCreateChecklist = async () => {
    setShowAdModal(true)
    setIsCreating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      // TODO: API 연동 - 'goal', 'selectedIntent', 'answers'를 서버로 보내고 실제 체크리스트를 생성합니다.
      // 예: const response = await fetch('/api/checklists', { method: 'POST', body: JSON.stringify({ goal, intentId: selectedIntent, answers }) });
      // const data = await response.json();
      // const checklistId = data.id;

      const checklistId = "mock-id-123"
      navigate(`/result/${checklistId}`)
    } catch (err) {
      setError("체크리스트 생성 중 오류가 발생했습니다.")
      setShowAdModal(false)
    } finally {
      setIsCreating(false)
    }
  }

  const isAllQuestionsAnswered =
    questions.length > 0 &&
    questions.every(
      (q) => answers[q.id] && (Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).length > 0 : answers[q.id]),
    )

  useEffect(() => {
    const storedGoal = sessionStorage.getItem("goal") || "일본 여행 가고싶어"
    setGoal(storedGoal)
    fetchIntents(storedGoal)
  }, [router])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showAdModal) {
        e.preventDefault()
      }

      if (e.ctrlKey && e.key === "Enter" && isAllQuestionsAnswered && !isCreating) {
        handleCreateChecklist()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showAdModal, isAllQuestionsAnswered, isCreating])

  if (isLoading && intents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
        <LoadingSpinner message="AI가 목표를 분석 중입니다..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 relative"
      role="main"
      aria-label="목표 구체화 페이지"
    >
      {/* 미묘한 배경 패턴 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {progress < 25 && "AI가 목표를 분석 중입니다"}
          {progress >= 25 && progress < 50 && "의도를 선택해주세요"}
          {progress >= 50 && progress < 90 && "맞춤 질문에 답변해주세요"}
          {progress >= 90 && "모든 질문에 답변하셨습니다. 체크리스트를 생성할 수 있습니다"}
        </div>
        <ClarifyHeader goal={goal} />
        <ProgressBar progress={progress} />

        {!selectedIntent && <IntentSelection intents={intents} onSelect={handleIntentSelect} />}

        {selectedIntent && isLoading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner message="맞춤 질문을 생성하고 있습니다..." />
          </div>
        )}

        {selectedIntent && !isLoading && questions.length > 0 && (
          <QuestionSection questions={questions} answers={answers} onAnswerChange={handleAnswerChange} />
        )}

        {isAllQuestionsAnswered && <CreateButton onClick={handleCreateChecklist} isLoading={isCreating} />}

        {showAdModal && <AdModal onComplete={() => setShowAdModal(false)} isCreating={isCreating} />}
      </div>
    </div>
  )
}
