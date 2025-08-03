import { useEffect, useState } from "react"
import { ExternalLink, ShoppingCart, Smartphone, Users } from "lucide-react"

interface MockAdProps {
  type?: 'banner' | 'square' | 'vertical'
  className?: string
}

// 실제 광고와 유사한 Mock 광고 데이터
const mockAds = [
  {
    id: 1,
    title: "ChatGPT Plus",
    description: "AI 생산성 향상의 새로운 차원을 경험해보세요",
    image: "https://via.placeholder.com/300x200/4f46e5/ffffff?text=ChatGPT+Plus",
    cta: "무료 체험 시작",
    url: "https://chat.openai.com",
    icon: <Users className="w-6 h-6" />,
    brand: "OpenAI"
  },
  {
    id: 2,
    title: "Notion 워크스페이스",
    description: "팀 협업과 개인 생산성을 위한 올인원 도구",
    image: "https://via.placeholder.com/300x200/000000/ffffff?text=Notion",
    cta: "지금 시작하기",
    url: "https://notion.so",
    icon: <Smartphone className="w-6 h-6" />,
    brand: "Notion"
  },
  {
    id: 3,
    title: "Amazon Prime",
    description: "무료 배송, 스트리밍, 게임까지 모든 혜택을",
    image: "https://via.placeholder.com/300x200/ff9900/ffffff?text=Amazon+Prime",
    cta: "30일 무료 체험",
    url: "https://amazon.com/prime",
    icon: <ShoppingCart className="w-6 h-6" />,
    brand: "Amazon"
  },
  {
    id: 4,
    title: "GitHub Copilot",
    description: "AI 코딩 어시스턴트로 개발 속도 10배 향상",
    image: "https://via.placeholder.com/300x200/24292e/ffffff?text=GitHub+Copilot",
    cta: "무료 체험",
    url: "https://github.com/features/copilot",
    icon: <ExternalLink className="w-6 h-6" />,
    brand: "GitHub"
  }
]

/**
 * AdSense 승인 전까지 사용할 실제 같은 Mock 광고 컴포넌트입니다.
 * @param {MockAdProps} props - Mock 광고 컴포넌트의 props입니다.
 * @param {'banner' | 'square' | 'vertical'} props.type - 광고 레이아웃 타입입니다.
 * @param {string} props.className - 추가 CSS 클래스입니다.
 * @returns {JSX.Element} 렌더링된 Mock 광고 컴포넌트입니다.
 */
export function MockAd({ type = 'banner', className = '' }: MockAdProps) {
  const [currentAd, setCurrentAd] = useState(mockAds[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 랜덤 광고 선택
    const randomAd = mockAds[Math.floor(Math.random() * mockAds.length)]
    setCurrentAd(randomAd)
    
    // 로딩 애니메이션
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  const handleAdClick = () => {
    // 실제 환경에서는 광고 클릭 추적
    console.log('📊 광고 클릭:', currentAd.title)
    window.open(currentAd.url, '_blank', 'noopener,noreferrer')
  }

  const getLayoutClasses = () => {
    switch (type) {
      case 'square':
        return 'w-80 h-80'
      case 'vertical':
        return 'w-64 h-96'
      default:
        return 'w-full h-48'
    }
  }

  return (
    <div 
      className={`
        relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
        border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden 
        shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group
        ${getLayoutClasses()} ${className}
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}
      onClick={handleAdClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleAdClick()}
      aria-label={`광고: ${currentAd.title}`}
    >
      {/* 광고 표시 라벨 */}
      <div className="absolute top-2 left-2 bg-gray-600/80 text-white text-xs px-2 py-1 rounded-md z-10">
        광고
      </div>

      {/* 메인 콘텐츠 */}
      <div className="h-full flex flex-col">
        {/* 이미지 영역 */}
        <div 
          className="flex-1 bg-cover bg-center relative overflow-hidden"
          style={{ 
            backgroundImage: `url(${currentAd.image})`,
            minHeight: type === 'banner' ? '120px' : '200px'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* 브랜드 로고/아이콘 */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg">
            {currentAd.icon}
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              {currentAd.title}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentAd.brand}
            </span>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
            {currentAd.description}
          </p>
          
          {/* CTA 버튼 */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors duration-200 group-hover:bg-blue-700">
            {currentAd.cta}
          </button>
        </div>
      </div>

      {/* 호버 효과 */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}