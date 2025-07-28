"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/header"
import { MainContent } from "../components/home/main-content"
import { useAuth } from "../hooks/useAuth"

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // 로그인된 상태에서 임시 저장된 목표가 있는지 확인
    if (isAuthenticated && !isLoading) {
      const pendingGoal = sessionStorage.getItem("pendingGoal")
      console.log('🔍 홈페이지에서 목표 확인:', { pendingGoal, length: pendingGoal?.length })

      if (pendingGoal && pendingGoal.trim()) {
        const trimmedGoal = pendingGoal.trim()
        console.log('📝 홈페이지에서 임시 저장된 목표 발견, clarify 페이지로 이동:', { goal: trimmedGoal })
        sessionStorage.setItem("goal", trimmedGoal)
        sessionStorage.removeItem("pendingGoal")

        // 저장 확인
        const savedGoal = sessionStorage.getItem("goal")
        console.log('✅ 홈페이지에서 목표 복원 완료:', { saved: savedGoal })

        void navigate('/clarify')
      }
    }
  }, [isAuthenticated, isLoading, navigate])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <MainContent />
    </div>
  )
}
