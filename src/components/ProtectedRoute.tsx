import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
    children: ReactNode
    redirectTo?: string
}

/**
 * 인증된 사용자만 접근할 수 있는 라우트를 보호하는 컴포넌트입니다.
 * 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */
export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />
    }

    return <>{children}</>
} 