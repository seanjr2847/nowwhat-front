"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LoadingSpinner } from "../components/clarify/loading-spinner"
import { ChecklistCard } from "../components/my-lists/checklist-card"
import { EmptyState } from "../components/my-lists/empty-state"
import { MyListsHeader } from "../components/my-lists/my-lists-header"
import { SearchAndFilter } from "../components/my-lists/search-and-filter"
import { getMyChecklists, deleteChecklist, type ChecklistSummary } from "../lib/api"

/**
 * 사용자가 생성한 모든 체크리스트를 보여주는 페이지 컴포넌트입니다.
 * 검색 및 카테고리 필터링 기능을 제공합니다.
 * @returns {JSX.Element} '내 체크리스트' 페이지를 렌더링합니다.
 */
export default function MyListsPage() {
  const navigate = useNavigate()
  const [checklists, setChecklists] = useState<ChecklistSummary[]>([])
  const [filteredChecklists, setFilteredChecklists] = useState<ChecklistSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const fetchChecklists = async () => {
    try {
      setIsLoading(true)
      const response = await getMyChecklists()
      
      if (response.success && response.data) {
        // API가 직접 배열을 반환하는 경우와 checklists 속성으로 반환하는 경우 모두 처리
        const rawData = Array.isArray(response.data) ? response.data : (response.data.checklists || [])
        
        // 백엔드의 progressPercentage를 progress로 변환하고 안전한 값 보장
        const checklistsData = rawData.map(checklist => {
          let progress: number
          
          if (typeof checklist.progressPercentage === 'number') {
            progress = checklist.progressPercentage
          } else if (typeof checklist.progress === 'number') {
            progress = checklist.progress
          } else {
            progress = (checklist.completedItems || 0) / Math.max(checklist.totalItems || 1, 1) * 100
          }
          
          // 소수점 2자리까지만 표시
          progress = Math.round(progress * 100) / 100
          
          return {
            ...checklist,
            progress
          }
        })
        
        setChecklists(checklistsData)
        setFilteredChecklists(checklistsData)
      } else {
        console.error("체크리스트 목록 로드 실패:", response.error)
        // 빈 배열로 설정하여 에러 상태 표시
        setChecklists([])
        setFilteredChecklists([])
      }
    } catch (err) {
      console.error("Failed to fetch checklists:", err)
      setChecklists([])
      setFilteredChecklists([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = checklists

    if (searchQuery) {
      filtered = filtered.filter((checklist) => checklist.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((checklist) => checklist.category === selectedCategory)
    }

    setFilteredChecklists(filtered)
  }, [checklists, searchQuery, selectedCategory])

  const handleDelete = async (id: string) => {
    if (confirm("정말로 이 체크리스트를 삭제하시겠습니까?")) {
      try {
        const response = await deleteChecklist(id)
        
        if (response.success) {
          setChecklists((prev) => prev.filter((item) => item.id !== id))
        } else {
          console.error("체크리스트 삭제 실패:", response.error)
          alert("체크리스트 삭제에 실패했습니다. 다시 시도해주세요.")
        }
      } catch (error) {
        console.error("체크리스트 삭제 오류:", error)
        alert("체크리스트 삭제 중 오류가 발생했습니다.")
      }
    }
  }

  const handleChecklistClick = (id: string) => {
    void navigate(`/result/${id}`)
  }

  const handleNewChecklist = () => {
    void navigate("/")
  }

  useEffect(() => {
    // TODO : 보이드 제거
    void fetchChecklists()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner message="체크리스트를 불러오는 중입니다..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 relative">
      {/* 미묘한 배경 패턴 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <MyListsHeader onNewChecklist={handleNewChecklist} totalCount={checklists?.length || 0} />

        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          checklists={checklists}
        />

        {filteredChecklists.length === 0 ? (
          <EmptyState
            hasChecklists={(checklists?.length || 0) > 0}
            searchQuery={searchQuery}
            onNewChecklist={handleNewChecklist}
            onClearSearch={() => setSearchQuery("")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChecklists.map((checklist) => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                onClick={() => handleChecklistClick(checklist.id)}
                onDelete={() => { void handleDelete(checklist.id) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
