# 새로운 브랜드 컬러 시스템

## 기본 브랜드 컬러
- **Primary**: `#03B2F9` (RGB: 3, 178, 249)
- **Secondary**: `#00EDCE` (RGB: 0, 237, 206)

## Tailwind CSS 커스텀 컬러 매핑

### Primary 계열 (기존 blue 대체)
```css
--primary-50: #f0f9ff;   /* 매우 밝은 */  
--primary-100: #e0f2fe;  /* 밝은 */
--primary-200: #bae6fd;  /* 연한 */
--primary-300: #7dd3fc;  /* 보통 연한 */
--primary-400: #38bdf8;  /* 보통 */
--primary-500: #03b2f9;  /* 기본 (Primary) */
--primary-600: #0284c7;  /* 진한 */
--primary-700: #0369a1;  /* 더 진한 */
--primary-800: #075985;  /* 매우 진한 */
--primary-900: #0c4a6e;  /* 가장 진한 */
```

### Secondary 계열 (기존 purple 대체)
```css
--secondary-50: #f0fdfa;  /* 매우 밝은 */
--secondary-100: #ccfbf1; /* 밝은 */
--secondary-200: #99f6e4; /* 연한 */
--secondary-300: #5eead4; /* 보통 연한 */
--secondary-400: #2dd4bf; /* 보통 */
--secondary-500: #00edce; /* 기본 (Secondary) */
--secondary-600: #0d9488; /* 진한 */
--secondary-700: #0f766e; /* 더 진한 */
--secondary-800: #115e59; /* 매우 진한 */
--secondary-900: #134e4a; /* 가장 진한 */
```

## 그라데이션 매핑
```css
/* 기존 → 새로운 */
from-blue-600 to-purple-600    → from-primary-600 to-secondary-600
from-blue-400 to-purple-400    → from-primary-400 to-secondary-400  
from-blue-500 to-purple-500    → from-primary-500 to-secondary-500
from-blue-400 via-purple-400 to-pink-400 → from-primary-400 via-secondary-400 to-secondary-300
from-blue-600 via-purple-600 to-pink-600 → from-primary-600 via-secondary-600 to-secondary-400
```