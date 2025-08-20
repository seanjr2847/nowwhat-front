"use client"

import { ChevronDown, Globe, List, LogOut, Menu, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "../hooks/use-mobile"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../hooks/useAuth"
import {
  SUPPORTED_LANGUAGES,
  getUserLocaleSettings,
  saveUserLocaleSettings,
  type UserLocaleSettings
} from "../lib/locale-utils"
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
  const { t, i18n } = useTranslation('common')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [localeSettings, setLocaleSettings] = useState<UserLocaleSettings>({
    userLanguage: 'en',
    userCountry: 'US',
    autoDetect: true,
    countryOption: false,
    lastUpdated: new Date().toISOString()
  })
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)


  // 인증 상태 변화 로깅
  console.log('🔍 Header 렌더링 - 인증 상태:', { isAuthenticated, isLoading, user: (user?.name !== undefined && user.name.length > 0) ? user.name : 'None' })

  // 컴포넌트 마운트 시 사용자 로케일 설정 초기화
  useEffect(() => {
    const settings = getUserLocaleSettings()
    setLocaleSettings(settings)
    console.log('🌍 사용자 로케일 설정 초기화:', settings)
  }, [])

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
        title: t('auth.signOutSuccess'),
        description: t('auth.signOutSuccessDesc'),
        variant: "default",
      })

      handleNavigation("/")
    } catch (error) {
      console.error('💥 로그아웃 실패:', error)

      // 로그아웃 실패 토스트 표시
      toast({
        title: t('auth.signOutError'),
        description: t('auth.signOutErrorDesc'),
        variant: "destructive",
      })
    }
  }

  // 언어 변경 핸들러
  const handleLanguageChange = (newLanguage: string) => {
    const updatedSettings = {
      ...localeSettings,
      userLanguage: newLanguage
    }
    setLocaleSettings(updatedSettings)
    saveUserLocaleSettings(updatedSettings)
    
    // i18next 언어 변경
    void i18n.changeLanguage(newLanguage)

    toast({
      title: t('status.success'),
      description: `${t('navigation.language')} → ${SUPPORTED_LANGUAGES[newLanguage as keyof typeof SUPPORTED_LANGUAGES]?.name}`,
      variant: "default",
    })
  }


  const renderNavContent = () => (
    <div className={`flex ${isMobile ? "flex-col space-y-4 p-4" : "items-center space-x-3"}`}>
      <div className={`flex ${isMobile ? "flex-col space-y-4" : "items-center space-x-2"}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2 py-1 h-8">
              <Globe className="w-3 h-3 mr-1" />
              <span className="flex items-center space-x-1 text-sm">
                <span>{SUPPORTED_LANGUAGES[localeSettings.userLanguage as keyof typeof SUPPORTED_LANGUAGES]?.flag}</span>
                <span className="hidden sm:inline">{SUPPORTED_LANGUAGES[localeSettings.userLanguage as keyof typeof SUPPORTED_LANGUAGES]?.name}</span>
              </span>
              <ChevronDown className="w-3 h-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => (
              <DropdownMenuItem key={code} onSelect={() => handleLanguageChange(code)}>
                <span className="mr-2">{info.flag}</span>
                {info.name}
                {localeSettings.userLanguage === code && <span className="ml-auto text-brand-primary-500">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>


        <div className={`flex items-center w-full ${isMobile ? "justify-between px-3" : ""}`}>
          {isMobile && <span className="text-sm text-muted-foreground">Theme</span>}
          <ThemeToggle />
        </div>
      </div>

      {isAuthenticated ? (
        <div className={`flex ${isMobile ? "flex-col space-y-2 border-t pt-4 mt-4" : "items-center space-x-2"}`}>
          {/* 사용자 정보 표시 */}
          <div className={`flex items-center ${isMobile ? "px-3 py-2 mb-2" : "px-3"}`}>
            <div className="w-8 h-8 bg-brand-primary-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-medium">
                {(user?.name !== undefined && user.name.length > 0) ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{(user?.name !== undefined && user.name.length > 0) ? user.name : t('auth.user')}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>

          <Button onClick={() => handleNavigation("/my-lists")} variant="ghost" className="w-full justify-start px-3">
            <List className="w-4 h-4 mr-2" />
            <span>{t('navigation.myLists')}</span>
          </Button>

          <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-500 px-3"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>{t('navigation.signOut')}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('auth.signOutConfirm')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('auth.signOutDescription')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('buttons.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => void handleSignOut()}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {t('navigation.signOut')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className={isMobile ? "border-t pt-4 mt-4" : ""}>
          <Button onClick={handleSignIn} variant="ghost" className="w-full justify-start px-3">
            <User className="w-4 h-4 mr-2" />
            <span>{t('navigation.signIn')}</span>
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <header className="flex items-center justify-between p-3 bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <button onClick={() => handleNavigation("/")} className="flex items-center space-x-2 group">
          <img 
            src="/NowWhat_logo.svg" 
            alt="NowWhat Logo" 
            className="w-8 h-8 transition-transform group-hover:scale-110"
          />
          <h1 className="text-xl font-semibold cursor-pointer group-hover:opacity-80 transition-opacity">
            Now <span className="text-brand-primary-400">What?</span>
          </h1>
        </button>
        <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
          Beta
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
