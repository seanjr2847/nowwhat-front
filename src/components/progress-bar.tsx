interface ProgressBarProps {
  progress: number
}

/**
 * 목표 구체화 과정의 진행 상태를 시각적으로 보여주는 프로그레스 바 컴포넌트입니다.
 * @param {ProgressBarProps} props - 프로그레스 바 컴포넌트의 props입니다.
 * @param {number} props.progress - 현재 진행률 (0-100)입니다.
 * @returns {JSX.Element} 렌더링된 프로그레스 바 컴포넌트입니다.
 */
export function ProgressBar({ progress }: ProgressBarProps) {
  const getProgressLabel = (progress: number) => {
    if (progress < 25) return "목표 분석"
    if (progress < 50) return "의도 선택"
    if (progress < 90) return "질문 답변"
    return "완료 준비"
  }

  const getStepNumber = (progress: number) => {
    if (progress < 25) return 1
    if (progress < 50) return 2
    if (progress < 90) return 3
    return 4
  }

  const getProgressColor = (progress: number) => {
    if (progress < 25) return "from-blue-500 to-blue-600"
    if (progress < 50) return "from-blue-500 to-purple-500"
    if (progress < 90) return "from-purple-500 to-pink-500"
    return "from-green-500 to-blue-500"
  }

  return (
    <div
      className="mb-8 animate-slide-up"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`진행률: ${Math.round(progress)}%, ${getProgressLabel(progress)}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-r ${getProgressColor(progress)} text-white text-sm font-bold shadow-lg`}
          >
            {getStepNumber(progress)}
          </div>
          <div>
            <span className="text-foreground font-semibold text-lg">{getProgressLabel(progress)}</span>
            <span className="text-muted-foreground text-sm ml-2">({getStepNumber(progress)}/4)</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-blue-400 font-bold text-xl" aria-hidden="true">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <div className="relative w-full bg-muted/50 rounded-full h-3 overflow-hidden backdrop-blur-sm" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-muted/30 to-muted/30 rounded-full" />
        <div
          className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        현재 진행률: {Math.round(progress)}퍼센트, {getProgressLabel(progress)}
      </div>
    </div>
  )
}
