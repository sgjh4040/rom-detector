// NextStepPreview.tsx — 다음 운동 예고 카드 (redesign-spike).
import React from "react";
import { SkipForward } from "lucide-react";
import { PHASE_META } from "../../../lib/ces/CesPlayerTypes";
import type { CesExerciseStep } from "../../../lib/ces/CesPlayerTypes";

interface NextStepPreviewProps {
  nextStep: CesExerciseStep;
}

export const NextStepPreview: React.FC<NextStepPreviewProps> = ({ nextStep }) => {
  const phase = PHASE_META[nextStep.cesPhase];
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 px-3.5 py-3">
      <SkipForward className="size-4 text-[var(--color-muted-foreground)] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          다음
        </p>
        <p className="truncate text-sm font-bold text-[var(--color-foreground)]">
          {nextStep.exerciseName}
        </p>
      </div>
      <span
        className="ml-auto shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
        style={{ background: phase.color }}
      >
        {phase.label.split(" ")[0]}
      </span>
    </div>
  );
};
