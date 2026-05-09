# Index.tsx 422줄 → PRD §4-0 (200줄) 분리

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [src/pages/Index.tsx](../../../src/pages/Index.tsx) 422줄을 PRD §4-0 (200줄 이하)을 만족하도록 책임별로 분리한다. 런타임 동작은 100% 동일.

**Architecture:** 3 Phase 점진 분리. 각 phase는 독립 commit + Playwright 시각 회귀 검증 + 사용자 승인 후 push. 의료 앱이라 회귀 위험 최소화 우선.

**Tech Stack:** React 19, TypeScript, React Router, Vite, Playwright (E2E), localStorage 기반 (서버 없음)

---

## 책임 매트릭스 (현재 422줄)

| 영역 | 라인 | 줄수 | 책임 |
|---|---|---|---|
| import + 상수 | 1-27 | 27 | useState, lib import, SIDE_MODE_MAP |
| **State (14개 useState)** | 29-86 | 58 | name/age/painArea/vasScore/patientId/sideMode/selectedJointIds/isManaging/patients/isAddingNew/isStartingNewMeasurement/pendingDelete |
| handleSelectPatient | 88-123 | 36 | 환자 선택 시 폼 자동 채우기 + saveRomSession |
| handleNewPatient | 127-140 | 14 | "새 환자" 버튼 — state 초기화 |
| handleDeletePatient + handleConfirmDeletePatient | 142-155 | 14 | 환자 삭제 확인 |
| handleSubmit | 157-179 | 23 | 측정 시작 — saveRomSession + navigate |
| 렌더: 빈 상태 + page-header | 184-217 | 34 | EmptyPatientState 분기 + 헤더 |
| 렌더: PatientSelector | 219-230 | 12 | 환자 목록 |
| 렌더: 안내 placeholder | 232-244 | 13 | "환자 선택해 주세요" |
| **렌더: Patient Summary 카드** ⭐ | 246-301 | 56 | 선택된 환자 요약 + CTA + HomePatientSummary |
| **렌더: NewMeasurementForm** ⭐ | 303-400 | 98 | 측정 시작 폼 (이름/나이/통증/방향/관절) |
| ConfirmDialog | 405-419 | 15 | 환자 삭제 확인 다이얼로그 |

⭐ = 분리 1순위 (가장 큰 덩어리, 단일 책임 명확)

## 분리 결과 예측

| 결과물 | 줄수 |
|---|---|
| Index.tsx (after Phase 1+2) | ~260줄 |
| Index.tsx (after Phase 3) | ~150줄 ✅ |
| PatientSummaryCard.tsx | ~85줄 |
| NewMeasurementForm.tsx | ~125줄 |
| useIndexPageHandlers.ts (Phase 3) | ~95줄 |

---

## File Structure

```
src/pages/Index.tsx                                          # ~150줄, thin wrapper
src/features/session/presentation/PatientSummaryCard.tsx     # 신규 ~85줄
src/features/measurement/presentation/NewMeasurementForm.tsx # 신규 ~125줄
src/pages/index/useIndexPageHandlers.ts                      # 신규 (Phase 3) ~95줄
```

PRD §1 준수:
- `PatientSummaryCard` → 환자 세션 도메인 (`features/session/presentation/`)
- `NewMeasurementForm` → 측정 도메인 (`features/measurement/presentation/`)
- `useIndexPageHandlers` → 페이지 전용 훅 (`pages/index/`, CesProtocol 패턴 따름)

---

## Phase 1: `PatientSummaryCard` 분리 (56줄 → 별도 컴포넌트)

선택된 환자의 요약 카드 + 새 측정/기록 보기 CTA + HomePatientSummary 임베드. 단일 책임이 명확하고 props가 단순.

### Task 1.1: PatientSummaryCard 컴포넌트 생성

