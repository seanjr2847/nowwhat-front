"use client"

import { ChevronDown, DollarSign, ExternalLink, Lightbulb, Mail, MapPin, Phone, Clock, TrendingUp } from "lucide-react"
import { useState } from "react"
import { toggleChecklistItem, type ChecklistItemData, type StepInfo } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Checkbox } from "../ui/checkbox"

interface ChecklistItemProps {
  item: ChecklistItemData
  index: number
  checklistId?: string
  onToggle: (itemId: string) => void
}

/**
 * 개별 체크리스트 항목을 표시하는 컴포넌트입니다.
 * 완료 토글, 상세 정보 확장/축소 기능을 포함합니다.
 * @param {ChecklistItemProps} props - 체크리스트 아이템 컴포넌트의 props입니다.
 * @param {ChecklistItemData} props.item - 표시할 항목의 데이터입니다.
 * @param {number} props.index - 항목의 순서 번호입니다.
 * @param {(itemId: string) => void} props.onToggle - 항목의 완료 상태를 토글하는 함수입니다.
 * @returns {JSX.Element} 렌더링된 체크리스트 항목입니다.
 */
export function ChecklistItem({ item, index, checklistId, onToggle }: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  // Helper function to check if a step is StepInfo object
  const isStepInfo = (step: string | StepInfo): step is StepInfo => {
    return typeof step === 'object' && 'order' in step && 'title' in step
  }

  // Helper function to get structured steps
  const getStructuredSteps = (): StepInfo[] => {
    if (!item.details?.steps) return []
    
    return item.details.steps.map((step, index) => {
      if (isStepInfo(step)) {
        return step
      }
      // Convert legacy string format to StepInfo
      return {
        order: index + 1,
        title: `${index + 1}단계`,
        description: step,
        estimatedTime: undefined,
        difficulty: undefined
      }
    })
  }

  const hasDetails =
    (item.details?.tips?.length ?? 0) > 0 ||
    (item.details?.steps?.length ?? 0) > 0 ||
    (item.details?.contacts?.length ?? 0) > 0 ||
    (item.details?.links?.length ?? 0) > 0 ||
    (item.details?.price != null && item.details?.price !== '') ||
    (item.details?.location != null && item.details?.location !== '')

  // 체크리스트 항목 토글 API 연결
  const handleToggle = async (itemId: string) => {
    if (checklistId == null || checklistId === '' || isUpdating) return

    // 낙관적 UI 업데이트 - 즉시 UI 변경
    const newIsCompleted = !item.isCompleted
    onToggle(itemId) // 먼저 UI 업데이트

    setIsUpdating(true)
    
    try {
      const response = await toggleChecklistItem(checklistId, itemId, newIsCompleted)

      if (response.success) {
        // 성공: 이미 UI가 업데이트됨, 성공 알림
        toast({
          title: newIsCompleted ? "완료 처리됨" : "완료 취소됨",
          description: newIsCompleted 
            ? `"${item.title}" 항목을 완료했습니다.` 
            : `"${item.title}" 항목을 미완료로 변경했습니다.`,
          duration: 2000,
        })
      } else {
        // 실패: UI를 원래 상태로 롤백
        onToggle(itemId) // 다시 토글해서 원상복구
        console.error("체크리스트 항목 토글 실패:", response.error)
        toast({
          title: "변경 실패",
          description: "항목 상태 변경에 실패했습니다. 다시 시도해주세요.",
          variant: "destructive",
        })
      }
    } catch (error) {
      // 오류: UI를 원래 상태로 롤백
      onToggle(itemId) // 다시 토글해서 원상복구
      console.error("체크리스트 항목 토글 오류:", error)
      toast({
        title: "오류 발생",
        description: "항목 상태 변경 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 ease-out ${
        item.isCompleted 
          ? "bg-gradient-to-br from-emerald-50/90 via-green-50/70 to-teal-50/90 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-teal-950/40 border border-emerald-200/60 dark:border-emerald-700/40 shadow-emerald-100/50 dark:shadow-emerald-900/20" 
          : "bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 border border-slate-200/60 dark:border-slate-700/40 shadow-lg dark:shadow-slate-900/20"
      } rounded-2xl shadow-lg`}
    >
      {/* Success celebration overlay */}
      {item.isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/8 via-green-400/5 to-teal-500/8 dark:from-emerald-400/12 dark:via-green-400/8 dark:to-teal-400/12 animate-pulse" />
      )}
      
      {/* Left accent border */}
      <div className={`absolute left-0 top-0 w-1.5 h-full ${
        item.isCompleted 
          ? "bg-gradient-to-b from-emerald-400 to-green-500" 
          : "bg-gradient-to-b from-blue-400 to-indigo-500"
      }`} />
      
      <CardContent className="relative p-6 sm:p-8">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Enhanced checkbox area */}
          <div className="flex-shrink-0 pt-1">
            <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
              item.isCompleted 
                ? "bg-emerald-100/80 dark:bg-emerald-900/40 ring-2 ring-emerald-200/60 dark:ring-emerald-700/40" 
                : "bg-slate-100/80 dark:bg-slate-800/60 ring-1 ring-slate-200/60 dark:ring-slate-700/40"
            }`}>
              <Checkbox
                id={`item-${item.id}`}
                checked={item.isCompleted}
                onCheckedChange={() => void handleToggle(item.id)}
                disabled={isUpdating}
                className="w-6 h-6 rounded-lg data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 border-2 transition-all duration-300"
              />
              {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            {/* Header with improved hierarchy */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl text-sm font-bold ${
                  item.isCompleted 
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 ring-2 ring-emerald-200/40 dark:ring-emerald-700/40" 
                    : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30 ring-1 ring-blue-200/40 dark:ring-blue-700/40"
                }`}
              >
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg sm:text-xl font-bold tracking-tight transition-all duration-300 leading-tight ${
                    item.isCompleted 
                      ? "text-emerald-700 dark:text-emerald-300 line-through decoration-2 decoration-emerald-500/70" 
                      : "text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Description with improved typography */}
            <p
              className={`text-base sm:text-lg leading-relaxed transition-all duration-300 ${
                item.isCompleted 
                  ? "text-emerald-600 dark:text-emerald-400 opacity-75" 
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {item.description}
            </p>

            {hasDetails && (
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`px-4 py-3 h-auto rounded-xl transition-all duration-300 ${
                  isExpanded 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-700/40 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/40'
                } focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-transparent`}
                aria-expanded={isExpanded}
                aria-controls={`details-${item.id}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {isExpanded ? "세부사항 접기" : "세부사항 보기"}
                  </span>
                  <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </Button>
            )}
          </div>
        </div>
        
        {isExpanded && hasDetails && (
          <div 
            id={`details-${item.id}`}
            className="mt-8 space-y-6 animate-slide-up border-t border-slate-200/60 dark:border-slate-700/40 pt-6"
            role="region"
            aria-label="상세 정보"
          >
            {item.details?.price && (
              <div className="bg-gradient-to-br from-amber-50/80 via-yellow-50/60 to-orange-50/80 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100">예상 비용</h4>
                </div>
                <div className="ml-16">
                  <div className="text-lg font-semibold text-amber-800 dark:text-amber-200 bg-white/60 dark:bg-amber-950/40 rounded-xl px-4 py-3 border border-amber-200/40 dark:border-amber-700/40">
                    💰 {item.details?.price}
                  </div>
                </div>
              </div>
            )}

            {item.details?.location && (
              <div className="bg-gradient-to-br from-sky-50/80 via-blue-50/60 to-cyan-50/80 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-cyan-950/30 border border-sky-200/50 dark:border-sky-700/30 rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200/50 dark:shadow-sky-900/30">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-sky-900 dark:text-sky-100">위치 정보</h4>
                </div>
                <div className="ml-16">
                  <div className="text-lg font-semibold text-sky-800 dark:text-sky-200 bg-white/60 dark:bg-sky-950/40 rounded-xl px-4 py-3 border border-sky-200/40 dark:border-sky-700/40">
                    📍 {item.details?.location}
                  </div>
                </div>
              </div>
            )}

            {/* Steps Section - New Structured Format */}
            {(getStructuredSteps().length > 0) && (
              <div className="bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-indigo-50/80 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-indigo-950/30 border border-violet-200/50 dark:border-violet-700/30 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200/50 dark:shadow-violet-900/30">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-violet-900 dark:text-violet-100">실행 단계</h4>
                </div>
                <div className="space-y-5 ml-16">
                  {getStructuredSteps().map((step, stepIndex) => (
                    <div key={stepIndex} className="bg-white/60 dark:bg-violet-950/40 border border-violet-200/40 dark:border-violet-700/40 rounded-xl p-5">
                      {/* Step Header */}
                      <div className="flex items-start gap-4 mb-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
                          {step.order}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-lg font-bold text-violet-900 dark:text-violet-100 mb-2">
                            {step.title}
                          </h5>
                          <p className="text-base text-violet-800 dark:text-violet-200 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Step Metadata */}
                      {(step.estimatedTime || step.difficulty) && (
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-violet-200/40 dark:border-violet-700/40">
                          {step.estimatedTime && (
                            <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{step.estimatedTime}</span>
                            </div>
                          )}
                          {step.difficulty && (
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingUp className="w-4 h-4" />
                              <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                                step.difficulty === '쉬움' 
                                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                  : step.difficulty === '보통'
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              }`}>
                                {step.difficulty}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Section - Legacy Format */}
            {(item.details?.tips && item.details.tips.length > 0) && (
              <div className="bg-gradient-to-br from-amber-50/80 via-yellow-50/60 to-orange-50/80 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100">유용한 팁</h4>
                </div>
                <ul className="space-y-3 ml-16">
                  {item.details.tips.map((tip, tipIndex) => {
                    // tip이 StepInfo 객체인지 문자열인지 확인
                    const isStepInfoTip = typeof tip === 'object' && tip !== null && 'description' in tip
                    
                    if (isStepInfoTip) {
                      // StepInfo 객체인 경우 구조화된 형태로 렌더링
                      return (
                        <li key={tipIndex} className="bg-white/60 dark:bg-amber-950/40 border border-amber-200/40 dark:border-amber-700/40 rounded-xl p-5">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-lg">
                              {tip.order}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">
                                {tip.title}
                              </h5>
                              <p className="text-base text-amber-800 dark:text-amber-200 leading-relaxed">
                                {tip.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* 메타데이터 */}
                          {(tip.estimatedTime || tip.difficulty) && (
                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-amber-200/40 dark:border-amber-700/40">
                              {tip.estimatedTime && (
                                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                  <Clock className="w-4 h-4" />
                                  <span className="font-medium">{tip.estimatedTime}</span>
                                </div>
                              )}
                              {tip.difficulty && (
                                <div className="flex items-center gap-2 text-sm">
                                  <TrendingUp className="w-4 h-4" />
                                  <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                                    tip.difficulty === '쉬움' 
                                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                      : tip.difficulty === '보통'
                                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                  }`}>
                                    {tip.difficulty}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      )
                    } else {
                      // 기존 문자열 형태인 경우
                      return (
                        <li key={tipIndex} className="text-base text-amber-800 dark:text-amber-200 flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200/80 dark:bg-amber-800/60 flex items-center justify-center mr-3 mt-1">
                            <span className="text-amber-700 dark:text-amber-300 text-sm font-bold">•</span>
                          </div>
                          <span className="leading-relaxed pt-1 flex-1">{tip}</span>
                        </li>
                      )
                    }
                  })}
                </ul>
              </div>
            )}

            {item.details?.contacts && item.details.contacts.length > 0 && (
              <div className="bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-fuchsia-50/80 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-fuchsia-950/30 border border-rose-200/50 dark:border-rose-700/30 rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-rose-900 dark:text-rose-100">연락처</h4>
                </div>
                <div className="space-y-4 ml-16">
                  {item.details?.contacts?.map((contact, contactIndex) => (
                    <div key={contactIndex} className="bg-white/60 dark:bg-rose-950/40 border border-rose-200/40 dark:border-rose-700/40 rounded-xl p-4">
                      <div className="text-lg font-bold mb-3 text-rose-900 dark:text-rose-100">{contact.name}</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-rose-200/80 dark:bg-rose-800/60 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          </div>
                          <a 
                            href={`tel:${contact.phone}`} 
                            className="text-base font-medium text-blue-600 dark:text-blue-400"
                            aria-label={`${contact.name}에게 전화하기`}
                          >
                            {contact.phone}
                          </a>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-rose-200/80 dark:bg-rose-800/60 rounded-lg flex items-center justify-center">
                              <Mail className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            </div>
                            <a 
                              href={`mailto:${contact.email}`} 
                              className="text-base font-medium text-blue-600 dark:text-blue-400"
                              aria-label={`${contact.name}에게 이메일 보내기`}
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.details?.links && item.details.links.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-700/30 rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">유용한 링크</h4>
                </div>
                <div className="space-y-3 ml-16">
                  {item.details?.links?.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-white/60 dark:bg-emerald-950/40 border border-emerald-200/40 dark:border-emerald-700/40 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
                      aria-label={`새 탭에서 ${link.title} 열기`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-200/80 dark:bg-emerald-800/60 rounded-xl flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-base text-emerald-800 dark:text-emerald-200 font-medium flex-1">
                        {link.title}
                      </span>
                      <div>
                        <ExternalLink className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
