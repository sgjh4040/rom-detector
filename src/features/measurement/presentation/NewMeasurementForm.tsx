// NewMeasurementForm.tsx — 측정 시작 폼 (redesign-spike).
// controlled component — 모든 폼 state 는 부모(Index.tsx)가 관리.
import React from "react";
import { ArrowLeft, Play } from "lucide-react";
import { PainAssessment } from "./PainAssessment";
import { JointSelector } from "./JointSelector";
import { Input } from "../../../components/redesign/ui/Input";
import { Button } from "../../../components/redesign/ui/Button";
import { cn } from "../../../lib/cn";

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
  const canSubmit = totalSteps > 0;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {showBackButton && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 self-start text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft className="size-4" />환자 정보로 돌아가기
        </Button>
      )}

      {/* 이름·나이 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="patientName"
            className="text-sm font-semibold text-[var(--color-foreground)]"
          >
            이름
          </label>
          <Input
            id="patientName"
            type="text"
            placeholder="성함"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="patientAge"
            className="text-sm font-semibold text-[var(--color-foreground)]"
          >
            나이
          </label>
          <Input
            id="patientAge"
            type="number"
            inputMode="numeric"
            placeholder="세"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </div>

      <Divider />

      {/* 통증 부위 + VAS */}
      <PainAssessment
        painArea={painArea}
        setPainArea={setPainArea}
        vasScore={vasScore}
        setVasScore={setVasScore}
      />

      <Divider />

      {/* 측정 방향 — segmented control */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[var(--color-foreground)]">
          측정 방향
        </label>
        <div
          role="radiogroup"
          aria-label="측정 방향"
          className="grid grid-cols-3 gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-1"
        >
          {SIDE_MODES.map((mode) => {
            const selected = sideMode === mode;
            return (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setSideMode(mode)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-semibold transition-all",
                  selected
                    ? "bg-[var(--color-card)] text-[var(--color-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
                )}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* 관절 선택 */}
      <JointSelector
        selectedJointIds={selectedJointIds}
        toggleJoint={toggleJoint}
      />

      {/* 제출 */}
      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit}
        className={cn(
          "w-full",
          canSubmit
            ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-accent-foreground)]"
            : "",
        )}
      >
        {canSubmit && <Play className="size-4" />}
        {canSubmit
          ? `측정 시작 · ${totalSteps}단계`
          : "관절을 먼저 선택해주세요"}
      </Button>
    </form>
  );
};

const Divider: React.FC = () => (
  <hr className="border-0 border-t border-[var(--color-border)]" />
);
