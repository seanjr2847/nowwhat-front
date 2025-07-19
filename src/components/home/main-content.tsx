"use client"

import { GoalInputForm } from "./goal-input-form"

/**
 * 메인 페이지의 핵심 콘텐츠를 렌더링하는 컴포넌트입니다.
 * 페이지의 제목과 핵심 기능인 목표 입력 폼을 포함합니다.
 * @returns {JSX.Element} 렌더링된 메인 콘텐츠입니다.
 */
export function MainContent() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-background">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="text-center space-y-12 max-w-5xl relative z-10">
        {/* 헤더 섹션 */}
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h1 className="main-title text-5xl md:text-7xl font-light text-foreground tracking-wide leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                뭐부터 해야하지?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI가 만드는 나만의 실행 체크리스트
            </p>
          </div>
        </div>

        {/* 목표 입력 폼 */}
        <GoalInputForm />
      </div>
    </main>
  )
}
