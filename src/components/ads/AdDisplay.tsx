import { AdSenseAd } from "./AdSenseAd"
import { MockAd } from "./MockAd"

interface AdDisplayProps {
  type?: 'banner' | 'square' | 'vertical'
  className?: string
}

/**
 * 환경에 따라 실제 AdSense 광고 또는 Mock 광고를 표시하는 컴포넌트입니다.
 * @param {AdDisplayProps} props - 광고 표시 컴포넌트의 props입니다.
 * @param {'banner' | 'square' | 'vertical'} props.type - 광고 레이아웃 타입입니다.
 * @param {string} props.className - 추가 CSS 클래스입니다.
 * @returns {JSX.Element} 렌더링된 광고 컴포넌트입니다.
 */
export function AdDisplay({ type = 'banner', className = '' }: AdDisplayProps) {
  const useMockAds = import.meta.env.VITE_USE_MOCK_ADS === 'true'
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID
  
  // AdSense 설정이 없거나 개발 환경에서는 Mock 광고 사용
  if (useMockAds || !publisherId || publisherId === 'ca-pub-YOUR_PUBLISHER_ID') {
    return <MockAd type={type} className={className} />
  }

  // 광고 슬롯 ID 결정
  const getAdSlot = () => {
    switch (type) {
      case 'square':
        return import.meta.env.VITE_ADSENSE_AD_SLOT_SQUARE
      case 'vertical':
        return import.meta.env.VITE_ADSENSE_AD_SLOT_SQUARE // 세로형도 사각형 슬롯 사용
      default:
        return import.meta.env.VITE_ADSENSE_AD_SLOT_BANNER
    }
  }

  return (
    <AdSenseAd 
      adSlot={getAdSlot()} 
      adFormat={type === 'banner' ? 'horizontal' : 'rectangle'}
      className={className}
    />
  )
}