"use client"

import { Button } from "../ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
  onRetry: () => void
}

/**
 * 오류 발생 시 사용자에게 메시지를 표시하고 재시도 옵션을 제공하는 컴포넌트입니다.
 * @param {ErrorMessageProps} props - 오류 메시지 컴포넌트의 props입니다.
 * @param {string} props.message - 표시할 오류 메시지입니다.
 * @param {() => void} props.onRetry - '다시 시도' 버튼 클릭 시 호출될 함수입니다.
 * @returns {JSX.Element} 렌더링된 오류 메시지 컴포넌트입니다.
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <p className="text-foreground text-lg">{message}</p>
      <Button onClick={onRetry} variant="outline" className="text-muted-foreground border-border bg-transparent">
        다시 시도
      </Button>
    </div>
  )
}
