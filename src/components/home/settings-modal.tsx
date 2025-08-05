"use client"

import { Globe, Settings, X } from "lucide-react"
import { useEffect, useState } from "react"
import { 
  getUserLocaleSettings,
  saveUserLocaleSettings,
  getSupportedRegions,
  type UserLocaleSettings
} from "../../lib/locale-utils"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { useToast } from "../../hooks/use-toast"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * 설정 모달 컴포넌트입니다.
 * API 개인화 설정을 관리합니다.
 * @param {SettingsModalProps} props - 설정 모달의 props입니다.
 * @param {boolean} props.isOpen - 모달이 열려있는지 여부입니다.
 * @param {() => void} props.onClose - 모달을 닫는 함수입니다.
 * @returns {JSX.Element | null} 렌더링된 설정 모달입니다.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<UserLocaleSettings>({
    userLanguage: 'ko',
    userCountry: 'KR',
    autoDetect: true,
    country_option: true,
    lastUpdated: new Date().toISOString()
  })

  // 설정 불러오기
  useEffect(() => {
    if (isOpen) {
      const currentSettings = getUserLocaleSettings()
      setSettings(currentSettings)
    }
  }, [isOpen])


  // 설정 저장
  const handleSave = () => {
    saveUserLocaleSettings(settings)
    toast({
      title: "설정 저장 완료",
      description: "언어 및 지역 설정이 저장되었습니다.",
      variant: "default"
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Settings className="w-5 h-5 mr-2 text-purple-500" />
            설정
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* API 개인화 설정 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <h4 className="text-base font-medium text-foreground">API 개인화</h4>
            </div>
            
            <p className="text-sm text-muted-foreground">
              AI가 당신의 국가와 언어에 맞는 더 정확한 답변을 제공합니다.
            </p>

            {/* 국가별 맞춤화 옵션 */}
            <div className="flex items-center justify-between">
              <Label htmlFor="country-option" className="text-sm font-medium">
                국가별 맞춤화
              </Label>
              <Switch
                id="country-option"
                checked={settings.country_option}
                onCheckedChange={(country_option) => setSettings(prev => ({ ...prev, country_option }))}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              국가별 맞춤화를 활성화하면 해당 국가의 법률, 가격, 연락처 등이 포함된 더 정확한 답변을 받을 수 있습니다.
            </p>

            {/* 국가 선택 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">국가</Label>
              <Select
                value={settings.userCountry}
                onValueChange={(value) => setSettings(prev => ({ 
                  ...prev, 
                  userCountry: value
                }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="국가를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(getSupportedRegions()).map(([code, region]) => (
                    <SelectItem key={code} value={code}>
                      {region.flag} {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* 버튼 그룹 */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
