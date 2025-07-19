"use client"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Search, Filter } from "lucide-react"

interface ChecklistSummary {
  id: string
  goal: string
  createdAt: string
  totalItems: number
  completedItems: number
  progress: number
  lastUpdated: string
  category: string
}

interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  checklists: ChecklistSummary[]
}

/**
 * 체크리스트를 검색하고 카테고리별로 필터링하는 UI 컴포넌트입니다.
 * @param {SearchAndFilterProps} props - 검색/필터 컴포넌트의 props입니다.
 * @param {string} props.searchQuery - 현재 검색어입니다.
 * @param {(query: string) => void} props.onSearchChange - 검색어 변경 시 호출될 함수입니다.
 * @param {string} props.selectedCategory - 현재 선택된 카테고리입니다.
 * @param {(category: string) => void} props.onCategoryChange - 카테고리 변경 시 호출될 함수입니다.
 * @param {ChecklistSummary[]} props.checklists - 필터링에 사용될 전체 체크리스트 데이터입니다.
 * @returns {JSX.Element} 렌더링된 검색 및 필터 UI입니다.
 */
export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  checklists,
}: SearchAndFilterProps) {
  const categories = [
    { id: "all", name: "전체", count: checklists.length },
    ...Array.from(new Set(checklists.map((c) => c.category))).map((category) => ({
      id: category,
      name: category,
      count: checklists.filter((c) => c.category === category).length,
    })),
  ]

  return (
    <div className="mb-8 space-y-6 animate-slide-up">
      {/* 검색바 */}
      <div className="relative max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="체크리스트 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500/70 focus:ring-blue-500/20 rounded-xl shadow-xl transition-all duration-300 focus:bg-white/80 dark:focus:bg-gray-900/80"
          />
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center justify-center">
        <div className="flex items-center flex-wrap gap-2 p-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl shadow-xl max-w-full overflow-x-auto">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="flex items-center flex-wrap gap-1 min-w-0">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                onClick={() => onCategoryChange(category.id)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur-sm"
                }`}
              >
                <span className="truncate">{category.name}</span>
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs transition-colors duration-300 ${
                    selectedCategory === category.id
                      ? "bg-white/20 text-white"
                      : "bg-white/40 dark:bg-gray-700/60 text-muted-foreground backdrop-blur-sm border border-white/20 dark:border-gray-600/20"
                  }`}
                >
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
