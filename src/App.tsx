import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './components/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'
import ClarifyPage from './pages/ClarifyPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyListsPage from './pages/MyListsPage'
import ResultPage from './pages/ResultPage'

function App() {
  // 애플리케이션 초기화
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clarify" element={<ClarifyPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* AuthCallback 라우트는 ID 토큰 방식에서는 불필요 */}
            <Route path="/my-lists" element={<ProtectedRoute><MyListsPage /></ProtectedRoute>} />
            <Route path="/result/:id" element={<ResultPage />} />
            <Route path="/privacy" element={<div>Privacy Policy</div>} />
            <Route path="/terms" element={<div>Terms of Service</div>} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
