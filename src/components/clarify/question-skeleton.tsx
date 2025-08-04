"use client"

import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { LoadingSpinner } from "./loading-spinner"

/**
 * 질문 생성 중 스켈레톤 UI 컴포넌트
 */
export function QuestionSkeleton() {
  return (
    <div className="space-y-8 py-8">
      {/* 섹션 제목 스켈레톤 */}
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-80 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      {/* 질문 카드들 스켈레톤 */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-4">
              {/* 질문 번호와 제목 */}
              <div className="flex items-start space-x-3">
                <Skeleton className="h-6 w-6 rounded-full flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* 질문 유형에 따른 스켈레톤 */}
              {index % 3 === 0 && (
                // 텍스트 입력 스켈레톤
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              )}
              
              {index % 3 === 1 && (
                // 객관식 스켈레톤
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {index % 3 === 2 && (
                // 다중 선택 스켈레톤
                <div className="space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 필수 여부 표시 */}
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* 하단 진행 상태 */}
      <div className="text-center space-y-4 pt-8">
        <Skeleton className="h-4 w-48 mx-auto" />
        <div className="flex justify-center space-x-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * 간단한 질문 로딩 스켈레톤 (컴팩트 버전)
 */
export function QuestionSkeletonCompact() {
  return (
    <div className="space-y-8 py-8">
      {/* 개선된 로딩 스피너 사용 */}
      <div className="flex justify-center">
        <LoadingSpinner stage="question-generation" />
      </div>

      {/* 미리보기 질문 카드들 */}
      <div className="grid gap-4 max-w-2xl mx-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-white/20">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* 추가 안내 */}
      <div className="text-center">
        <Skeleton className="h-3 w-56 mx-auto" />
      </div>
    </div>
  )
}