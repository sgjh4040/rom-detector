# rom-detector UI 리디자인 — physiolog-collab 톤 흡수

**Status:** Draft — 유저 승인 대기
**Date:** 2026-05-16
**Owner:** sakongjoenghun
**Reference:** [physiolog-collab](https://physiolog-collab.vercel.app/), `~/Projects/physiolog-collab`

---

## 1. 목표

rom-detector 의 시각 톤을 physiolog-collab 수준의 "모던 프리미엄 SaaS" 로 끌어올린다.
**기능·라우트·도메인 코드는 그대로 두고 시각·컴포넌트 레이어만 교체.**

성공 기준:
- 사용자가 두 앱을 나란히 봤을 때 "같은 디자이너가 만든 것 같다" 느낌
- 페이지 200줄 룰, `any` 금지 등 PRD 조항 모두 유지
- 모든 기존 라우트·기능 동일 작동 (E2E 그린 유지)

비목표 (YAGNI):
- 도메인 로직 / API / localStorage 스키마 변경 ❌
- Vercel·PWA 인프라 변경 ❌
- 다국어, 신규 페이지, 신규 기능 ❌
- 다크모드 1차 범위에서는 토큰만 준비, 토글 UI 는 다음 단계로

---

## 2. 디자인 언어 결정

### 2-1. 컬러 토큰 (라벤더 → 중성 모노크롬 + 의료 액센트)

`oklch` 좌표계로 통일. shadcn `radix-nova` 베이스를 그대로 가져오되, **의료 앱이라는 정체성을 위해 액센트 1개만 추가** (physiolog 의 옐로우 자리).

```css
:root {
  /* 베이스 — physiolog 와 동일한 중성 그레이스케일 */
  --background:          oklch(1 0 0);
  --foreground:          oklch(0.145 0 0);
  --card:                oklch(1 0 0);
  --card-foreground:     oklch(0.145 0 0);
  --muted:               oklch(0.97 0 0);
  --muted-foreground:    oklch(0.556 0 0);
  --border:              oklch(0.922 0 0);
  --input:               oklch(0.922 0 0);
  --ring:                oklch(0.708 0 0);

  /* Primary = 거의 블랙 (physiolog 와 동일) */
  --primary:             oklch(0.205 0 0);
  --primary-foreground:  oklch(0.985 0 0);

  /* Secondary / accent — 매우 옅은 그레이 */
  --secondary:           oklch(0.97 0 0);
  --secondary-foreground:oklch(0.205 0 0);
  --accent:              oklch(0.97 0 0);
  --accent-foreground:   oklch(0.205 0 0);

  /* 의료 액센트 — VAS/통증/경고용. Coral 한 톤만. */
  --destructive:         oklch(0.577 0.245 27.325);

  /* CES 4단계 — 채도 낮은 segment 컬러 (시각 식별용만, 메인 액션엔 안 씀) */
  --stage-inhibit:       oklch(0.65 0.10 230);   /* slate blue */
  --stage-lengthen:      oklch(0.70 0.10 180);   /* teal */
  --stage-activate:      oklch(0.72 0.13 80);    /* warm amber */
  --stage-integrate:     oklch(0.65 0.13 150);   /* sage green */

  /* Radius — physiolog 동일 */
  --radius: 0.625rem;
}

.dark {
  --background:          oklch(0.145 0 0);
  --foreground:          oklch(0.985 0 0);
  --card:                oklch(0.205 0 0);
  /* ... physiolog dark 토큰 1:1 복사 ... */
}
```

**제거 대상**:
- `--primary: #5C6BC0` (보라)
- `linear-gradient(135deg, #1A1F36 ...)` (사이드바 다크 글래스)
- `backdrop-filter: blur(20px)` (글래스 모피즘 전반)
- 카드 그라데이션 배경 전반

### 2-2. 타이포그래피

- **Geist Sans** (본문) + **Geist Mono** (수치 — 각도, VAS 점수 등)
- 한글: Pretendard 보조 (Geist 가 한글 미지원이라 fallback)
- Vite 환경에서는 `@fontsource-variable/geist` + `@fontsource-variable/pretendard` 패키지로 self-host
- 타이포 스케일 (Tailwind 기본 + 헤딩만 정의):
  - h1: `text-2xl font-semibold tracking-tight`
  - h2: `text-xl font-semibold`
  - h3: `text-base font-medium`
  - body: `text-sm`
  - caption / 메타: `text-xs text-muted-foreground`

### 2-3. 간격·반경 시스템

- 카드 padding: `p-4` (모바일) / `p-6` (≥1100px)
- 컴포넌트 간 gap: `gap-4` 기본, `gap-2` 인라인
- 컨테이너 max-width: **`max-w-2xl` (640px)** 모바일 우선, 데스크톱은 `lg:max-w-3xl` (768px)
- 사이드바 ❌ → **상단 헤더 + 풀폭 컨텐츠** (physiolog 와 동일 구조)
- 모서리: `rounded-lg` 기본, `rounded-xl` 카드, `rounded-2xl` 모달

### 2-4. 컴포넌트 라이브러리 결정: shadcn/ui

`components.json` 추가, 다음 컴포넌트만 1차 도입:
```
button, card, tabs, dialog, drawer, dropdown-menu,
input, label, badge, separator, skeleton, sonner (toast),
alert-dialog, popover, scroll-area, switch, sheet
```

기존 커스텀 CSS 와 충돌 없도록 **새 globals.css 로 토큰 일원화** → 기존 `dashboard_premium.css`, `ces_player.css` 등은 단계적으로 흡수.

**Tailwind v4 + shadcn 호환**: physiolog 와 동일하게 `@import "tailwindcss"` + `@import "tw-animate-css"` + `@import "shadcn/tailwind.css"` 형태.

---

## 3. 아키텍처 (코드 레이아웃)

```
src/
  styles/
    globals.css           ← 신규. 토큰 단일 진입점
    [legacy/]             ← 기존 *.css 이동, 점진 폐기
  components/
    ui/                   ← shadcn 컴포넌트 (자동 생성)
    layout/
      AppShell.tsx        ← 상단 헤더 + main + bottom nav (모바일)
      TopNav.tsx
      MobileBottomNav.tsx
  features/
    patients/             ← 기존 pages/components 점진 재구성
    measurement/
    ces/
    trends/
```

원칙:
- `components/ui/` 는 shadcn 표준, 손대지 않음
- `components/layout/` 는 앱 셸 (재사용)
- `features/*` 는 도메인별 화면 (기존 `pages/` 코드 흡수)
- 모든 파일 ≤ 200줄 유지 (PRD 규칙)

---

## 4. 페이지별 리디자인 윤곽

각 페이지는 **기능·라우트 동일**, 시각만 교체.

### 4-1. `/` 홈 (환자 선택)
- **현재**: 좌측 보라 사이드바 + 메인 영역. 환자 카드 가로 1개.
- **새 디자인**: physiolog 의 `PatientList` 구조 차용
  - 상단 헤더: `physiolog` 로고 자리에 `ROM Detector` 워드마크 + 우측 프로필 드롭다운
  - 본문: 환자 검색 input + 환자 카드 list (각 카드: 이름·나이·마지막 측정일·VAS)
  - 우하단 floating `+ 새 환자` (모바일) / 우상단 outline 버튼 (데스크톱)
- 카드 hover: `hover:bg-muted` (보라 톤 제거)

### 4-2. `/measure` 측정
- **유지**: 측정 인터랙션·각도 로직 일체 그대로
- **교체**: 상단 진행 상태 bar → shadcn `Progress`, 결과 카드 → `Card` + 큰 `text-mono` 각도값
- 보라 CTA → 검정 `Button variant="default"`

### 4-3. `/results` 결과 대시보드
- 라벤더 그라데이션 BG 제거, 흰 BG + 그레이 보더 카드
- 차트(recharts) 색상: 검정·중성회색 + 상태별 stage 컬러만
- VAS 표시: `text-4xl font-mono tabular-nums`

### 4-4. `/ces` & `/ces-player`
- 사이드바 다크 글래스 → **상단 sticky 헤더** (단계 progress + 현재 운동명)
- 4단계는 `Tabs` 컴포넌트, 비활성 단계는 흐리게
- 운동 카드: shadcn `Card`, 영상 thumbnail + 운동명 + 근육 chip
- 인체 도해 (`react-muscle-highlighter` 사용 검토 — physiolog 가 쓰는 라이브러리. 현재 SVG 와 호환되면 교체, 아니면 색만 토큰화)

### 4-5. `/cesinfo` `/trends` `/settings`
- 동일 패턴: 헤더 + max-w-2xl 컨텐츠 + shadcn 컴포넌트

### 4-6. 새 컴포넌트: `AppShell`
```tsx
<AppShell>
  <TopNav />          {/* 모든 페이지 공통 헤더 */}
  <main>{children}</main>
  <MobileBottomNav /> {/* 모바일 하단 네비 — 5개 탭 max */}
</AppShell>
```
- 모바일: 하단 탭 (홈 / 측정 / 결과 / CES / 설정)
- 데스크톱 (≥1100px): 하단 탭 숨기고 상단 nav 만

---

## 5. 마이그레이션 전략 (페이지별 점진)

부수효과를 최소화하기 위해 **레이어 단위 → 페이지 단위** 순서.

**Phase 0 — 토큰·셸 (1일)**
1. `tailwind.config` / `globals.css` 신규, shadcn init, Geist/Pretendard 폰트 셋업
2. shadcn 컴포넌트 17개 install
3. `AppShell` `TopNav` `MobileBottomNav` 만들어 라우터에 끼움
4. 기존 페이지 그대로 둠 — 시각 충돌은 다음 phase 에서 해소
5. **검증**: 빌드 그린, E2E 그린, 라이트하우스 스코어 동등

**Phase 1 — 홈 + 측정 (1일)**
- `/` 와 `/measure` 만 새 컴포넌트로 교체
- 매 페이지 데스크톱+모바일 스크린샷 → 승인 → 머지
- 다른 페이지는 일시적으로 톤 불일치하지만 기능 OK

**Phase 2 — 결과 + 트렌드 (1일)**
- `/results` `/trends` 교체
- recharts 색상·축 스타일 토큰화

**Phase 3 — CES 전체 (1.5일)**
- `/ces` `/ces-player` `/cesinfo` 교체 (가장 큰 페이지)
- 사이드바 다크 글래스 폐기 → sticky 헤더로
- `dashboard_premium.css` `ces_player.css` 삭제

**Phase 4 — 설정 + 정리 (0.5일)**
- `/settings` 교체
- legacy CSS 파일 일괄 제거, 데드 코드 정리
- README/CLAUDE.md 디자인 섹션 갱신

**총 약 4~5일**, 페이지별로 끊어 머지 가능 → 도중에 멈춰도 항상 배포 가능 상태.

---

## 6. 검증 루프 (페이지별 의무)

PRD 의 "UI 작업 규칙" 그대로 적용:
1. 코드 수정 → `npm run dev` → Playwright 로 데스크톱(1440)·모바일(390) 스크린샷
2. JPG 파일 첨부 → 유저 승인
3. 승인 후 스크린샷을 `~/.claude/projects/-Users-jeonghunsakong-Projects-rom-detector/memory/screenshots/2026-05-16-redesign/` 로 이동
4. `npm run lint` + `npm run test:e2e` 통과 → 머지

**중요**: 기능 동작 변경 없으면 E2E 그대로 재사용 가능. 셀렉터가 `data-testid` 없이 `getByRole`·`getByText` 기반이라 텍스트만 안 바꾸면 깨질 위험 낮음.

---

## 7. 리스크 & 완화

| 리스크 | 영향 | 완화 |
|---|---|---|
| Tailwind v4 + shadcn 호환 이슈 | 빌드 깨짐 | physiolog 가 동일 Tailwind v4 + shadcn 으로 성공 → 토큰·컴포넌트 1:1 카피 |
| shadcn CLI 가 Vite 환경 (Next.js 아님) | init 단계 막힘 | shadcn 공식 Vite 가이드 사용 (`--style new-york`, alias 매핑 `tsconfig.app.json` 에 추가). Phase 0 첫 작업으로 검증 |
| Geist 한글 미지원으로 글자 뭉개짐 | 가독성 저하 | Pretendard fallback, `font-feature-settings` 검증 |
| recharts 차트 색상 재정의 시 가독성 손상 | 의료 데이터 오해 | Phase 2 검증 단계에서 좌우반전/색맹 시뮬레이션 |
| `react-muscle-highlighter` 라이브러리가 현재 SVG 와 호환 안 됨 | 근육 색칠 깨짐 | 1차에는 현 SVG 유지, 색만 토큰화. 라이브러리 교체는 별 spec |
| 페이지 점진 교체 중 일시적 톤 불일치 | UX 일관성 ↓ | 4~5일 안에 끝낼 수 있는 분량, 친구·환자 데모 일정 피해서 진행 |
| PWA 캐시가 구버전 CSS 잡아 두 톤 섞임 | 폰에서 깨짐 | `skipWaiting` + `clientsClaim` 이미 적용됨 (CLAUDE.md 확인) |

---

## 8. 결정해야 할 것

이 스펙을 확정하려면 다음 3개만 결정해주시면 됩니다:

1. **액센트 컬러**: physiolog 의 옐로우 대신 의료 앱에 어울리는 한 가지 색
   - (A) **순흑만 유지** (가장 미니멀, physiolog 그대로)
   - (B) Coral/주황 1개 추가 (통증·VAS 표시용으로 자연스러움)
   - (C) Teal/청록 1개 추가 (의료·헬스 톤)

2. **다크모드 토글 UI**: 이번 범위에 포함할지
   - (A) 토큰만 준비, 토글 UI 는 다음에
   - (B) `/settings` 에 토글까지 포함

3. **마이그레이션 속도**:
   - (A) **페이지별 끊어 머지** (위 Phase 그대로) — 안전, 4~5일
   - (B) 한 번에 전부 교체 (브랜치 따로) — 빠르지만 중간 검증 어려움

답 주시면 spec 확정 → 구현 플랜으로 넘어갑니다.
