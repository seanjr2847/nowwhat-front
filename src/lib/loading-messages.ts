/**
 * 단계별 로딩 메시지 시스템
 * 각 작업 단계별로 최적화된 메시지와 애니메이션을 제공합니다.
 */

export type LoadingStage = 
  | 'auth-check'
  | 'goal-analysis' 
  | 'intent-analysis'
  | 'question-generation'
  | 'checklist-creation'
  | 'saving'
  | 'generic'

export interface LoadingMessage {
  /** 메인 메시지 */
  primary: string
  /** 서브 메시지 */
  secondary: string
  /** 격려/안내 메시지 */
  encouragement: string
  /** 예상 소요 시간 (초) */
  estimatedDuration: number
  /** 단계별 순환 메시지들 */
  progressMessages: string[]
}

export interface LoadingStageConfig {
  /** 단계 이름 */
  name: string
  /** 아이콘 이모지 */
  icon: string
  /** 메시지 설정 */
  messages: LoadingMessage
  /** 컬러 테마 */
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

/**
 * 각 단계별 로딩 설정
 */
export const LOADING_STAGES: Record<LoadingStage, LoadingStageConfig> = {
  'auth-check': {
    name: '인증 확인',
    icon: '🔐',
    messages: {
      primary: '로그인 상태를 확인하고 있어요',
      secondary: '안전한 연결을 준비 중입니다',
      encouragement: '곧 시작할 수 있어요!',
      estimatedDuration: 3,
      progressMessages: [
        '사용자 인증 확인 중...',
        '보안 연결 설정 중...',
        '준비 완료!'
      ]
    },
    colors: {
      primary: '#10b981', // green-500
      secondary: '#34d399', // green-400  
      accent: '#6ee7b7' // green-300
    }
  },

  'goal-analysis': {
    name: '목표 분석',
    icon: '🎯',
    messages: {
      primary: 'AI가 목표를 깊이 분석하고 있어요',
      secondary: '가장 효과적인 접근 방법을 찾고 있습니다',
      encouragement: '곧 맞춤형 방향을 제시해드릴게요!',
      estimatedDuration: 8,
      progressMessages: [
        '목표 키워드 분석 중...',
        '유사 사례 검토 중...',
        '최적 전략 도출 중...',
        '개인화 방향 설정 중...'
      ]
    },
    colors: {
      primary: '#03b2f9', // brand-primary-500
      secondary: '#38bdf8', // brand-primary-400
      accent: '#7dd3fc' // brand-primary-300
    }
  },

  'intent-analysis': {
    name: '의도 분석',
    icon: '🧠',
    messages: {
      primary: '선택하신 방향으로 세부 분석 중이에요',
      secondary: '가장 실현 가능한 방법들을 찾고 있습니다',
      encouragement: '거의 다 왔어요! 조금만 더 기다려주세요',
      estimatedDuration: 6,
      progressMessages: [
        '의도 파악 중...',
        '실행 가능성 검토 중...',
        '단계별 계획 수립 중...'
      ]
    },
    colors: {
      primary: '#8b5cf6', // violet-500
      secondary: '#a78bfa', // violet-400
      accent: '#c4b5fd' // violet-300
    }
  },

  'question-generation': {
    name: '질문 생성',
    icon: '❓',
    messages: {
      primary: '맞춤 질문을 생성하고 있어요',
      secondary: '귀하의 상황에 최적화된 질문들을 준비 중입니다',
      encouragement: '곧 구체적인 질문들을 만나보실 수 있어요!',
      estimatedDuration: 10,
      progressMessages: [
        '핵심 질문 도출 중...',
        '개인화 질문 생성 중...',
        '질문 순서 최적화 중...',
        '마지막 검토 중...'
      ]
    },
    colors: {
      primary: '#f59e0b', // amber-500
      secondary: '#fbbf24', // amber-400
      accent: '#fcd34d' // amber-300
    }
  },

  'checklist-creation': {
    name: '체크리스트 생성',
    icon: '📋',
    messages: {
      primary: '나만의 실행 체크리스트를 만들고 있어요',
      secondary: '답변을 바탕으로 완벽한 계획을 세우고 있습니다',
      encouragement: '마지막 단계예요! 곧 완성됩니다',
      estimatedDuration: 15,
      progressMessages: [
        '답변 분석 중...',
        '실행 계획 수립 중...',
        '우선순위 설정 중...',
        '체크리스트 구성 중...',
        '최종 검토 중...'
      ]
    },
    colors: {
      primary: '#00edce', // brand-secondary-500
      secondary: '#2dd4bf', // brand-secondary-400
      accent: '#5eead4' // brand-secondary-300
    }
  },

  'saving': {
    name: '저장 중',
    icon: '💾',
    messages: {
      primary: '결과를 안전하게 저장하고 있어요',
      secondary: '언제든 다시 볼 수 있도록 보관 중입니다',
      encouragement: '거의 완료되었어요!',
      estimatedDuration: 3,
      progressMessages: [
        '데이터 저장 중...',
        '백업 생성 중...',
        '저장 완료!'
      ]
    },
    colors: {
      primary: '#06b6d4', // cyan-500
      secondary: '#22d3ee', // cyan-400
      accent: '#67e8f9' // cyan-300
    }
  },

  'generic': {
    name: '처리 중',
    icon: '⚡',
    messages: {
      primary: '요청을 처리하고 있어요',
      secondary: '최상의 결과를 위해 열심히 작업 중입니다',
      encouragement: '잠시만 기다려주세요!',
      estimatedDuration: 5,
      progressMessages: [
        '처리 중...',
        '작업 진행 중...',
        '마무리 중...'
      ]
    },
    colors: {
      primary: '#6b7280', // gray-500
      secondary: '#9ca3af', // gray-400
      accent: '#d1d5db' // gray-300
    }
  }
}

/**
 * 단계별 격려 메시지 (랜덤 선택용)
 */
export const ENCOURAGEMENT_MESSAGES = {
  'start': [
    '좋은 선택이에요! 🎯',
    '함께 완벽한 계획을 세워봐요! 💪',
    '목표 달성을 위한 첫걸음이에요! 🚀'
  ],
  'middle': [
    '절반 이상 완료되었어요! 📈',
    '순조롭게 진행되고 있어요! ✨',
    '거의 다 왔어요! 💫'
  ],
  'end': [
    '마지막 단계예요! 🏁',
    '곧 완성됩니다! 🎉',
    '조금만 더 기다려주세요! ⏰'
  ]
}

/**
 * 성공 메시지
 */
export const SUCCESS_MESSAGES = {
  'goal-analysis': '완벽한 방향들을 찾았어요! 🎯',
  'question-generation': '맞춤 질문들이 준비되었어요! ❓',
  'checklist-creation': '나만의 체크리스트가 완성되었어요! 📋',
  'saving': '안전하게 저장되었어요! 💾'
}

/**
 * 에러 시 표시할 친근한 메시지
 */
export const ERROR_MESSAGES = {
  'network': '인터넷 연결을 확인해주세요 🌐',
  'timeout': '시간이 조금 걸리고 있어요. 다시 시도해볼까요? ⏰',
  'server': '잠시 문제가 발생했어요. 곧 해결될 거예요! 🔧',
  'generic': '예상치 못한 문제가 발생했어요. 다시 시도해주세요 🤝'
}

/**
 * 로딩 단계에 따른 설정 반환
 */
export function getLoadingConfig(stage: LoadingStage): LoadingStageConfig {
  return LOADING_STAGES[stage]
}

/**
 * 랜덤 격려 메시지 반환
 */
export function getRandomEncouragement(phase: 'start' | 'middle' | 'end'): string {
  const messages = ENCOURAGEMENT_MESSAGES[phase]
  return messages[Math.floor(Math.random() * messages.length)]
}