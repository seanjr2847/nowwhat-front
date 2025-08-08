"use client"

import { Card, CardContent } from "../ui/card"

/**
 * Intent 선택 컴포넌트의 로딩 상태를 나타내는 스켈레톤 UI 컴포넌트입니다.
 * @returns {JSX.Element} 렌더링된 Intent 스켈레톤 컴포넌트입니다.
 */
export function IntentSkeleton() {
  return (
    <section className="mb-12 animate-scale-in" aria-labelledby="intent-heading">
      {/* 상단 로딩바 */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-pulse-width origin-left" 
             style={{ 
               animation: 'loading-bar 2s ease-in-out infinite',
               width: '60%'
             }} />
      </div>

      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={`skeleton-${index}`}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl overflow-hidden"
          >
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                {/* 아이콘 skeleton */}
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto animate-pulse" />
                
                {/* 제목 skeleton */}
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto animate-pulse" />
                
                {/* 설명 skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mx-auto animate-pulse" />
                </div>
                
                {/* 선택 버튼 skeleton */}
                <div className="flex items-center justify-center space-x-2 pt-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}