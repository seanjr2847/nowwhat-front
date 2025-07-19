// "use client"

// import type React from "react"

// import { useState } from "react"

// interface OnboardingProviderProps {
//   children: React.ReactNode
// }

// /**
//  * 온보딩 상태를 관리하고 코치마크를 제공하는 프로바이더 컴포넌트입니다.
//  * @param {OnboardingProviderProps} props - 온보딩 프로바이더의 props입니다.
//  * @param {React.ReactNode} props.children - 자식 컴포넌트들입니다.
//  * @returns {JSX.Element} 렌더링된 온보딩 프로바이더입니다.
//  */
// export function OnboardingProvider({ children }: OnboardingProviderProps) {
//   const [setShowOnboarding] = useState(false)

//   const onboardingSteps = [
//     {
//       id: "welcome",
//       title: "환영합니다! 👋",
//       description: "Now What?에서 당신의 목표를 실현 가능한 체크리스트로 만들어보세요. 간단한 가이드를 시작하겠습니다.",
//       targetSelector: ".main-title",
//       position: "bottom" as const,
//       offset: { x: 0, y: 20 },
//     },
//     {
//       id: "goal-input",
//       title: "목표를 입력하세요",
//       description: "이곳에 달성하고 싶은 목표를 자유롭게 입력해보세요. 예: '일본 여행 가기', '새로운 언어 배우기' 등",
//       targetSelector: ".goal-input",
//       position: "top" as const,
//       offset: { x: 0, y: -10 },
//     },
//     {
//       id: "suggestions",
//       title: "제안 버튼 활용하기",
//       description: "목표가 떠오르지 않는다면 이 제안 버튼들을 클릭해보세요. 인기 있는 목표들을 확인할 수 있습니다.",
//       targetSelector: ".suggestion-buttons",
//       position: "top" as const,
//       offset: { x: 0, y: -10 },
//     },
//     {
//       id: "theme-toggle",
//       title: "테마 변경",
//       description: "여기서 다크모드와 라이트모드를 전환할 수 있습니다. 편한 테마를 선택해보세요.",
//       targetSelector: ".theme-toggle",
//       position: "bottom" as const,
//       offset: { x: 0, y: 10 },
//     },
//     {
//       id: "start",
//       title: "시작해보세요! 🚀",
//       description: "이제 모든 준비가 끝났습니다. 목표를 입력하고 AI가 만드는 맞춤 체크리스트를 경험해보세요!",
//       targetSelector: ".goal-input",
//       position: "bottom" as const,
//       offset: { x: 0, y: 20 },
//     },
//   ]

//   return (
//     <>
//       {children}
//       {/* 이제 자동으로 온보딩을 시작하지 않습니다. 도움말 모달에서 가이드 시작 버튼을 통해서만 시작됩니다. */}
//     </>
//   )
// }
