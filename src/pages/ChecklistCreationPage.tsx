"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { StreamingChecklistGenerator } from "../components/streaming/streaming-checklist-generator"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../hooks/useAuth"
import { LoadingSpinner } from "../components/clarify/loading-spinner"

interface ChecklistCreationParams {
  sessionId: string
  goal: string
  intentTitle: string
  answersArray: Array<{
    questionId: string
    questionIndex: number
    questionText: string
    questionType: string
    answer: string | string[]
  }>
}

/**
 * 체크리스트 생성 전용 페이지 컴포넌트
 * 질문 답변 완료 후 스트리밍 방식으로 체크리스트를 생성합니다.
 */
export default function ChecklistCreationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  const [creationParams, setCreationParams] = useState<ChecklistCreationParams | null>(null)
  const [error, setError] = useState<string>("")

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

    // 전달된 상태 확인
    if (isAuthenticated && location.state) {
      const params = location.state as ChecklistCreationParams
      
      if (!params.sessionId || !params.goal || !params.intentTitle || !params.answersArray) {
        console.error('❌ 체크리스트 생성에 필요한 정보가 부족합니다:', params)
        toast({
          title: "정보 부족",
          description: "체크리스트를 생성하기 위한 정보가 부족합니다. 다시 시도해주세요.",
          variant: "destructive",
        })
        void navigate('/clarify')
        return
      }

      console.log('✅ 체크리스트 생성 준비 완료:', {
        sessionId: params.sessionId,
        goal: params.goal,
        intentTitle: params.intentTitle,
        answersCount: params.answersArray.length
      })

      setCreationParams(params)
    } else if (isAuthenticated && !location.state) {
      // 상태 없이 직접 접근한 경우
      console.log('🚫 체크리스트 생성 정보 없이 접근, 질문 페이지로 이동')
      toast({
        title: "잘못된 접근",
        description: "먼저 질문에 답변해주세요.",
        variant: "destructive",
      })
      void navigate('/clarify')
      return
    }
  }, [navigate, isAuthenticated, authLoading, location.state, toast])

  // 체크리스트 생성 완료 핸들러
  const handleChecklistComplete = (checklistId: string) => {
    console.log('✅ 체크리스트 생성 완료:', checklistId)
    console.log('🔗 결과 페이지로 이동:', `/result/${checklistId}`)
    
    toast({
      title: "체크리스트 생성 완료!",
      description: "맞춤형 체크리스트가 준비되었습니다.",
      variant: "default",
    })

    void navigate(`/result/${checklistId}`)
  }

  // 체크리스트 생성 에러 핸들러
  const handleChecklistError = (errorMessage: string) => {
    console.error('❌ 체크리스트 생성 에러:', errorMessage)
    setError(errorMessage)
    
    toast({
      title: "체크리스트 생성 실패",
      description: errorMessage,
      variant: "destructive",
    })
  }

  // 다시 시도 핸들러
  const handleRetry = () => {
    setError("")
    // StreamingChecklistGenerator의 autoStart로 자동으로 다시 시작됨
  }

  // 인증 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-primary-50 dark:from-gray-900 dark:to-slate-900">
        <LoadingSpinner stage="auth-check" />
      </div>
    )
  }

  // 체크리스트 생성 정보 로딩 중
  if (!creationParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-primary-50 dark:from-gray-900 dark:to-slate-900">
        <LoadingSpinner stage="checklist-creation" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-primary-50 dark:from-gray-900 dark:to-slate-900 relative"
      role="main"
      aria-label="체크리스트 생성 페이지"
    >
      {/* 미묘한 배경 패턴 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary-500/5 dark:bg-brand-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary-500/5 dark:bg-brand-secondary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            맞춤형 체크리스트 생성
          </h1>
          <p className="text-muted-foreground">
            답변을 바탕으로 개인화된 체크리스트를 준비하고 있습니다.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            목표: <span className="font-medium">{creationParams.goal}</span>
          </div>
        </div>

        {/* 체크리스트 생성기 */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-6">
          <StreamingChecklistGenerator
            sessionId={creationParams.sessionId}
            goal={creationParams.goal}
            intentTitle={creationParams.intentTitle}
            answersArray={creationParams.answersArray}
            onChecklistComplete={handleChecklistComplete}
            onError={handleChecklistError}
            autoStart={true}
            className="w-full"
          />
        </div>

        {/* 에러 상태 */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <h3 className="text-red-800 dark:text-red-200 font-medium text-lg mb-2">
              체크리스트 생성 실패
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                다시 시도
              </button>
              <button
                onClick={() => void navigate('/clarify')}
                className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                질문으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}