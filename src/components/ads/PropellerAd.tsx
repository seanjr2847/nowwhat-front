import { useEffect, useRef } from "react"

interface PropellerAdProps {
  zoneId: string
  adType?: 'banner' | 'popup' | 'native'
  width?: number
  height?: number
  className?: string
}

declare global {
  interface Window {
    propellerads_site_id?: string
    propellerads_loaded?: boolean
  }
}

/**
 * PropellerAds 광고를 표시하는 컴포넌트입니다.
 * @param {PropellerAdProps} props - PropellerAds 광고 컴포넌트의 props입니다.
 * @param {string} props.zoneId - PropellerAds Zone ID입니다.
 * @param {'banner' | 'popup' | 'native'} props.adType - 광고 타입입니다.
 * @param {number} props.width - 광고 너비입니다.
 * @param {number} props.height - 광고 높이입니다.
 * @param {string} props.className - 추가 CSS 클래스입니다.
 * @returns {JSX.Element} 렌더링된 PropellerAds 광고 컴포넌트입니다.
 */
export function PropellerAd({ 
  zoneId, 
  adType = 'banner',
  width = 300,
  height = 250,
  className = '' 
}: PropellerAdProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    if (!zoneId || zoneId === 'YOUR_ZONE_ID') {
      console.warn('PropellerAds: Zone ID not configured')
      return
    }

    const loadPropellerAd = () => {
      try {
        // 기존 스크립트 제거
        if (scriptRef.current) {
          scriptRef.current.remove()
        }

        // 새 스크립트 생성
        const script = document.createElement('script')
        script.type = 'text/javascript'
        
        // PropellerAds 배너 광고 스크립트
        if (adType === 'banner') {
          script.innerHTML = `
            propellerads_site_id = '${import.meta.env.VITE_PROPELLER_SITE_ID || ''}';
            propellerads_ad_client = "propellerads";
            propellerads_ad_slot = "${zoneId}";
            propellerads_ad_width = ${width};
            propellerads_ad_height = ${height};
          `
          
          // PropellerAds 스크립트 로드
          const adScript = document.createElement('script')
          adScript.src = 'https://cdn.propellerads.com/ads.js'
          adScript.async = true
          
          if (adRef.current) {
            adRef.current.appendChild(script)
            adRef.current.appendChild(adScript)
          }
          
          scriptRef.current = adScript
        }
        
      } catch (error) {
        console.error('PropellerAds 광고 로드 오류:', error)
      }
    }

    loadPropellerAd()

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove()
      }
    }
  }, [zoneId, adType, width, height])

  // Zone ID가 설정되지 않은 경우 플레이스홀더 표시
  if (!zoneId || zoneId === 'YOUR_ZONE_ID') {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            PropellerAds Zone ID 설정 필요
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            .env 파일에서 VITE_PROPELLER_ZONE_ID 설정
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={adRef} 
      className={`propeller-ad-container ${className}`}
      style={{ width, height, minHeight: height }}
    >
      {/* PropellerAds 스크립트가 여기에 삽입됩니다 */}
    </div>
  )
}