import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './components/theme-provider'
import ClarifyPage from './pages/ClarifyPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyListsPage from './pages/MyListsPage'
import ResultPage from './pages/ResultPage'

function App() {
  // TODO: API 연결 - GET /health
  // 서버 상태 체크 (애플리케이션 시작 시 서버 연결 확인)
  // useEffect(() => {
  //   const checkServerHealth = async () => {
  //     try {
  //       const response = await fetch('/api/health');
  //       if (!response.ok) {
  //         console.warn('서버 상태가 불안정합니다.');
  //       }
  //     } catch (error) {
  //       console.error('서버 연결 실패:', error);
  //     }
  //   };
  //   
  //   checkServerHealth();
  //   const interval = setInterval(checkServerHealth, 5 * 60 * 1000); // 5분마다 체크
  //   return () => clearInterval(interval);
  // }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clarify" element={<ClarifyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-lists" element={<MyListsPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/privacy" element={<div>Privacy Policy</div>} />
          <Route path="/terms" element={<div>Terms of Service</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
