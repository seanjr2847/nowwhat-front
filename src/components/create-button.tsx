"use client"

import { Loader2, Sparkles, Zap } from "lucide-react"
import { Button } from "./ui/button"

interface CreateButtonProps {
  onClick: () => void
  isLoading: boolean
}

/**
 * 모든 질문에 답변한 후 체크리스트 생성을 시작하는 버튼 컴포넌트입니다.
 * 로딩 상태에 따라 UI가 변경됩니다.
 * @param {CreateButtonProps} props - 생성 버튼 컴포넌트의 props입니다.
 * @param {() => void} props.onClick - 버튼 클릭 시 호출될 함수입니다.
 * @param {boolean} props.isLoading - 로딩 상태 여부입니다.
 * @returns {JSX.Element} 렌더링된 생성 버튼 컴포넌트입니다.
 */
export function CreateButton({ onClick, isLoading }: CreateButtonProps) {
  return (
    <div id="create-button-section" className="text-center animate-scale-in">
      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-brand-primary-500/20 rounded-full border border-green-500/30 mb-4">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-green-300">모든 질문 완료!</span>
        </div>
      </div>

      <Button
        onClick={onClick}
        disabled={isLoading}
        className="bg-gradient-to-r from-brand-primary-600 via-brand-primary-500 to-brand-secondary-600 hover:from-brand-primary-700 hover:via-brand-primary-600 hover:to-brand-secondary-700 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-2xl shadow-brand-primary-500/25 hover:shadow-brand-primary-500/40 transition-all duration-300 hover:scale-105 focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-describedby="create-button-help"
        aria-live="polite"
      >
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
            <span>체크리스트 생성 중...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6" aria-hidden="true" />
            <span>체크리스트 만들기</span>
          </div>
        )}
      </Button>

      <div id="create-button-help" className="sr-only">
        모든 질문에 답변하신 후 이 버튼을 클릭하여 개인화된 체크리스트를 생성하세요. 키보드 단축키: Ctrl + Enter
      </div>

      {!isLoading && (
        <div className="mt-6 space-y-2">
          <p className="text-gray-400 text-base">개인화된 체크리스트가 곧 생성됩니다</p>
          <p className="text-gray-500 text-sm flex items-center justify-center space-x-2">
            <span>빠른 생성:</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Enter</kbd>
          </p>
        </div>
      )}
    </div>
  )
}
