"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeContext } from "../hooks/use-theme"

/**
 * 애플리케이션에서 사용 가능한 테마 타입
 * @typedef {"light" | "dark"} Theme
 */
type Theme = "light" | "dark"

/**
 * ThemeProvider 컴포넌트의 Props 타입 정의
 * @interface ThemeProviderProps
 */
interface ThemeProviderProps {
  /** Provider로 감쌀 자식 컴포넌트들 */
  children: React.ReactNode
  /** HTML 요소의 테마 속성명 (현재 미사용) */
  attribute?: string
  /** 기본 테마 설정. 기본값은 "dark" */
  defaultTheme?: Theme
  /** 시스템 테마 사용 여부 (현재 미사용) */
  enableSystem?: boolean
  /** 테마 변경 시 전환 효과 비활성화 여부 (현재 미사용) */
  disableTransitionOnChange?: boolean
}

/**
 * 애플리케이션 전체에 테마 상태를 제공하는 Context Provider 컴포넌트
 * 
 * 다음 기능들을 제공합니다:
 * - 라이트/다크 테마 상태 관리
 * - 로컬 스토리지를 통한 테마 설정 영속화
 * - 시스템 테마 자동 감지
 * - HTML 루트 요소에 테마 클래스 자동 적용
 * - 클라이언트 사이드 하이드레이션 안전성 보장
 * 
 * @param {ThemeProviderProps} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - Provider로 감쌀 자식 컴포넌트들
 * @param {Theme} [props.defaultTheme="dark"] - 기본 테마 설정
 * @returns {JSX.Element} 테마 컨텍스트를 제공하는 Provider 컴포넌트
 * 
 * @example
 * ```tsx
 * // App.tsx
 * function App() {
 *   return (
 *     <ThemeProvider defaultTheme="dark">
 *       <MyComponent />
 *     </ThemeProvider>
 *   )
 * }
 * 
 * // MyComponent.tsx
 * import { useTheme } from "../hooks/use-theme"
 * 
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme()
 *   
 *   return (
 *     <div>
 *       <p>현재 테마: {theme}</p>
 *       <button onClick={toggleTheme}>테마 변경</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // 로컬 스토리지에서 테마 불러오기
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setThemeState(savedTheme)
    } else {
      // 시스템 테마 감지
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setThemeState(systemTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    // 이전 테마 클래스 제거
    root.classList.remove("light", "dark")

    // 새 테마 클래스 추가
    root.classList.add(theme)

    // 로컬 스토리지에 저장
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  /**
   * 테마를 설정하는 내부 함수
   * @param {Theme} newTheme - 설정할 새로운 테마
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  /**
   * 현재 테마를 반대 테마로 토글하는 함수
   * light ↔ dark 간 전환
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  // 마운트되기 전에는 기본 테마로 렌더링
  if (!mounted) {
    return <div className={defaultTheme}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}


