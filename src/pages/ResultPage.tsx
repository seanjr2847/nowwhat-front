"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { LoadingSpinner } from "../components/clarify/loading-spinner"
import { ActionButtons } from "../components/result/action-buttons"
import { ChecklistHeader } from "../components/result/checklist-header"
import { ChecklistItem } from "../components/result/checklist-item"
import { CompletionCelebration } from "../components/result/completion-celebration"
import { FeedbackSection } from "../components/result/feedback-section"
import { ProgressBar } from "../components/result/progress-bar"
import { DeleteChecklistModal } from "../components/result/delete-checklist-modal"
import { getChecklist, type ChecklistData } from "../lib/api"

/**
 * 생성된 체크리스트를 표시하고 관리하는 결과 페이지 컴포넌트입니다.
 * 체크리스트 항목들을 체크하고, 저장하고, 공유할 수 있습니다.
 * @returns {JSX.Element} 렌더링된 결과 페이지입니다.
 */
export default function ResultPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [checklist, setChecklist] = useState<ChecklistData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [feedbackGiven, setFeedbackGiven] = useState(false)
    const [showCelebration, setShowCelebration] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // 체크리스트 상세 정보 조회 API 연결
    const fetchChecklist = async () => {
        if (id === undefined) return

        try {
            setIsLoading(true)
            const response = await getChecklist(id)
            
            if (response.success && response.data) {
                // API 응답 데이터를 UI에 맞게 변환
                const safeProgress = typeof response.data.progressPercentage === 'number' 
                    ? Math.max(0, Math.min(100, response.data.progressPercentage))
                    : (response.data.completedItems || 0) / Math.max(response.data.totalItems || 1, 1) * 100
                    
                const checklistData = {
                    ...response.data,
                    progress: safeProgress,
                    isSaved: false // 기본값
                }
                setChecklist(checklistData)
            } else {
                console.error("체크리스트 로드 실패:", response.error)
                void navigate("/404")
            }
        } catch (error) {
            console.error("체크리스트 로드 실패:", error)
            void navigate("/404")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        void fetchChecklist()
    }, [id])

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

        // 모든 항목이 완료되었을 때 축하 모달 표시
        if (completedCount === updatedItems.length && completedCount > 0) {
            setShowCelebration(true)
        } else {
            setShowCelebration(false)
        }
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

    const handleCelebrationClose = () => {
        setShowCelebration(false)
    }

    const handleChecklistUpdate = (updatedChecklist: Partial<ChecklistData>) => {
        if (!checklist) return
        
        // 기존 체크리스트 데이터와 업데이트된 데이터 병합
        const mergedChecklist = {
            ...checklist,
            ...updatedChecklist,
            // progress와 items는 현재 상태 유지 (제목/카테고리/설명만 업데이트)
            items: checklist.items,
            progress: checklist.progress
        }
        setChecklist(mergedChecklist)
    }

    const handleDeleteClick = () => {
        setShowDeleteModal(true)
    }

    const handleDeleteClose = () => {
        setShowDeleteModal(false)
    }

    const handleChecklistDelete = () => {
        // 삭제 완료 후 홈으로 리다이렉트
        void navigate("/")
    }

    // 편집 권한 확인 (로그인한 사용자만 편집 가능)
    const canEditChecklist = isAuthenticated && user !== null
    // 삭제 권한 확인 (편집 권한과 동일)
    const canDeleteChecklist = isAuthenticated && user !== null

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
                        className="text-brand-primary-500 hover:underline"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        )
    }

    const completedCount = checklist.items.filter(item => item.isCompleted).length

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-primary-50 dark:from-gray-900 dark:to-slate-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <ChecklistHeader 
                    goal={checklist.title} 
                    createdAt={checklist.createdAt}
                    checklistId={checklist.id}
                    category={checklist.category}
                    description={checklist.description}
                    onDelete={handleDeleteClick}
                    onUpdate={handleChecklistUpdate}
                    canEdit={canEditChecklist}
                    canDelete={canDeleteChecklist}
                />

                <ProgressBar
                    completed={completedCount}
                    total={checklist.items.length}
                    progress={checklist.progress}
                />

                <ActionButtons
                    onShare={handleShare} // 기존 호환성 유지
                    onNewChecklist={handleNewChecklist}
                    checklistData={{
                        title: checklist.title,
                        completedItems: completedCount,
                        totalItems: checklist.items.length,
                        progressPercentage: Math.round(checklist.progress)
                    }}
                    userName={user?.name || "사용자"}
                />

                <div className="space-y-6 mb-8">
                    {checklist.items.map((item, index) => (
                        <ChecklistItem
                            key={item.id}
                            item={item}
                            index={index}
                            checklistId={checklist.id}
                            onToggle={handleItemToggle}
                        />
                    ))}
                </div>

                {showCelebration && (
                    <CompletionCelebration 
                        onClose={handleCelebrationClose} 
                        goal={checklist.title}
                        checklistData={{
                            title: checklist.title,
                            completedItems: completedCount,
                            totalItems: checklist.items.length,
                            progressPercentage: Math.round(checklist.progress)
                        }}
                        userName={user?.name || "사용자"}
                    />
                )}

                <FeedbackSection 
                    onFeedback={handleFeedback} 
                    feedbackGiven={feedbackGiven}
                    checklistId={checklist.id}
                />

                {/* 삭제 확인 모달 */}
                {showDeleteModal && checklist && (
                    <DeleteChecklistModal
                        isOpen={showDeleteModal}
                        onClose={handleDeleteClose}
                        checklistTitle={checklist.title}
                        checklistId={checklist.id}
                        onDelete={handleChecklistDelete}
                    />
                )}
            </div>
        </div>
    )
}
