"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { LoadingSpinner } from "../components/clarify/loading-spinner"
import { ActionButtons } from "../components/result/action-buttons"
import { ChecklistHeader } from "../components/result/checklist-header"
import { ChecklistItem } from "../components/result/checklist-item"
import { CompletionCelebration } from "../components/result/completion-celebration"
import { FeedbackSection } from "../components/result/feedback-section"
import { ProgressBar } from "../components/result/progress-bar"

interface ChecklistData {
    id: string
    goal: string
    createdAt: string
    items: ChecklistItemData[]
    progress: number
    isSaved: boolean
}

interface ChecklistItemData {
    id: string
    title: string
    description: string
    details: {
        tips?: string[]
        contacts?: { name: string; phone: string; email?: string }[]
        links?: { title: string; url: string }[]
        price?: string
        location?: string
    }
    isCompleted: boolean
}

/**
 * 생성된 체크리스트를 표시하고 관리하는 결과 페이지 컴포넌트입니다.
 * 체크리스트 항목들을 체크하고, 저장하고, 공유할 수 있습니다.
 * @returns {JSX.Element} 렌더링된 결과 페이지입니다.
 */
export default function ResultPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [checklist, setChecklist] = useState<ChecklistData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [feedbackGiven, setFeedbackGiven] = useState(false)

    // TODO: API 연결 - GET /checklists/{id}
    // 체크리스트 상세 정보 조회 (가장 중요한 누락된 API!)
    const fetchChecklist = async () => {
        if (id === undefined) return

        try {
            setIsLoading(true)
            // const response = await fetch(`/api/checklists/${id}`, {
            //   headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            // });
            // 
            // if (!response.ok) {
            //   throw new Error('체크리스트를 불러올 수 없습니다.');
            // }
            // 
            // const checklistData = await response.json();
            // setChecklist(checklistData);

            // Mock 데이터 (실제 API 연결 전까지 사용)
            await new Promise(resolve => setTimeout(resolve, 1000))

            const mockChecklist: ChecklistData = {
                id,
                goal: "일본 여행 가고싶어",
                createdAt: "2024-01-15T10:30:00Z",
                isSaved: false,
                progress: 0,
                items: [
                    {
                        id: "1",
                        title: "여권 유효기간 확인",
                        description: "여권 유효기간이 6개월 이상 남아있는지 확인하세요.",
                        details: {
                            tips: ["여권 유효기간은 입국일 기준 6개월 이상이어야 합니다."],
                            links: [{ title: "외교부 여권안내", url: "https://passport.go.kr" }]
                        },
                        isCompleted: false
                    },
                    {
                        id: "2",
                        title: "항공권 예약",
                        description: "왕복 항공권을 예약하고 좌석을 선택하세요.",
                        details: {
                            tips: ["최소 2주 전 예약시 더 저렴한 가격으로 예약 가능"],
                            price: "300,000원 ~ 800,000원"
                        },
                        isCompleted: false
                    }
                ]
            }

            setChecklist(mockChecklist)
        } catch (error) {
            console.error("체크리스트 로드 실패:", error)
            void navigate("/404")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        void fetchChecklist()
    }, [id, navigate])

    const handleItemToggle = (itemId: string) => {
        if (!checklist) return

        const updatedItems = checklist.items.map(item =>
            item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
        )

        const completedCount = updatedItems.filter(item => item.isCompleted).length
        const progress = (completedCount / updatedItems.length) * 100

        setChecklist({
            ...checklist,
            items: updatedItems,
            progress
        })
    }

    const handleSaveChecklist = () => {
        if (!checklist) return
        setChecklist({ ...checklist, isSaved: true })
    }

    const handleShare = () => {
        const url = window.location.href
        void navigator.clipboard.writeText(url)
        alert("링크가 클립보드에 복사되었습니다!")
    }

    const handleNewChecklist = () => {
        void navigate("/")
    }

    const handleFeedback = (isPositive: boolean) => {
        console.log('Feedback received:', isPositive)
        setFeedbackGiven(true)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <LoadingSpinner message="체크리스트를 불러오는 중입니다..." />
            </div>
        )
    }

    if (!checklist) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">체크리스트를 찾을 수 없습니다</h1>
                    <button
                        onClick={() => { void navigate("/") }}
                        className="text-blue-500 hover:underline"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        )
    }

    const completedCount = checklist.items.filter(item => item.isCompleted).length
    const isAllCompleted = completedCount === checklist.items.length

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <ChecklistHeader goal={checklist.goal} createdAt={checklist.createdAt} />

                <ProgressBar
                    completed={completedCount}
                    total={checklist.items.length}
                    progress={checklist.progress}
                />

                <ActionButtons
                    onShare={handleShare}
                    onNewChecklist={handleNewChecklist}
                    onSaveChecklist={handleSaveChecklist}
                    isSaved={checklist.isSaved}
                />

                <div className="space-y-6 mb-8">
                    {checklist.items.map((item, index) => (
                        <ChecklistItem
                            key={item.id}
                            item={item}
                            index={index}
                            onToggle={handleItemToggle}
                        />
                    ))}
                </div>

                {isAllCompleted && <CompletionCelebration onClose={() => { }} goal={checklist.goal} />}

                <FeedbackSection onFeedback={handleFeedback} feedbackGiven={feedbackGiven} />
            </div>
        </div>
    )
}
