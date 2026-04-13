# rom-detector

ROM(관절가동범위) 측정 + CES(Corrective Exercise Strategy) 재활 처방 웹 앱.
의료/헬스케어 용도. 1인 개발, GitHub Pages 배포.

## ⚠️ 최우선 규칙
**모든 코드 작성 전 [PRD.md](./PRD.md) 먼저 확인.**
PRD 조항 위반 = Fail. 파일 200줄, `any` 금지, 매직 스트링 금지, 아키텍처 규칙 등 모두 엄수.

## 기술 스택
- React 19 + TypeScript + Vite
- React Router (BrowserRouter + basename `/rom-detector`)
- Tailwind CSS 4 + 커스텀 CSS
- Playwright E2E (Chromium + WebKit)
- localStorage 기반 (서버 없음)

## 명령어
- `npm run dev` — 개발 서버 (포트 5173, URL `/rom-detector/...`)
- `npm run build` — 빌드 + 404.html fallback 복사 (GitHub Pages SPA)
- `npm run lint`
- `npm run test:e2e`
- `npm run test:e2e:ui` — Playwright UI 모드
- `npm run deploy` — gh-pages 배포

## 라우트 (BrowserRouter, basename `/rom-detector`)
- `/` 홈 — 환자 등록/선택
- `/measure` 측정
- `/results` 결과 대시보드
- `/ces` CES 프로토콜
- `/ces-player` 가이드 운동 플레이어
- `/cesinfo` CES 레퍼런스
- `/trends?patientId=X` 경과 관찰
- `/settings` 설정

## localStorage 키 (직접 접근 금지, `lib/` 래퍼 사용)
- `rom_session` — 현재 측정 세션 (`RomSession`)
- `rom_patients` — 환자 목록 (`Patient[]`)
- `rom_history_{patientId}` — 환자별 측정 히스토리
- `ces_history_durations` — CES 4단계 누적 시간

CES 4단계: Inhibit(억제) → Lengthen(신장) → Activate(활성) → Integrate(통합)

## UI/UX 컨벤션
- **브레이크포인트:** 모바일 ≤720px, 태블릿 ≤1100px, 데스크톱 >1100px
- **메인 컬러:** 보라/라벤더 (`var(--primary)` = `#5C6BC0`)
- **버튼 위계:**
  - Primary CTA → 보라 채움
  - Secondary → outline (투명 + 외곽선)
  - Play/시작 → 그린 `#22C55E`
  - 일시정지 → 앰버 `#F59E0B`
  - 초기화/약한 위험 → 회색 outline
- 데스크톱 레이아웃 변경 시 미디어 쿼리로 격리 → 모바일 영향 0 유지

## UI 작업 규칙

### "UI 수정"의 정의
페이지/컴포넌트 렌더 결과가 바뀌는 모든 변경 (CSS, JSX 구조, 레이아웃, 색상, 텍스트 등).

### 필수 절차
1. 코드 수정
2. Playwright로 스크린샷 촬영 (규칙 아래)
3. 스크린샷 보여주고 승인 요청
4. 승인 후 다음 작업

**예외:** 사용자가 "쭉 진행" / "일괄" 등을 명시하면 중간 승인 생략하고 최종 결과만 한 번에 보고.

### 스크린샷 규칙
- **형식:** JPG (`type: jpeg`)
- **범위:**
  - 반응형 영향 있는 변경 → 데스크톱(1440) + 모바일(390) 둘 다
  - 한쪽만 영향 → 해당 뷰포트만
- **캡처 방식:** `fullPage: true` 우선 시도. 15초 타임아웃 나면 viewport 단위로 스크롤하며 여러 장.
- **파일명:** `screenshot_after_{작업명}.jpg`
- **저장 위치:**
  - 승인용(임시): 프로젝트 루트
  - 승인 후 메모리 폴더 `~/.claude/projects/-Users-jeonghunsakong-Projects-rom-detector/memory/screenshots/YYYY-MM-DD-주제/`로 이동
- 필요 시 작업 전에도 한 장 찍어 Before/After 비교.

### Playwright MCP
- 스크린샷 촬영 시 별도 허락 없이 실행
- localhost 접근 허용
- 작업 중간 상태는 묻지 말고 최종만 보고

## 작업 시 패턴
- **직접 브라우저 확인** — 목업/추측 말고 dev 서버 + Playwright MCP로 실측
- **E2E 셀렉터** — `data-testid` 없으므로 `getByRole`, `getByPlaceholder`, `getByText` 사용
- **E2E 네비게이션** — `navigateTo(page, '/ces')` 헬퍼 사용 (URL에 `#` 쓰지 말 것)

## 절대 금지
- `dist/` 폴더 직접 수정 (gh-pages가 자동 생성)
- `.claude/`, `.playwright-mcp/`, `test-results/` 커밋 (이미 `.gitignore`)
- `--no-verify` 등 hook 우회
- 환자 정보를 외부 서비스로 전송 (의료 데이터)

## 자주 보는 파일
- `src/lib/romTypes.ts` — 도메인 타입 + 세션 유틸
- `src/lib/patientHistory.ts` — 환자/히스토리 localStorage 래퍼
- `src/lib/ces/CesPlayerTypes.ts` — CES 단계/페이즈 메타
- `src/styles/dashboard_premium.css` — 전체 디자인 토큰
- `src/styles/ces_player.css` — 플레이어 레이아웃
- `vite.config.ts` — `base: '/rom-detector/'`

## 이 파일의 역할
- **PRD.md** → 제품/아키텍처 규칙 (강제)
- **CLAUDE.md** → Claude Code가 빠르게 컨텍스트 잡는 요약 + 작업 패턴
