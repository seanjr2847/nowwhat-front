"use client"

import { BarChart3, List, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"

export function Navigation() {
  const navigate = useNavigate()

  const handleMyListsClick = () => {
    void navigate("/my-lists")
    console.log("Navigate to my-lists page")
  }

  const handleProfileClick = () => {
    void navigate("/profile")
    console.log("Navigate to profile page")
  }

  // TODO: 목업 내용 삭제
  const navigationItems = [
    {
      id: "my-lists",
      title: "내 체크리스트",
      description: "생성한 체크리스트 관리",
      icon: List,
      onClick: handleMyListsClick,
      gradient: "from-blue-500 to-purple-500",
      hoverGradient: "from-blue-600 to-purple-600",
    },
    {
      id: "analytics",
      title: "진행 현황",
      description: "목표 달성 통계 보기",
      icon: BarChart3,
      onClick: () => console.log("Analytics coming soon"),
      gradient: "from-green-500 to-teal-500",
      hoverGradient: "from-green-600 to-teal-600",
    },
    {
      id: "profile",
      title: "프로필",
      description: "계정 설정 및 관리",
      icon: User,
      onClick: handleProfileClick,
      gradient: "from-purple-500 to-pink-500",
      hoverGradient: "from-purple-600 to-pink-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {navigationItems.map((item) => {
        const IconComponent = item.icon
        return (
          <Button
            key={item.id}
            variant="ghost"
            onClick={item.onClick}
            className="h-auto p-6 glass border border-border/50 hover:bg-accent/50 hover:border-blue-500/50 rounded-2xl transition-all duration-300 hover:scale-105 group bg-card/30 text-left flex flex-col items-center space-y-3"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} group-hover:${item.hoverGradient} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110`}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-semibold text-foreground group-hover:text-blue-400 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                {item.description}
              </p>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
