"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "../ui/card"
import { LoadingSpinner } from "./loading-spinner"

interface AdModalProps {
  onComplete: () => void
  isCreating: boolean
}

/**
 * 체크리스트 생성 전 광고를 보여주는 모달 컴포넌트입니다.
 * 일정 시간 후 자동으로 닫히거나, 생성 중일 때는 로딩 상태를 표시합니다.
 * @param {AdModalProps} props - 광고 모달 컴포넌트의 props입니다.
 * @param {() => void} props.onComplete - 광고 시청 또는 로딩 완료 시 호출될 콜백 함수입니다.
 * @param {boolean} props.isCreating - 체크리스트 생성 중인지 여부를 나타냅니다.
 * @returns {JSX.Element} 렌더링된 광고 모달 컴포넌트입니다.
 */
export function AdModal({ onComplete, isCreating }: AdModalProps) {
  const [timeLeft, setTimeLeft] = useState(15)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // 현재 포커스된 요소 저장
    previousFocusRef.current = document.activeElement as HTMLElement

    // 모달에 포커스
    if (modalRef.current) {
      modalRef.current.focus()
    }

    // 포커스 트랩
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault() // 모달 외부로 포커스 이동 방지
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      // 이전 포커스 복원
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!isCreating) {
            onComplete()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onComplete, isCreating])

  useEffect(() => {
    if (timeLeft === 0 && !isCreating) {
      onComplete()
    }
  }, [timeLeft, isCreating, onComplete])

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-modal-title"
      aria-describedby="ad-modal-description"
    >
      <Card className="bg-gray-800 border-gray-700 max-w-md w-full mx-4" ref={modalRef} tabIndex={-1}>
        <CardContent className="p-8 text-center">
          <h2 id="ad-modal-title" className="sr-only">
            광고 시청
          </h2>

          <div className="mb-6">
            <div
              className="w-full h-48 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4"
              role="img"
              aria-label="광고 콘텐츠"
            >
              <span className="text-white text-lg font-semibold">광고 영역</span>
            </div>

            {timeLeft > 0 ? (
              <div>
                <p id="ad-modal-description" className="text-gray-400">
                  {timeLeft}초 후 건너뛸 수 있습니다
                </p>
                <div className="sr-only" aria-live="polite" aria-atomic="true">
                  광고 시청 중, {timeLeft}초 남음
                </div>
              </div>
            ) : isCreating ? (
              <div className="flex flex-col items-center">
                <LoadingSpinner message="체크리스트를 생성하고 있습니다..." />
                <div className="sr-only" aria-live="polite">
                  체크리스트 생성 중입니다. 잠시만 기다려주세요.
                </div>
              </div>
            ) : (
              <div>
                <p className="text-green-400">완료!</p>
                <div className="sr-only" aria-live="polite">
                  광고 시청 완료. 체크리스트 페이지로 이동합니다.
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
