import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextType } from '../hooks/useAuth'
import type { User } from '../lib/api'
import {
    clearTokens,
    getCurrentUser,
    isLoggedIn,
    loginWithGoogle,
    logout as logoutService,
    saveTokens
} from '../lib/auth'

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // 초기 로드 시 사용자 정보 확인
    useEffect(() => {
        async function checkAuthStatus() {
            console.log('🔍 초기 인증 상태 확인 시작')
            if (isLoggedIn()) {
                console.log('🔑 로컬 토큰 발견, 사용자 정보 조회 중...')
                try {
                    const response = await getCurrentUser()
                    if (response.success && response.data) {
                        console.log('✅ 사용자 정보 조회 성공:', response.data)
                        setUser(response.data)
                    } else {
                        console.log('❌ 사용자 정보 조회 실패, 토큰 정리')
                        // 토큰이 유효하지 않은 경우 정리
                        clearTokens()
                    }
                } catch (error) {
                    console.error('💥 사용자 정보 조회 에러:', error)
                    clearTokens()
                }
            } else {
                console.log('🚫 로컬 토큰 없음')
            }
            console.log('🏁 초기 로딩 완료')
            setIsLoading(false)
        }

        void checkAuthStatus()
    }, [])

    const login = async (googleToken: string): Promise<boolean> => {
        try {
            console.log('🔄 로그인 시작...')
            setIsLoading(true)
            const response = await loginWithGoogle(googleToken)
            console.log('📡 로그인 응답:', response)

            if (response.success && response.data) {
                const { user: userData, accessToken, refreshToken } = response.data
                console.log('✅ 로그인 성공, 토큰 저장 중...')
                saveTokens(accessToken, refreshToken)
                console.log('👤 사용자 정보 설정:', userData)
                setUser(userData)
                console.log('🎉 로그인 프로세스 완료')
                return true
            } else {
                console.error('❌ 로그인 실패:', response.error)
                return false
            }
        } catch (error) {
            console.error('💥 로그인 에러:', error)
            return false
        } finally {
            console.log('🏁 로딩 상태 해제')
            setIsLoading(false)
        }
    }

    const logout = async (): Promise<void> => {
        try {
            console.log('🔄 AuthProvider 로그아웃 시작')
            setIsLoading(true)
            console.log('📡 서버에 로그아웃 요청 전송')
            await logoutService()
            console.log('✅ 서버 로그아웃 완료')
        } catch (error) {
            console.error('💥 서버 로그아웃 에러 (토큰은 삭제됨):', error)
        } finally {
            console.log('🧹 로컬 토큰 및 사용자 정보 정리')
            clearTokens()
            setUser(null)
            setIsLoading(false)
            console.log('🎯 로그아웃 프로세스 완료')
        }
    }

    const refreshUser = async (): Promise<void> => {
        if (!isLoggedIn()) return

        try {
            const response = await getCurrentUser()
            if (response.success && response.data) {
                setUser(response.data)
            } else {
                // 사용자 정보 조회 실패 시 (토큰 만료 등)
                console.log('❌ 사용자 정보 조회 실패, 로그아웃 처리:', response.error)
                if (response.error?.includes('인증') || response.error?.includes('만료')) {
                    // 인증 에러인 경우 자동 로그아웃
                    await logout()
                }
            }
        } catch (error) {
            console.error('💥 사용자 정보 새로고침 에러:', error)
            // 네트워크 에러가 아닌 인증 에러인 경우에만 로그아웃
            if (error instanceof Error && error.message.includes('인증')) {
                await logout()
            }
        }
    }

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
    }

    // 인증 상태 변화 로깅
    console.log('🔄 AuthProvider 상태 업데이트:', {
        hasUser: !!user,
        isLoading,
        isAuthenticated: !!user,
        userName: user?.name
    })

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
} 