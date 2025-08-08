"use client"

import { Card, CardContent } from "../ui/card"

/**
 * Intent 선택 컴포넌트의 로딩 상태를 나타내는 스켈레톤 UI 컴포넌트입니다.
 * @returns {JSX.Element} 렌더링된 Intent 스켈레톤 컴포넌트입니다.
 */
export function IntentSkeleton() {
  return (
    <section className="mb-12 animate-scale-in" aria-labelledby="intent-heading">
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

      {/* 로딩 메시지 */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-white/20 dark:border-gray-700/20">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">AI가 맞춤 방향을 분석하고 있습니다...</span>
        </div>
      </div>
    </section>
  )
}