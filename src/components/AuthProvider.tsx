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
            if (isLoggedIn()) {
                try {
                    const response = await getCurrentUser()
                    if (response.success && response.data) {
                        setUser(response.data)
                    } else {
                        // 토큰이 유효하지 않은 경우 정리
                        clearTokens()
                    }
                } catch (error) {
                    console.error('Failed to get current user:', error)
                    clearTokens()
                }
            }
            setIsLoading(false)
        }

        void checkAuthStatus()
    }, [])

    const login = async (googleToken: string): Promise<boolean> => {
        try {
            setIsLoading(true)
            const response = await loginWithGoogle(googleToken)

            if (response.success && response.data) {
                const { user: userData, accessToken, refreshToken } = response.data
                saveTokens(accessToken, refreshToken)
                setUser(userData)
                return true
            } else {
                console.error('Login failed:', response.error)
                return false
            }
        } catch (error) {
            console.error('Login error:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true)
            await logoutService()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            clearTokens()
            setUser(null)
            setIsLoading(false)
        }
    }

    const refreshUser = async (): Promise<void> => {
        if (!isLoggedIn()) return

        try {
            const response = await getCurrentUser()
            if (response.success && response.data) {
                setUser(response.data)
            }
        } catch (error) {
            console.error('Failed to refresh user:', error)
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

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
} 