"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { GoogleIcon } from "@/components/icons/google-icon"

/**
 * 사용자 로그인을 위한 페이지 컴포넌트입니다.
 * 구글 계정을 통한 로그인만 지원합니다.
 * @returns {JSX.Element} 로그인 페이지를 렌더링합니다.
 */
export default function LoginPage() {
  const router = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = () => {
    setIsLoading(true)
    // TODO: API 연동 - 실제 Google OAuth 로그인 로직을 구현해야 합니다.
    // 현재는 2초 후 성공으로 가정하고 홈으로 이동합니다.
    setTimeout(() => {
      console.log("Google login successful (mock)")
      setIsLoading(false)
      navigate("/")
    }, 2000)
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
