import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage' 
import ClarifyPage from './pages/ClarifyPage'
import MyListsPage from './pages/MyListsPage'
import './App.css'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clarify" element={<ClarifyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-lists" element={<MyListsPage />} />
          <Route path="/result/:id" element={<div>Result Page</div>} />
          <Route path="/privacy" element={<div>Privacy Policy</div>} />
          <Route path="/terms" element={<div>Terms of Service</div>} />
        </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
