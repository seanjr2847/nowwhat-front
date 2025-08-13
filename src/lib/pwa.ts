// PWA 기능을 위한 유틸리티 함수들

/**
 * Service Worker 등록 및 PWA 기능 초기화
 */
export function initializePWA(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('✅ Service Worker registered successfully:', registration)
        
        // 업데이트 체크
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 새 버전 사용 가능 알림
                showUpdateAvailableNotification()
              }
            })
          }
        })
        
        // PWA 설치 프롬프트 처리
        handleInstallPrompt()
        
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error)
      }
    })
  } else {
    console.warn('⚠️ Service Worker not supported')
  }
}

/**
 * PWA 설치 프롬프트 처리
 */
function handleInstallPrompt(): void {
  let deferredPrompt: BeforeInstallPromptEvent | null = null
  
  // 설치 프롬프트 표시 여부 체크
  const hasShownInstallPrompt = sessionStorage.getItem('pwa-install-prompt-shown') === 'true'
  const userDismissedInstall = localStorage.getItem('pwa-install-dismissed') === 'true'
  const installDeclinedAt = localStorage.getItem('pwa-install-declined-at')
  
  // 설치를 거부한지 24시간이 지났는지 확인
  const shouldShowAgain = !installDeclinedAt || 
    (Date.now() - parseInt(installDeclinedAt)) > 24 * 60 * 60 * 1000 // 24시간
  
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    const event = e as BeforeInstallPromptEvent
    // 기본 브라우저 설치 프롬프트 방지
    event.preventDefault()
    deferredPrompt = event
    
    // 표시 조건: 세션에서 표시 안함 && (거부하지 않음 || 24시간 경과)
    if (!hasShownInstallPrompt && (!userDismissedInstall || shouldShowAgain)) {
      // 커스텀 설치 버튼 표시 (5초 후에)
      setTimeout(() => {
        if (deferredPrompt) {
          showInstallButton(deferredPrompt)
        }
      }, 5000)
    }
  })
  
  // 앱이 설치되었을 때
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA가 설치되었습니다!')
    deferredPrompt = null
    hideInstallButton()
    
    // 설치 성공 토스트 표시 (추후 구현)
    // toast.success('앱이 성공적으로 설치되었습니다!')
  })
}

/**
 * PWA 설치 버튼 표시
 */
function showInstallButton(prompt: BeforeInstallPromptEvent): void {
  // 설치 버튼 DOM 요소 생성 및 이벤트 핸들러 추가
  const installButton = document.createElement('button')
  installButton.id = 'pwa-install-button'
  installButton.className = `
    fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white 
    px-4 py-2 rounded-full shadow-lg transition-all duration-300
    flex items-center space-x-2 text-sm font-medium
    hover:scale-105
  `.trim()
  installButton.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
    </svg>
    <span>앱 설치</span>
  `
  
  installButton.addEventListener('click', async () => {
    if (prompt) {
      // 설치 프롬프트 표시
      prompt.prompt()
      
      // 사용자 선택 결과 확인
      const { outcome } = await prompt.userChoice
      console.log(`설치 프롬프트 결과: ${outcome}`)
      
      if (outcome === 'accepted') {
        console.log('✅ 사용자가 PWA 설치를 수락했습니다')
      } else {
        console.log('❌ 사용자가 PWA 설치를 거부했습니다')
      }
      
      // 설치 프롬프트 처리 완료 기록
      sessionStorage.setItem('pwa-install-prompt-shown', 'true')
      hideInstallButton()
    }
  })
  
  // 닫기 버튼 추가
  const closeButton = document.createElement('button')
  closeButton.className = 'ml-2 text-white/80 hover:text-white'
  closeButton.innerHTML = '✕'
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation()
    // 세션 중 다시 표시하지 않도록 기록
    sessionStorage.setItem('pwa-install-prompt-shown', 'true')
    hideInstallButton()
  })
  installButton.appendChild(closeButton)
  
  document.body.appendChild(installButton)
  
  // 세션에 표시됨을 기록
  sessionStorage.setItem('pwa-install-prompt-shown', 'true')
  
  // 15초 후 자동 숨김 (사용자가 상호작용하지 않은 경우)
  setTimeout(() => {
    if (document.getElementById('pwa-install-button')) {
      hideInstallButton()
    }
  }, 15000) // 15초
}

/**
 * PWA 설치 버튼 숨김
 */
function hideInstallButton(): void {
  const button = document.getElementById('pwa-install-button')
  if (button) {
    button.remove()
  }
}

/**
 * 앱 업데이트 알림 표시
 */
function showUpdateAvailableNotification(): void {
  // 업데이트 알림 배너 생성
  const updateBanner = document.createElement('div')
  updateBanner.id = 'pwa-update-banner'
  updateBanner.className = `
    fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-4
    flex items-center justify-between shadow-lg
    animate-slide-down
  `.trim()
  updateBanner.innerHTML = `
    <div class="flex items-center space-x-3">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
      </svg>
      <span>새 버전이 사용 가능합니다!</span>
    </div>
    <div class="flex items-center space-x-2">
      <button id="pwa-update-button" class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm">
        업데이트
      </button>
      <button id="pwa-update-close" class="text-white/80 hover:text-white text-lg">
        ✕
      </button>
    </div>
  `
  
  // 이벤트 리스너 추가
  updateBanner.querySelector('#pwa-update-button')?.addEventListener('click', () => {
    window.location.reload()
  })
  
  updateBanner.querySelector('#pwa-update-close')?.addEventListener('click', () => {
    updateBanner.remove()
  })
  
  document.body.appendChild(updateBanner)
  
  // 15초 후 자동 숨김
  setTimeout(() => {
    if (document.getElementById('pwa-update-banner')) {
      updateBanner.remove()
    }
  }, 15000)
}

/**
 * PWA 설치 상태 확인
 */
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

/**
 * PWA 설치 가능 여부 확인
 */
export function isPWAInstallable(): boolean {
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window
}

/**
 * 오프라인 상태 감지 및 처리
 */
export function handleOnlineStatus(): void {
  window.addEventListener('online', () => {
    console.log('✅ 온라인 상태로 변경되었습니다')
    showOnlineNotification('인터넷에 연결되었습니다')
  })
  
  window.addEventListener('offline', () => {
    console.log('❌ 오프라인 상태로 변경되었습니다')
    showOnlineNotification('오프라인 모드입니다. 일부 기능이 제한될 수 있습니다', 'warning')
  })
}

/**
 * 온라인/오프라인 상태 알림
 */
function showOnlineNotification(message: string, type: 'success' | 'warning' = 'success'): void {
  const notification = document.createElement('div')
  notification.className = `
    fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm
    animate-slide-in-right
    ${type === 'success' ? 'bg-green-600' : 'bg-orange-600'}
  `.trim()
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  // 3초 후 자동 제거
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// TypeScript 타입 정의
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}