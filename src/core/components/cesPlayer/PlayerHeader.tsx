// PlayerHeader.tsx — CesPlayer 헤더 (redesign-spike).
import React from "react";
import { Coffee, ArrowRight } from "lucide-react";
import { PHASE_META, BREAK_META } from "../../../lib/ces/CesPlayerTypes";
import type { CesPlayerStep } from "../../../lib/ces/CesPlayerTypes";

interface PlayerHeaderProps {
  currentStep: CesPlayerStep;
  stepIndex: number;
  allSteps?: CesPlayerStep[];
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  currentStep,
  stepIndex,
  allSteps,
}) => {
  const exerciseSteps = allSteps ? allSteps.filter((s) => s.kind === "exercise") : [];
  const totalExerciseCount = exerciseSteps.length;
  const currentExerciseNum = allSteps
    ? allSteps.slice(0, stepIndex + 1).filter((s) => s.kind === "exercise").length
    : stepIndex + 1;
  const phaseCounts = allSteps
    ? (["Inhibit", "Lengthen", "Activate", "Integrate"] as const).reduce(
        (acc, p) => {
          const count = allSteps.filter(
            (s) => s.kind === "exercise" && s.cesPhase === p,
          ).length;
          if (count > 0) acc.push({ phase: p, count });
          return acc;
        },
        [] as { phase: string; count: number }[],
      )
    : [];

  // ── break 분기 ──
  if (currentStep.kind === "break") {
    const breakMeta = BREAK_META[currentStep.breakKind];
    const BreakIcon = currentStep.breakKind === "set-rest" ? Coffee : ArrowRight;
    return (
      <>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold text-white"
            style={{ background: breakMeta.color }}
          >
            <BreakIcon className="size-3.5" />
            {breakMeta.label}
          </span>
          <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
            {breakMeta.description(currentStep)}
          </span>
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--color-muted-foreground)] mb-1">
            운동 {currentExerciseNum} / {totalExerciseCount}
          </p>
          <h2
            className="text-xl font-extrabold tracking-tight leading-tight"
            style={{ color: breakMeta.color }}
          >
            {breakMeta.title}
          </h2>
        </div>
      </>
    );
  }

  // ── exercise 분기 ──
  const phase = PHASE_META[currentStep.cesPhase];
  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold text-white"
          style={{ background: phase.color }}
        >
          {phase.label}
        </span>
        <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
          {phase.description}
        </span>
      </div>
      <div>
        <p className="text-xs font-bold text-[var(--color-muted-foreground)] mb-1">
          운동 {currentExerciseNum} / {totalExerciseCount}
          {currentStep.currentSet &&
            currentStep.totalSets &&
            currentStep.totalSets > 1 && (
              <> · 세트 {currentStep.currentSet} / {currentStep.totalSets}</>
            )}
          {phaseCounts.length > 0 && (
            <span className="ml-1.5 opacity-70 text-[11px]">
              ({phaseCounts
                .map((p) => {
                  const short = PHASE_META[p.phase as keyof typeof PHASE_META].label.split("(")[0].trim();
                  return `${short} ${p.count}`;
                })
                .join(" · ")})
            </span>
          )}
        </p>
        <h2 className="text-xl font-extrabold tracking-tight leading-tight text-[var(--color-foreground)]">
          {currentStep.exerciseName}
        </h2>
      </div>
    </>
  );
};
