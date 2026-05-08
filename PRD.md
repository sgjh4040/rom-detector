# ROM 측정기 — Product Requirements Document (PRD)

> **⚠️ 모든 코드 작성 전 이 문서를 반드시 먼저 읽을 것. 아래 규칙을 위반하면 즉시 Fail 처리.**

---

## 🎯 프로젝트 개요

| 항목 | 내용 |
|---|---|
| **앱 이름** | ROM 측정기 (관절 가동범위 측정 및 재활 처방 도구) |
| **대상 사용자** | 물리치료사, 재활 전문가 |
| **핵심 목적** | 관절(Shoulder/Elbow/Wrist/Hip/Knee/Ankle)의 ROM(Range of Motion)을 측정하고, 측정 결과에 맞는 맞춤 재활 운동을 처방하는 웹 앱 |
| **프론트엔드** | React (Vite) + TypeScript |
| **스타일링** | Vanilla CSS (index.css, App.css) |
| **상태 관리** | React useState / localStorage (세션 데이터) |
| **백엔드/DB** | 현재 없음 (로컬 세션). 향후 Firebase 연동 예정 |
| **배포 목표** | 웹 브라우저 (PWA 고려) |

---

## 🏛️ 1. 아키텍처 및 폴더 구조 명세 (Feature-Driven Architecture)

코드는 반드시 **기능(Feature)** 단위로 분리하고, 각 기능 안에서 3개의 계층(Layer)으로 나눈다.

```
src/
├── core/                          # 공통 모듈 (전역 재사용)
│   ├── components/                # 공통 UI 컴포넌트 (버튼, 입력창 등)
│   ├── types/                     # 전역 공통 타입 정의
│   └── utils/                     # 공통 유틸 함수
│
├── features/
│   ├── measurement/               # ROM 측정 기능
│   │   ├── presentation/          # UI 컴포넌트 (화면)
│   │   ├── domain/                # 타입 / 인터페이스 정의
│   │   └── data/                  # 데이터 접근 (localStorage 등)
│   │
│   ├── results/                  # 결과 분석 기능
│   │   ├── presentation/
│   │   ├── domain/
│   │   └── data/
│   │
│   └── session/                  # 환자 세션 관리
│       ├── presentation/
│       ├── domain/
│       └── data/
│
├── lib/                           # 도메인 데이터 (romData.ts 등 정적 데이터)
└── pages/                         # 라우팅 진입점 (thin wrapper만, 로직 금지)
```

### ❌ 절대 금지 사항

- **UI 컴포넌트(`.tsx`) 안에 데이터 조작 로직(localStorage 직접 접근 등)을 작성하지 마라.**
- 공통 UI(버튼, 뱃지, 입력창)를 각 컴포넌트에서 인라인으로 만들지 마라. → `/core/components`로 분리.
- `any` 타입을 절대 사용하지 마라. TypeScript는 무조건 엄격하게 작성한다.

---

## 🚨 2. 무관용 보안 원칙 (Zero-Tolerance Security)

### 2-1. 환경변수 강제

- Firebase 등 외부 서비스를 연동할 경우, **모든 API Key / 시크릿 값은 `.env` 파일에 보관한다.**
- `.env`는 반드시 `.gitignore`에 포함되어야 한다.
- 코드에 `const API_KEY = "sk-..."` 형태의 하드코딩 **절대 금지.**

```typescript
// ✅ 올바른 방법
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ 잘못된 방법 — 즉시 Fail
const apiKey = "sk-abc123xyz";
```

### 2-2. localStorage 데이터 보안

- 현재 `localStorage`에 환자 데이터(이름, 나이, 측정값)가 저장되고 있다.
- **저장 전 데이터는 반드시 타입 검증 후 직렬화(serialize)할 것.**
- 향후 Firebase 연동 시, Firestore Security Rules로 `uid` 기반 접근 제어 필수.

### 2-3. 타입 안전성 (Type Safety) — 핵심 규칙

- `any` 타입 사용 **절대 금지.**
- `unknown` 타입 + 타입가드 패턴을 사용할 것.
- 모든 데이터 모델은 `interface` 또는 `type`으로 명시적으로 정의할 것.

```typescript
// ✅ 올바른 방법
interface RomSession {
  patientName: string;
  patientAge: number;
  targetSide: '좌측' | '우측' | '양측';
  measurements: Record<string, number>;
}

// ❌ 잘못된 방법 — 즉시 Fail
const [session] = useState<any>(() => { ... });
```

---

