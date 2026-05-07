// NextStepPreview.tsx — exercise 스텝 진행 중일 때 표시되는 "다음 운동" 예고 카드
import React from "react";
import { SkipForward } from "lucide-react";
import { PHASE_META } from "../../../lib/ces/CesPlayerTypes";
import type { CesExerciseStep } from "../../../lib/ces/CesPlayerTypes";

interface NextStepPreviewProps {
  nextStep: CesExerciseStep;
}

export const NextStepPreview: React.FC<NextStepPreviewProps> = ({ nextStep }) => {
  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        borderRadius: "var(--radius-xs)",
        background: "rgba(28,63,111,0.05)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <span className="flex items-center" style={{ fontSize: "var(--text-base)" }}>
        <SkipForward size={18} />
      </span>
      <div>
        <p
          style={{
            fontSize: "var(--text-2xs)",
            color: "var(--text-secondary)",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          다음
        </p>
        <p
          style={{ fontSize: "var(--text-sm)", fontWeight: 800, color: "var(--ink-strong)" }}
        >
          {nextStep.exerciseName}
        </p>
      </div>
      <span
        style={{
          marginLeft: "auto",
          padding: "0.2rem 0.5rem",
          borderRadius: "var(--radius-xs)",
          background: PHASE_META[nextStep.cesPhase].color,
          color: "#fff",
          fontSize: "var(--text-2xs)",
          fontWeight: 800,
        }}
      >
        {PHASE_META[nextStep.cesPhase].label.split(" ")[0]}
      </span>
    </div>
  );
};
