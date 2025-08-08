import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n' // i18n 초기화
import { initializePWA, handleOnlineStatus } from './lib/pwa'
import App from './App.tsx'

// PWA 초기화
initializePWA()
handleOnlineStatus()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
