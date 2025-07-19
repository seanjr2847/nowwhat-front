"use client"

import { Moon, Sun } from "lucide-react"
import * as React from "react"
import { useTheme } from "../hooks/use-theme"
import { Button } from "./ui/button"

/**
 * 라이트 모드와 다크 모드를 전환하는 토글 버튼 컴포넌트입니다.
 * 커스텀 테마 시스템을 사용하여 테마 상태를 관리합니다.
 * @returns {JSX.Element} 렌더링된 테마 토글 버튼입니다.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 px-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
      >
        <div className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="theme-toggle w-9 h-9 px-0 text-gray-400 hover:text-white hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group"
      aria-label={`${theme === "light" ? "다크" : "라이트"} 모드로 전환`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:scale-110" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:scale-110" />
      <span className="sr-only">테마 전환</span>
    </Button>
  )
}
