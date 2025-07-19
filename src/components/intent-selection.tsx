"use client"

import { ChevronRight } from "lucide-react"
import { useEffect, useRef } from "react"
import { Card, CardContent } from "./ui/card"

interface Intent {
  id: string
  title: string
  description: string
  icon: string
}

interface IntentSelectionProps {
  intents: Intent[]
  onSelect: (intentId: string) => void
}

/**
 * AI가 분석한 사용자의 목표에 대한 여러 의도(방향)를 제시하고 선택받는 컴포넌트입니다.
 * @param {IntentSelectionProps} props - 의도 선택 컴포넌트의 props입니다.
 * @param {Intent[]} props.intents - 표시할 의도 목록입니다.
 * @param {(intentId: string) => void} props.onSelect - 의도 선택 시 호출될 콜백 함수입니다.
 * @returns {JSX.Element} 렌더링된 의도 선택 컴포넌트입니다.
 */
export function IntentSelection({ intents, onSelect }: IntentSelectionProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const focusedElement = document.activeElement as HTMLElement
      const currentIndex = cardRefs.current.findIndex((card) => card?.contains(focusedElement))

      if (currentIndex === -1) return

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          { e.preventDefault()
          const nextIndex = (currentIndex + 1) % intents.length
          cardRefs.current[nextIndex]?.focus()
          break }
        case "ArrowLeft":
        case "ArrowUp":
          { e.preventDefault()
          const prevIndex = currentIndex === 0 ? intents.length - 1 : currentIndex - 1
          cardRefs.current[prevIndex]?.focus()
          break }
        case "Enter":
        case " ":
          e.preventDefault()
          onSelect(intents[currentIndex].id)
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [intents, onSelect])

  return (
    <section className="mb-12 animate-scale-in" aria-labelledby="intent-heading">
      <div className="text-center mb-8">
        <h2 id="intent-heading" className="text-2xl font-bold text-foreground mb-2">
          어떤 방향으로 도움을 드릴까요?
        </h2>
      </div>

      <div className="sr-only" aria-live="polite">
        {intents.length}개의 의도 옵션이 있습니다. 화살표 키로 탐색하고 엔터 또는 스페이스바로 선택하세요.
      </div>

      <div className="grid md:grid-cols-2 gap-6" role="radiogroup" aria-labelledby="intent-heading">
        {intents.map((intent, index) => (
          <Card
            key={intent.id}
            ref={(el) => {(cardRefs.current[index] = el)}}
            className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-900/80 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 focus-ring rounded-2xl hover:border-blue-500/50 card-hover overflow-hidden"
            onClick={() => onSelect(intent.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelect(intent.id)
              }
            }}
            tabIndex={0}
            role="radio"
            aria-checked={false}
            aria-describedby={`intent-desc-${intent.id}`}
            aria-label={`${intent.title}: ${intent.description}`}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

              <div className="relative z-10">
                <div
                  className="text-4xl mb-4 transform group-hover:scale-110 transition-all duration-300"
                  aria-hidden="true"
                >
                  {intent.icon}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {intent.title}
                </h3>

                <p id={`intent-desc-${intent.id}`} className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {intent.description}
                </p>

                <div className="flex items-center justify-center text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-sm font-medium mr-2">선택하기</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-6">
        <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-full">
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">↑↓←→</kbd>
            <span className="text-muted-foreground text-xs">탐색</span>
          </div>
          <div className="w-px h-3 bg-border"></div>
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
            <span className="text-muted-foreground text-xs">선택</span>
          </div>
        </div>
      </div>
    </section>
  )
}
