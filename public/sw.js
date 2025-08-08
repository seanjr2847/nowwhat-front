// Service Worker for PWA functionality
const CACHE_NAME = 'nowwhat-v1.0.0'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/NowWhat_logo.svg',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// 설치 이벤트 - 캐시 생성
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache.map(url => {
          return new Request(url, { cache: 'no-cache' })
        }))
      })
      .catch((error) => {
        console.error('Cache addAll failed:', error)
      })
  )
  // 즉시 활성화
  self.skipWaiting()
})

// 활성화 이벤트 - 이전 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // 즉시 클라이언트 제어 시작
  return self.clients.claim()
})

// Fetch 이벤트 - 네트워크 우선, 캐시 fallback 전략
self.addEventListener('fetch', (event) => {
  // API 요청은 캐시하지 않음
  if (event.request.url.includes('/api/')) {
    return
  }
  
  // Chrome extension 요청은 무시
  if (event.request.url.startsWith('chrome-extension://')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 성공적인 응답이면 캐시에 저장
        if (response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
        }
        return response
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 응답
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response
            }
            // 페이지 요청이면 루트 페이지로 fallback (SPA 라우팅 지원)
            if (event.request.mode === 'navigate') {
              return caches.match('/')
            }
            return new Response('오프라인 상태입니다', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=utf-8'
              })
            })
          })
      })
  )
})

// 백그라운드 동기화 (추후 구현)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag)
  if (event.tag === 'background-sync') {
    // 체크리스트 오프라인 저장 데이터 동기화 로직
  }
})

// 푸시 알림 (추후 구현)
self.addEventListener('push', (event) => {
  console.log('Push message received')
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: '확인하기',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: '닫기',
          icon: '/icon-192x192.png'
        }
      ]
    }
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received.')
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/my-lists')
    )
  }
})