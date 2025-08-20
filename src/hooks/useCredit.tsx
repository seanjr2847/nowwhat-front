"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCredits, type CreditInfo, type CreditErrorResponse } from '../lib/api'
import { useToast } from './use-toast'

interface CreditContextType {
  credits: number
  status: "sufficient" | "insufficient"
  isLoading: boolean
  refreshCredits: () => Promise<void>
  decrementCredits: (amount: number) => void
  showCreditModal: (errorData: CreditErrorResponse) => void
}

const CreditContext = createContext<CreditContextType | null>(null)

/**
 * 크레딧 관련 상태를 관리하는 Context Provider 컴포넌트입니다.
 * @param {Object} props - Provider props
 * @param {ReactNode} props.children - 자식 컴포넌트들
 * @returns {JSX.Element} 크레딧 Context Provider
 */
export function CreditProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(0)
  const [status, setStatus] = useState<"sufficient" | "insufficient">("sufficient")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // 크레딧 정보 새로고침
  const refreshCredits = async () => {
    try {
      setIsLoading(true)
      const response = await getCredits()

      if (response.success && response.data) {
        console.log('💎 크레딧 정보 업데이트:', response.data)
        setCredits(response.data.credits)
        setStatus(response.data.status)
      } else {
        console.error('크레딧 조회 실패:', response.error)
        // 에러가 있어도 기본값 유지 (로그인 안된 상태 등)
      }
    } catch (error) {
      console.error('크레딧 조회 에러:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 크레딧 차감 (낙관적 업데이트)
  const decrementCredits = (amount: number) => {
    setCredits(prev => {
      const newCredits = Math.max(0, prev - amount)
      setStatus(newCredits > 0 ? "sufficient" : "insufficient")
      return newCredits
    })
  }

  // 크레딧 부족 모달 표시
  const showCreditModal = (errorData: CreditErrorResponse) => {
    console.log('💎 크레딧 부족 모달 표시:', errorData)
    
    // 실제 크레딧 정보로 상태 업데이트
    setCredits(errorData.current_credits)
    setStatus("insufficient")
    
    toast({
      title: "💎 크레딧이 부족합니다",
      description: errorData.message,
      variant: "destructive",
      duration: 5000,
    })
  }

  // 초기 크레딧 정보 로드
  useEffect(() => {
    void refreshCredits()
  }, [])

  const value = {
    credits,
    status,
    isLoading,
    refreshCredits,
    decrementCredits,
    showCreditModal
  }

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  )
}

/**
 * 크레딧 상태를 사용하기 위한 커스텀 훅입니다.
 * @returns {CreditContextType} 크레딧 관련 상태와 함수들
 * @throws {Error} CreditProvider 외부에서 사용 시 에러 발생
 */
export function useCredit() {
  const context = useContext(CreditContext)
  
  if (!context) {
    throw new Error('useCredit must be used within a CreditProvider')
  }
  
  return context
}