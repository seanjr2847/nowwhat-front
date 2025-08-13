import { ArrowLeft, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"

interface ClarifyHeaderProps {
  goal: string
}

/**
 * 목표 구체화 페이지의 헤더 컴포넌트입니다.
 * 사용자의 목표를 표시하고, 이전 페이지로 돌아가는 링크를 제공합니다.
 * @param {ClarifyHeaderProps} props - 헤더 컴포넌트의 props입니다.
 * @param {string} props.goal - 사용자가 입력한 목표 텍스트입니다.
 * @returns {JSX.Element} 렌더링된 헤더 컴포넌트입니다.
 */
export function ClarifyHeader({ goal }: ClarifyHeaderProps) {
  return (
    <header className="mb-8 animate-fade-in" role="banner">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" aria-label="메인 페이지로 돌아가기">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300 focus-ring rounded-xl px-4 py-2 group"
            aria-describedby="restart-hint"
          >
            <ArrowLeft
              className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
              aria-hidden="true"
            />
            <span className="font-medium">다시 시작</span>
          </Button>
        </Link>
        <div id="restart-hint" className="sr-only">
          처음부터 새로운 목표를 입력하려면 이 버튼을 클릭하세요
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">AI 분석 완료</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-xl font-bold text-foreground" id="main-heading">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{goal}</span>
            <span className="text-foreground"> 구체화하기</span>
          </h1>

          <p className="text-muted-foreground text-sm" aria-describedby="main-heading">
            가장 적합한 방향을 선택해주세요
          </p>
        </div>
      </div>
    </header>
  )
}
