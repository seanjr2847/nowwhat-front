"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AdModal } from "../components/clarify/ad-modal"
import { ClarifyHeader } from "../components/clarify/clarify-header"
import { CreateButton } from "../components/clarify/create-button"
import { ErrorMessage } from "../components/clarify/error-message"
import { IntentSelection } from "../components/clarify/intent-selection"
import { LoadingSpinner } from "../components/clarify/loading-spinner"
import { ProgressBar } from "../components/clarify/progress-bar"
import { QuestionSection } from "../components/clarify/question-section"

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
  const navigate = useNavigate()
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

  const fetchIntents = async () => {
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // TODO: API 연결 - POST /intents/analyze
      // 사용자 입력을 분석하여 의도 옵션 생성
      // const response = await fetch('/api/intents/analyze', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: JSON.stringify({ goal })
      // });
      // const { sessionId, intents } = await response.json();
      // sessionStorage.setItem('sessionId', sessionId);
      // setIntents(intents);

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
    } catch {
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
      // TODO: API 연결 - POST /questions/generate
      // 선택된 의도에 따른 맞춤 질문 생성
      // const sessionId = sessionStorage.getItem('sessionId');
      // const selectedIntentObj = intents.find(i => i.id === intentId);
      // const response = await fetch('/api/questions/generate', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: JSON.stringify({ 
      //     sessionId,
      //     goal,
      //     intentTitle: selectedIntentObj.title
      //   })
      // });
      // const { questionSetId, questions } = await response.json();
      // sessionStorage.setItem('questionSetId', questionSetId);
      // setQuestions(questions);

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
          type: "single",
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
    } catch {
      setError("질문 생성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    // 답변은 로컬에만 저장하고 최종 제출 시 한번에 전송
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
      // TODO: API 연결 - POST /questions/answer
      // 모든 답변을 한번에 제출하여 체크리스트 생성
      // const sessionId = sessionStorage.getItem('sessionId');
      // const questionSetId = sessionStorage.getItem('questionSetId');
      // const selectedIntentObj = intents.find(i => i.id === selectedIntent);
      // const answersArray = questions.map(q => ({
      //   questionId: q.id,
      //   questionText: q.text,
      //   questionType: q.type === 'single' ? 'multiple' : 'text',
      //   answer: answers[q.id] || ''
      // }));
      // const response = await fetch('/api/questions/answer', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: JSON.stringify({
      //     sessionId,
      //     questionSetId,
      //     goal,
      //     selectedIntent: selectedIntentObj.title,
      //     answers: answersArray
      //   })
      // });
      // const { checklistId, redirectUrl } = await response.json();

      const checklistId = "mock-id-123"
      void navigate(`/result/${checklistId}`)
    } catch {
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
    // TODO: 보이드 제거 아악
    void fetchIntents()
  }, [navigate])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showAdModal) {
        e.preventDefault()
      }

      if (e.ctrlKey && e.key === "Enter" && isAllQuestionsAnswered && !isCreating) {
        // TODO: 보이드 제거
        void handleCreateChecklist()
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

        {/* TODO: 보이드 제거 */}
        {!selectedIntent && <IntentSelection intents={intents} onSelect={(id) => void handleIntentSelect(id)} />}

        {selectedIntent && isLoading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner message="맞춤 질문을 생성하고 있습니다..." />
          </div>
        )}

        {selectedIntent && !isLoading && questions.length > 0 && (
          <QuestionSection questions={questions} answers={answers} onAnswerChange={handleAnswerChange} />
        )}

        // TODO: 보이드 제거
        {isAllQuestionsAnswered && <CreateButton onClick={() => void handleCreateChecklist()} isLoading={isCreating} />}

        {showAdModal && <AdModal onComplete={() => setShowAdModal(false)} isCreating={isCreating} />}
      </div>
    </div>
  )
}
