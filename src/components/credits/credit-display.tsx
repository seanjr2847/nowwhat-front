"use client"

import { Zap, ZapOff, Loader2 } from "lucide-react"
import { useCredit } from "../../hooks/useCredit"
import { cn } from "../../lib/utils"

interface CreditDisplayProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showStatus?: boolean
}

/**
 * 사용자의 현재 크레딧을 표시하는 컴포넌트입니다.
 * @param {CreditDisplayProps} props - 크레딧 표시 컴포넌트의 props
 * @param {string} props.className - 추가 CSS 클래스
 * @param {"sm" | "md" | "lg"} props.size - 컴포넌트 크기
 * @param {boolean} props.showStatus - 상태 표시 여부
 * @returns {JSX.Element} 크레딧 표시 컴포넌트
 */
export function CreditDisplay({ 
  className,
  size = "md",
  showStatus = false 
}: CreditDisplayProps) {
  const { credits, status, isLoading } = useCredit()

  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-2", 
    lg: "text-lg px-4 py-3"
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }

  if (isLoading) {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
        sizeClasses[size],
        className
      )}>
        <Loader2 className={cn("animate-spin", iconSizes[size])} />
        <span>로딩중...</span>
      </div>
    )
  }

  const isInsufficient = status === "insufficient" || credits === 0

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200",
      isInsufficient 
        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800" 
        : credits <= 3
        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
        : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
      sizeClasses[size],
      className
    )}>
      {isInsufficient ? (
        <ZapOff className={cn(iconSizes[size])} />
      ) : (
        <Zap className={cn(iconSizes[size])} />
      )}
      
      <span className="font-bold">{credits}크레딧</span>
      
      {showStatus && (
        <span className={cn(
          "text-xs opacity-75",
          size === "sm" && "hidden"
        )}>
          {isInsufficient ? "(부족)" : credits <= 3 ? "(부족 예상)" : "(충분)"}
        </span>
      )}
    </div>
  )
}

/**
 * 간단한 크레딧 수치만 표시하는 컴포넌트입니다.
 * @param {Object} props - props 객체
 * @param {string} props.className - 추가 CSS 클래스
 * @returns {JSX.Element} 간단한 크레딧 표시
 */
export function SimpleCreditDisplay({ className }: { className?: string }) {
  const { credits, isLoading } = useCredit()

  if (isLoading) {
    return (
      <span className={cn("text-slate-400", className)}>
        <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
        ...
      </span>
    )
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 font-medium",
      credits === 0 ? "text-red-600 dark:text-red-400" : 
      credits <= 3 ? "text-amber-600 dark:text-amber-400" : 
      "text-emerald-600 dark:text-emerald-400",
      className
    )}>
      <Zap className="w-3 h-3" />
      {credits}
    </span>
  )
}