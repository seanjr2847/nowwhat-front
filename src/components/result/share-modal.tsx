"use client"

import { useState, useRef } from "react"
import { X, Download, Copy, Share2, Smartphone, Monitor, Palette } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { AchievementCard } from "./achievement-card"
import { useToast } from "../../hooks/use-toast"
// html2canvas는 별도 설치 필요 시 사용
// import html2canvas from "html2canvas"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  checklistData: {
    title: string
    completedItems: number
    totalItems: number
    progressPercentage: number
  }
  userName?: string
}

/**
 * 성취 카드 공유를 위한 모달 컴포넌트입니다.
 * 다양한 테마와 미리보기, 이미지 다운로드 기능을 제공합니다.
 */
export function ShareModal({ isOpen, onClose, checklistData, userName = "사용자" }: ShareModalProps) {
  const [selectedTheme, setSelectedTheme] = useState<'celebration' | 'professional' | 'minimal'>('celebration')
  const [personalMessage, setPersonalMessage] = useState("")
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  if (!isOpen) return null

  const themes = [
    { key: 'celebration' as const, name: '축하', emoji: '🎉', color: 'border-yellow-400/50 bg-yellow-400/10' },
    { key: 'professional' as const, name: '전문적', emoji: '💼', color: 'border-blue-400/50 bg-blue-400/10' },
    { key: 'minimal' as const, name: '미니멀', emoji: '🖤', color: 'border-gray-400/50 bg-gray-400/10' }
  ]

  const handleDownloadImage = async () => {
    // TODO: html2canvas 패키지 설치 후 이미지 다운로드 기능 구현
    // npm install html2canvas @types/html2canvas
    
    toast({
      title: "이미지 다운로드",
      description: "현재 텍스트 복사 기능을 이용해주세요. 이미지 다운로드는 곧 지원될 예정입니다.",
      duration: 3000,
    })
    
    // 임시로 텍스트 복사 실행
    await handleCopyText()
  }

  const handleCopyText = async () => {
    const shareText = `🎉 "${checklistData.title}" 체크리스트를 ${checklistData.progressPercentage}% 달성했어요!\n\n✅ ${checklistData.completedItems}개 중 ${checklistData.totalItems}개 완료\n\n${personalMessage || "꾸준히 목표를 향해 나아가고 있어요! 💪"}\n\n🔗 나도 체크리스트 만들어보기: nowwhat.co.kr`

    try {
      await navigator.clipboard.writeText(shareText)
      toast({
        title: "텍스트 복사 완료",
        description: "공유용 텍스트가 클립보드에 복사되었습니다.",
        duration: 2000,
      })
    } catch (error) {
      console.error('텍스트 복사 실패:', error)
      toast({
        title: "복사 실패",
        description: "텍스트 복사 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleWebShare = async () => {
    const shareData = {
      title: `${userName}님의 성취 달성!`,
      text: `"${checklistData.title}" 체크리스트를 ${checklistData.progressPercentage}% 달성했어요!`,
      url: 'https://nowwhat.co.kr'
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast({
          title: "공유 완료",
          description: "성취를 성공적으로 공유했습니다.",
          duration: 2000,
        })
      } else {
        // 웹 공유가 지원되지 않는 경우 URL 복사
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`)
        toast({
          title: "링크 복사 완료",
          description: "공유 링크가 클립보드에 복사되었습니다.",
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('공유 실패:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">성취 공유하기</h2>
            </div>
            <Button onClick={onClose} variant="ghost" className="p-2">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 카드 미리보기 */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground/80 flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span>미리보기</span>
              </h3>
              
              <div className="flex justify-center p-4 bg-gray-900/20 rounded-xl">
                <AchievementCard
                  ref={cardRef}
                  userName={userName}
                  checklistTitle={checklistData.title}
                  completedItems={checklistData.completedItems}
                  totalItems={checklistData.totalItems}
                  progressPercentage={checklistData.progressPercentage}
                  personalMessage={personalMessage}
                  theme={selectedTheme}
                />
              </div>
            </div>

            {/* 오른쪽: 설정 및 공유 옵션 */}
            <div className="space-y-6">
              {/* 테마 선택 */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground/80 flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>테마 선택</span>
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.key}
                      onClick={() => setSelectedTheme(theme.key)}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200 text-center
                        ${selectedTheme === theme.key 
                          ? theme.color + ' border-opacity-100' 
                          : 'border-gray-600/30 hover:border-gray-500/50'
                        }
                      `}
                    >
                      <div className="text-lg">{theme.emoji}</div>
                      <div className="text-xs font-medium text-foreground/70 mt-1">{theme.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 개인 메시지 */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground/80">개인 메시지 (선택사항)</h3>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="성취에 대한 개인적인 메시지를 추가해보세요..."
                  className="w-full p-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-foreground placeholder-gray-400 resize-none focus:border-primary/50 focus:outline-none"
                  rows={3}
                  maxLength={100}
                />
                <p className="text-xs text-gray-400">{personalMessage.length}/100</p>
              </div>

              {/* 공유 버튼들 */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground/80 flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>공유 방법</span>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={handleDownloadImage}
                    variant="outline"
                    className="justify-start h-12 bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">이미지로 다운로드</div>
                      <div className="text-xs text-muted-foreground">SNS에 이미지 업로드</div>
                    </div>
                  </Button>

                  <Button
                    onClick={handleCopyText}
                    variant="outline"
                    className="justify-start h-12 bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    <Copy className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">텍스트 복사</div>
                      <div className="text-xs text-muted-foreground">메시지 앱에 붙여넣기</div>
                    </div>
                  </Button>

                  <Button
                    onClick={handleWebShare}
                    className="justify-start h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Share2 className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">바로 공유하기</div>
                      <div className="text-xs text-blue-100">카카오톡, 인스타그램 등</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}