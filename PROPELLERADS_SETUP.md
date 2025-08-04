# PropellerAds 설정 가이드

## 1. PropellerAds 계정 생성

1. [PropellerAds](https://propellerads.com) 방문
2. "Get Started" 클릭하여 퍼블리셔 계정 생성
3. 웹사이트 정보 입력 (즉시 승인 가능)

## 2. 사이트 추가 및 Zone 생성

### 사이트 추가:
1. 대시보드에서 "Sites" 메뉴 클릭
2. "Add Site" 버튼 클릭
3. 도메인 입력: `your-domain.com`
4. 카테고리 선택: `Productivity/Tools`

### Zone 생성:
1. "Zones" 메뉴 클릭
2. "Create Zone" 버튼 클릭
3. Zone 설정:
   - **Zone Type**: `Display Banner`
   - **Size**: `728x90` (배너용)
   - **Name**: `NowWhat Banner`
   - **Site**: 방금 추가한 사이트 선택

## 3. 환경 변수 설정

`.env` 파일에서 다음 값들을 업데이트하세요:

```bash
# PropellerAds 설정
VITE_PROPELLER_ZONE_ID=YOUR_ACTUAL_ZONE_ID
VITE_PROPELLER_SITE_ID=YOUR_ACTUAL_SITE_ID

# Mock 광고 사용 여부 (false로 설정하면 PropellerAds 사용)
VITE_USE_MOCK_ADS=false
```

### Zone ID 찾는 방법:
1. PropellerAds 대시보드 → "Zones"
2. 생성한 Zone 클릭
3. "Zone ID" 복사 (숫자로 된 ID)

### Site ID 찾는 방법:
1. PropellerAds 대시보드 → "Sites"
2. 등록한 사이트 클릭
3. "Site ID" 복사

## 4. 현재 상태

### 개발 환경 (VITE_USE_MOCK_ADS=true)
- 실제 같은 Mock 광고 표시
- PropellerAds 승인 전까지 사용

### 프로덕션 환경 (VITE_USE_MOCK_ADS=false)
- 실제 PropellerAds 광고 표시
- 광고 수익 발생 시작

## 5. PropellerAds 장점

✅ **즉시 승인**: 계정 생성 후 바로 사용 가능
✅ **높은 수익**: AdSense 대비 80-120% 수익률  
✅ **다양한 광고**: 배너, 팝업, 네이티브 등
✅ **글로벌 지원**: 전 세계 트래픽 지원
✅ **최소 지급액**: $25 (AdSense: $100)

## 6. 광고 타입별 수익률

- **Display Banner**: 중간 수익, 사용자 경험 좋음
- **Pop-under**: 높은 수익, 약간의 방해
- **Native Ads**: 높은 클릭률, 콘텐츠와 자연스럽게 섞임

## 7. 수익 최적화 팁

1. **적절한 배치**: 사용자 경험을 해치지 않는 위치
2. **A/B 테스트**: 다양한 Zone으로 테스트
3. **트래픽 품질**: 봇 트래픽 방지
4. **모바일 최적화**: 모바일 사용자 고려

## 8. 지급 방식

- **PayPal**: 수수료 낮음
- **Wire Transfer**: 큰 금액에 적합
- **WebMoney**: 빠른 처리
- **지급 주기**: 매주 또는 격주

## 9. 문제 해결

### 광고가 표시되지 않는 경우:
1. Zone ID 확인
2. Site ID 확인  
3. 도메인 승인 상태 확인
4. 브라우저 광고 차단기 확인

### Mock 광고로 전환하려면:
```bash
VITE_USE_MOCK_ADS=true
```

### 실제 PropellerAds로 전환하려면:
```bash
VITE_USE_MOCK_ADS=false
VITE_PROPELLER_ZONE_ID=실제Zone ID
VITE_PROPELLER_SITE_ID=실제Site ID
```

## 10. 다음 단계

1. ✅ PropellerAds 계정 생성
2. ✅ 사이트 추가 및 승인
3. ✅ Zone 생성 (Display Banner)
4. ✅ Zone ID 및 Site ID 확인
5. ✅ 환경 변수 업데이트
6. ✅ 프로덕션 배포
7. ✅ 수익 모니터링 시작

**예상 승인 시간**: 즉시 ~ 24시간
**예상 첫 수익**: 배포 후 1-3일 내