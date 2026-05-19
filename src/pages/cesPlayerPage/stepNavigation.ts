// stepNavigation.ts — CesPlayer 운동 스텝 탐색 헬퍼.
import type { CesPlayerStep } from "../../lib/ces/CesPlayerTypes";

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
