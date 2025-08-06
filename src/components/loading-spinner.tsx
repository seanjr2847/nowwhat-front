import { Brain, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

interface LoadingSpinnerProps {
  message: string
}

// Playful한 로딩 메시지들
const playfulMessages = [
  "마법 같은 체크리스트를 만들고 있어요 ✨",
  "AI가 열심히 생각하고 있어요 🤔",
  "완벽한 계획을 세우는 중이에요 📝",
  "당신만을 위한 특별한 리스트 준비 중 🎯",
  "똑똑한 체크리스트가 완성되어가요 🧠",
  "거의 다 왔어요! 조금만 더 기다려주세요 ⏳",
  "최고의 결과를 위해 마무리 중이에요 🚀"
]

/**
 * 데이터 로딩 중임을 나타내는 스피너 및 메시지 컴포넌트입니다.
 * @param {LoadingSpinnerProps} props - 로딩 스피너 컴포넌트의 props입니다.
 * @param {string} props.message - 로딩 상태를 설명하는 메시지입니다.
 * @returns {JSX.Element} 렌더링된 로딩 스피너 컴포넌트입니다.
 */
export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayMessage, setDisplayMessage] = useState(message)

  useEffect(() => {
    // 메인 메시지 표시 후 2초 뒤부터 playful 메시지 시작
    const initialDelay = setTimeout(() => {
      setDisplayMessage(playfulMessages[0])
      setCurrentMessageIndex(0)
      
      // 3초마다 메시지 변경
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % playfulMessages.length)
      }, 3000)

      return () => clearInterval(interval)
    }, 2000)

    return () => clearTimeout(initialDelay)
  }, [])

  useEffect(() => {
    setDisplayMessage(playfulMessages[currentMessageIndex])
  }, [currentMessageIndex])
  return (
    <div
      className="flex flex-col items-center space-y-8 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* 메인 로딩 애니메이션 */}
      <div className="relative">
        {/* 외부 회전 링 */}
        <div
          className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-secondary-300 animate-spin"
          style={{
            background: "conic-gradient(from 0deg, #03b2f9, #00edce, #00edce, #03b2f9)",
            mask: "radial-gradient(circle at center, transparent 70%, black 72%)",
            WebkitMask: "radial-gradient(circle at center, transparent 70%, black 72%)",
          }}
        />

        {/* 내부 회전 링 (반대 방향) */}
        <div
          className="absolute inset-2 w-20 h-20 rounded-full border-3 border-transparent bg-gradient-to-r from-brand-secondary-300 via-brand-secondary-500 to-brand-primary-500 animate-spin"
          style={{
            background: "conic-gradient(from 180deg, #00edce, #00edce, #03b2f9, #00edce)",
            mask: "radial-gradient(circle at center, transparent 65%, black 67%)",
            WebkitMask: "radial-gradient(circle at center, transparent 65%, black 67%)",
            animationDirection: "reverse",
            animationDuration: "2s",
          }}
        />

        {/* 중앙 글로우 효과 */}
        <div className="absolute inset-4 w-16 h-16 bg-gradient-to-r from-brand-primary-500/30 to-brand-secondary-500/30 rounded-full blur-xl animate-pulse" />

        {/* 중앙 아이콘 */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20 dark:border-gray-700/20">
            <Brain className="w-6 h-6 text-brand-primary-600 dark:text-brand-primary-400 animate-pulse" aria-hidden="true" />
          </div>
        </div>

        {/* 플로팅 파티클들 */}
        <div className="absolute -inset-8">
          <Sparkles
            className="absolute top-0 left-4 w-3 h-3 text-brand-primary-400 animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "2s" }}
          />
          <Sparkles
            className="absolute top-4 right-0 w-2 h-2 text-brand-secondary-400 animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
          />
          <Sparkles
            className="absolute bottom-2 left-0 w-2.5 h-2.5 text-brand-secondary-300 animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "2.2s" }}
          />
          <Sparkles
            className="absolute bottom-0 right-6 w-3 h-3 text-brand-primary-300 animate-bounce"
            style={{ animationDelay: "1.5s", animationDuration: "2.8s" }}
          />
        </div>
      </div>

      {/* 메시지 섹션 */}
      <div className="text-center space-y-4 max-w-md">
        <p className="text-foreground text-lg font-semibold bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 bg-clip-text text-transparent transition-all duration-500 ease-in-out">
          {displayMessage}
        </p>

        {/* 진행 표시 점들 */}
        <div className="flex items-center justify-center space-x-2">
          <div
            className="w-2 h-2 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 rounded-full animate-pulse shadow-lg shadow-brand-primary-500/50"
            style={{ animationDelay: "0ms", animationDuration: "1.5s" }}
          />
          <div
            className="w-2 h-2 bg-gradient-to-r from-brand-secondary-500 to-brand-secondary-600 rounded-full animate-pulse shadow-lg shadow-brand-secondary-500/50"
            style={{ animationDelay: "300ms", animationDuration: "1.5s" }}
          />
          <div
            className="w-2 h-2 bg-gradient-to-r from-brand-secondary-300 to-brand-secondary-400 rounded-full animate-pulse shadow-lg shadow-brand-secondary-300/50"
            style={{ animationDelay: "600ms", animationDuration: "1.5s" }}
          />
          <div
            className="w-2 h-2 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 rounded-full animate-pulse shadow-lg shadow-brand-primary-500/50"
            style={{ animationDelay: "900ms", animationDuration: "1.5s" }}
          />
        </div>

        {/* 서브 텍스트 */}
        <p className="text-muted-foreground text-sm">잠시만 기다려주세요...</p>
      </div>

      <div className="sr-only">로딩 중입니다. 잠시만 기다려주세요.</div>
    </div>
  )
}