## 💣 3. 시한폭탄(잠재적 버그) 사전 차단

### 3-1. localStorage 파싱 안전 처리

```typescript
// ✅ 올바른 방법: try-catch + 타입가드
const loadSession = (): RomSession | null => {
  try {
    const saved = localStorage.getItem('rom_session');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (!isValidRomSession(parsed)) return null; // 타입가드 검사
    return parsed;
  } catch (error) {
    console.error('세션 데이터 파싱 실패:', error);
    return null;
  }
};

// ❌ 잘못된 방법 — JSON.parse 결과를 바로 any로 사용
const saved = localStorage.getItem('rom_session');
return saved ? JSON.parse(saved) : null;
```

### 3-2. 필수 에러 핸들링

- 모든 데이터 계층(Data Layer) 함수는 `try-catch`로 감쌀 것.
- `catch` 블록에서 `console.error` 와 사용자 친화적 메시지를 분리할 것.

### 3-3. 입력값 유효성 검사

- ROM 측정값은 `0 ~ 360` 범위인지 확인 후 저장.
- 음수 입력 방지 로직 포함.

---

## 🧹 4. 클린 코드 (Clean Code & SOLID) 강제 규칙

### 4-0. 파일 길이 제한 ⭐ NEW

- 개발자가 직접 작성하는 **모든 코드 파일(`.ts`, `.tsx`, `.css` 등)은 200줄을 초과할 수 없다.**
- 초과 시 즉시 역할에 따라 파일을 분리해라. 예: `romData.ts`가 200줄 넘으면 `romTypes.ts`, `romExercises.ts`, `romCalculations.ts`로 쪼개라.

> **📌 자동 생성 파일은 이 규칙의 예외다.**
> `package-lock.json`, `dist/`, `node_modules/` 등 도구가 자동으로 생성하는 파일은 개발자가 작성하는 코드가 아니므로 줄 수 제한을 적용하지 않는다. 절대 손으로 편집하지 마라.

| 파일 종류 | 200줄 규칙 |
|---|---|
| `.ts`, `.tsx`, `.css`, `.js` (직접 작성) | ✅ 적용 |
| `package-lock.json`, `dist/`, `node_modules/` | ❌ 자동생성 — 예외 |

### 4-1. 함수 길이 제한

- 하나의 함수는 **50줄을 초과할 수 없다.**
- 초과 시 의미 있는 이름의 별도 함수로 분리.

### 4-2. Early Return (빠른 반환)

```typescript
// ✅ 올바른 방법: 예외를 먼저 처리하고 반환
const handleSubmit = (session: RomSession | null, jointId: string | null) => {
  if (!session) return navigate('/');
  if (!jointId) return navigate('/');
  // 정상 로직...
};

// ❌ if-else 깊이 3 이상 — 금지
```

### 4-3. 매직 넘버 금지

```typescript
// ✅ 상수로 선언
const ROM_NORMAL_THRESHOLD = 0.85;
const ROM_MILD_THRESHOLD = 0.65;
const ROM_MODERATE_THRESHOLD = 0.45;

// ❌ 코드에 직접 숫자 삽입 — 금지
if (ratio >= 0.85) return '정상';
```

### 4-4. 타입 정의 위치 원칙

- 도메인 타입(비즈니스 모델)은 `/features/[기능명]/domain/` 또는 `/lib/` 에 정의.
- UI 전용 타입(props 타입)은 해당 컴포넌트 파일 상단에 정의.

---

## 🤖 5. AI 답변 출력 프로토콜 (행동 강령)

코드 요청이 들어오면 **무조건 아래 4단계**를 거쳐라:

| 단계 | 행동 |
|---|---|
| **Step 1: 아키텍처 제안** | 필요한 폴더 구조, 파일 목록, 핵심 로직 흐름을 텍스트로 먼저 요약 |
| **Step 2: 사용자 승인 대기** | "이렇게 구조를 잡고 코딩을 시작할까요?" 묻고 Yes/No 대기 |
| **Step 3: 점진적 코드 작성** | 승인 후, 핵심 파일 **1~2개** 단위로 끊어서 제공 |
| **Step 4: 비개발자 맞춤 설명** | 주요 코드에 레고/일상에 빗댄 **쉬운 주석** 포함 |

---

## 📋 6. 현재 알려진 기술 부채 (Tech Debt)

> 새 기능을 추가하기 전에, 아래 부채부터 인지하고 코드를 작성할 것.

