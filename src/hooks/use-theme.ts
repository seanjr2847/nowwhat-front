import { createContext, useContext } from "react"

/**
 * 애플리케이션에서 사용 가능한 테마 타입
 * @typedef {"light" | "dark"} Theme
 */
type Theme = "light" | "dark"

/**
 * 테마 컨텍스트에서 제공하는 값들의 타입 정의
 * @interface ThemeContextType
 */
interface ThemeContextType {
  /** 현재 활성화된 테마 */
  theme: Theme
  /** 테마를 설정하는 함수 */
  setTheme: (theme: Theme) => void
  /** 라이트/다크 테마를 토글하는 함수 */
  toggleTheme: () => void
}

/**
 * 테마 상태와 관련 함수들을 제공하는 React Context
 * @type {React.Context<ThemeContextType>}
 */
export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
})

/**
 * 테마 컨텍스트를 사용하기 위한 커스텀 훅
 * ThemeProvider 내부에서만 사용 가능합니다.
 * 
 * @returns {ThemeContextType} 현재 테마 상태와 테마 제어 함수들
 * @throws {Error} ThemeProvider 외부에서 사용될 경우 에러가 발생합니다
 * 
 * @example
 * ```tsx
 * const { theme, setTheme, toggleTheme } = useTheme()
 * 
 * // 현재 테마 확인
 * console.log(theme) // "light" | "dark"
 * 
 * // 테마 변경
 * setTheme("dark")
 * 
 * // 테마 토글
 * toggleTheme()
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
} 