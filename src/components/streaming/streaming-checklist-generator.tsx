"use client"

import { Brain } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { LoadingSpinner } from "../clarify/loading-spinner"
import { generateChecklistStream, createChecklist, type StreamChecklistResponse } from "../../lib/api"

interface StreamingChecklistGeneratorProps {
  /** 세션 ID */
  sessionId: string
  /** 목표 */
  goal: string
  /** 의도 제목 */
  intentTitle: string
  /** 답변 배열 */
  answersArray: any[]
  /** 체크리스트 완료 콜백 */
  onChecklistComplete: (checklistId: string) => void
  /** 에러 콜백 */
  onError?: (error: string) => void
  /** 자동 시작 여부 */
  autoStart?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

interface ChecklistItem {
  item_id: string
  title: string
  description: string
  order: number
  tips?: string[]
  links?: Array<{ title: string; url: string }>
  price?: string
}

/**
 * 스트리밍 체크리스트 생성기 컴포넌트
 * 질문 생성과 동일한 방식의 실시간 체크리스트 아이템 표시
 */
export function StreamingChecklistGenerator({
  sessionId,
  goal,
  intentTitle,
  answersArray,
  onChecklistComplete,
  onError,
  autoStart = true,
  className
}: StreamingChecklistGeneratorProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [currentStatus, setCurrentStatus] = useState<StreamChecklistResponse['status'] | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [progress, setProgress] = useState({ current: 0, estimated_total: 0 })
  const [streamId, setStreamId] = useState<string>('')

  const outputRef = useRef<HTMLDivElement>(null)
  const hasStartedRef = useRef(false)

  // 자동 시작
  useEffect(() => {
    if (autoStart && !isStreaming && !checklistItems.length && sessionId && !hasStartedRef.current) {
      console.log('🎬 체크리스트 생성 자동 시작')
      hasStartedRef.current = true
      void startChecklistCreation()
    }
  }, [autoStart, sessionId])

  // 에러 처리
  useEffect(() => {
    if (error !== null) {
      onError?.(error)
    }
  }, [error, onError])

  // 스크롤 자동 이동
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [checklistItems])

  const startChecklistCreation = async () => {
    setIsStreaming(true)
    setError(null)
    setChecklistItems([])
    setCurrentStatus(null)
    setStatusMessage('')
    setProgress({ current: 0, estimated_total: 0 })
    
    console.log('🚀 체크리스트 생성 시작:', {
      sessionId,
      goal,
      intentTitle,
      answersCount: answersArray.length
    })

    try {
      // 먼저 스트리밍 API 시도
      await generateChecklistStream(
        sessionId,
        '', // questionSetId는 답변에서 자동으로 처리됨
        goal,
        intentTitle,
        answersArray,
        handleStreamData,
        handleStreamComplete,
        handleStreamError
      )
    } catch (streamError) {
      console.warn('⚠️ 스트리밍 API 실패, 기존 API로 폴백:', streamError)
      
      // 스트리밍 실패 시 기존 API 사용
      try {
        setCurrentStatus('started')
        setStatusMessage('체크리스트 생성 중...')
        
        const response = await createChecklist(
          sessionId,
          '',
          goal,
          intentTitle,
          answersArray
        )
        
        if (response.success && response.data?.checklistId) {
          setCurrentStatus('completed')
          setStatusMessage('체크리스트가 성공적으로 생성되었습니다!')
          setIsStreaming(false)
          onChecklistComplete(response.data.checklistId)
        } else {
          throw new Error(response.error || '체크리스트 생성에 실패했습니다.')
        }
      } catch (fallbackError) {
        const errorMessage = fallbackError instanceof Error ? fallbackError.message : '체크리스트 생성 중 오류가 발생했습니다.'
        handleStreamError(errorMessage)
      }
    }
  }

  const handleStreamData = (data: StreamChecklistResponse) => {
    console.log('📄 체크리스트 스트림 데이터 수신:', data)
    console.log('🔍 상세 데이터 분석:', {
      status: data.status,
      hasItem: !!data.item,
      hasEnhancedItem: !!data.enhanced_item,
      hasDetails: !!data.details,
      detailsContent: data.details
    })
    
    setCurrentStatus(data.status)
    
    if (data.message) {
      setStatusMessage(data.message)
    }

    if (data.stream_id) {
      setStreamId(data.stream_id)
    }

    if (data.progress) {
      setProgress(data.progress)
    }

    // 새 아이템 추가
    if (data.status === 'item_ready' && data.item) {
      console.log('📦 item_ready 상태 - details 확인:', {
        hasDetails: !!data.details,
        details: data.details
      })
      
      const newItem: ChecklistItem = {
        item_id: data.item.item_id,
        title: data.item.title,
        description: data.item.description,
        order: data.item.order,
        // item_ready에서도 details가 있으면 포함
        tips: data.details?.tips,
        links: data.details?.links,
        price: data.details?.price
      }
      
      console.log('📝 생성된 아이템:', newItem)
      
      setChecklistItems(prev => {
        // 중복 방지: 같은 item_id가 있으면 교체, 없으면 추가
        const existing = prev.find(item => item.item_id === newItem.item_id)
        if (existing) {
          console.log('🔄 기존 아이템 교체:', newItem.item_id)
          return prev.map(item => item.item_id === newItem.item_id ? newItem : item)
        } else {
          console.log('➕ 새 아이템 추가:', newItem.item_id)
          return [...prev, newItem].sort((a, b) => a.order - b.order)
        }
      })
    }

    // 아이템 향상 (details 추가)
    if (data.status === 'item_enhanced') {
      console.log('🌟 item_enhanced 상태 감지:', {
        hasEnhancedItem: !!data.enhanced_item,
        hasDetails: !!data.details,
        enhanced_item: data.enhanced_item,
        details: data.details
      })
      
      if (data.enhanced_item && data.details) {
        const enhancedItem: ChecklistItem = {
          item_id: data.enhanced_item.item_id,
          title: data.enhanced_item.title,
          description: data.enhanced_item.description,
          order: data.enhanced_item.order,
          tips: data.details.tips,
          links: data.details.links,
          price: data.details.price
        }

        console.log('✨ 아이템 향상 적용:', enhancedItem)

        setChecklistItems(prev => {
          const updated = prev.map(item => 
            item.item_id === enhancedItem.item_id ? enhancedItem : item
          )
          console.log('📝 향상 후 아이템 목록:', updated)
          return updated
        })
      } else {
        console.warn('⚠️ item_enhanced 상태이지만 enhanced_item 또는 details가 없음:', {
          enhanced_item: data.enhanced_item,
          details: data.details
        })
      }
    }
  }

