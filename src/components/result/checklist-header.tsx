import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { ArrowLeft, Calendar, Target, Edit3, Trash2, Save, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "../../hooks/use-toast"
import { updateChecklist, type ChecklistData } from "../../lib/api"

interface ChecklistHeaderProps {
  goal: string
  createdAt: string
  checklistId: string
  category?: string
  description?: string
  onDelete?: () => void
  onUpdate?: (updatedData: Partial<ChecklistData>) => void
  canEdit?: boolean
  canDelete?: boolean
}

/**
 * 체크리스트 결과 페이지의 헤더 컴포넌트입니다.
 * 목표와 생성 날짜를 표시하고, 편집/삭제 기능을 제공합니다.
 * @param {ChecklistHeaderProps} props - 헤더 컴포넌트의 props입니다.
 * @param {string} props.goal - 체크리스트의 목표입니다.
 * @param {string} props.createdAt - 체크리스트 생성 날짜입니다.
 * @param {() => void} [props.onDelete] - 삭제 버튼 클릭 시 호출될 함수입니다.
 * @param {boolean} [props.canEdit] - 편집 가능 여부입니다.
 * @param {boolean} [props.canDelete] - 삭제 가능 여부입니다.
 * @returns {JSX.Element} 렌더링된 체크리스트 헤더입니다.
 */
export function ChecklistHeader({ 
  goal, 
  createdAt,
  checklistId,
  category = "",
  description = "",
  onDelete, 
  onUpdate,
  canEdit = false, 
  canDelete = false 
}: ChecklistHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(goal)
  const [editCategory, setEditCategory] = useState(category)
  const [editDescription, setEditDescription] = useState(description)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditTitle(goal)
    setEditCategory(category)
    setEditDescription(description)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditTitle(goal)
    setEditCategory(category)
    setEditDescription(description)
  }

  const handleSave = async () => {
    if (!editTitle.trim()) {
      toast({
        title: "입력 오류",
        description: "체크리스트 제목을 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    if (editTitle.trim().length < 2) {
      toast({
        title: "입력 오류",
        description: "체크리스트 제목은 2자 이상 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    // 변경사항이 있는지 확인
    const hasChanges = 
      editTitle.trim() !== goal ||
      editCategory.trim() !== category ||
      editDescription.trim() !== description

    if (!hasChanges) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)

    try {
      const updateData = {
        title: editTitle.trim(),
        ...(editCategory.trim() && { category: editCategory.trim() }),
        ...(editDescription.trim() && { description: editDescription.trim() })
      }

      const response = await updateChecklist(checklistId, updateData)

      if (response.success && response.data) {
        toast({
          title: "수정 완료",
          description: "체크리스트가 성공적으로 수정되었습니다.",
        })
        
        if (onUpdate) {
          onUpdate(response.data)
        }
        
        setIsEditing(false)
      } else {
        toast({
          title: "수정 실패",
          description: response.error || "체크리스트 수정 중 오류가 발생했습니다.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('체크리스트 수정 오류:', error)
      toast({
        title: "수정 실패",
        description: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300 focus-ring rounded-xl px-4 py-2 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">홈으로</span>
          </Button>
        </Link>
        
        {(canEdit || canDelete) && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 focus-ring rounded-xl px-4 py-2 border-input/50"
                >
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
                <Button
                  onClick={() => void handleSave()}
                  disabled={isLoading || !editTitle.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 focus-ring rounded-xl px-4 py-2"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "저장 중..." : "저장"}
                </Button>
              </>
            ) : (
              <>
                {canEdit && (
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 focus-ring rounded-xl px-4 py-2 border-input/50"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    편집하기
                  </Button>
                )}
                {canDelete && onDelete && (
                  <Button
                    variant="outline"
                    onClick={onDelete}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 focus-ring rounded-xl px-4 py-2 border-destructive/50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제하기
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-full shadow-lg">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">목표 달성</span>
          </div>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="체크리스트 제목을 입력하세요"
                  className="text-2xl font-bold text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-xl shadow-lg"
                  maxLength={100}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground text-center mt-2">{editTitle.length}/100</p>
              </div>
              
              {(editCategory || isEditing) && (
                <div>
                  <Input
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="카테고리 (선택사항)"
                    className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-xl shadow-lg"
                    maxLength={50}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">{editCategory.length}/50</p>
                </div>
              )}
              
              {(editDescription || isEditing) && (
                <div>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="체크리스트 설명 (선택사항)"
                    className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-xl shadow-lg resize-none"
                    rows={3}
                    maxLength={500}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">{editDescription.length}/500</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{goal}</span>
              </h1>
              {category && (
                <div className="flex items-center justify-center">
                  <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                    {category}
                  </span>
                </div>
              )}
              {description && (
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>생성일: {formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
