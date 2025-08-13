import { Button } from "../ui/button"
import { ArrowLeft, Calendar, Target, Edit3, Trash2, MoreVertical } from "lucide-react"
import { Link } from "react-router-dom"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "../ui/dropdown-menu"

interface ChecklistHeaderProps {
  goal: string
  createdAt: string
  onEdit?: () => void
  onDelete?: () => void
  canEdit?: boolean
  canDelete?: boolean
}

/**
 * 체크리스트 결과 페이지의 헤더 컴포넌트입니다.
 * 목표와 생성 날짜를 표시하고, 편집/삭제 기능을 제공합니다.
 * @param {ChecklistHeaderProps} props - 헤더 컴포넌트의 props입니다.
 * @param {string} props.goal - 체크리스트의 목표입니다.
 * @param {string} props.createdAt - 체크리스트 생성 날짜입니다.
 * @param {() => void} [props.onEdit] - 편집 버튼 클릭 시 호출될 함수입니다.
 * @param {() => void} [props.onDelete] - 삭제 버튼 클릭 시 호출될 함수입니다.
 * @param {boolean} [props.canEdit] - 편집 가능 여부입니다.
 * @param {boolean} [props.canDelete] - 삭제 가능 여부입니다.
 * @returns {JSX.Element} 렌더링된 체크리스트 헤더입니다.
 */
export function ChecklistHeader({ 
  goal, 
  createdAt, 
  onEdit, 
  onDelete, 
  canEdit = false, 
  canDelete = false 
}: ChecklistHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300 focus-ring rounded-xl px-4 py-2 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">홈으로</span>
          </Button>
        </Link>
        
        {(canEdit || canDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 focus-ring rounded-xl px-3 py-2 border-input/50"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <Edit3 className="w-4 h-4 mr-2" />
                  편집하기
                </DropdownMenuItem>
              )}
              {canEdit && canDelete && <DropdownMenuSeparator />}
              {canDelete && onDelete && (
                <DropdownMenuItem 
                  onClick={onDelete} 
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제하기
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-full shadow-lg">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">목표 달성</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">"{goal}"</span>
          </h1>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>생성일: {formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
