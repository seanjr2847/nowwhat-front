"use client"

import { Header } from "../components/header"
import { MainContent } from "../components/home/main-content"
import { OnboardingProvider } from "../components/onboarding/onboarding-provider"

export default function HomePage() {
  return (
    <OnboardingProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <MainContent />
      </div>
    </OnboardingProvider>
  )
}
