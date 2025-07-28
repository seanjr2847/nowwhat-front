"use client"

import { HelpCircle, Send, Settings, Sparkles, Target, Zap } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../hooks/use-toast"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { HelpModal } from "./help-modal"
import { SettingsModal } from "./settings-modal"

/**
 * 사용자가 목표를 입력하고 제출할 수 있는 폼 컴포넌트입니다.
 * 목표 제안 버튼도 포함되어 있습니다.
 * @returns {JSX.Element} 렌더링된 목표 입력 폼입니다.
 */
export function GoalInputForm() {
  const router = useNavigate()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [goal, setGoal] = useState("")
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal.trim()) return

    console.log('🎯 목표 제출:', { goal: goal.trim(), isAuthenticated })

    // 로그인 상태 확인
    if (!isAuthenticated) {
      console.log('🚫 로그인 필요, 로그인 페이지로 이동')
      const trimmedGoal = goal.trim()
      console.log('💾 임시 목표 저장:', { goal: trimmedGoal, length: trimmedGoal.length })

      sessionStorage.setItem("pendingGoal", trimmedGoal) // 로그인 후 복원할 수 있도록 저장

      // 저장 확인
      const savedPendingGoal = sessionStorage.getItem("pendingGoal")
      console.log('✅ 임시 저장 확인:', { saved: savedPendingGoal })

      toast({
        title: "로그인 필요",
        description: "체크리스트를 생성하려면 먼저 로그인해주세요.",
        variant: "destructive",
      })

      void router("/login")
      return
    }

    // 로그인된 경우 목표 저장 후 clarify 페이지로 이동
    const trimmedGoal = goal.trim()
    console.log('💾 목표 저장 중:', { original: goal, trimmed: trimmedGoal, length: trimmedGoal.length })

    sessionStorage.setItem("goal", trimmedGoal)
    sessionStorage.removeItem("pendingGoal") // 임시 저장된 목표 제거

    // 저장된 값 확인
    const savedGoal = sessionStorage.getItem("goal")
    console.log('✅ 저장 확인:', { saved: savedGoal, savedLength: savedGoal?.length })

    toast({
      title: "목표 설정 완료!",
      description: "AI가 분석하여 맞춤 체크리스트를 만들어드립니다.",
      variant: "default",
    })

    console.log('🎯 clarify 페이지로 이동')
    void router("/clarify")
  }

  return (
    <div className="relative max-w-4xl mx-auto animate-scale-in" style={{ animationDelay: "0.2s" }}>
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-3 shadow-2xl">
            <div className="space-y-3">
              {/* 첫 번째 줄: 입력창 */}
              <div>
                <Input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="어떤 목표를 이루고 싶으신가요?"
                  className="goal-input w-full h-14 sm:h-16 px-4 sm:px-6 text-sm sm:text-base bg-transparent border-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                />
              </div>

              {/* 두 번째 줄: 버튼들 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    onClick={() => setShowSettingsModal(true)}
                    className="h-9 w-9 sm:h-10 sm:w-10 bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 rounded-2xl transition-all duration-300 hover:scale-110 group/settings"
                  >
                    <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover/settings:text-purple-500 transition-colors duration-300" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="h-9 w-9 sm:h-10 sm:w-10 bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 rounded-2xl transition-all duration-300 hover:scale-110 group/help"
                  >
                    <HelpCircle className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover/help:text-blue-500 transition-colors duration-300" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={!goal.trim()}
                  className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110 group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4 text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="suggestion-buttons mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
        {[
          { icon: Target, text: "취업 준비하기" },
          { icon: Zap, text: "새로운 언어 배우기" },
          { icon: Sparkles, text: "건강한 생활 시작하기" },
        ].map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => setGoal(suggestion.text)}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/30 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-800/80 px-3 py-2 sm:px-4 rounded-xl transition-all duration-300 hover:scale-105 group shadow-lg"
          >
            <suggestion.icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xs sm:text-sm font-medium">{suggestion.text}</span>
          </Button>
        ))}
      </div>

      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  )
}
