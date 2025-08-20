"use client"

import { Eye, EyeOff, Plus, Share2 } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { ShareModal } from "./share-modal"

interface ActionButtonsProps {
  onShare?: () => void // 기존 호환성을 위해 optional로 변경
  onNewChecklist: () => void
  checklistData?: {
    title: string
    completedItems: number
    totalItems: number
    progressPercentage: number
  }
  userName?: string
  showAllDetails?: boolean
  onToggleDetails?: () => void
}

/**
 * 체크리스트 결과 페이지의 주요 액션 버튼(공유, 새로 만들기)을 모아놓은 컴포넌트입니다.
 * @param {ActionButtonsProps} props - 액션 버튼 컴포넌트의 props입니다.
 * @param {() => void} props.onShare - 공유 버튼 클릭 시 호출될 함수입니다.
 * @param {() => void} props.onNewChecklist - 새 체크리스트 만들기 버튼 클릭 시 호출될 함수입니다.
 * @returns {JSX.Element} 렌더링된 액션 버튼 그룹입니다.
 */
export function ActionButtons({ onShare, onNewChecklist, checklistData, userName, showAllDetails = true, onToggleDetails }: ActionButtonsProps) {
  const [showShareModal, setShowShareModal] = useState(false)

  const handleShareClick = () => {
    if (checklistData) {
      setShowShareModal(true)
    } else if (onShare) {
      onShare() // 기존 동작 유지
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button
          onClick={handleShareClick}
          variant="outline"
          className="flex-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 text-muted-foreground hover:bg-white/80 dark:hover:bg-gray-900/80 hover:border-blue-500/50 py-3 rounded-xl transition-all duration-300 group hover:text-foreground shadow-lg"
        >
          <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium">공유하기</span>
        </Button>

        {onToggleDetails && (
          <Button
            onClick={onToggleDetails}
            variant="outline"
            className="flex-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 text-muted-foreground hover:bg-white/80 dark:hover:bg-gray-900/80 hover:border-indigo-500/50 py-3 rounded-xl transition-all duration-300 group hover:text-foreground shadow-lg"
          >
            {showAllDetails ? (
              <>
                <EyeOff className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">간단히 보기</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">상세히 보기</span>
              </>
            )}
          </Button>
        )}

      <Button
        onClick={onNewChecklist}
        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 group"
      >
        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
        <span>새 체크리스트 만들기</span>
      </Button>
    </div>

    {/* 공유 모달 */}
    {showShareModal && checklistData && (
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        checklistData={checklistData}
        userName={userName}
      />
    )}
  </>
  )
}
