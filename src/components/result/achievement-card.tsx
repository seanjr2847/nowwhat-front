"use client"

import { forwardRef } from "react"
import { Trophy, Users, Calendar, Target } from "lucide-react"
import { Card, CardContent } from "../ui/card"

interface AchievementCardProps {
  userName: string
  checklistTitle: string
  completedItems: number
  totalItems: number
  progressPercentage: number
  completedDate?: Date
  personalMessage?: string
  theme?: 'celebration' | 'professional' | 'minimal'
  className?: string
}

/**
 * 소셜 미디어 공유용 성취 카드 컴포넌트입니다.
 * 체크리스트 완료 성과를 시각적으로 표현하여 바이럴 효과를 극대화합니다.
 */
export const AchievementCard = forwardRef<HTMLDivElement, AchievementCardProps>(
  ({ 
    userName, 
    checklistTitle, 
    completedItems, 
    totalItems, 
    progressPercentage,
    completedDate = new Date(),
    personalMessage,
    theme = 'celebration',
    className = ""
  }, ref) => {

    const getThemeStyles = () => {
      switch (theme) {
        case 'celebration':
          return {
            background: 'bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20',
            border: 'border-yellow-400/30',
            accent: 'text-yellow-400',
            icon: 'text-yellow-400',
            glow: 'shadow-yellow-400/25'
          }
        case 'professional':
          return {
            background: 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20',
            border: 'border-blue-500/30',
            accent: 'text-blue-400',
            icon: 'text-blue-400',
            glow: 'shadow-blue-400/25'
          }
        case 'minimal':
          return {
            background: 'bg-gradient-to-br from-gray-500/10 via-slate-500/10 to-gray-600/10',
            border: 'border-gray-500/20',
            accent: 'text-gray-300',
            icon: 'text-gray-400',
            glow: 'shadow-gray-400/10'
          }
      }
    }

    const styles = getThemeStyles()
    const formattedDate = completedDate.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    const getAchievementEmoji = () => {
      if (progressPercentage === 100) return '🎉'
      if (progressPercentage >= 75) return '🔥'
      if (progressPercentage >= 50) return '💪'
      return '🚀'
    }

    const getMotivationalMessage = () => {
      if (progressPercentage === 100) {
        return personalMessage || "목표 달성 완료! 👏"
      }
      return personalMessage || "꾸준히 진행 중! 💫"
    }

    return (
      <Card 
        ref={ref}
        className={`
          ${styles.background} 
          ${styles.border} 
          border-2 backdrop-blur-sm 
          shadow-2xl ${styles.glow} 
          max-w-md w-full
          ${className}
        `}
      >
        <CardContent className="p-8 space-y-6">
          {/* 헤더 - 사용자와 성취 */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Trophy className={`w-6 h-6 ${styles.icon}`} />
              <h2 className="text-xl font-bold text-foreground/90">
                {userName}님이 달성했어요!
              </h2>
              <span className="text-2xl">{getAchievementEmoji()}</span>
            </div>
          </div>

          {/* 체크리스트 정보 */}
          <div className="bg-white/5 dark:bg-gray-900/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-start space-x-3">
              <Target className={`w-5 h-5 ${styles.icon} mt-0.5 flex-shrink-0`} />
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-foreground/90 text-lg leading-tight">
                  "{checklistTitle}"
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">
                    ✅ {completedItems}개 중 {totalItems}개 완료
                  </span>
                  <span className={`font-bold text-lg ${styles.accent}`}>
                    {progressPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="space-y-2">
            <div className="w-full bg-gray-700/30 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r transition-all duration-500 ease-out ${
                  progressPercentage === 100 
                    ? 'from-green-400 to-emerald-500' 
                    : 'from-blue-400 to-purple-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* 개인 메시지 */}
          <div className="text-center">
            <p className={`text-lg font-medium ${styles.accent}`}>
              {getMotivationalMessage()}
            </p>
          </div>

          {/* 하단 정보 */}
          <div className="flex items-center justify-between text-sm text-foreground/60 pt-2 border-t border-white/10">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>nowwhat.co.kr</span>
            </div>
          </div>

          {/* 하단 CTA */}
          <div className="text-center pt-2">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-3 border border-blue-500/20">
              <p className="text-sm text-blue-300 font-medium">
                🚀 나도 체크리스트 만들어보기
              </p>
              <p className="text-xs text-blue-400/80 mt-1">
                nowwhat.co.kr
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

AchievementCard.displayName = "AchievementCard"