"use client"

import { ChevronDown, Globe, List, LogOut, MapPin, Menu, User } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "../hooks/use-mobile"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../hooks/useAuth"
import { ThemeToggle } from "./theme-toggle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

/**
 * 애플리케이션의 최상단에 위치하는 반응형 헤더 컴포넌트입니다.
 * 데스크탑에서는 모든 메뉴를 표시하고, 모바일에서는 햄버거 메뉴를 통해 접근할 수 있습니다.
 * @returns {JSX.Element} 렌더링된 헤더 컴포넌트입니다.
 */
export function Header() {
  const router = useNavigate()
  const isMobile = useIsMobile()
  const { isAuthenticated, logout, user, isLoading } = useAuth()
  const { toast } = useToast()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [language, setLanguage] = useState("EN")
  const [region, setRegion] = useState("KR")
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  // 인증 상태 변화 로깅
  console.log('🔍 Header 렌더링 - 인증 상태:', { isAuthenticated, isLoading, user: user?.name || 'None' })

  const handleNavigation = (path: string) => {
    void router(path)
    setIsSheetOpen(false)
  }

  const handleSignIn = () => {
    handleNavigation("/login")
  }

  const handleSignOut = async () => {
    try {
      console.log('🚪 로그아웃 프로세스 시작')
      await logout()
      console.log('✅ 로그아웃 성공, 홈으로 이동')
      setIsLogoutDialogOpen(false)

      // 로그아웃 성공 토스트 표시
      toast({
        title: "로그아웃 완료",
        description: "성공적으로 로그아웃되었습니다.",
        variant: "default",
      })

      handleNavigation("/")
    } catch (error) {
      console.error('💥 로그아웃 실패:', error)

      // 로그아웃 실패 토스트 표시
      toast({
        title: "로그아웃 실패",
        description: "로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    }
  }

  const renderNavContent = () => (
    <div className={`flex ${isMobile ? "flex-col space-y-4 p-4" : "items-center space-x-3"}`}>
      <div className={`flex ${isMobile ? "flex-col space-y-4" : "items-center space-x-2"}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-3">
              <Globe className="w-4 h-4 mr-2" />
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setLanguage("EN")}>English</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setLanguage("KO")}>한국어</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!isMobile && <div className="w-px h-4 bg-border"></div>}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-3">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{region}</span>
              <ChevronDown className="w-3 h-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setRegion("KR")}>South Korea</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setRegion("US")}>United States</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setRegion("JP")}>Japan</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!isMobile && <div className="w-px h-4 bg-border"></div>}

        <div className={`flex items-center w-full ${isMobile ? "justify-between px-3" : ""}`}>
          {isMobile && <span className="text-sm text-muted-foreground">Theme</span>}
          <ThemeToggle />
        </div>
      </div>

      {isAuthenticated ? (
        <div className={`flex ${isMobile ? "flex-col space-y-2 border-t pt-4 mt-4" : "items-center space-x-2"}`}>
          <Button onClick={() => handleNavigation("/my-lists")} variant="ghost" className="w-full justify-start px-3">
            <List className="w-4 h-4 mr-2" />
            <span>My Lists</span>
          </Button>

          <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-500 px-3"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign Out</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>로그아웃 하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  로그아웃하면 현재 세션이 종료되며, 다시 로그인해야 합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => void handleSignOut()}
                  className="bg-red-500 hover:bg-red-600"
                >
                  로그아웃
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className={isMobile ? "border-t pt-4 mt-4" : ""}>
          <Button onClick={handleSignIn} variant="ghost" className="w-full justify-start px-3">
            <User className="w-4 h-4 mr-2" />
            <span>Sign In</span>
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <header className="flex items-center justify-between p-3 bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <button onClick={() => handleNavigation("/")} className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold cursor-pointer hover:opacity-80 transition-opacity">
            Now <span className="text-blue-400">What?</span>
          </h1>
        </button>
        <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
          Alpha
        </Badge>
      </div>

      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>{renderNavContent()}</SheetContent>
        </Sheet>
      ) : (
        renderNavContent()
      )}
    </header>
  )
}
