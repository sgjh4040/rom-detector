# E2E Testing Design — rom-detector

**Date:** 2026-04-13
**Approach:** 페이지 단위 독립 테스트 + 통합 골든패스 테스트
**Tool:** Playwright
**Browsers:** Chromium + WebKit (Safari)
**Environment:** 로컬 dev 서버 (`npm run dev`), 수동 실행

---

## 프로젝트 구조

```
e2e/
├── playwright.config.ts
├── fixtures/
│   └── test-data.ts              # localStorage 목 데이터
├── helpers/
│   └── setup.ts                  # 공통 헬퍼 (localStorage 주입, HashRouter 네비게이션)
├── pages/                        # 페이지별 독립 테스트
│   ├── index.spec.ts
│   ├── measurement.spec.ts
│   ├── results.spec.ts
│   ├── ces-protocol.spec.ts
│   ├── ces-player.spec.ts
│   ├── ces-info.spec.ts
│   ├── settings.spec.ts
│   └── trends.spec.ts
└── journeys/                     # 통합 골든패스 테스트
    ├── patient-to-results.spec.ts
    └── results-to-ces.spec.ts
```

## Playwright 설정

- `baseURL`: `http://localhost:5173`
- `webServer`: `npm run dev` 자동 시작, 이미 켜져있으면 재사용
- `screenshot`: 실패 시만 저장
- `trace`: 첫 번째 재시도 시 저장
- HashRouter 대응: `/#/path` 형태로 네비게이션

## 테스트 데이터 전략

- **독립 테스트**: `seedLocalStorage()`로 필요한 상태를 미리 주입
- **통합 테스트**: 시딩 없이 처음부터 실제 흐름 그대로 진행
- 앱의 실제 localStorage 키/구조(`rom_session`, `patients` 등)를 그대로 사용

## 페이지별 독립 테스트

| 페이지 | 라우트 | 테스트 항목 |
|--------|--------|-----------|
| 홈 | `/` | 환자 이름/나이 입력 → 통증 부위/VAS → 사이드 모드 → 관절 토글 → "측정 시작하기" 활성화 |
| 측정 | `/measure` | 각도 입력 → 퍼센트 버튼 값 변경 → 이전/다음 이동 → 프로그레스바 진행 |
| 결과 | `/results` | 통계카드 3개 렌더링 → 관절 카드 펼침 → "CES 재활 시작" 버튼 존재 |
| CES | `/ces` | 4개 스테이지 탭 전환 → 운동 목록 표시 → "자동 재생 시작" 버튼 |
| CES 플레이어 | `/ces-player` | 재생/일시정지 토글 → 다음/이전 스킵 → 프로그레스바 세그먼트 |
| CES 정보 | `/cesinfo` | 관절 버튼 → 무브먼트 탭 → 프로토콜 섹션 → "Go to Protocol" 네비게이션 |
| 설정 | `/settings` | 환자수/측정수 카드 → 내보내기 다운로드 → 삭제 confirm |
| 경과관찰 | `/trends` | 대시보드/상세 뷰 토글 → 히스토리 아이템 선택 상태 변경 |

## 통합 골든패스 테스트

| 여정 | 흐름 |
|------|------|
| 환자→결과 | 홈 환자 등록 → 관절 선택 → 측정 값 입력 → 결과 도착 → 통계카드 확인 |
| 결과→CES | "CES 재활 시작" → CES 스테이지 확인 → "자동 재생 시작" → 플레이어 진입 → 재생 동작 확인 |

## 실행 방법

```bash
# Playwright 설치
npm install -D @playwright/test
npx playwright install chromium webkit

# 전체 테스트 실행
npx playwright test

# 특정 파일만
npx playwright test e2e/pages/index.spec.ts

# UI 모드 (디버깅)
npx playwright test --ui

# Chromium만
npx playwright test --project=chromium
```
