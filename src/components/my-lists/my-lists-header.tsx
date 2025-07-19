"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, BarChart3 } from "lucide-react"
import { Link } from "react-router-dom"

interface MyListsHeaderProps {
  onNewChecklist: () => void
  totalCount: number
}

/**
 * '내 체크리스트' 페이지의 헤더 컴포넌트입니다.
 * 페이지 제목, 전체 체크리스트 개수, 새 체크리스트 생성 버튼을 포함합니다.
 * @param {MyListsHeaderProps} props - 헤더 컴포넌트의 props입니다.
 * @param {() => void} props.onNewChecklist - '새 체크리스트' 버튼 클릭 시 호출될 함수입니다.
 * @param {number} props.totalCount - 전체 체크리스트의 개수입니다.
 * @returns {JSX.Element} 렌더링된 헤더입니다.
 */
export function MyListsHeader({ onNewChecklist, totalCount }: MyListsHeaderProps) {
  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 focus-ring rounded-xl px-4 py-2 group backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">홈으로</span>
          </Button>
        </Link>

        <Button
          onClick={onNewChecklist}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 group"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />새 체크리스트
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-full shadow-lg">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">내 체크리스트</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">나의 목표 관리</h1>
          <p className="text-gray-600 dark:text-gray-400">
            총 <span className="text-blue-600 dark:text-blue-400 font-semibold">{totalCount}개</span>의 체크리스트가
            있습니다
          </p>
        </div>
      </div>
    </header>
  )
}
