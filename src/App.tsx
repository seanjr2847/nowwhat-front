import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LanguageSwitcher from './components/LanguageSwitcher'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const { t } = useTranslation()

  return (
    <>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{t('welcome.title')}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          {t('welcome.countButton', { count })}
        </button>
        <p>
          <Trans 
            i18nKey="welcome.editMessage"
            components={{ 1: <code /> }}
          />
        </p>
      </div>
      <p className="read-the-docs">
        {t('welcome.learnMore')}
      </p>
    </>
  )
}

export default App
