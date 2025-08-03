import { useEffect, useRef } from "react"

interface AdSenseAdProps {
  adSlot: string
  adFormat?: string
  style?: React.CSSProperties
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

/**
 * Google AdSense 광고를 표시하는 컴포넌트입니다.
 * @param {AdSenseAdProps} props - AdSense 광고 컴포넌트의 props입니다.
 * @param {string} props.adSlot - AdSense 광고 슬롯 ID입니다.
 * @param {string} props.adFormat - 광고 형식 (기본값: auto)입니다.
 * @param {React.CSSProperties} props.style - 광고 컨테이너 스타일입니다.
 * @param {string} props.className - 광고 컨테이너 CSS 클래스입니다.
 * @returns {JSX.Element} 렌더링된 AdSense 광고 컴포넌트입니다.
 */
export function AdSenseAd({ 
  adSlot, 
  adFormat = "auto", 
  style, 
  className = "" 
}: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      // AdSense 스크립트가 로드되었는지 확인
      if (typeof window !== "undefined" && window.adsbygoogle) {
        // 광고 푸시
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error("AdSense 광고 로드 오류:", error)
    }
  }, [])

  return (
    <div ref={adRef} className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client={import.meta.env.VITE_ADSENSE_PUBLISHER_ID || "ca-pub-YOUR_PUBLISHER_ID"}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}