"use client"

import { Heart, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

interface FeedbackSectionProps {
  onFeedback: (isPositive: boolean) => void
  feedbackGiven: boolean
}

/**
 * 생성된 체크리스트에 대한 사용자 피드백을 받는 섹션 컴포넌트입니다.
 * @param {FeedbackSectionProps} props - 피드백 섹션 컴포넌트의 props입니다.
 * @param {(isPositive: boolean) => void} props.onFeedback - 피드백 제출 시 호출될 함수입니다.
 * @param {boolean} props.feedbackGiven - 피드백이 이미 제출되었는지 여부입니다.
 * @returns {JSX.Element} 렌더링된 피드백 섹션입니다.
 */
export function FeedbackSection({ onFeedback, feedbackGiven }: FeedbackSectionProps) {
  const [showThanks, setShowThanks] = useState(feedbackGiven)

  const handleFeedback = (isPositive: boolean) => {
    // TODO: API 연결 - POST /feedback
    // 피드백 제출
    // (async () => {
    //   const response = await fetch('/api/feedback', {
    //     method: 'POST',
    //     headers: { 
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    //     },
    //     body: JSON.stringify({ 
    //       checklistId: checklistId, 
    //       isPositive: isPositive,
    //       timestamp: new Date().toISOString()
    //     })
    //   });
    // })();

    onFeedback(isPositive)
    setShowThanks(true)
  }

  return (
    <div className="mb-8">
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl shadow-xl">
        <CardContent className="p-6 text-center">
          {showThanks ? (
            <div className="animate-scale-in">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">감사합니다!</h3>
              <p className="text-muted-foreground">
                소중한 피드백을 주셔서 감사합니다. 더 나은 서비스를 만들어가겠습니다.
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">이 체크리스트가 도움이 되었나요?</h3>
              <p className="text-muted-foreground mb-6">여러분의 피드백이 서비스 개선에 큰 도움이 됩니다</p>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => handleFeedback(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 group shadow-lg"
                >
                  <ThumbsUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  도움됐어요
                </Button>

                <Button
                  onClick={() => handleFeedback(false)}
                  variant="outline"
                  className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 text-muted-foreground hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 group shadow-lg"
                >
                  <ThumbsDown className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  아쉬워요
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
