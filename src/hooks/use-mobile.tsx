"use client"

import { useState, useEffect } from "react"

/**
 * 현재 화면이 모바일 크기인지 여부를 반환하는 커스텀 훅입니다.
 * @param {number} [maxWidth=768] - 모바일로 간주할 최대 너비 (기본값: 768px).
 * @returns {boolean} 모바일 크기이면 true, 아니면 false를 반환합니다.
 */
export function useIsMobile(maxWidth = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 클라이언트 사이드에서만 window 객체에 접근
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`)

      const handleResize = (event: MediaQueryListEvent) => {
        setIsMobile(event.matches)
      }

      // 초기 상태 설정
      setIsMobile(mediaQuery.matches)

      // 리스너 추가 및 제거
      mediaQuery.addEventListener("change", handleResize)
      return () => mediaQuery.removeEventListener("change", handleResize)
    }
  }, [maxWidth])

  return isMobile
}
