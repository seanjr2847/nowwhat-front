"use client"

import { ChevronDown, DollarSign, ExternalLink, Lightbulb, Mail, MapPin, Phone } from "lucide-react"
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
      className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 transition-all duration-300 rounded-2xl shadow-xl ${item.isCompleted ? "border-green-500/50 bg-green-500/10" : "hover:border-brand-primary-500/50"
        }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center mt-1">
            <Checkbox
              id={`item-${item.id}`}
              checked={item.isCompleted}
              onCheckedChange={() => void handleToggle(item.id)}
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
                    className={`
                      group relative overflow-hidden backdrop-blur-sm p-3 h-auto rounded-xl transition-all duration-300 
                      ${isExpanded 
                        ? 'text-brand-primary-300 bg-brand-primary-500/30 border border-brand-primary-400/40' 
                        : 'text-brand-primary-400 hover:text-brand-primary-300 hover:bg-brand-primary-500/20 border border-brand-primary-400/20 hover:border-brand-primary-400/40'
                      }
                      hover:shadow-lg hover:shadow-brand-primary-500/25 focus:ring-2 focus:ring-brand-primary-500/50 focus:ring-offset-2 focus:ring-offset-transparent
                    `}
                    aria-expanded={isExpanded}
                    aria-controls={`details-${item.id}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="text-sm font-medium mr-2 relative z-10">
                      {isExpanded ? "간단히 보기" : "자세히 보기"}
                    </span>
                    <div className={`transition-transform duration-300 relative z-10 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </Button>
                )}
              </div>
            </div>

            {isExpanded && hasDetails && (
              <div 
                id={`details-${item.id}`}
                className="mt-6 space-y-6 animate-slide-up"
                role="region"
                aria-label="상세 정보"
              >
                {item.details?.price && (
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                      </div>
                      <span className="text-base font-semibold text-yellow-300">예상 비용</span>
                    </div>
                    <div className="pl-11">
                      <span className="inline-flex items-center px-3 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 font-medium">
                        💰 {item.details?.price}
                      </span>
                    </div>
                  </div>
                )}

                {item.details?.location && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-base font-semibold text-blue-300">위치 정보</span>
                    </div>
                    <div className="pl-11">
                      <span className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-200 font-medium">
                        📍 {item.details?.location}
                      </span>
                    </div>
                  </div>
                )}

                {item.details?.tips && item.details.tips.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className="text-base font-semibold text-orange-300">유용한 팁</span>
                    </div>
                    <ul className="space-y-3 pl-11">
                      {item.details?.tips?.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-sm text-muted-foreground flex items-start group">
                          <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                            <span className="text-orange-400 text-xs font-bold">•</span>
                          </div>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.details?.contacts && item.details.contacts.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-base font-semibold text-purple-300">연락처</span>
                    </div>
                    <div className="space-y-4 pl-11">
                      {item.details?.contacts?.map((contact, contactIndex) => (
                        <div key={contactIndex} className="bg-white/5 border border-purple-500/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                          <div className="text-foreground font-semibold mb-2">{contact.name}</div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Phone className="w-3 h-3 text-purple-400" />
                            <a 
                              href={`tel:${contact.phone}`} 
                              className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
                              aria-label={`${contact.name}에게 전화하기`}
                            >
                              {contact.phone}
                            </a>
                          </div>
                          {contact.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-purple-400" />
                              <a 
                                href={`mailto:${contact.email}`} 
                                className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
                                aria-label={`${contact.name}에게 이메일 보내기`}
                              >
                                {contact.email}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.details?.links && item.details.links.length > 0 && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-base font-semibold text-green-300">유용한 링크</span>
                    </div>
                    <div className="space-y-3 pl-11">
                      {item.details?.links?.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center space-x-3 p-3 bg-white/5 border border-green-500/10 rounded-lg hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-200 focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
                          aria-label={`새 탭에서 ${link.title} 열기`}
                        >
                          <div className="w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                            <ExternalLink className="w-3 h-3 text-green-400 group-hover:scale-110 transition-transform duration-200" />
                          </div>
                          <span className="text-sm text-green-300 hover:text-green-200 transition-colors font-medium flex-1">
                            {link.title}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ExternalLink className="w-3 h-3 text-green-400" />
                          </div>
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