  const handleStreamComplete = (checklistId: string) => {
    console.log('✅ 체크리스트 생성 완료:', checklistId)
    setIsStreaming(false)
    setCurrentStatus('completed')
    setStatusMessage('체크리스트가 성공적으로 생성되었습니다!')
    onChecklistComplete(checklistId)
  }

  const handleStreamError = (errorMessage: string) => {
    console.error('❌ 체크리스트 생성 에러:', errorMessage)
    setError(errorMessage)
    setIsStreaming(false)
    setCurrentStatus('error')
    setStatusMessage(errorMessage)
  }

  const handleStart = () => {
    hasStartedRef.current = true
    void startChecklistCreation()
  }

  const getStatusMessage = () => {
    if (statusMessage) {
      return statusMessage
    }

    if (isStreaming) {
      if (currentStatus === 'started') {
        return '체크리스트 생성을 시작합니다...'
      }
      if (currentStatus === 'saving_answers') {
        return '답변을 저장하고 있습니다...'
      }
      if (currentStatus === 'item_ready') {
        return `체크리스트 아이템이 생성되고 있습니다 (${progress.current}/${progress.estimated_total || '?'}개)`
      }
      if (currentStatus === 'item_enhanced') {
        return '아이템 세부 정보를 보강하고 있습니다...'
      }
      return 'AI가 체크리스트를 생성하고 있습니다...'
    }
    
    if (currentStatus === 'completed') {
      return '체크리스트 생성이 완료되었습니다!'
    }
    
    if (currentStatus === 'error') {
      return '체크리스트 생성 중 오류가 발생했습니다.'
    }

    return '체크리스트를 생성할 준비가 되었습니다.'
  }

  const getStatusColor = () => {
    if (currentStatus === 'error' || error) {
      return 'text-red-600 dark:text-red-400'
    }
    if (isStreaming) {
      return 'text-blue-600 dark:text-blue-400'
    }
    if (currentStatus === 'completed') {
      return 'text-green-600 dark:text-green-400'
    }
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* 상태 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Brain
              className={cn(
                "w-6 h-6 transition-colors duration-300",
                isStreaming ? "text-blue-500 streaming-pulse" : "text-gray-500"
              )}
            />
            {isStreaming && (
              <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI 체크리스트 생성</h3>
            <p className={cn("text-sm transition-colors duration-300", getStatusColor())}>
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex items-center space-x-2">
          {!isStreaming && !checklistItems.length && (
            <Button
              onClick={handleStart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              생성 시작
            </Button>
          )}
        </div>
      </div>

      {/* 진행률 표시 */}
      {progress.estimated_total > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(progress.current / progress.estimated_total) * 100}%` }}
          />
        </div>
      )}

      {/* 체크리스트 아이템들 */}
      <div ref={outputRef} className="space-y-4 max-h-96 overflow-y-auto">
        {checklistItems.map((item, index) => (
          <div
            key={item.item_id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl p-4 animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-md mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <h4 className="font-medium text-foreground">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
                
                {/* 팁 표시 */}
                {item.tips && item.tips.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">💡 팁</h5>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {item.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-1">
                          <span>•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* 링크 표시 */}
                {item.links && item.links.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">🔗 참고 링크</h5>
                    <div className="space-y-1">
                      {item.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline block"
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 가격 정보 */}
                {item.price && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      💰 {item.price}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* 로딩 상태일 때만 스피너 표시 */}
        {isStreaming && checklistItems.length === 0 && (
          <div className="flex justify-center py-8">
            <LoadingSpinner stage="checklist-creation" />
          </div>
        )}
      </div>

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-red-800 dark:text-red-200 font-medium text-sm mb-1">
                체크리스트 생성 실패
              </h4>
              <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                {error}
              </p>
              {streamId && (
                <p className="text-red-500 dark:text-red-500 text-xs">
                  오류 ID: {streamId}
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setError(null)
                setCurrentStatus(null)
                void startChecklistCreation()
              }}
              className="ml-4"
            >
              다시 시도
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StreamingChecklistGenerator