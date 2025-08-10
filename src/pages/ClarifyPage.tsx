"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClarifyHeader } from "../components/clarify/clarify-header"
import { CreateButton } from "../components/clarify/create-button"
import { ErrorMessage } from "../components/clarify/error-message"
import { IntentSelection } from "../components/clarify/intent-selection"
import { IntentSkeleton } from "../components/clarify/intent-skeleton"
import { LoadingSpinner } from "../components/clarify/loading-spinner"
import { ProgressBar } from "../components/clarify/progress-bar"
import { QuestionSection } from "../components/clarify/question-section"
import { StreamingQuestionGenerator } from "../components/streaming/streaming-question-generator"
import { StreamingChecklistGenerator } from "../components/streaming/streaming-checklist-generator"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../hooks/useAuth"
import {
  analyzeIntents,
  saveQuestionAnswer,
  formatApiError,
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
  const [isCreating, setIsCreating] = useState(false)
  // 세션 정보
  const [sessionId, setSessionId] = useState<string>("")

  const fetchIntents = async (targetGoal?: string) => {
    const goalToAnalyze = targetGoal || goal

    if (!goalToAnalyze || !goalToAnalyze.trim()) {
      console.error('❌ 의도 분석 실패: 목표가 비어있음')
      setError("목표가 설정되지 않았습니다.")
      return
    }

    try {
      console.log('🎯 의도 분석 시작:', { goal: goalToAnalyze })
      setIsLoading(true)
      setError("")

      const response = await analyzeIntents(goalToAnalyze.trim())

      if (response.success && response.data) {
        console.log('✅ 의도 분석 성공:', response.data)
        
        // Intent에 id가 없는 경우 생성해주기
        const intentsWithId = (response.data.intents || []).map((intent, index) => ({
          ...intent,
          id: intent.id || `intent_${index}_${Date.now()}`
        }))
        
        console.log('🔧 ID 추가된 의도들:', intentsWithId)
        
        setSessionId(response.data.sessionId)
        setIntents(intentsWithId)
        setProgress(25)

        toast({
          title: "분석 완료!",
          description: `${response.data.intents?.length || 0}개의 방향을 찾았습니다.`,
          variant: "default",
        })
      } else {
        console.error('❌ 의도 분석 실패:', response.error)
        const errorMessage = formatApiError(response.error) || "의도 분석 중 오류가 발생했습니다."
        setError(errorMessage)

        toast({
          title: "분석 실패",
          description: errorMessage,
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
    console.log('📌 현재 sessionId:', sessionId)
    console.log('🚀 스트리밍 모드로 질문 생성 시작')

    // title과 description을 결합하여 더 많은 컨텍스트 제공
    const intentWithContext = `${selectedIntentObj.title}. ${selectedIntentObj.description}`
    setSelectedIntent(intentWithContext)
    setError("")
    setProgress(25) // 의도 선택 완료
  }

  // 스트리밍 질문 생성 완료 핸들러
  const handleStreamingQuestionsComplete = (streamedQuestions: Question[]) => {
    console.log('✅ 스트리밍 질문 생성 완료:', streamedQuestions)
    // 중복 방지: 이미 질문이 있으면 추가로 설정하지 않음
    if (questions.length === 0) {
      setQuestions(streamedQuestions)
      setProgress(50)
      
      toast({
        title: "질문 생성 완료!",
        description: `${streamedQuestions.length}개의 맞춤 질문을 준비했습니다.`,
        variant: "default",
      })
    } else {
      console.log('⚠️ 이미 질문이 있으므로 중복 설정 방지:', questions.length, '개 존재')
    }
  }

  // 스트리밍 에러 핸들러
  const handleStreamingError = (streamError: string) => {
    console.error('❌ 스트리밍 에러:', streamError)
    setError(streamError)
    
    toast({
      title: "질문 생성 실패",
      description: streamError,
      variant: "destructive",
    })
  }

  const handleAnswerChange = async (questionId: string, answer: string | string[]) => {
    console.log('📝 답변 업데이트:', { questionId, answer })
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))

    const answeredCount = Object.keys({ ...answers, [questionId]: answer }).length
    const totalQuestions = questions.length
    const newProgress = 50 + (answeredCount / totalQuestions) * 40
    setProgress(newProgress)

    // 백엔드에 개별 답변 저장 (비동기로 처리, 실패해도 UI 블록하지 않음)
    if (sessionId && answer) {
      try {
        await saveQuestionAnswer(sessionId, questionId, answer)
        console.log('✅ 개별 답변 저장 성공:', { questionId })
      } catch (error) {
        console.warn('⚠️ 개별 답변 저장 실패 (계속 진행):', error)
      }
    }
  }

  // 체크리스트 생성 시작 (스트리밍 UI가 실제 API 호출을 처리)
  const handleCreateChecklist = () => {
    console.log('🚀 체크리스트 생성 UI 표시')
    setIsCreating(true)
    setError("")
  }


  const isAllQuestionsAnswered =
    questions.length > 0 &&
    questions.every((q) => {
      const answer = answers[q.id]
      if (!answer) return !q.required // 필수가 아니면 답변 없어도 OK
      
      if (Array.isArray(answer)) {
        return answer.length > 0
      } else if (typeof answer === 'string') {
        return answer.trim().length > 0
      }
      return false
    })

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
      console.log('📝 sessionStorage에서 가져온 목표:', { storedGoal, length: storedGoal?.length })

      if (!storedGoal || !storedGoal.trim()) {
        console.log('🚫 목표 없음 또는 빈 문자열, 홈페이지로 이동')
        toast({
          title: "목표 없음",
          description: "먼저 목표를 입력해주세요.",
          variant: "destructive",
        })
        void navigate('/')
        return
      }

      const trimmedGoal = storedGoal.trim()
      console.log('✅ 유효한 목표 설정:', { goal: trimmedGoal })
      setGoal(trimmedGoal)
      void fetchIntents(trimmedGoal)
    }
  }, [navigate, isAuthenticated, authLoading])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter" && isAllQuestionsAnswered && !isCreating) {
        handleCreateChecklist()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isAllQuestionsAnswered, isCreating])

  // 디버그: 상태 변경 추적
  useEffect(() => {
    console.log('📊 상태 변경 감지:', {
      selectedIntent,
      isLoading,
      questionsLength: questions.length,
      questionsData: questions.slice(0, 2) // 처음 2개만 로깅
    })
  }, [selectedIntent, isLoading, questions])

  // 인증 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-primary-50 dark:from-gray-900 dark:to-slate-900">
        <LoadingSpinner stage="auth-check" />
      </div>
    )
  }

  // 의도 분석 로딩 중
  if (isLoading && intents.length === 0) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-primary-50 dark:from-gray-900 dark:to-slate-900 relative"
        role="main"
        aria-label="목표 구체화 페이지"
      >
        {/* 미묘한 배경 패턴 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary-500/5 dark:bg-brand-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary-500/5 dark:bg-brand-secondary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          <ClarifyHeader goal={goal} />
          <IntentSkeleton />
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-primary-50 dark:from-gray-900 dark:to-slate-900">
        <ErrorMessage
          message={error}
          onRetry={() => {
            setError("")
            if (intents.length === 0) {
              void fetchIntents(goal)
            } else if (selectedIntent && questions.length === 0) {
              // 스트리밍 모드에서는 에러 초기화만 하면 자동으로 다시 시작됨
              setError("")
              setQuestions([])
            }
          }}
        />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-primary-50 dark:from-gray-900 dark:to-slate-900 relative"
      role="main"
      aria-label="목표 구체화 페이지"
    >
      {/* 미묘한 배경 패턴 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary-500/5 dark:bg-brand-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary-500/5 dark:bg-brand-secondary-500/10 rounded-full blur-3xl" />
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

        {/* 디버그: 현재 상태 확인 */}
        {(() => {
          console.log('🔍 렌더링 상태:', {
            selectedIntent,
            isLoading,
            questionsLength: questions.length,
            showIntentSelection: !selectedIntent && intents.length > 0,
            showLoading: selectedIntent && isLoading,
            showQuestions: selectedIntent && !isLoading && questions.length > 0
          })
          return null
        })()}

        {/* 의도 선택 단계 */}
        {!selectedIntent && intents.length > 0 && (
          <IntentSelection intents={intents} onSelect={(id) => void handleIntentSelect(id)} />
        )}

        {/* 스트리밍 질문 생성기 */}
        {selectedIntent && questions.length === 0 && (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-6 mb-8">
            <StreamingQuestionGenerator
              sessionId={sessionId}
              goal={goal}
              intentTitle={selectedIntent}
              onQuestionsComplete={handleStreamingQuestionsComplete}
              onError={handleStreamingError}
              autoStart={true}
              className="w-full"
            />
          </div>
        )}

        {/* 질문 표시 */}
        {selectedIntent && questions.length > 0 && (
          <QuestionSection questions={questions} answers={answers} onAnswerChange={handleAnswerChange} />
        )}

        {/* 에러 상태: 질문 생성 실패 */}
        {selectedIntent && questions.length === 0 && error && (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">질문을 생성하지 못했습니다.</p>
            <button
              onClick={() => {
                // 에러 초기화하고 다시 스트리밍 시작
                setError("")
                setQuestions([])
              }}
              className="px-4 py-2 bg-brand-primary-500 text-white rounded hover:bg-brand-primary-600"
            >
              다시 시도
            </button>
          </div>
        )}

        {isAllQuestionsAnswered && !isCreating && (
          <CreateButton onClick={handleCreateChecklist} isLoading={isCreating} />
        )}

        {/* 체크리스트 생성 중일 때 스트리밍 UI */}
        {isCreating && (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-6 mb-8">
            <StreamingChecklistGenerator
              sessionId={sessionId}
              goal={goal}
              intentTitle={selectedIntent}
              answersArray={questions.map((q, index) => ({
                questionId: q.id,
                questionIndex: index,
                questionText: q.text,
                questionType: q.type,
                answer: answers[q.id] || (q.type === 'multiple' ? [] : '')
              }))}
              onChecklistComplete={(checklistId) => {
                console.log('✅ 체크리스트 완료:', checklistId)
                void navigate(`/result/${checklistId}`)
              }}
              onError={(error) => {
                console.error('❌ 체크리스트 생성 에러:', error)
                setError(error)
                setIsCreating(false)
              }}
              autoStart={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
