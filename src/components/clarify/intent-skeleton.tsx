"use client"

import { Card, CardContent } from "../ui/card"
import { LoadingSpinner } from "./loading-spinner"

/**
 * Intent 선택 컴포넌트의 로딩 상태를 나타내는 스켈레톤 UI 컴포넌트입니다.
 * @returns {JSX.Element} 렌더링된 Intent 스켈레톤 컴포넌트입니다.
 */
export function IntentSkeleton() {
  return (
    <section className="mb-12 animate-scale-in" aria-labelledby="intent-heading">
      {/* 일관된 로딩 스피너 사용 */}
      <div className="mb-12">
        <LoadingSpinner 
          stage="intent-analysis" 
          message="당신의 목표에 맞는 방향을 분석하고 있어요"
        />
      </div>

      {/* 스켈레톤 컨텐샤를 더 간단하고 일관성 있게 */}
      <div className="grid md:grid-cols-2 gap-6 opacity-50">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={`skeleton-${index}`}
            className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl overflow-hidden animate-pulse"
          >
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                {/* 아이콘 skeleton */}
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto" />
                
                {/* 제목 skeleton */}
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4 mx-auto" />
                
                {/* 설명 skeleton - 더 자연스럽게 */}
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full" />
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-4/5 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}