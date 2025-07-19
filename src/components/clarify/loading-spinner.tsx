import { Brain, Sparkles } from "lucide-react"

interface LoadingSpinnerProps {
  message: string
}

/**
 * 데이터 로딩 중임을 나타내는 스피너 및 메시지 컴포넌트입니다.
 * @param {LoadingSpinnerProps} props - 로딩 스피너 컴포넌트의 props입니다.
 * @param {string} props.message - 로딩 상태를 설명하는 메시지입니다.
 * @returns {JSX.Element} 렌더링된 로딩 스피너 컴포넌트입니다.
 */
export function LoadingSpinner({ message }: LoadingSpinnerProps) {
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
          className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin"
          style={{
            background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
            mask: "radial-gradient(circle at center, transparent 70%, black 72%)",
            WebkitMask: "radial-gradient(circle at center, transparent 70%, black 72%)",
          }}
        />

        {/* 내부 회전 링 (반대 방향) */}
        <div
          className="absolute inset-2 w-20 h-20 rounded-full border-3 border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-spin"
          style={{
            background: "conic-gradient(from 180deg, #ec4899, #8b5cf6, #3b82f6, #ec4899)",
            mask: "radial-gradient(circle at center, transparent 65%, black 67%)",
            WebkitMask: "radial-gradient(circle at center, transparent 65%, black 67%)",
            animationDirection: "reverse",
            animationDuration: "2s",
          }}
        />

        {/* 중앙 글로우 효과 */}
        <div className="absolute inset-4 w-16 h-16 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl animate-pulse" />

        {/* 중앙 아이콘 */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20 dark:border-gray-700/20">
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" aria-hidden="true" />
          </div>
        </div>

        {/* 플로팅 파티클들 */}
        <div className="absolute -inset-8">
          <Sparkles
            className="absolute top-0 left-4 w-3 h-3 text-blue-400 animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "2s" }}
          />
          <Sparkles
            className="absolute top-4 right-0 w-2 h-2 text-purple-400 animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
          />
          <Sparkles
            className="absolute bottom-2 left-0 w-2.5 h-2.5 text-pink-400 animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "2.2s" }}
          />
          <Sparkles
            className="absolute bottom-0 right-6 w-3 h-3 text-blue-300 animate-bounce"
            style={{ animationDelay: "1.5s", animationDuration: "2.8s" }}
          />
        </div>
      </div>

      {/* 메시지 섹션 */}
      <div className="text-center space-y-4 max-w-md">
        <p className="text-foreground text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {message}
        </p>

        {/* 진행 표시 점들 */}
        <div className="flex items-center justify-center space-x-2">
          <div
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50"
            style={{ animationDelay: "0ms", animationDuration: "1.5s" }}
          />
          <div
            className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse shadow-lg shadow-purple-500/50"
            style={{ animationDelay: "300ms", animationDuration: "1.5s" }}
          />
          <div
            className="w-2 h-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full animate-pulse shadow-lg shadow-pink-500/50"
            style={{ animationDelay: "600ms", animationDuration: "1.5s" }}
          />
          <div
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50"
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
