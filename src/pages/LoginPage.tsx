"use client"

import { GoogleIcon } from "@/components/icons/google-icon"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../hooks/useAuth"

// 구글 Sign-In 라이브러리 타입 정의
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
          prompt: () => void
        }
      }
    }
  }
}

/**
 * 사용자 로그인을 위한 페이지 컴포넌트입니다.
 * 구글 ID 토큰을 통한 로그인을 지원합니다.
 * @returns {JSX.Element} 로그인 페이지를 렌더링합니다.
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 구글 Sign-In 라이브러리 로드
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: (import.meta.env as { VITE_GOOGLE_CLIENT_ID?: string }).VITE_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
        })
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleCredentialResponse = (response: { credential: string }) => {
    // 비동기 로그인 처리를 별도 함수로 분리
    void processGoogleLogin(response.credential)
  }

  const processGoogleLogin = async (credential: string) => {
    console.log('🚀 Google 로그인 프로세스 시작')
    setIsLoading(true)
    try {
      console.log('🔑 구글 credential 받음, 로그인 함수 호출')
      const success = await login(credential) // ID 토큰을 직접 전송
      console.log('📊 로그인 결과:', success)

      if (success) {
        console.log('🎯 로그인 성공! 잠시 대기 후 홈으로 이동...')

        // 로그인 성공 토스트 표시
        toast({
          title: "로그인 성공!",
          description: "환영합니다! 홈페이지로 이동합니다.",
          variant: "default",
        })

        // 상태 업데이트가 완료될 시간을 주기 위해 약간의 지연
        setTimeout(() => {
          console.log('🏠 홈으로 이동 중...')
          void navigate('/', { replace: true })
        }, 100)
      } else {
        console.error('❌ 로그인에 실패했습니다.')

        // 로그인 실패 토스트 표시
        toast({
          title: "로그인 실패",
          description: "로그인에 실패했습니다. 다시 시도해주세요.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("💥 Google login error:", error instanceof Error ? error.message : 'Unknown error')

      // 로그인 에러 토스트 표시
      toast({
        title: "로그인 오류",
        description: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      console.log('🏁 LoginPage 로딩 상태 해제')
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt() // One Tap 프롬프트 표시
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-6 left-6">
        <Link to="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            홈으로 돌아가기
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-sm animate-fade-in glass">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">시작하기</CardTitle>
          <CardDescription>구글 계정으로 간편하게 시작하세요.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full bg-transparent py-3 text-base"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <GoogleIcon className="mr-3 h-5 w-5" />
                Google 계정으로 로그인
              </>
            )}
          </Button>
        </CardContent>

        <CardFooter>
          <p className="text-xs text-center text-muted-foreground w-full">
            로그인 시{" "}
            <Link to="/terms" className="underline hover:text-primary">
              이용약관
            </Link>
            과{" "}
            <Link to="/privacy" className="underline hover:text-primary">
              개인정보처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
