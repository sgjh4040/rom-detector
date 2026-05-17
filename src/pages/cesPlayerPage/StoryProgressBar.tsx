// StoryProgressBar.tsx — 인스타 스토리 바 스타일 운동 진행률 (redesign-spike).
import React from "react";
import { PHASE_META } from "../../lib/ces/CesPlayerTypes";
import type { CesPlayerStep } from "../../lib/ces/CesPlayerTypes";

interface StoryProgressBarProps {
  exercises: CesPlayerStep[];
  currentStepIndex: number;
  stepProgress: number;
  onGoToStep: (i: number) => void;
}

export const StoryProgressBar: React.FC<StoryProgressBarProps> = ({
  exercises,
  currentStepIndex,
  stepProgress,
  onGoToStep,
}) => {
  const exerciseEntries = exercises
    .map((step, i) => ({ step, originalIndex: i }))
    .filter((e) => e.step.kind === "exercise");

  let activeOriginalIndex = currentStepIndex;
  if (exercises[currentStepIndex]?.kind === "break") {
    for (let i = currentStepIndex; i >= 0; i--) {
      if (exercises[i].kind === "exercise") {
        activeOriginalIndex = i;
        break;
      }
    }
  }
  const activeExerciseIdx = exerciseEntries.findIndex(
    (e) => e.originalIndex === activeOriginalIndex,
  );

  const goToPrev = () => {
    const prev = exerciseEntries[activeExerciseIdx - 1];
    if (prev) onGoToStep(prev.originalIndex);
  };
  const goToNext = () => {
    const next = exerciseEntries[activeExerciseIdx + 1];
    if (next) onGoToStep(next.originalIndex);
  };

  return (
    <div className="relative">
      {/* 세그먼트 바 */}
      <div className="flex gap-1.5">
        {exerciseEntries.map((entry, i) => {
          const meta = PHASE_META[entry.step.cesPhase as keyof typeof PHASE_META];
          const isDone = i < activeExerciseIdx;
          const isActive = i === activeExerciseIdx;
          const isBreakActive = exercises[currentStepIndex]?.kind === "break";
          const fill = isDone
            ? 100
            : isActive
              ? isBreakActive
                ? 100
                : Math.max(2, stepProgress)
              : 0;
          return (
            <div
              key={entry.originalIndex}
              className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-muted)]"
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${fill}%`,
                  background: meta.color,
                  opacity: isDone ? 0.6 : 1,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* 좌/우 탭 영역 (투명 오버레이) */}
      <div className="absolute inset-0 flex pointer-events-none">
        <button
          type="button"
          onClick={goToPrev}
          aria-label="이전 운동"
          className="flex-1 pointer-events-auto cursor-pointer"
        />
        <button
          type="button"
          onClick={goToNext}
          aria-label="다음 운동"
          className="flex-1 pointer-events-auto cursor-pointer"
        />
      </div>
    </div>
  );
};

/** 브레이크 스텝을 건너뛰고 가장 가까운 exercise 스텝을 찾는다 */
export const findNearestExerciseStep = (
  steps: CesPlayerStep[],
  currentIndex: number,
): CesPlayerStep | null => {
  for (let i = currentIndex; i < steps.length; i++) {
    if (steps[i].kind === "exercise") return steps[i];
  }
  for (let i = currentIndex; i >= 0; i--) {
    if (steps[i].kind === "exercise") return steps[i];
  }
  return null;
};
