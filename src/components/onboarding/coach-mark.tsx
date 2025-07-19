"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

interface CoachMarkStep {
  id: string
  title: string
  description: string
  targetSelector: string
  position: "top" | "bottom" | "left" | "right"
  offset?: { x: number; y: number }
}

interface CoachMarkProps {
  steps: CoachMarkStep[]
  onComplete: () => void
  onSkip: () => void
}

/**
 * 처음 방문자를 위한 단계별 가이드 코치마크 컴포넌트입니다.
 * @param {CoachMarkProps} props - 코치마크 컴포넌트의 props입니다.
 * @param {CoachMarkStep[]} props.steps - 가이드 단계들입니다.
 * @param {() => void} props.onComplete - 가이드 완료 시 호출될 함수입니다.
 * @param {() => void} props.onSkip - 가이드 건너뛰기 시 호출될 함수입니다.
 * @returns {JSX.Element} 렌더링된 코치마크 컴포넌트입니다.
 */
export function CoachMark({ steps, onComplete, onSkip }: CoachMarkProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  useEffect(() => {
    const updatePosition = () => {
      if (!currentStepData) return

      const targetElement = document.querySelector(currentStepData.targetSelector) as HTMLElement
      if (!targetElement) {
        console.warn(`Target element not found: ${currentStepData.targetSelector}`)
        return
      }

      const rect = targetElement.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      setTargetPosition({
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height,
      })

      // 툴팁 위치 계산
      const offset = currentStepData.offset || { x: 0, y: 0 }
      let tooltipTop = rect.top + scrollTop
      let tooltipLeft = rect.left + scrollLeft

      switch (currentStepData.position) {
        case "top":
          tooltipTop = rect.top + scrollTop - 20 + offset.y
          tooltipLeft = rect.left + scrollLeft + rect.width / 2 + offset.x
          break
        case "bottom":
          tooltipTop = rect.top + scrollTop + rect.height + 20 + offset.y
          tooltipLeft = rect.left + scrollLeft + rect.width / 2 + offset.x
          break
        case "left":
          tooltipTop = rect.top + scrollTop + rect.height / 2 + offset.y
          tooltipLeft = rect.left + scrollLeft - 20 + offset.x
          break
        case "right":
          tooltipTop = rect.top + scrollTop + rect.height / 2 + offset.y
          tooltipLeft = rect.left + scrollLeft + rect.width + 20 + offset.x
          break
      }

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft })

      // 타겟 요소로 스크롤
      setTimeout(() => {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        })
      }, 100)
    }

    // 약간의 지연을 두고 위치 업데이트
    const timer = setTimeout(updatePosition, 100)

    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [currentStep, currentStepData])

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  if (!currentStepData) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 오버레이 배경 */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500"
        style={{
          clipPath:
            targetPosition.width > 0
              ? `polygon(0% 0%, 0% 100%, ${targetPosition.left}px 100%, ${targetPosition.left}px ${targetPosition.top}px, ${
                  targetPosition.left + targetPosition.width
                }px ${targetPosition.top}px, ${targetPosition.left + targetPosition.width}px ${
                  targetPosition.top + targetPosition.height
                }px, ${targetPosition.left}px ${targetPosition.top + targetPosition.height}px, ${
                  targetPosition.left
                }px 100%, 100% 100%, 100% 0%)`
              : "none",
        }}
      />

      {/* 하이라이트 테두리 */}
      <div
        className="absolute border-4 border-blue-500 rounded-lg shadow-2xl shadow-blue-500/50 animate-pulse pointer-events-none"
        style={{
          top: targetPosition.top - 4,
          left: targetPosition.left - 4,
          width: targetPosition.width + 8,
          height: targetPosition.height + 8,
        }}
      />

      {/* 툴팁 카드 */}
      <Card
        className="absolute bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 shadow-2xl rounded-2xl max-w-sm pointer-events-auto animate-scale-in"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: `translate(${
            currentStepData.position === "left" ? "-100%" : currentStepData.position === "right" ? "0%" : "-50%"
          }, ${currentStepData.position === "top" ? "-100%" : currentStepData.position === "bottom" ? "0%" : "-50%"})`,
        }}
      >
        <CardContent className="p-6">
          {/* 헤더 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{currentStepData.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {currentStep + 1} / {steps.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 설명 */}
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{currentStepData.description}</p>

          {/* 진행률 바 */}
          <div className="mb-4">
            <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                건너뛰기
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              >
                {isLastStep ? "완료" : "다음"}
                {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 화살표 (선택적) */}
      {currentStepData.position === "top" && (
        <div
          className="absolute w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/95 dark:border-t-gray-900/95 pointer-events-none"
          style={{
            top: tooltipPosition.top + 8,
            left: tooltipPosition.left,
            transform: "translateX(-50%)",
          }}
        />
      )}
      {currentStepData.position === "bottom" && (
        <div
          className="absolute w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white/95 dark:border-b-gray-900/95 pointer-events-none"
          style={{
            top: tooltipPosition.top - 8,
            left: tooltipPosition.left,
            transform: "translateX(-50%)",
          }}
        />
      )}
    </div>
  )
}
