"use client"

import { GoogleIcon } from "@/components/icons/google-icon"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
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
    setIsLoading(true)
    try {
      const success = await login(credential) // ID 토큰을 직접 전송

      if (success) {
        void navigate('/', { replace: true })
      } else {
        console.error('로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error("Google login error:", error instanceof Error ? error.message : 'Unknown error')
    } finally {
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
