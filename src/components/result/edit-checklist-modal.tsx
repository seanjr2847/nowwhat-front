"use client"

import { useState, useEffect } from "react"
import { X, Edit3, Save, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { useToast } from "../../hooks/use-toast"
import { updateChecklist, type ChecklistData } from "../../lib/api"

interface EditChecklistModalProps {
  isOpen: boolean
  onClose: () => void
  checklist: ChecklistData
  onUpdate: (updatedChecklist: ChecklistData) => void
}

/**
 * 체크리스트 정보 편집을 위한 모달 컴포넌트입니다.
 * 제목, 카테고리, 설명을 수정할 수 있습니다.
 */
export function EditChecklistModal({ isOpen, onClose, checklist, onUpdate }: EditChecklistModalProps) {
  const [title, setTitle] = useState(checklist.title)
  const [category, setCategory] = useState(checklist.category || "")
  const [description, setDescription] = useState(checklist.description || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 체크리스트가 변경되면 폼 상태 초기화
  useEffect(() => {
    setTitle(checklist.title)
    setCategory(checklist.category || "")
    setDescription(checklist.description || "")
  }, [checklist])

  // 모달이 열릴 때 포커스 설정
  useEffect(() => {
    if (isOpen) {
      // 작은 딜레이를 주어 모달이 완전히 렌더링된 후 포커스 설정
      setTimeout(() => {
        const titleInput = document.getElementById('edit-title') as HTMLInputElement
        if (titleInput) {
          titleInput.focus()
          titleInput.select()
        }
      }, 100)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    if (!title.trim()) {
      toast({
        title: "입력 오류",
        description: "체크리스트 제목을 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    if (title.trim().length < 2) {
      toast({
        title: "입력 오류",
        description: "체크리스트 제목은 2자 이상 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    // 변경사항이 있는지 확인
    const hasChanges = 
      title.trim() !== checklist.title ||
      category.trim() !== (checklist.category || "") ||
      description.trim() !== (checklist.description || "")

    if (!hasChanges) {
      toast({
        title: "수정할 내용이 없습니다",
        description: "변경된 내용이 없어 저장하지 않습니다.",
      })
      onClose()
      return
    }

    setIsLoading(true)

    try {
      const updateData = {
        title: title.trim(),
        ...(category.trim() && { category: category.trim() }),
        ...(description.trim() && { description: description.trim() })
      }

      const response = await updateChecklist(checklist.id, updateData)

      if (response.success && response.data) {
        toast({
          title: "수정 완료",
          description: "체크리스트가 성공적으로 수정되었습니다.",
        })
        // 업데이트된 데이터를 기존 체크리스트와 병합
        const updatedChecklist = {
          ...checklist,
          ...response.data,
          // items와 progress는 기존 값 유지 (제목/설명만 업데이트)
          items: checklist.items,
          progress: checklist.progress
        }
        onUpdate(updatedChecklist)
        onClose()
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-primary" />
              <span>체크리스트 편집</span>
            </CardTitle>
            <Button 
              onClick={onClose} 
              variant="ghost" 
              className="p-2 h-8 w-8"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
            {/* 제목 입력 */}
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-sm font-medium text-foreground">
                제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="체크리스트 제목을 입력하세요"
                className="bg-background border-input text-foreground"
                maxLength={100}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">{title.length}/100</p>
            </div>

            {/* 카테고리 입력 */}
            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-sm font-medium text-foreground">
                카테고리
              </Label>
              <Input
                id="edit-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 건강, 업무, 학습 등"
                className="bg-background border-input text-foreground"
                maxLength={50}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">{category.length}/50</p>
            </div>

            {/* 설명 입력 */}
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-medium text-foreground">
                설명
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="체크리스트에 대한 추가 설명을 입력하세요"
                className="bg-background border-input text-foreground resize-none"
                rows={3}
                maxLength={500}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">{description.length}/500</p>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    저장하기
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}