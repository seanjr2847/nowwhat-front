"use client"

import { Construction, Settings, X } from "lucide-react"
import { Button } from "../ui/button"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * 설정 모달 컴포넌트입니다.
 * 현재는 준비중 상태를 표시합니다.
 * @param {SettingsModalProps} props - 설정 모달의 props입니다.
 * @param {boolean} props.isOpen - 모달이 열려있는지 여부입니다.
 * @param {() => void} props.onClose - 모달을 닫는 함수입니다.
 * @returns {JSX.Element | null} 렌더링된 설정 모달입니다.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Settings className="w-5 h-5 mr-2 text-purple-500" />
            설정
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center py-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Construction className="w-8 h-8 text-white" />
            </div>
          </div>

          <h4 className="text-xl font-semibold text-foreground mb-2">준비중입니다</h4>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            설정 기능을 열심히 개발하고 있습니다.
            <br />곧 더 많은 기능을 만나보실 수 있어요!
          </p>



          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}