**Files:**
- Create: `src/features/session/presentation/PatientSummaryCard.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
// src/features/session/presentation/PatientSummaryCard.tsx
import React from "react";
import { Play, LineChart } from "lucide-react";
import { HomePatientSummary } from "./HomePatientSummary";

interface PatientSummaryCardProps {
  patientId: string;
  name: string;
  age: string;
  painArea: string;
  vasScore: number;
  historyCount: number;
  lastMeasuredAt?: string;
  onStartMeasurement: () => void;
  onViewTrends: () => void;
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  patientId,
  name,
  age,
  painArea,
  vasScore,
  historyCount,
  lastMeasuredAt,
  onStartMeasurement,
  onViewTrends,
}) => {
  return (
    <div className="patient-summary">
      <div className="patient-summary__info">
        <h2 className="patient-summary__name">
          {name}
          <span className="patient-summary__age"> ({age}세)</span>
        </h2>
        <div className="patient-summary__meta">
          {painArea && <span>{painArea}</span>}
          {painArea && <span className="dot">·</span>}
          <span>VAS {vasScore}</span>
          {historyCount > 0 && (
            <>
              <span className="dot">·</span>
              <span>측정 {historyCount}회</span>
            </>
          )}
        </div>
        {lastMeasuredAt && (
          <p className="patient-summary__last">
            최근 측정:{" "}
            {new Date(lastMeasuredAt).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
      <div className="patient-summary__actions">
        <button
          type="button"
          className="btn btn-primary btn-large"
          onClick={onStartMeasurement}
        >
          <Play size={18} /> 새 측정 시작
        </button>
        <button
          type="button"
          className="btn btn-outline btn-large"
          onClick={onViewTrends}
          disabled={historyCount === 0}
          style={
            historyCount === 0
              ? { opacity: 0.5, cursor: "not-allowed" }
              : undefined
          }
        >
          <LineChart size={18} />
          {historyCount === 0 ? "측정 기록 없음" : "측정 기록 보기"}
        </button>
      </div>
      <HomePatientSummary patientId={patientId} />
    </div>
  );
};
```

### Task 1.2: Index.tsx에서 사용으로 교체

**Files:**
- Modify: `src/pages/Index.tsx:246-301` (56줄 삭제 + 12줄로 교체)

- [ ] **Step 1: import 추가**

```tsx
import { PatientSummaryCard } from "../features/session/presentation/PatientSummaryCard";
```

- [ ] **Step 2: 246-301줄을 다음으로 교체**

```tsx
{showSummary && patientId && (
  <PatientSummaryCard
    patientId={patientId}
    name={name}
    age={age}
    painArea={painArea}
    vasScore={vasScore}
    historyCount={historyCount}
    lastMeasuredAt={lastMeasuredAt}
    onStartMeasurement={() => setIsStartingNewMeasurement(true)}
    onViewTrends={() => navigate(`/trends?patientId=${patientId}`)}
  />
)}
```

- [ ] **Step 3: HomePatientSummary import 제거**

Index.tsx 상단의 `import { HomePatientSummary } from ...` 제거 (이제 PatientSummaryCard 안에서 사용).

### Task 1.3: 빌드 + 시각 검증

- [ ] **Step 1: 빌드**

```bash
npm run build
```

Expected: ✅ 통과

- [ ] **Step 2: dev 서버 + Playwright 회귀**

홈 화면에서 환자 선택 → PatientSummaryCard 정상 렌더, "새 측정 시작" / "측정 기록 보기" 버튼 정상 동작 확인. 콘솔 에러 0건.

- [ ] **Step 3: commit**

```bash
git add -A
git commit -m "refactor(index): PatientSummaryCard 분리 (#13 Phase 1)

src/pages/Index.tsx 의 환자 요약 카드 56줄을
src/features/session/presentation/PatientSummaryCard.tsx 로 분리.

- HomePatientSummary 를 내부에 임베드 → Index.tsx 의 import 1건 감소
- props 9개 (controlled): 환자 메타 + 2개 콜백
- 런타임 동작 변화 0

PRD §4-0 (200줄 이하) 준수를 위한 첫 단계.
Index.tsx: 422줄 → ~378줄 (~44줄 절감, HomePatientSummary 가 카드 안으로 들어감).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.4: 사용자 승인 후 push

- [ ] 사용자에게 검증 결과 보고 + push 승인 요청
- [ ] 승인 시 `git push origin main`

---

## Phase 2: `NewMeasurementForm` 분리 (98줄 → 별도 컴포넌트)

가장 큰 덩어리. controlled component 패턴 (state는 Index가 그대로 관리, 폼은 props로 받아 표시).

### Task 2.1: NewMeasurementForm 컴포넌트 생성

**Files:**
- Create: `src/features/measurement/presentation/NewMeasurementForm.tsx`

- [ ] **Step 1: 타입 + 컴포넌트 작성**

```tsx
// src/features/measurement/presentation/NewMeasurementForm.tsx
import React from "react";
import { PainAssessment } from "./PainAssessment";
import { JointSelector } from "./JointSelector";

export type SideMode = "좌측만" | "우측만" | "양쪽";

