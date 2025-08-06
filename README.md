<div align="center">
  <img src="./public/NowWhat_logo.svg" alt="NowWhat Logo" width="120" height="120"/>
  
  # Now What? <sup><em>Alpha</em></sup>
  
  ### AI 개인화 체크리스트 생성기
  
  > AI가 당신의 목표를 실행 가능한 단계별 체크리스트로 변환해 드립니다

  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
</div>

**NowWhat**은 AI를 활용하여 사용자의 목표나 아이디어를 구체적이고 실행 가능한 체크리스트로 변환해주는 웹 애플리케이션입니다. ChatGPT 스타일의 실시간 스트리밍으로 개인화된 질문을 생성하고, 답변을 바탕으로 맞춤형 행동 계획을 제공합니다.

## ✨ 주요 기능

### 🧠 AI 기반 질문 생성
- **실시간 스트리밍**: ChatGPT 스타일의 실시간 질문 생성
- **개인화 질문**: 사용자의 목표와 상황에 맞춤화된 질문
- **의도 분석**: 사용자 입력을 분석하여 최적의 질문 유형 선택

### 📋 스마트 체크리스트
- **단계별 가이드**: 목표 달성을 위한 구체적인 행동 단계
- **진행률 추적**: 실시간 체크리스트 완료율 모니터링
- **상세 정보**: 각 항목별 팁, 연락처, 관련 링크 제공

### 🔐 안전한 사용자 관리
- **Google OAuth**: 간편한 소셜 로그인
- **JWT 인증**: 안전한 토큰 기반 인증 시스템
- **자동 갱신**: 토큰 자동 갱신으로 끊김없는 사용 경험

### 🎨 모던 UI/UX
- **반응형 디자인**: 모바일부터 데스크톱까지 완벽 대응
- **다크/라이트 테마**: 사용자 선호에 따른 테마 전환
- **접근성**: WCAG 2.1 AA 준수로 모든 사용자에게 접근 가능
- **한국어 최적화**: 한글 폰트와 한국 문화에 최적화된 UI

## 🌟 사용 사례

- **창업 준비**: 사업 아이디어를 실제 창업 단계로 구체화
- **취업 활동**: 취업 목표를 구체적인 준비 과정으로 분해
- **학습 계획**: 새로운 기술이나 언어 학습을 체계적인 단계로 정리
- **생활 개선**: 건강, 관계, 취미 등 생활 목표를 실행 가능한 계획으로 변환
- **프로젝트 관리**: 복잡한 프로젝트를 관리 가능한 태스크로 분할

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### ⚡ 빠른 시작

1. **저장소 클론**
```bash
git clone https://github.com/your-username/nowwhat-front.git
cd nowwhat-front
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
# .env.local 파일 생성
echo "VITE_GOOGLE_CLIENT_ID=your_google_client_id_here" > .env.local
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **브라우저에서 확인**
   
   http://localhost:5173 에서 애플리케이션을 확인하세요.

### 🎥 사용 방법

1. **목표 입력**: 홈페이지에서 달성하고 싶은 목표를 입력하세요
2. **의도 선택**: AI가 제안하는 의도 중 가장 적합한 것을 선택하세요
3. **질문 답변**: 실시간으로 생성되는 개인화 질문에 답변하세요
4. **체크리스트 확인**: AI가 생성한 맞춤형 체크리스트를 확인하고 실행하세요
5. **진행률 추적**: 각 단계를 완료하며 목표 달성 과정을 추적하세요

## 🔑 로그인 기능 설정

이 애플리케이션은 구글 OAuth를 통한 로그인을 지원합니다.

### 구글 OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트를 생성하거나 기존 프로젝트를 선택합니다.

2. "APIs & Services" → "Credentials"로 이동합니다.

3. "Create Credentials" → "OAuth client ID"를 선택합니다.

4. Application type을 "Web application"으로 선택합니다.

5. **Authorized JavaScript origins**에 다음을 추가합니다:
   - `http://localhost:3000` (개발 환경)
   - `https://yourdomain.com` (프로덕션 환경)

6. **Authorized redirect URIs**에 다음을 추가합니다:
   - `http://localhost:3000/auth/callback` (개발 환경)
   - `https://yourdomain.com/auth/callback` (프로덕션 환경)

7. 생성된 Client ID를 복사합니다.

### 환경 변수 설정

`.env.local` 파일에 구글 클라이언트 ID를 추가합니다:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 🏗️ 백엔드 연결

