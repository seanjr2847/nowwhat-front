# Now What? - Frontend

"Now What?" 프로젝트의 프론트엔드 애플리케이션입니다. React + TypeScript + Vite를 기반으로 구축되었습니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

1. 저장소 클론
```bash
git clone <repository-url>
cd nowwhat-front
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env.local
```

4. 개발 서버 실행
```bash
npm run dev
```

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

## 🛠️ 사용된 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **Tailwind CSS** - 스타일링
- **shadcn/ui** - UI 컴포넌트
- **Lucide React** - 아이콘

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # shadcn/ui 컴포넌트
│   ├── AuthProvider.tsx # 인증 상태 관리
│   ├── ProtectedRoute.tsx # 라우트 보호
│   └── header.tsx      # 헤더 컴포넌트
├── hooks/              # 커스텀 훅
│   └── useAuth.ts      # 인증 훅
├── lib/                # 유틸리티 및 설정
│   ├── api.ts          # API 클라이언트
│   ├── auth.ts         # 인증 서비스
│   └── utils.ts        # 공통 유틸리티
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── AuthCallbackPage.tsx
│   └── MyListsPage.tsx
└── App.tsx             # 메인 앱 컴포넌트
```

## 🎯 주요 기능

- ✅ 구글 OAuth 로그인/로그아웃
- ✅ JWT 토큰 기반 인증
- ✅ 보호된 라우트 시스템
- ✅ 반응형 디자인
- ✅ 다크/라이트 테마
- ✅ 전역 상태 관리

## 📝 개발 스크립트

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 미리보기
npm run lint         # ESLint 실행
npm run type-check   # TypeScript 타입 체크
```

## 🚨 문제 해결

### 로그인이 작동하지 않는 경우

1. 구글 클라이언트 ID가 올바르게 설정되었는지 확인
2. 백엔드 서버가 실행 중인지 확인
3. 브라우저 콘솔에서 오류 메시지 확인
4. CORS 설정이 올바른지 확인

### 토큰 만료 오류

- 애플리케이션이 자동으로 토큰을 갱신하려고 시도합니다
- 갱신이 실패하면 자동으로 로그아웃됩니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
