import { MockAd } from "./MockAd"
import { PropellerAd } from "./PropellerAd"

interface AdDisplayProps {
  type?: 'banner' | 'square' | 'vertical'
  className?: string
}

/**
 * 환경에 따라 실제 PropellerAds 광고 또는 Mock 광고를 표시하는 컴포넌트입니다.
 * @param {AdDisplayProps} props - 광고 표시 컴포넌트의 props입니다.
 * @param {'banner' | 'square' | 'vertical'} props.type - 광고 레이아웃 타입입니다.
 * @param {string} props.className - 추가 CSS 클래스입니다.
 * @returns {JSX.Element} 렌더링된 광고 컴포넌트입니다.
 */
export function AdDisplay({ type = 'banner', className = '' }: AdDisplayProps) {
  const useMockAds = import.meta.env.VITE_USE_MOCK_ADS === 'true'
  const zoneId = import.meta.env.VITE_PROPELLER_ZONE_ID as string

  // PropellerAds 설정이 없거나 개발 환경에서는 Mock 광고 사용
  if (useMockAds || !zoneId || zoneId === 'YOUR_ZONE_ID') {
    return <MockAd type={type} className={className} />
  }

  // 광고 크기 결정
  const getAdSize = () => {
    switch (type) {
      case 'square':
        return { width: 300, height: 300 }
      case 'vertical':
        return { width: 160, height: 600 }
      default:
        return { width: 728, height: 90 } // 배너
    }
  }

  const { width, height } = getAdSize()

  return (
    <PropellerAd
      zoneId={zoneId}
      adType="banner"
      width={width}
      height={height}
      className={className}
    />
  )
}