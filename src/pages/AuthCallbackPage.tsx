import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../hooks/useAuth'

/**
 * 구글 OAuth 인증 후 콜백을 처리하는 페이지입니다.
 * 인증 코드를 받아서 백엔드로 전송하고 토큰을 받아옵니다.
 */
export default function AuthCallbackPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { login } = useAuth()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function handleCallback() {
            const code = searchParams.get('code')
            const errorParam = searchParams.get('error')

            if (errorParam) {
                setError(`인증 중 오류가 발생했습니다: ${errorParam}`)
                return
            }

            if (!code) {
                setError('인증 코드가 없습니다.')
                return
            }

            try {
                // 구글 인증 코드를 백엔드로 전송
                const success = await login(code)

                if (success) {
                    // 로그인 성공 시 홈으로 이동
                    void navigate('/', { replace: true })
                } else {
                    setError('로그인에 실패했습니다. 다시 시도해주세요.')
                }
            } catch (error) {
                console.error('Auth callback error:', error)
                setError('로그인 처리 중 오류가 발생했습니다.')
            }
        }

        void handleCallback()
    }, [searchParams, login, navigate])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-red-600">로그인 오류</CardTitle>
                        <CardDescription className="text-center">
                            {error}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <button
                            onClick={() => void navigate('/login')}
                            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            다시 로그인하기
                        </button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">로그인 중...</CardTitle>
                    <CardDescription className="text-center">
                        잠시만 기다려주세요
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        </div>
    )
} 