| 파일 | 문제 | 심각도 |
|---|---|---|
| `RomMeasurement.tsx` | `useState<any>` — 타입 미정의 | 🔴 높음 |
| `Results.tsx` | `useState<any>` — 타입 미정의 | 🔴 높음 |
| `RomMeasurement.tsx` | localStorage 파싱 시 try-catch 없음 | 🟡 중간 |
| `Results.tsx` | localStorage 파싱 시 try-catch 없음 | 🟡 중간 |
| `romData.ts` | `calculateSeverity`의 임계값이 매직 넘버 | 🟡 중간 |
| 전체 | `.env` 파일 미생성 (향후 Firebase 연동 대비) | 🔵 낮음 |

---

## 📐 7. 데이터 모델 명세

### RomSession (환자 세션)

```typescript
interface RomSession {
  patientName: string;           // 환자 이름
  patientAge: number;            // 나이
  targetSide: '좌측' | '우측' | '양측';  // 측정 부위 방향
  measurements?: Record<string, number>; // 측정값 (movementId → 각도)
}
```

### Movement (관절 동작)

```typescript
interface Movement {
  id: string;
  name: string;
  normalRange: number;  // 단위: 도(°)
}
```

### Joint (관절)

```typescript
interface Joint {
  id: string;
  name: string;
  movements: Movement[];
}
```

### Severity (제한 등급)

```typescript
type Severity = '정상' | '경도제한' | '중등도제한' | '심각한제한';
```

---

## 🔑 8. 핵심 판단 기준 (ROM 분석 알고리즘)

```
정상: 측정값 ≥ 정상 × 85%
경도제한: 측정값 ≥ 정상 × 65%
중등도제한: 측정값 ≥ 정상 × 45%
심각한제한: 측정값 < 정상 × 45%
특수 케이스: 정상 범위가 0°인 동작 (예: 무릎 완전 신전) — 별도 로직 적용
```

---

## 📷 9. ROM 측정 입력 방법

ROM 측정값은 다음 두 가지 방법으로 입력할 수 있다. 두 방법 모두 같은 `measurements` 객체에 저장되며 후속 분석/처방/기록은 동일하다.

### 9-1. 직접 입력 (기본)

- 슬라이더 + 숫자 입력
- 빠른 비율 버튼 (`25% / 50% / 75% / 목표치`) — 측정자가 각도기/육안으로 측정한 값을 빠르게 반영
- 구현: `features/measurement/presentation/MeasurementPanel.tsx`, `FastInputControls.tsx`

### 9-2. 사진 기반 측정 보조 (선택)

핸드 측정이 어려운 자세(예: 어깨 외회전, 고관절 외전)에서 임상 정확도를 보강하기 위한 보조 도구.

**동작 흐름:**
1. 측정자가 환자 동작 사진을 업로드 (모바일은 카메라/갤러리 선택, 데스크톱은 파일 선택)
2. 사진 위에 **3점을 직접 클릭**:
   - ① 한쪽 끝점 (예: 손목)
   - ② 관절 중심 (예: 팔꿈치)
   - ③ 다른쪽 끝점 (예: 어깨)
3. 두 벡터의 사잇각을 자바스크립트가 계산 → 측정값 자동 입력

**중요 — UI 라벨링 원칙 (audit #35):**
- 이 기능은 **AI 자동 인식이 아니다**. 측정자가 직접 3점을 찍어야 한다.
- 따라서 UI 라벨은 "AI 분석" / "자동 인식" / "정밀 분석" 같은 표현을 쓰지 말 것.
- 권장 라벨: "사진으로 측정하기" + 부제 "사진을 올리고 3점을 찍으면 각도가 자동 계산됩니다".

**구현:**
- `core/components/ImageAngleMeasurer.tsx` — 캔버스 위 사진 표시 + 3점 클릭 + 각도 표시
- `core/components/useAngleMeasurer.ts` — 파일 업로드 → 캔버스 그리기 → 3점 → 두 벡터 사잇각 계산

### 9-3. 의료 데이터 보안

- **사진 첨부물은 서버나 외부 서비스로 전송하지 않는다** (이 앱은 백엔드 자체가 없음).
- 사진은 브라우저 메모리(`HTMLCanvasElement`)에만 존재하며, 측정값(각도 number)만 `RomSession.measurements` 에 저장된다.
- 향후 Firebase 연동 시에도 사진 원본은 업로드하지 말고 측정값만 동기화할 것.

---

> 📌 **이 PRD는 살아있는 문서(Living Document)다.** 새 기능을 추가하거나 설계가 변경될 때마다 이 파일을 업데이트하라.
