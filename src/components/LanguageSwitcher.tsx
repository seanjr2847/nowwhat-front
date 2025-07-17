import React, { useState } from 'react';
import { ChevronDown, Languages } from 'lucide-react';
import { useLanguage, type SupportedLanguage } from '../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, supportedLanguages, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode: SupportedLanguage) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, languageCode: SupportedLanguage) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange(languageCode);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-label={t('ui.languageSelector')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
      >
        <Languages className="w-4 h-4 mr-2" />
        <span className="mr-1">{currentLanguage.flag}</span>
        <span>{currentLanguage.nativeName}</span>
        <ChevronDown 
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="listbox">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150 ${
                  currentLanguage.code === language.code 
                    ? 'bg-indigo-50 text-indigo-900 font-medium' 
                    : 'text-gray-700'
                }`}
                onClick={() => handleLanguageChange(language.code)}
                onKeyDown={(e) => handleKeyDown(e, language.code)}
                role="option"
                aria-selected={currentLanguage.code === language.code}
                tabIndex={0}
              >
                <span className="mr-2">{language.flag}</span>
                {language.nativeName}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 클릭 외부 영역 감지를 위한 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LanguageSwitcher; 