const SIDE_MODES: SideMode[] = ["좌측만", "우측만", "양쪽"];

interface NewMeasurementFormProps {
  name: string;
  setName: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  painArea: string;
  setPainArea: (v: string) => void;
  vasScore: number;
  setVasScore: (v: number) => void;
  sideMode: SideMode;
  setSideMode: (v: SideMode) => void;
  selectedJointIds: string[];
  toggleJoint: (id: string) => void;
  totalSteps: number;
  showBackButton: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const NewMeasurementForm: React.FC<NewMeasurementFormProps> = ({
  name,
  setName,
  age,
  setAge,
  painArea,
  setPainArea,
  vasScore,
  setVasScore,
  sideMode,
  setSideMode,
  selectedJointIds,
  toggleJoint,
  totalSteps,
  showBackButton,
  onBack,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      {showBackButton && (
        <button
          type="button"
          className="btn btn-outline btn-small mb-3"
          onClick={onBack}
          style={{
            padding: "6px 14px",
            borderRadius: "var(--radius-xs)",
            fontSize: "var(--text-sm)",
          }}
        >
          ← 환자 정보로 돌아가기
        </button>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="form-group">
          <label className="form-label">이름</label>
          <input
            type="text"
            className="form-input"
            placeholder="성함"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">나이</label>
          <input
            type="number"
            className="form-input"
            placeholder="세"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </div>

      <PainAssessment
        painArea={painArea}
        setPainArea={setPainArea}
        vasScore={vasScore}
        setVasScore={setVasScore}
      />

      <div className="form-group mt-6">
        <label className="form-label mb-3 block">방향 선택</label>
        <div className="grid grid-cols-3 gap-3">
          {SIDE_MODES.map((mode) => {
            const selected = sideMode === mode;
            return (
              <button
                key={mode}
                type="button"
                className={`btn ${selected ? "btn-primary" : "btn-outline"}`}
                onClick={() => setSideMode(mode)}
              >
                {selected ? "✓ " : ""}
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      <JointSelector
        selectedJointIds={selectedJointIds}
        toggleJoint={toggleJoint}
      />

      <div className="mt-4">
        <button
          type="submit"
          className="btn btn-primary btn-large w-full"
          disabled={totalSteps === 0}
          style={
            totalSteps === 0
              ? { opacity: 0.5, cursor: "not-allowed" }
              : undefined
          }
        >
          {totalSteps === 0
            ? "관절을 먼저 선택해주세요"
            : `측정 시작하기 (${totalSteps}단계)`}
        </button>
      </div>
    </form>
  );
};
```

### Task 2.2: Index.tsx 에서 SIDE_MODE_MAP 통합 + 폼 교체

**Files:**
- Modify: `src/pages/Index.tsx` (SIDE_MODE_MAP 정의 위치 변경 + 303-400줄 교체)

- [ ] **Step 1: SideMode 타입을 NewMeasurementForm 에서 import**

Index.tsx 상단:
```tsx
import { NewMeasurementForm, type SideMode } from "../features/measurement/presentation/NewMeasurementForm";
```

기존 22-26줄의 `SIDE_MODE_MAP` 은 Index 내부에서 sides 계산용으로 그대로 유지 (NewMeasurementForm 은 sideMode 만 받고 사이드 매핑은 부모가 처리).

- [ ] **Step 2: PainAssessment, JointSelector import 제거** (NewMeasurementForm 안에서 사용)

- [ ] **Step 3: 303-400줄을 다음으로 교체**

```tsx
{showForm && (
  <NewMeasurementForm
    name={name}
    setName={setName}
    age={age}
    setAge={setAge}
    painArea={painArea}
    setPainArea={setPainArea}
    vasScore={vasScore}
    setVasScore={setVasScore}
    sideMode={sideMode}
    setSideMode={setSideMode}
    selectedJointIds={selectedJointIds}
    toggleJoint={(id) =>
      setSelectedJointIds((prev) =>
        prev.includes(id)
          ? prev.filter((i) => i !== id)
          : [...prev, id],
      )
    }
    totalSteps={totalSteps}
    showBackButton={isStartingNewMeasurement && !isAddingNew}
    onBack={() => setIsStartingNewMeasurement(false)}
    onSubmit={handleSubmit}
  />
)}
```

### Task 2.3: 빌드 + 시각 검증 + commit + push

- [ ] **Step 1: 빌드**

```bash
npm run build
```

- [ ] **Step 2: Playwright 회귀**

- 새 환자 등록 흐름: "새 환자" 버튼 → 폼 → 모든 필드 입력 → 측정 시작 누름 → /measure 정상 진입
- 기존 환자 + "새 측정 시작": 폼이 환자 정보로 자동 채워짐 + "← 환자 정보로 돌아가기" 버튼 정상
- 관절 선택 토글 정상
- 통증 부위 / VAS 입력 정상
- 콘솔 에러 0건

- [ ] **Step 3: commit**

```bash
git add -A
git commit -m "refactor(index): NewMeasurementForm 분리 (#13 Phase 2)

src/pages/Index.tsx 의 측정 시작 폼 98줄을
src/features/measurement/presentation/NewMeasurementForm.tsx 로 분리.

- controlled component 패턴 (state 는 Index 가 유지, 폼은 props 로 받음)
- props 16개 (필수 14 + 콜백 2)
- PainAssessment, JointSelector 가 폼 안으로 이동 → Index import 2건 감소
- SideMode 타입을 NewMeasurementForm 에서 export

런타임 동작 변화 0.
Index.tsx: ~378줄 → ~280줄 (98줄 절감).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 4: 사용자 승인 후 push**

---

## Phase 3: `useIndexPageHandlers` 훅 분리 (조건부)

Phase 1+2 후 Index.tsx 가 ~280줄. PRD 200줄을 위해 추가 80줄 분리 필요.

핸들러 5개 (handleSelectPatient, handleNewPatient, handleDeletePatient, handleConfirmDeletePatient, handleSubmit) + 일부 state (pendingDelete, isManaging, patients) 를 hook으로 묶음.

### Task 3.1: useIndexPageHandlers 훅 생성

**Files:**
- Create: `src/pages/index/useIndexPageHandlers.ts`

- [ ] **Step 1: hook 작성**

```ts
// src/pages/index/useIndexPageHandlers.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveRomSession,
  getPatients,
  deletePatient,
  getPatientHistory,
  getMeasurementQueue,
} from "../../lib/romData";
import { clearRomSession } from "../../lib/romTypes";
import type { Patient, RomSession, Side } from "../../lib/romData";

interface FormSetters {
  setName: (v: string) => void;
  setAge: (v: string) => void;
  setPainArea: (v: string) => void;
  setVasScore: (v: number) => void;
  setPatientId: (v: string | undefined) => void;
  setIsAddingNew: (v: boolean) => void;
  setIsStartingNewMeasurement: (v: boolean) => void;
  setIsManaging: (v: boolean) => void;
}

interface UseIndexPageHandlersArgs extends FormSetters {
  // submit 시 필요한 현재 폼 값
  name: string;
  age: string;
  painArea: string;
  vasScore: number;
  patientId?: string;
  selectedJointIds: string[];
  sides: Side[];
  totalSteps: number;
}

export const useIndexPageHandlers = (args: UseIndexPageHandlersArgs) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(getPatients());
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const handleSelectPatient = (p: Patient) => {
    const history = getPatientHistory(p.id);
    const latest = history[0];

    args.setPatientId(p.id);
    args.setName(p.name);
    args.setAge(p.age.toString());
    args.setPainArea(p.painArea || "");
    args.setVasScore(latest?.vasScore ?? p.vasScore ?? 0);
    args.setIsAddingNew(false);
    args.setIsStartingNewMeasurement(false);

    if (latest) {
      saveRomSession(latest);
    } else {
      saveRomSession({
        patientId: p.id,
        patientName: p.name,
        patientAge: p.age,
        painArea: p.painArea || "",
        vasScore: p.vasScore || 0,
        selectedJointIds: [],
        selectedSides: [],
        measurements: {},
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleNewPatient = () => {
    clearRomSession();
    args.setPatientId(undefined);
    args.setName("");
    args.setAge("");
    args.setPainArea("");
    args.setVasScore(0);
    args.setIsManaging(false);
    args.setIsAddingNew(true);
    args.setIsStartingNewMeasurement(false);
  };

  const handleDeletePatient = (id: string) => {
    const target = patients.find((p) => p.id === id);
    if (!target) return;
    setPendingDelete({ id, name: target.name });
  };

  const handleConfirmDeletePatient = () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    deletePatient(id);
    setPatients(getPatients());
    if (args.patientId === id) handleNewPatient();
    setPendingDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!args.name || !args.age) return alert("정보를 입력해주세요.");
    if (args.selectedJointIds.length === 0) return alert("관절을 선택해 주세요.");

    saveRomSession({
      patientId: args.patientId || `p_${Date.now()}`,
      patientName: args.name,
      patientAge: parseInt(args.age, 10),
      painArea: args.painArea,
      vasScore: args.vasScore,
      selectedJointIds: args.selectedJointIds,
      selectedSides: args.sides,
      measurements: {},
      createdAt: new Date().toISOString(),
    } as RomSession);

    const queue = getMeasurementQueue({
      selectedJointIds: args.selectedJointIds,
      selectedSides: args.sides,
    } as RomSession);
    navigate(`/measure?joint=${queue[0].jointId}&side=${queue[0].side}`);
  };

  return {
    patients,
    pendingDelete,
    setPendingDelete,
    handleSelectPatient,
    handleNewPatient,
    handleDeletePatient,
    handleConfirmDeletePatient,
    handleSubmit,
  };
};
```

### Task 3.2: Index.tsx 가 hook 사용

**Files:**
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: 핸들러 + 일부 state 제거, hook 사용**

```tsx
import { useIndexPageHandlers } from "./index/useIndexPageHandlers";

// 컴포넌트 내부:
const sides = SIDE_MODE_MAP[sideMode];
const totalSteps = getMeasurementQueue({
  selectedJointIds,
  selectedSides: sides,
} as RomSession).length;

const {
  patients,
  pendingDelete,
  setPendingDelete,
  handleSelectPatient,
  handleNewPatient,
  handleDeletePatient,
  handleConfirmDeletePatient,
  handleSubmit,
} = useIndexPageHandlers({
  name, age, painArea, vasScore, patientId,
  selectedJointIds, sides, totalSteps,
  setName, setAge, setPainArea, setVasScore, setPatientId,
  setIsAddingNew, setIsStartingNewMeasurement, setIsManaging,
});
```

기존 88-179줄의 5개 핸들러 + state(`patients`, `pendingDelete`) 정의 제거.

### Task 3.3: 빌드 + 회귀 + commit + push

- [ ] **Step 1: 빌드**
- [ ] **Step 2: 전체 흐름 회귀** — 환자 선택/등록/삭제/측정 시작 모두 정상
- [ ] **Step 3: commit + push**

```bash
git add -A
git commit -m "refactor(index): useIndexPageHandlers 훅 분리 (#13 Phase 3)

5개 핸들러 + 환자 목록/삭제 다이얼로그 state 를
src/pages/index/useIndexPageHandlers.ts 훅으로 분리.

- handleSelectPatient/NewPatient/DeletePatient/ConfirmDeletePatient/Submit
- patients, pendingDelete state 도 hook 내부로 이동
- form state setters 는 args 로 주입 (controlled)

런타임 동작 변화 0.
Index.tsx: ~280줄 → ~150줄 ✅ PRD §4-0 (200줄 이하) 달성.

#13 13파일 중 가장 큰 Index.tsx (422줄) 처리 완료.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

### 1. Spec coverage
- ✅ PRD §4-0 (200줄 이하) — Phase 3 완료 시 Index.tsx ~150줄
- ✅ PRD §1 (Feature-Driven Architecture) — features/session/, features/measurement/ 에 분리
- ✅ 런타임 동작 변화 0 — controlled component + hook 패턴

### 2. Placeholder scan
- ❌ TBD/TODO/적절한 처리 — 없음
- ✅ 모든 step에 실제 코드 포함

### 3. Type consistency
- `SideMode` 타입: NewMeasurementForm 에서 export, Index.tsx에서 import — 일치
- `Side` 타입: 기존 lib/romData에서 import 유지
- `PatientSummaryCard` props 9개: PatientId 필수, 나머지 일관

### 4. 회귀 검증 누락 확인
각 Phase별 Playwright 시나리오:
- Phase 1: 환자 선택 → 카드 표시 → 새 측정 / 기록 보기 버튼
- Phase 2: 새 환자 등록 / 기존 환자 측정 시작 / 폼 모든 필드 / 관절 선택 / 돌아가기
- Phase 3: 전체 흐름 + 환자 삭제 (ConfirmDialog)

---

## Execution Strategy

각 Phase 완료 후:
1. 빌드 통과 확인
2. Playwright 시각 검증 (해당 Phase 영향 영역)
3. commit (로컬)
4. **사용자 승인 받고** push (Vercel 프로덕션 자동 배포)
5. 다음 Phase 진행 여부 결정

Phase 1부터 천천히 진행. 사용자가 언제든 중단 가능.
