// NewMeasurementForm.tsx — 측정 시작 폼 (audit #13 Phase 2)
//
// 이름/나이/통증/방향/관절 입력 + 측정 시작 버튼.
// 이전에는 src/pages/Index.tsx 가 직접 인라인으로 렌더했으나
// PRD §4-0 (200줄) 준수를 위해 분리.
//
// 패턴: controlled component — 모든 폼 state 는 부모가 관리하고 props 로 받는다.
// 이는 Index.tsx 의 환자 선택 흐름(handleSelectPatient) 이 폼 state 를
// 자동으로 채우는 기존 동작을 보존하기 위함.
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
  /** 기존 환자에서 "새 측정 시작" 으로 들어왔을 때만 노출되는 돌아가기 버튼 */
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
      {/* 같은 페이지 내 상태 전환이라 "← 환자 정보로 돌아가기" 라는 문구를
          유지 — 페이지 이동이 아님을 명확히. */}
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
