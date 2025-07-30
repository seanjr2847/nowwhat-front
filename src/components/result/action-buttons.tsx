"use client"

import { Heart, Plus, Share2 } from "lucide-react"
import { Button } from "../ui/button"
import { saveChecklist } from "../../lib/api"
import { useState } from "react"

interface ActionButtonsProps {
  onShare: () => void
  onNewChecklist: () => void
  onSaveChecklist?: () => void
  isSaved?: boolean
  checklistId?: string
}

/**
 * 체크리스트 결과 페이지의 주요 액션 버튼(공유, 새로 만들기, 저장)을 모아놓은 컴포넌트입니다.
 * @param {ActionButtonsProps} props - 액션 버튼 컴포넌트의 props입니다.
 * @param {() => void} props.onShare - 공유 버튼 클릭 시 호출될 함수입니다.
 * @param {() => void} props.onNewChecklist - 새 체크리스트 만들기 버튼 클릭 시 호출될 함수입니다.
 * @param {() => void} [props.onSaveChecklist] - 체크리스트 저장 버튼 클릭 시 호출될 함수입니다.
 * @param {boolean} [props.isSaved] - 체크리스트가 이미 저장되었는지 여부입니다.
 * @returns {JSX.Element} 렌더링된 액션 버튼 그룹입니다.
 */
export function ActionButtons({ onShare, onNewChecklist, onSaveChecklist, isSaved, checklistId }: ActionButtonsProps) {
  const [isSaving, setIsSaving] = useState(false)

  // 체크리스트 저장 API 연결
  const handleSaveChecklist = async () => {
    if (checklistId == null || checklistId === '' || isSaving) return
    
    try {
      setIsSaving(true)
      const response = await saveChecklist(checklistId)
      
      if (response.success) {
        onSaveChecklist?.()
      } else {
        console.error("체크리스트 저장 실패:", response.error)
        alert("체크리스트 저장에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("체크리스트 저장 오류:", error)
      alert("체크리스트 저장 중 오류가 발생했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {onSaveChecklist && (
        <Button
          onClick={() => { void handleSaveChecklist() }}
          disabled={isSaving === true || isSaved === true}
          variant={isSaved ? "default" : "outline"}
          className={`flex-1 ${isSaved === true
              ? "bg-pink-500 hover:bg-pink-600 text-white"
              : "bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 text-muted-foreground hover:bg-white/80 dark:hover:bg-gray-900/80 hover:border-pink-500/50"
            } py-3 rounded-xl transition-all duration-300 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isSaved === true ? "fill-current" : ""} group-hover:scale-110 transition-transform duration-300`} />
          <span className="font-medium">
            {isSaving ? "저장 중..." : isSaved === true ? "저장됨" : "내 리스트에 저장"}
          </span>
        </Button>
      )}

      <Button
        onClick={onShare}
        variant="outline"
        className="flex-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 text-muted-foreground hover:bg-white/80 dark:hover:bg-gray-900/80 hover:border-blue-500/50 py-3 rounded-xl transition-all duration-300 group hover:text-foreground shadow-lg"
      >
        <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
        <span className="font-medium">공유하기</span>
      </Button>

      <Button
        onClick={onNewChecklist}
        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 group"
      >
        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
        <span>새 체크리스트 만들기</span>
      </Button>
    </div>
  )
}
