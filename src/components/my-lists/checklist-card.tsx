"use client"

import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import {
  Calendar,
  CheckCircle,
  Clock,
  MoreVertical,
  Trash2,
  Plane,
  Briefcase,
  BookOpen,
  Heart,
  Building2,
} from "lucide-react"
import { useState } from "react"
import type { ChecklistSummary } from "../../lib/api"

interface ChecklistCardProps {
  checklist: ChecklistSummary
  onClick: () => void
  onDelete: () => void
}

/**
 * '내 체크리스트' 페이지에 표시되는 개별 체크리스트 요약 카드 컴포넌트입니다.
 * @param {ChecklistCardProps} props - 체크리스트 카드 컴포넌트의 props입니다.
 * @param {ChecklistSummary} props.checklist - 표시할 체크리스트의 요약 정보입니다.
 * @param {() => void} props.onClick - 카드를 클릭했을 때 호출될 함수입니다.
 * @param {() => void} props.onDelete - 삭제 버튼을 클릭했을 때 호출될 함수입니다.
 * @returns {JSX.Element} 렌더링된 체크리스트 카드입니다.
 */
export function ChecklistCard({ checklist, onClick, onDelete }: ChecklistCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    })
  }

  // 통일된 진행률 색상 - 블루 계열로 통일
  const getProgressColor = () => {
    return "from-blue-500 to-blue-600"
  }

  // 카테고리별 아이콘과 색상
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
      여행: { icon: Plane, color: "text-blue-500" },
      커리어: { icon: Briefcase, color: "text-emerald-500" },
      학습: { icon: BookOpen, color: "text-purple-500" },
      건강: { icon: Heart, color: "text-rose-500" },
      비즈니스: { icon: Building2, color: "text-amber-500" },
    }
    return iconMap[category] || { icon: CheckCircle, color: "text-muted-foreground" }
  }

  // 진행률 텍스트 색상도 통일
  const getProgressTextColor = () => {
    return "text-blue-600 dark:text-blue-400"
  }

  const categoryInfo = getCategoryIcon(checklist.category)
  const CategoryIcon = categoryInfo.icon

  return (
    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 hover:border-blue-500/60 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 rounded-2xl hover:scale-[1.02] group cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-blue-500/20">
      <CardContent className="p-6" onClick={onClick}>
        <div className="space-y-4">
          {/* 헤더 */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-start space-x-3 mb-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 flex items-center justify-center shadow-lg">
                    <CategoryIcon className={`w-4 h-4 ${categoryInfo.color}`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {checklist.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{checklist.category}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur-sm p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg border border-white/20 dark:border-gray-700/20"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 top-8 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-lg p-1 min-w-[120px] shadow-2xl">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                      setShowMenu(false)
                    }}
                    className="w-full justify-start text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/20 backdrop-blur-sm px-3 py-2 text-sm rounded-md"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    삭제
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 진행률 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">진행률</span>
              <span className={`font-bold ${getProgressTextColor()}`}>{Math.round(checklist.progress)}%</span>
            </div>

            <div className="relative w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                style={{ width: `${checklist.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>
                  <span className="font-medium text-gray-900 dark:text-white">{checklist.completedItems}</span>
                  <span className="text-gray-500 dark:text-gray-400">/{checklist.totalItems}</span> 완료
                </span>
              </div>
              {checklist.progress === 100 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs px-2 py-1 bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/30 rounded-full shadow-sm">
                  완료!
                </span>
              )}
            </div>
          </div>

          {/* 날짜 정보 */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-white/40 dark:border-gray-700/40">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>생성: {formatDate(checklist.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>수정: {formatDate(checklist.lastUpdated)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
