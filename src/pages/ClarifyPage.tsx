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
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../hooks/useAuth"
import {
  analyzeIntents,
  createChecklist,
  generateQuestions,
  type Intent,
  type Question
} from "../lib/api"

/**
 * 사용자의 목표를 구체화하기 위한 다단계 페이지 컴포넌트입니다.
 * 의도 선택, 질문 답변 등의 과정을 통해 체크리스트 생성을 준비합니다.
 * @returns {JSX.Element} 목표 구체화 페이지를 렌더링합니다.
 */
export default function ClarifyPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

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

  // 세션 정보
  const [sessionId, setSessionId] = useState<string>("")
  const [questionSetId, setQuestionSetId] = useState<string>("")

  const fetchIntents = async () => {
    try {
      console.log('🎯 의도 분석 시작:', { goal })
      setIsLoading(true)
      setError("")

      const response = await analyzeIntents(goal)

      if (response.success && response.data) {
        console.log('✅ 의도 분석 성공:', response.data)
        setSessionId(response.data.sessionId)
        setIntents(response.data.intents)
        setProgress(25)

        toast({
          title: "분석 완료!",
          description: `${response.data.intents.length}개의 방향을 찾았습니다.`,
          variant: "default",
        })
      } else {
        console.error('❌ 의도 분석 실패:', response.error)
        setError(response.error || "의도 분석 중 오류가 발생했습니다.")

        toast({
          title: "분석 실패",
          description: response.error || "의도 분석 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('💥 의도 분석 에러:', error)
      setError("의도 분석 중 오류가 발생했습니다.")

      toast({
        title: "연결 오류",
        description: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleIntentSelect = async (intentId: string) => {
    const selectedIntentObj = intents.find(i => i.id === intentId)
    if (!selectedIntentObj) return

    console.log('🎯 의도 선택:', selectedIntentObj)
    setSelectedIntent(intentId)
    setIsLoading(true)
    setError("")

    try {
      const response = await generateQuestions(sessionId, goal, selectedIntentObj.title)

      if (response.success && response.data) {
        console.log('✅ 질문 생성 성공:', response.data)
        setQuestionSetId(response.data.questionSetId)
        setQuestions(response.data.questions)
        setProgress(50)

        toast({
          title: "질문 생성 완료!",
          description: `${response.data.questions.length}개의 맞춤 질문을 준비했습니다.`,
          variant: "default",
        })
      } else {
        console.error('❌ 질문 생성 실패:', response.error)
        setError(response.error || "질문 생성 중 오류가 발생했습니다.")

        toast({
          title: "질문 생성 실패",
          description: response.error || "질문 생성 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('💥 질문 생성 에러:', error)
      setError("질문 생성 중 오류가 발생했습니다.")

      toast({
        title: "연결 오류",
        description: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    console.log('📝 답변 업데이트:', { questionId, answer })
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))

    const answeredCount = Object.keys({ ...answers, [questionId]: answer }).length
    const totalQuestions = questions.length
    const newProgress = 50 + (answeredCount / totalQuestions) * 40
    setProgress(newProgress)
  }

  const handleCreateChecklist = async () => {
    console.log('🚀 체크리스트 생성 시작')
    setShowAdModal(true)
    setIsCreating(true)
    setError("")

    try {
      const selectedIntentObj = intents.find(i => i.id === selectedIntent)
      if (!selectedIntentObj) throw new Error('선택된 의도를 찾을 수 없습니다.')

      const answersArray = questions.map(q => ({
        questionId: q.id,
        questionText: q.text,
        questionType: q.type === 'single' ? 'multiple' : 'text',
        answer: answers[q.id] || ''
      }))

      console.log('📊 제출할 데이터:', { sessionId, questionSetId, goal, selectedIntent: selectedIntentObj.title, answersArray })

      const response = await createChecklist(
        sessionId,
        questionSetId,
        goal,
        selectedIntentObj.title,
        answersArray
      )

      if (response.success && response.data) {
        console.log('✅ 체크리스트 생성 성공:', response.data)

        toast({
          title: "체크리스트 생성 완료!",
          description: "나만의 실행 체크리스트가 준비되었습니다.",
          variant: "default",
        })

        // 잠시 후 결과 페이지로 이동
        setTimeout(() => {
          void navigate(`/result/${response.data!.checklistId}`)
        }, 1000)
      } else {
        console.error('❌ 체크리스트 생성 실패:', response.error)
        setError(response.error || "체크리스트 생성 중 오류가 발생했습니다.")
        setShowAdModal(false)

        toast({
          title: "생성 실패",
          description: response.error || "체크리스트 생성 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('💥 체크리스트 생성 에러:', error)
      setError("체크리스트 생성 중 오류가 발생했습니다.")
      setShowAdModal(false)

      toast({
        title: "연결 오류",
        description: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
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
    // 인증 상태 확인
    if (!authLoading && !isAuthenticated) {
      console.log('🚫 인증되지 않은 사용자, 로그인 페이지로 이동')
      toast({
        title: "로그인 필요",
        description: "체크리스트를 생성하려면 로그인이 필요합니다.",
        variant: "destructive",
      })
      void navigate('/login')
      return
    }

    // 목표 확인 및 의도 분석 시작
    if (isAuthenticated) {
      const storedGoal = sessionStorage.getItem("goal")
      if (!storedGoal) {
        console.log('🚫 목표 없음, 홈페이지로 이동')
        toast({
          title: "목표 없음",
          description: "먼저 목표를 입력해주세요.",
          variant: "destructive",
        })
        void navigate('/')
        return
      }

      setGoal(storedGoal)
      void fetchIntents()
    }
  }, [navigate, isAuthenticated, authLoading])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showAdModal) {
        e.preventDefault()
      }

      if (e.ctrlKey && e.key === "Enter" && isAllQuestionsAnswered && !isCreating) {
        void handleCreateChecklist()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showAdModal, isAllQuestionsAnswered, isCreating])

  // 인증 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
        <LoadingSpinner message="인증 상태 확인 중..." />
      </div>
    )
  }

  // 의도 분석 로딩 중
  if (isLoading && intents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
        <LoadingSpinner message="AI가 목표를 분석 중입니다..." />
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
        <ErrorMessage
          message={error}
          onRetry={() => {
            setError("")
            if (intents.length === 0) {
              void fetchIntents()
            } else if (selectedIntent && questions.length === 0) {
              void handleIntentSelect(selectedIntent)
            }
          }}
        />
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

        {!selectedIntent && <IntentSelection intents={intents} onSelect={(id) => void handleIntentSelect(id)} />}

        {selectedIntent && isLoading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner message="맞춤 질문을 생성하고 있습니다..." />
          </div>
        )}

        {selectedIntent && !isLoading && questions.length > 0 && (
          <QuestionSection questions={questions} answers={answers} onAnswerChange={handleAnswerChange} />
        )}

        {isAllQuestionsAnswered && <CreateButton onClick={() => void handleCreateChecklist()} isLoading={isCreating} />}

        {showAdModal && <AdModal onComplete={() => setShowAdModal(false)} isCreating={isCreating} />}
      </div>
    </div>
  )
}