백엔드 API는 `https://nowwhat-back.vercel.app`에 배포되어 있습니다.

### API 엔드포인트

- `POST /auth/google` - 구글 로그인
- `POST /auth/logout` - 로그아웃
- `GET /auth/me` - 현재 사용자 정보
- `POST /auth/refresh` - 토큰 갱신

### 인증 플로우

1. 사용자가 "Google 계정으로 로그인" 버튼을 클릭
2. 구글 Sign-In 라이브러리가 One Tap 프롬프트 또는 팝업 표시
3. 사용자가 계정을 선택하면 구글에서 ID 토큰 발급
4. 프론트엔드가 ID 토큰을 직접 백엔드로 전송
5. 백엔드가 구글 API로 ID 토큰을 검증하고 JWT 토큰 발행
6. 프론트엔드가 JWT 토큰을 localStorage에 저장하고 사용자 로그인 완료

## 🔒 보호된 라우트

다음 라우트들은 로그인이 필요합니다:

- `/my-lists` - 나의 리스트 페이지

로그인하지 않은 사용자가 보호된 라우트에 접근하려고 하면 자동으로 로그인 페이지로 리다이렉트됩니다.

## 🛠️ 기술 스택

### 🚀 프론트엔드
- **React 19** - 최신 React 기능을 활용한 현대적 UI 개발
- **TypeScript 5.8** - 강력한 타입 시스템으로 안정적인 코드
- **Vite 7.0** - 번개 같이 빠른 개발 서버와 빌드
- **React Router v7** - 클라이언트 사이드 라우팅
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크

### 🎨 UI 라이브러리
- **shadcn/ui** - 고품질 React 컴포넌트 라이브러리
- **Radix UI** - 접근성을 고려한 unstyled 컴포넌트
- **Lucide React** - 아름다운 SVG 아이콘 패키지
- **Tailwind Animate** - 부드러운 애니메이션

### 🔧 유틸리티
- **React Hook Form** - 고성능 폼 라이브러리
- **Zod** - 타입 안전한 스키마 검증
- **Class Variance Authority** - 조건부 CSS 클래스 관리
- **date-fns** - 현대적인 JavaScript 날짜 유틸리티

### 📊 모니터링 & 분석
- **Vercel Analytics** - 실시간 웹사이트 분석
- **Vercel Speed Insights** - 성능 모니터링

### 🎯 개발 도구
- **ESLint** - 코드 품질 및 스타일 가이드
- **TypeScript ESLint** - TypeScript 전용 린팅 규칙
- **PostCSS** - CSS 후처리 도구

## 📁 프로젝트 구조

```
nowwhat-front/
├── public/                 # 정적 파일
│   └── favicon.ico
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── ui/            # shadcn/ui 기본 컴포넌트
│   │   ├── streaming/     # AI 질문 생성 스트리밍
│   │   ├── result/        # 체크리스트 결과 화면
│   │   ├── my-lists/      # 사용자 체크리스트 관리
│   │   ├── home/          # 홈페이지 컴포넌트
│   │   ├── clarify/       # 의도 명확화 플로우
│   │   ├── ads/           # 광고 시스템
│   │   ├── onboarding/    # 사용자 온보딩
│   │   ├── AuthProvider.tsx    # 전역 인증 상태
│   │   ├── ProtectedRoute.tsx  # 보호된 라우트
│   │   └── theme-provider.tsx  # 테마 관리
│   ├── hooks/             # 커스텀 React 훅
│   │   ├── useAuth.ts         # 인증 상태 관리
│   │   ├── useStreamingQuestions.ts # AI 스트리밍
│   │   └── use-theme.ts       # 테마 토글
│   ├── lib/               # 유틸리티 라이브러리
│   │   ├── api.ts             # API 클라이언트
│   │   ├── auth.ts            # 인증 서비스
│   │   ├── locale-utils.ts    # 국제화 유틸
│   │   └── utils.ts           # 공통 헬퍼
│   ├── pages/             # 라우트별 페이지
│   │   ├── HomePage.tsx       # 메인 랜딩
│   │   ├── ClarifyPage.tsx    # 의도 명확화
│   │   ├── ResultPage.tsx     # 체크리스트 결과
│   │   ├── MyListsPage.tsx    # 내 체크리스트
│   │   └── LoginPage.tsx      # 로그인
│   ├── types/             # TypeScript 타입 정의
│   ├── App.tsx            # 메인 앱 컴포넌트
│   └── main.tsx           # 앱 엔트리포인트
├── components.json        # shadcn/ui 설정
├── tailwind.config.ts     # Tailwind CSS 설정
├── vite.config.ts         # Vite 빌드 설정
├── tsconfig.json          # TypeScript 설정
└── vercel.json            # Vercel 배포 설정
```

