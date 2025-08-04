import { Brain, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { getLoadingConfig, getRandomEncouragement, type LoadingStage } from "../../lib/loading-messages"

interface LoadingSpinnerProps {
  /** 기본 메시지 (하위 호환성) */
  message?: string
  /** 로딩 단계 타입 */
  stage?: LoadingStage
  /** 결과 개수 (예: "5개의 방향을 찾았어요!") */
  resultCount?: number
  /** 완료 콜백 */
  onComplete?: () => void
}

/**
 * 단계별 로딩 스피너 컴포넌트 - 사용자 이탈율 감소를 위한 개선된 버전
 */
export function LoadingSpinner({ 
  message, 
  stage = 'generic', 
  resultCount
}: LoadingSpinnerProps) {
  const [currentProgressIndex, setCurrentProgressIndex] = useState(0)
  const [showEncouragement, setShowEncouragement] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  // 로딩 설정 가져오기
  const config = getLoadingConfig(stage)
  const progressMessages = config.messages.progressMessages
  const estimatedDuration = config.messages.estimatedDuration

  useEffect(() => {
    // 2초 후부터 진행 메시지 시작
    const initialDelay = setTimeout(() => {
      setCurrentProgressIndex(0)
      
      // 진행 메시지 순환 (단계별로 적절한 간격)
      const messageInterval = Math.max(2000, (estimatedDuration * 1000) / progressMessages.length)
      
      const interval = setInterval(() => {
        setCurrentProgressIndex((prev) => {
          const next = (prev + 1) % progressMessages.length
          return next
        })
      }, messageInterval)

      return () => clearInterval(interval)
    }, 2000)

    // 시간 카운터
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    // 격려 메시지 표시 (예상 시간의 70% 지점)
    const encouragementDelay = setTimeout(() => {
      setShowEncouragement(true)
    }, estimatedDuration * 700)

    return () => {
      clearTimeout(initialDelay)
      clearTimeout(encouragementDelay)
      clearInterval(timeInterval)
    }
  }, [stage, message, config, progressMessages, estimatedDuration])

  // 현재 표시할 메시지 결정
  const getCurrentMessage = () => {
    if (elapsedTime < 2) {
      return message || config.messages.primary
    }
    
    if (progressMessages[currentProgressIndex]) {
      return progressMessages[currentProgressIndex]
    }
    
    return config.messages.secondary
  }

  // 격려 메시지 결정
  const getEncouragementMessage = () => {
    if (!showEncouragement) return config.messages.secondary
    
    const phase = elapsedTime < estimatedDuration * 0.3 ? 'start' : 
                  elapsedTime < estimatedDuration * 0.8 ? 'middle' : 'end'
    
    return getRandomEncouragement(phase)
  }
  return (
    <div
      className="flex flex-col items-center space-y-8 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label={getCurrentMessage()}
    >
      {/* 단계 표시 헤더 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">{config.icon}</span>
          <span className="text-sm font-medium text-muted-foreground">
            {config.name}
          </span>
        </div>
        
        {/* 진행 단계 표시 */}
        {progressMessages.length > 1 && (
          <div className="flex items-center justify-center space-x-1">
            {progressMessages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentProgressIndex 
                    ? 'bg-current opacity-100' 
                    : 'bg-current opacity-30'
                }`}
                style={{ 
                  color: index <= currentProgressIndex ? config.colors.primary : config.colors.accent 
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 메인 로딩 애니메이션 */}
      <div className="relative">
        {/* 외부 회전 링 - 단계별 색상 */}
        <div
          className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent animate-spin"
          style={{
            background: `conic-gradient(from 0deg, ${config.colors.primary}, ${config.colors.secondary}, ${config.colors.accent}, ${config.colors.primary})`,
            mask: "radial-gradient(circle at center, transparent 70%, black 72%)",
            WebkitMask: "radial-gradient(circle at center, transparent 70%, black 72%)",
          }}
        />

        {/* 내부 회전 링 (반대 방향) */}
        <div
          className="absolute inset-2 w-20 h-20 rounded-full border-3 border-transparent animate-spin"
          style={{
            background: `conic-gradient(from 180deg, ${config.colors.accent}, ${config.colors.secondary}, ${config.colors.primary}, ${config.colors.accent})`,
            mask: "radial-gradient(circle at center, transparent 65%, black 67%)",
            WebkitMask: "radial-gradient(circle at center, transparent 65%, black 67%)",
            animationDirection: "reverse",
            animationDuration: "2s",
          }}
        />

        {/* 중앙 글로우 효과 */}
        <div 
          className="absolute inset-4 w-16 h-16 rounded-full blur-xl animate-pulse" 
          style={{
            background: `linear-gradient(45deg, ${config.colors.primary}30, ${config.colors.secondary}30)`
          }}
        />

        {/* 중앙 아이콘 */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20 dark:border-gray-700/20">
            <Brain 
              className="w-6 h-6 animate-pulse" 
              style={{ color: config.colors.primary }}
              aria-hidden="true" 
            />
          </div>
        </div>

        {/* 플로팅 파티클들 - 단계별 색상 */}
        <div className="absolute -inset-8">
          <Sparkles
            className="absolute top-0 left-4 w-3 h-3 animate-bounce"
            style={{ 
              color: config.colors.primary,
              animationDelay: "0s", 
              animationDuration: "2s" 
            }}
          />
          <Sparkles
            className="absolute top-4 right-0 w-2 h-2 animate-bounce"
            style={{ 
              color: config.colors.secondary,
              animationDelay: "0.5s", 
              animationDuration: "2.5s" 
            }}
          />
          <Sparkles
            className="absolute bottom-2 left-0 w-2.5 h-2.5 animate-bounce"
            style={{ 
              color: config.colors.accent,
              animationDelay: "1s", 
              animationDuration: "2.2s" 
            }}
          />
          <Sparkles
            className="absolute bottom-0 right-6 w-3 h-3 animate-bounce"
            style={{ 
              color: config.colors.primary,
              animationDelay: "1.5s", 
              animationDuration: "2.8s" 
            }}
          />
        </div>
      </div>

      {/* 메시지 섹션 */}
      <div className="text-center space-y-4 max-w-md">
        {/* 메인 메시지 */}
        <p 
          className="text-foreground text-lg font-semibold bg-clip-text text-transparent transition-all duration-500 ease-in-out"
          style={{
            backgroundImage: `linear-gradient(45deg, ${config.colors.primary}, ${config.colors.secondary})`
          }}
        >
          {getCurrentMessage()}
        </p>

        {/* 격려 메시지 */}
        <p className="text-muted-foreground text-sm transition-opacity duration-300">
          {getEncouragementMessage()}
        </p>

        {/* 결과 카운트 표시 */}
        {resultCount && (
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
              ✅ {resultCount}개 완료
            </span>
          </div>
        )}

        {/* 경과 시간 표시 (10초 이상일 때만) */}
        {elapsedTime >= 10 && (
          <p className="text-xs text-muted-foreground opacity-60">
            {elapsedTime}초 경과 • 조금만 더 기다려주세요
          </p>
        )}
      </div>

      <div className="sr-only">
        {config.name} 중입니다. {getCurrentMessage()}
      </div>
    </div>
  )
}
