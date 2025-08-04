"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Smartphone } from "lucide-react"
import { isKakaoTalkInAppBrowser, redirectToExternalBrowser, KAKAO_MESSAGES } from "../lib/kakao-utils"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface KakaoRedirectProps {
  /** 자동 리다이렉트 여부 (기본값: true) */
  autoRedirect?: boolean
  /** 리다이렉트 지연 시간 (ms, 기본값: 2000) */
  delay?: number
  /** 리다이렉트할 URL (기본값: 현재 URL) */
  targetUrl?: string
}

/**
 * 카카오톡 인앱 브라우저에서 외부 브라우저로 리다이렉트를 처리하는 컴포넌트
 */
export function KakaoRedirect({ 
  autoRedirect = true, 
  delay = 2000,
  targetUrl 
}: KakaoRedirectProps) {
  const [isKakao, setIsKakao] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [countdown, setCountdown] = useState(Math.floor(delay / 1000))

  useEffect(() => {
    // 카카오톡 인앱 브라우저 감지
    if (isKakaoTalkInAppBrowser()) {
      setIsKakao(true)
      console.log('🔍 카카오톡 인앱 브라우저 감지됨')
      
      if (autoRedirect) {
        setIsRedirecting(true)
        
        // 카운트다운 타이머
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              handleRedirect()
              return 0
            }
            return prev - 1
          })
        }, 1000)
        
        return () => clearInterval(countdownInterval)
      }
    }
  }, [autoRedirect, delay, targetUrl])

  const handleRedirect = () => {
    setIsRedirecting(true)
    redirectToExternalBrowser(targetUrl)
  }

  const handleManualRedirect = () => {
    handleRedirect()
  }

  // 카카오톡 인앱 브라우저가 아니면 렌더링하지 않음
  if (!isKakao) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <CardTitle className="text-lg">
            {KAKAO_MESSAGES.DETECTED}
          </CardTitle>
          <CardDescription className="text-center">
            {KAKAO_MESSAGES.REDIRECTING}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isRedirecting && autoRedirect ? (
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">
                {countdown > 0 ? `${countdown}초 후 자동으로 이동합니다...` : '외부 브라우저로 이동 중...'}
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                더 나은 사용 경험을 위해 외부 브라우저에서 사용해주세요.
              </p>
              
              <Button 
                onClick={handleManualRedirect}
                className="w-full"
                disabled={isRedirecting}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {KAKAO_MESSAGES.MANUAL_REDIRECT}
              </Button>
              
              <p className="text-xs text-muted-foreground">
                자동 이동이 되지 않으면 위 버튼을 클릭해주세요.
              </p>
            </div>
          )}
          
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              💡 카카오톡에서 링크를 클릭할 때 "외부 브라우저에서 열기"를 선택하시면 이 화면을 보지 않으실 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}