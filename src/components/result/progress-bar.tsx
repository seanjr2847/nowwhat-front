import { CheckCircle, Circle } from "lucide-react"

interface ProgressBarProps {
  completed: number
  total: number
  progress: number
}

/**
 * 체크리스트의 전반적인 진행 상황을 보여주는 프로그레스 바 컴포넌트입니다.
 * 완료된 항목 수와 백분율을 표시합니다.
 * @param {ProgressBarProps} props - 프로그레스 바 컴포넌트의 props입니다.
 * @param {number} props.completed - 완료된 항목 수입니다.
 * @param {number} props.total - 전체 항목 수입니다.
 * @param {number} props.progress - 진행률 (0-100)입니다.
 * @returns {JSX.Element} 렌더링된 프로그레스 바입니다.
 */
export function ProgressBar({ completed, total, progress }: ProgressBarProps) {
  const getProgressColor = (progress: number) => {
    if (progress === 100) return "from-green-500 to-emerald-500"
    if (progress >= 75) return "from-blue-500 to-green-500"
    if (progress >= 50) return "from-purple-500 to-blue-500"
    if (progress >= 25) return "from-orange-500 to-purple-500"
    return "from-red-500 to-orange-500"
  }

  const getStatusMessage = (progress: number) => {
    if (progress === 100) return "🎉 모든 항목을 완료했습니다!"
    if (progress >= 75) return "🔥 거의 다 왔어요!"
    if (progress >= 50) return "💪 절반을 넘었습니다!"
    if (progress >= 25) return "🚀 좋은 시작이에요!"
    return "📝 체크리스트를 시작해보세요"
  }

  return (
    <div className="mb-8 animate-slide-up">
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${getProgressColor(progress)} text-white shadow-lg`}
            >
              {progress === 100 ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-foreground font-semibold text-lg">진행 상황</h3>
              <p className="text-muted-foreground text-sm">{getStatusMessage(progress)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {completed}
              <span className="text-muted-foreground">/{total}</span>
            </div>
            <div className="text-sm text-muted-foreground">완료</div>
          </div>
        </div>

        <div className="relative w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-full h-4 overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-muted/30 to-muted/30 rounded-full" />
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-muted-foreground">0%</span>
          <span className={`text-sm font-medium ${progress === 100 ? "text-green-400" : "text-blue-400"}`}>
            {Math.round(progress)}%
          </span>
          <span className="text-sm text-muted-foreground">100%</span>
        </div>
      </div>
    </div>
  )
}
