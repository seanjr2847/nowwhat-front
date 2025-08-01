"use client"

import { ChevronDown, ChevronUp, DollarSign, ExternalLink, Lightbulb, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { toggleChecklistItem } from "../../lib/api"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Checkbox } from "../ui/checkbox"

interface ChecklistItemData {
  id: string
  title: string
  description: string
  details: {
    tips?: string[]
    contacts?: { name: string; phone: string; email?: string }[]
    links?: { title: string; url: string }[]
    price?: string
    location?: string
  }
  isCompleted: boolean
}

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
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const hasDetails =
    (item.details?.tips?.length ?? 0) > 0 ||
    (item.details?.contacts?.length ?? 0) > 0 ||
    (item.details?.links?.length ?? 0) > 0 ||
    (item.details?.price != null && item.details?.price !== '') ||
    (item.details?.location != null && item.details?.location !== '')

  // 체크리스트 항목 토글 API 연결
  const handleToggle = async (itemId: string) => {
    if (checklistId == null || checklistId === '' || isUpdating) return

    try {
      setIsUpdating(true)
      const newIsCompleted = !item.isCompleted
      const response = await toggleChecklistItem(checklistId, itemId, newIsCompleted)

      if (response.success) {
        onToggle(itemId)
      } else {
        console.error("체크리스트 항목 토글 실패:", response.error)
        alert("항목 상태 변경에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("체크리스트 항목 토글 오류:", error)
      alert("항목 상태 변경 중 오류가 발생했습니다.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card
      className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 transition-all duration-300 rounded-2xl shadow-xl ${item.isCompleted ? "border-green-500/50 bg-green-500/10" : "hover:border-blue-500/50"
        }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center mt-1">
            <Checkbox
              id={`item-${item.id}`}
              checked={item.isCompleted}
              onCheckedChange={() => handleToggle(item.id)}
              disabled={isUpdating}
              className="w-5 h-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors duration-300 ${item.isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <h3
                    className={`text-lg font-semibold transition-all duration-300 ${item.isCompleted ? "text-green-300 line-through" : "text-foreground"
                      }`}
                  >
                    {item.title}
                  </h3>
                </div>

                <p
                  className={`text-muted-foreground mb-3 transition-all duration-300 ${item.isCompleted ? "opacity-60" : ""}`}
                >
                  {item.description}
                </p>

                {hasDetails && (
                  <Button
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm p-2 h-auto rounded-lg transition-all duration-300 border border-blue-400/20"
                  >
                    <span className="text-sm font-medium mr-2">{isExpanded ? "간단히 보기" : "자세히 보기"}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            {isExpanded && hasDetails && (
              <div className="mt-4 space-y-4 animate-slide-up">
                {item.details?.price && (
                  <div className="flex items-center space-x-3 p-3 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-500/30">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <div>
                      <span className="text-sm font-medium text-yellow-300">예상 비용</span>
                      <p className="text-yellow-200">{item.details?.price}</p>
                    </div>
                  </div>
                )}

                {item.details?.location && (
                  <div className="flex items-center space-x-3 p-3 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-sm font-medium text-purple-300">위치</span>
                      <p className="text-purple-200">{item.details?.location}</p>
                    </div>
                  </div>
                )}

                {item.details?.tips && item.details.tips.length > 0 && (
                  <div className="relative space-y-3 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 backdrop-blur-sm">
                    {/* 반짝이는 효과 배경 */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-amber-400/5 to-transparent animate-shimmer"></div>
                    
                    {/* 헤더 섹션 */}
                    <div className="relative flex items-center space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-pulse"></div>
                        <div className="relative p-2 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                        </div>
                      </div>
                      <div className="relative">
                        <span className="text-sm font-semibold bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                          💡 유용한 팁
                        </span>
                        <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-amber-400/50 via-orange-400/50 to-yellow-400/50"></div>
                      </div>
                    </div>
                    
                    {/* 팁 리스트 */}
                    <div className="relative space-y-3">
                      {item.details?.tips?.map((tip, tipIndex) => (
                        <div 
                          key={tipIndex} 
                          className="group flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-400/10 hover:border-amber-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                        >
                          {/* 팁 인덱스 번호 */}
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xs font-bold text-amber-300">{tipIndex + 1}</span>
                          </div>
                          
                          {/* 팁 내용 */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-amber-100 leading-relaxed group-hover:text-amber-50 transition-colors duration-300">
                              {tip}
                            </p>
                          </div>
                          
                          {/* 호버 시 반짝이는 효과 */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-1 h-1 rounded-full bg-amber-400 animate-ping"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 하단 장식 효과 */}
                    <div className="relative mt-2">
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                    </div>
                  </div>
                )}

                {item.details?.contacts && item.details.contacts.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-blue-300 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      연락처
                    </span>
                    <div className="space-y-2 ml-6">
                      {item.details?.contacts?.map((contact, contactIndex) => (
                        <div key={contactIndex} className="text-sm">
                          <div className="text-foreground font-medium">{contact.name}</div>
                          <div className="text-blue-400">{contact.phone}</div>
                          {contact.email && (
                            <div className="text-muted-foreground flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {contact.email}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.details?.links && item.details.links.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-green-300 flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      유용한 링크
                    </span>
                    <div className="space-y-2 ml-6">
                      {item.details?.links?.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-400 hover:text-green-300 transition-colors duration-200 flex items-center group"
                        >
                          <ExternalLink className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
