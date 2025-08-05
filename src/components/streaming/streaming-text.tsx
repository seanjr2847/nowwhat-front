import { useEffect, useState } from "react"
import { cn } from "../../lib/utils"
import "./streaming.css"

interface StreamingTextProps {
  /** 스트리밍 텍스트 */
  text: string
  /** 스트리밍 진행 중 여부 */
  isStreaming: boolean
  /** 타이핑 속도 (ms per character) */
  typingSpeed?: number
  /** 커서 표시 여부 */
  showCursor?: boolean
  /** 추가 CSS 클래스 */
  className?: string
  /** 완료 콜백 */
  onComplete?: () => void
}

/**
 * ChatGPT 스타일의 스트리밍 텍스트 컴포넌트
 * 실시간으로 텍스트가 타이핑되는 효과 제공
 */
export function StreamingText({
  text,
  isStreaming,
  typingSpeed = 30,
  showCursor = true,
  className,
  onComplete
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // 텍스트가 변경될 때마다 디스플레이 업데이트
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(prev => prev + 1)
      }, typingSpeed)

      return () => clearTimeout(timer)
    } else if (currentIndex >= text.length && text.length > 0) {
      // 타이핑 완료
      onComplete?.()
    }
  }, [text, currentIndex, typingSpeed, onComplete])

  // 새로운 텍스트가 들어오면 인덱스 조정
  useEffect(() => {
    if (text.length > displayedText.length) {
      // 새 텍스트가 추가됨 - 현재 표시된 텍스트 뒤부터 계속
      setCurrentIndex(displayedText.length)
    } else if (text.length < displayedText.length) {
      // 텍스트가 초기화됨 - 처음부터 시작
      setDisplayedText('')
      setCurrentIndex(0)
    }
  }, [text, displayedText.length])

  return (
    <div className={cn("relative", className)}>
      <div className="streaming-output text-sm leading-relaxed">
        <span className={isStreaming ? "typing-text" : ""}>
          {displayedText}
        </span>
        {isStreaming && showCursor && (
          <span className="cursor inline-block w-2 h-5 bg-current ml-1 align-middle">
            |
          </span>
        )}
      </div>
      
      {/* 스크린 리더용 */}
      <div className="sr-only" aria-live="polite" aria-atomic="false">
        {displayedText}
      </div>
    </div>
  )
}

export default StreamingText