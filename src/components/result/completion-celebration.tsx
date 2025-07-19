"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Trophy, Sparkles, X } from "lucide-react"

interface CompletionCelebrationProps {
  onClose: () => void
  goal: string
}

/**
 * 모든 체크리스트 항목을 완료했을 때 나타나는 축하 모달 컴포넌트입니다.
 * @param {CompletionCelebrationProps} props - 축하 모달 컴포넌트의 props입니다.
 * @param {() => void} props.onClose - 모달을 닫을 때 호출될 함수입니다.
 * @param {string} props.goal - 완료된 체크리스트의 목표입니다.
 * @returns {JSX.Element} 렌더링된 축하 모달입니다.
 */
export function CompletionCelebration({ onClose, goal }: CompletionCelebrationProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <Card className="bg-card border-border max-w-md w-full mx-4 animate-scale-in" ref={modalRef} tabIndex={-1}>
        <CardContent className="p-8 text-center relative">
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h2 className="text-2xl font-bold text-foreground">축하합니다!</h2>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>

            <p className="text-muted-foreground text-lg">
              <span className="text-yellow-400 font-semibold">"{goal}"</span> 체크리스트를 모두 완료하셨습니다!
            </p>

            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
              <p className="text-green-300 text-sm">
                🎉 모든 항목을 체크하셨네요! 목표 달성을 위한 첫 걸음을 성공적으로 마쳤습니다.
              </p>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              확인
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
