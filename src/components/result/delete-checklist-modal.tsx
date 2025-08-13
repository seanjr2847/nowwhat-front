"use client"

import { useState } from "react"
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useToast } from "../../hooks/use-toast"
import { deleteChecklist } from "../../lib/api"

interface DeleteChecklistModalProps {
  isOpen: boolean
  onClose: () => void
  checklistTitle: string
  checklistId: string
  onDelete: () => void
}

/**
 * 체크리스트 삭제 확인을 위한 모달 컴포넌트입니다.
 * 안전한 삭제를 위해 체크리스트 제목을 입력하도록 요구합니다.
 */
export function DeleteChecklistModal({ 
  isOpen, 
  onClose, 
  checklistTitle, 
  checklistId, 
  onDelete 
}: DeleteChecklistModalProps) {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  if (!isOpen) return null

  const isConfirmValid = confirmText.trim() === checklistTitle.trim()

  const handleDelete = async () => {
    if (!isConfirmValid) {
      toast({
        title: "확인 텍스트 불일치",
        description: "체크리스트 제목을 정확히 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    setIsDeleting(true)

    try {
      const response = await deleteChecklist(checklistId)

      if (response.success) {
        toast({
          title: "삭제 완료",
          description: "체크리스트가 성공적으로 삭제되었습니다.",
        })
        onDelete()
        onClose()
      } else {
        toast({
          title: "삭제 실패",
          description: response.error || "체크리스트 삭제 중 오류가 발생했습니다.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('체크리스트 삭제 오류:', error)
      toast({
        title: "삭제 실패",
        description: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter' && isConfirmValid && !isDeleting) {
      handleDelete()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-destructive/20 max-w-md w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-destructive flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>체크리스트 삭제</span>
            </CardTitle>
            <Button 
              onClick={onClose} 
              variant="ghost" 
              className="p-2 h-8 w-8 hover:bg-destructive/10"
              disabled={isDeleting}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 경고 메시지 */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  ⚠️ 주의: 이 작업은 되돌릴 수 없습니다
                </p>
                <p className="text-sm text-muted-foreground">
                  이 체크리스트와 관련된 모든 데이터가 영구적으로 삭제됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 삭제할 체크리스트 정보 */}
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              다음 체크리스트를 삭제하려고 합니다:
            </p>
            <div className="bg-muted/50 rounded-lg p-3 border">
              <p className="font-medium text-foreground">"{checklistTitle}"</p>
            </div>
          </div>

          {/* 확인 입력 */}
          <div className="space-y-3">
            <Label htmlFor="confirm-input" className="text-sm font-medium">
              삭제를 확인하려면 체크리스트 제목을 입력하세요:
            </Label>
            <Input
              id="confirm-input"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={checklistTitle}
              className="bg-background border-input text-foreground"
              disabled={isDeleting}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {confirmText && !isConfirmValid && (
              <p className="text-xs text-destructive">
                입력하신 텍스트가 체크리스트 제목과 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleDelete}
              disabled={!isConfirmValid || isDeleting}
              variant="destructive"
              className="flex-1"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  삭제 중...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제하기
                </>
              )}
            </Button>
          </div>

          {/* 추가 안내 */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            삭제된 체크리스트는 복구할 수 없습니다.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}