## 🎯 주요 특징

### ⚡ 성능 최적화
- **React 19**: 최신 concurrent 렌더링으로 부드러운 사용자 경험
- **Vite 빌드**: 최적화된 번들링과 코드 분할
- **이미지 최적화**: 반응형 이미지와 lazy loading
- **캐싱 전략**: API 응답 캐싱과 브라우저 캐시 최적화

### 🌐 국제화 및 접근성
- **다국어 지원**: 한국어 우선, 다국어 확장 가능
- **시간대 대응**: 사용자 현지 시간대 자동 감지
- **접근성**: 키보드 내비게이션과 스크린 리더 지원
- **반응형**: 모든 디바이스에서 일관된 경험

### 🔒 보안 및 프라이버시
- **OAuth 2.0**: Google 공식 인증 시스템
- **JWT 토큰**: 안전한 세션 관리
- **HTTPS 전용**: 모든 통신 암호화
- **CORS 보안**: 적절한 도메인 제한

### 🧪 개발 경험
- **타입 안전성**: 완전한 TypeScript 적용
- **컴포넌트 스토리**: 재사용 가능한 컴포넌트 라이브러리
- **개발 도구**: 핫 리로딩과 에러 오버레이
- **코드 품질**: ESLint + Prettier 자동화

## 📝 개발 명령어

### 🚀 개발 환경
```bash
npm run dev              # 개발 서버 실행 (Vite)
npm run type-check:watch # TypeScript 실시간 타입 체크
```

### 🔨 빌드 및 배포
```bash
npm run build            # 프로덕션 빌드 (TypeScript + Vite)
npm run preview          # 빌드된 앱 미리보기
```

### 🔍 코드 품질 검사
```bash
npm run lint             # ESLint 실행
npm run type-check       # TypeScript 타입 체크
npm run check-all        # 타입 체크 + 린트 (배포 전 권장)
```

### 🛠️ 유용한 개발 팁
```bash
# 실시간 타입 검사와 개발 서버 동시 실행
npm run type-check:watch & npm run dev

# 배포 전 전체 검증
npm run check-all && npm run build
```

## 🚨 문제 해결

### 일반적인 문제들

<details>
<summary><strong>🔐 로그인이 작동하지 않는 경우</strong></summary>

1. **환경 변수 확인**
   ```bash
   # .env.local 파일에 Google Client ID 확인
   cat .env.local
   ```

2. **Google Cloud Console 설정 확인**
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173/auth/callback`

3. **브라우저 개발자 도구 확인**
   - Console 탭에서 에러 메시지 확인
   - Network 탭에서 API 요청 상태 확인

4. **백엔드 서버 상태 확인**
   - https://nowwhat-back.vercel.app/health 접속 확인
</details>

<details>
<summary><strong>⚡ 개발 서버가 느린 경우</strong></summary>

1. **Node.js 버전 확인**
   ```bash
   node --version  # 18.0 이상 확인
   ```

2. **캐시 클리어**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **브라우저 캐시 클리어**
   - Chrome: Ctrl+Shift+R (하드 리프레시)
</details>

<details>
<summary><strong>🔧 빌드 에러가 발생하는 경우</strong></summary>

1. **타입 에러 확인**
   ```bash
   npm run type-check
   ```

2. **린트 에러 확인**
   ```bash
   npm run lint
   ```

3. **의존성 재설치**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
</details>

### 🆘 지원 및 기여

- **이슈 리포트**: GitHub Issues에서 버그 리포트 및 기능 요청
- **기여 방법**: Pull Request를 통한 코드 기여 환영
- **코드 스타일**: ESLint 설정을 따라주세요

### 📊 성능 최적화

- **Lighthouse 점수**: 90+ 목표
- **Core Web Vitals**: Google 권장 기준 준수
- **번들 크기**: 1MB 이하 유지

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

<div align="center">

**🌟 NowWhat과 함께 당신의 목표를 현실로 만들어보세요! 🌟**

Made with ❤️ in Seoul, Korea

</div>
