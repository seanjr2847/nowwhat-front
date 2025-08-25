"use client"

import { AlertTriangle, Mail, X, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { type CreditErrorResponse } from "../../lib/api"
import { Button } from "../ui/button"

interface CreditModalProps {
  isOpen: boolean
  errorData?: CreditErrorResponse
  onClose: () => void
}

/**
 * 크레딧 부족 시 표시되는 모달 컴포넌트입니다.
 * @param {CreditModalProps} props - 모달 컴포넌트의 props
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {CreditErrorResponse} props.errorData - 크레딧 에러 데이터
 * @param {() => void} props.onClose - 모달 닫기 함수
 * @returns {JSX.Element | null} 크레딧 부족 모달
 */
export function CreditModal({ isOpen, errorData, onClose }: CreditModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 150) // 애니메이션 완료 후 닫기
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4 transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
    >
      <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all duration-150 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800 dark:text-red-200">
                크레딧이 부족합니다
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                작업을 완료하려면 크레딧이 필요합니다
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground p-1 -mr-2 -mt-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 크레딧 정보 */}
        <div className="space-y-4 mb-6">
          <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-red-800 dark:text-red-200">현재 크레딧</span>
              <div className="flex items-center gap-1 text-red-700 dark:text-red-300">
                <Zap className="w-4 h-4" />
                <span className="font-bold">{errorData?.current_credits ?? 0}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-800 dark:text-red-200">필요 크레딧</span>
              <div className="flex items-center gap-1 text-red-700 dark:text-red-300">
                <Zap className="w-4 h-4" />
                <span className="font-bold">{errorData?.required_credits ?? 1}</span>
              </div>
            </div>
          </div>

          {(errorData?.message != null && errorData.message !== '') && (
            <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              {errorData.message}
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="space-y-3 mb-6">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">크레딧은 어떻게 사용되나요?</h4>
            <ul className="space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <span>목표 분석: 1크레딧</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <span>질문 생성: 1크레딧</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <span>체크리스트 생성: 2크레딧</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            나중에 하기
          </Button>
          <Button
            onClick={() => {
              const subject = encodeURIComponent("NowWhat 크레딧 충전 요청")
              const body = encodeURIComponent(
                `크레딧 충전을 요청드립니다.\n\n 간단한 사용후기:`
              )
              window.open(`mailto:seanjr28475@gmail.com?subject=${subject}&body=${body}`, '_blank')
              handleClose()
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            이메일로 충전 요청
          </Button>
        </div>
      </div>
    </div>
  )
}

