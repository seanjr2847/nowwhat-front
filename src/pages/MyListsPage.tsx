"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LoadingSpinner } from "../components/clarify/loading-spinner"
import { ChecklistCard } from "../components/my-lists/checklist-card"
import { EmptyState } from "../components/my-lists/empty-state"
import { MyListsHeader } from "../components/my-lists/my-lists-header"
import { SearchAndFilter } from "../components/my-lists/search-and-filter"

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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // TODO: API 연결 - GET /checklists/my
      // 내 체크리스트 목록 조회
      // const response = await fetch('/api/checklists/my', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      // });
      // const { checklists } = await response.json();
      // setChecklists(checklists);
      // setFilteredChecklists(checklists);

      const mockChecklists: ChecklistSummary[] = [
        {
          id: "1",
          goal: "일본 여행 가고싶어",
          createdAt: "2024-01-15T10:30:00Z",
          totalItems: 8,
          completedItems: 5,
          progress: 62.5,
          lastUpdated: "2024-01-16T14:20:00Z",
          category: "여행",
        },
        {
          id: "2",
          goal: "취업 준비하기",
          createdAt: "2024-01-10T09:15:00Z",
          totalItems: 12,
          completedItems: 3,
          progress: 25,
          lastUpdated: "2024-01-14T16:45:00Z",
          category: "커리어",
        },
        {
          id: "3",
          goal: "새로운 언어 배우기",
          createdAt: "2024-01-08T11:00:00Z",
          totalItems: 10,
          completedItems: 10,
          progress: 100,
          lastUpdated: "2024-01-12T18:30:00Z",
          category: "학습",
        },
        {
          id: "4",
          goal: "건강한 생활 시작하기",
          createdAt: "2024-01-05T08:45:00Z",
          totalItems: 6,
          completedItems: 2,
          progress: 33.3,
          lastUpdated: "2024-01-15T07:20:00Z",
          category: "건강",
        },
        {
          id: "5",
          goal: "부업으로 온라인 쇼핑몰 창업하기",
          createdAt: "2024-01-03T13:20:00Z",
          totalItems: 15,
          completedItems: 8,
          progress: 53.3,
          lastUpdated: "2024-01-16T20:10:00Z",
          category: "비즈니스",
        },
      ]

      setChecklists(mockChecklists)
      setFilteredChecklists(mockChecklists)
    } catch (err) {
      console.error("Failed to fetch checklists:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = checklists

    if (searchQuery) {
      filtered = filtered.filter((checklist) => checklist.goal.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((checklist) => checklist.category === selectedCategory)
    }

    setFilteredChecklists(filtered)
  }, [checklists, searchQuery, selectedCategory])

  const handleDelete = (id: string) => {
    if (confirm("정말로 이 체크리스트를 삭제하시겠습니까?")) {
      // TODO: API 연결 - DELETE /checklists/{id}
      // 체크리스트 삭제
      // (async () => {
      //   const response = await fetch(`/api/checklists/${id}`, {
      //     method: 'DELETE',
      //     headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      //   });
      //   if (response.ok) {
      //     setChecklists((prev) => prev.filter((item) => item.id !== id))
      //   }
      // })();

      setChecklists((prev) => prev.filter((item) => item.id !== id))
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
        <MyListsHeader onNewChecklist={handleNewChecklist} totalCount={checklists.length} />

        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          checklists={checklists}
        />

        {filteredChecklists.length === 0 ? (
          <EmptyState
            hasChecklists={checklists.length > 0}
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
                onDelete={() => handleDelete(checklist.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
