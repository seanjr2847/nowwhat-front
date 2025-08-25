import { useState } from "react"
import type { CreditErrorResponse } from "../lib/api"
import { CreditModal } from "../components/credits/credit-modal"

/**
 * 크레딧 부족 상황을 위한 전역 모달 훅
 * @returns {Object} showModal 함수와 Modal 컴포넌트
 */
export function useCreditModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [errorData, setErrorData] = useState<CreditErrorResponse>()

  const showModal = (data: CreditErrorResponse) => {
    setErrorData(data)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setErrorData(undefined)
  }

  const Modal = () => (
    <CreditModal 
      isOpen={isOpen} 
      errorData={errorData} 
      onClose={closeModal} 
    />
  )

  return { showModal, Modal }
}