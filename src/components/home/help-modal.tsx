"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { HelpCircle, X, Play } from "lucide-react"
import { CoachMark } from "../onboarding/coach-mark"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * 도움말 모달 컴포넌트입니다.
 * 사용법 안내와 가이드 투어를 제공합니다.
 * @param {HelpModalProps} props - 도움말 모달의 props입니다.
 * @param {boolean} props.isOpen - 모달이 열려있는지 여부입니다.
 * @param {() => void} props.onClose - 모달을 닫는 함수입니다.
 * @returns {JSX.Element | null} 렌더링된 도움말 모달입니다.
 */
export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  const onboardingSteps = [
    {
      id: "welcome",
      title: "환영합니다! 👋",
      description: "Now What?에서 당신의 목표를 실현 가능한 체크리스트로 만들어보세요. 간단한 가이드를 시작하겠습니다.",
      targetSelector: ".main-title",
      position: "bottom" as const,
      offset: { x: 0, y: 20 },
    },
    {
      id: "goal-input",
      title: "목표를 입력하세요",
      description: "이곳에 달성하고 싶은 목표를 자유롭게 입력해보세요. 예: '일본 여행 가기', '새로운 언어 배우기' 등",
      targetSelector: ".goal-input",
      position: "top" as const,
      offset: { x: 0, y: -10 },
    },
    {
      id: "suggestions",
      title: "제안 버튼 활용하기",
      description: "목표가 떠오르지 않는다면 이 제안 버튼들을 클릭해보세요. 인기 있는 목표들을 확인할 수 있습니다.",
      targetSelector: ".suggestion-buttons",
      position: "top" as const,
      offset: { x: 0, y: -10 },
    },
    {
      id: "theme-toggle",
      title: "테마 변경",
      description: "여기서 다크모드와 라이트모드를 전환할 수 있습니다. 편한 테마를 선택해보세요.",
      targetSelector: ".theme-toggle",
      position: "bottom" as const,
      offset: { x: 0, y: 10 },
    },
    {
      id: "start",
      title: "시작해보세요! 🚀",
      description: "이제 모든 준비가 끝났습니다. 목표를 입력하고 AI가 만드는 맞춤 체크리스트를 경험해보세요!",
      targetSelector: ".goal-input",
      position: "bottom" as const,
      offset: { x: 0, y: 20 },
    },
  ]

  const handleStartGuide = () => {
    onClose()
    setShowOnboarding(true)
  }

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false)
  }

  const handleSkipOnboarding = () => {
    setShowOnboarding(false)
  }

  if (!isOpen && !showOnboarding) return null

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
                사용법 안내
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 text-sm text-muted-foreground mb-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">💡 목표 입력 팁</h4>
                <ul className="space-y-1 ml-4">
                  <li>• 구체적이고 명확한 목표를 입력하세요</li>
                  <li>• "일본 여행 가기", "새로운 언어 배우기" 등</li>
                  <li>• 너무 추상적인 목표보다는 실행 가능한 목표가 좋습니다</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">🚀 진행 과정</h4>
                <ul className="space-y-1 ml-4">
                  <li>• AI가 목표를 분석합니다</li>
                  <li>• 맞춤형 질문에 답변하세요</li>
                  <li>• 개인화된 체크리스트가 생성됩니다</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/40"
              >
                닫기
              </Button>
              <Button
                onClick={handleStartGuide}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                가이드 시작
              </Button>
            </div>
          </div>
        </div>
      )}

      {showOnboarding && (
        <CoachMark steps={onboardingSteps} onComplete={handleCompleteOnboarding} onSkip={handleSkipOnboarding} />
      )}
    </>
  )
}
