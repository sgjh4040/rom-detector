// StoryProgressBar.tsx — 인스타 스토리 바 형태의 운동 진행률 (audit #13).
// 운동 스텝만 세그먼트로 표시, phase 색상 적용, 좌/우 탭으로 이전/다음 운동 이동.
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
  // 운동 스텝만 추출 + 원래 인덱스 보존
  const exerciseEntries = exercises
    .map((step, i) => ({ step, originalIndex: i }))
    .filter((e) => e.step.kind === "exercise");

  // 현재 stepIndex → 운동 기준 인덱스 (break일 때 직전 운동)
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

  // 좌/우 탭 → 이전/다음 운동으로 이동
  const goToPrev = () => {
    const prev = exerciseEntries[activeExerciseIdx - 1];
    if (prev) onGoToStep(prev.originalIndex);
  };
  const goToNext = () => {
    const next = exerciseEntries[activeExerciseIdx + 1];
    if (next) onGoToStep(next.originalIndex);
  };

  return (
    <div className="story-bar-wrap">
      {/* 세그먼트 바 */}
      <div className="story-bar">
        {exerciseEntries.map((entry, i) => {
          const meta =
            PHASE_META[entry.step.cesPhase as keyof typeof PHASE_META];
          const isDone = i < activeExerciseIdx;
          const isActive = i === activeExerciseIdx;
          const isBreakActive = exercises[currentStepIndex]?.kind === "break";
          // 진행률: 완료 100%, 현재 운동은 stepProgress, 나머지 0%
          const fill = isDone
            ? 100
            : isActive
              ? isBreakActive
                ? 100
                : Math.max(2, stepProgress)
              : 0;
          return (
            <div key={entry.originalIndex} className="story-segment">
              <div
                className="story-segment-fill"
                style={{
                  width: `${fill}%`,
                  background: meta.color,
                  opacity: isDone ? 0.7 : 1,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* 좌/우 탭 영역 (투명 오버레이) */}
      <div className="story-tap-zones">
        <button
          className="story-tap-left"
          onClick={goToPrev}
          aria-label="이전 운동"
        />
        <button
          className="story-tap-right"
          onClick={goToNext}
          aria-label="다음 운동"
        />
      </div>
    </div>
  );
};

/** 브레이크 스텝을 건너뛰고 가장 가까운 exercise 스텝을 찾는다 — 근육 하이라이트 유지용 */
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
