"use client"

import { Button } from "../ui/button"
import { FileText, Search, Plus } from "lucide-react"

interface EmptyStateProps {
  hasChecklists: boolean
  searchQuery: string
  onNewChecklist: () => void
  onClearSearch: () => void
}

/**
 * 표시할 체크리스트가 없을 때(아예 없거나, 검색 결과가 없을 때) 보여주는 컴포넌트입니다.
 * 상황에 맞는 메시지와 액션 버튼을 제공합니다.
 * @param {EmptyStateProps} props - 빈 상태 컴포넌트의 props입니다.
 * @param {boolean} props.hasChecklists - 체크리스트가 하나라도 존재하는지 여부입니다.
 * @param {string} props.searchQuery - 현재 검색어입니다.
 * @param {() => void} props.onNewChecklist - 새 체크리스트 생성 함수입니다.
 * @param {() => void} props.onClearSearch - 검색어 초기화 함수입니다.
 * @returns {JSX.Element} 렌더링된 빈 상태 UI입니다.
 */
export function EmptyState({ hasChecklists, searchQuery, onNewChecklist, onClearSearch }: EmptyStateProps) {
  if (!hasChecklists) {
    // 체크리스트가 아예 없는 경우
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-xl">
              <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">첫 번째 체크리스트를 만들어보세요!</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            목표를 입력하면 AI가 실행 가능한 체크리스트로 만들어드립니다. 지금 바로 시작해보세요!
          </p>
        </div>

        <Button
          onClick={onNewChecklist}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 group"
        >
          <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />첫 체크리스트 만들기
        </Button>
      </div>
    )
  }

  // 검색 결과가 없는 경우
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-xl">
            <Search className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">검색 결과가 없습니다</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          "<span className="text-amber-600 dark:text-amber-400 font-medium">{searchQuery}</span>"에 대한 체크리스트를
          찾을 수 없습니다. 다른 키워드로 검색해보세요.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onClearSearch}
          variant="outline"
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-900/90 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 px-6 py-2 rounded-xl transition-all duration-300 shadow-lg"
        >
          검색 초기화
        </Button>

        <Button
          onClick={onNewChecklist}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 group"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />새 체크리스트
        </Button>
      </div>
    </div>
  )
}
