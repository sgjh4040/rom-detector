// helpers.ts — CesProtocol 분리 시 공유 상수 (PRD 4-0 200줄 이하 보조)
import { STAGE_COLORS } from "../../lib/ces/CesPlayerTypes";
import type {
  CesStage,
  CesAnalysisResult,
  CesExercise,
} from "../../lib/ces/cesTypes";
import {
  extractMuscleKeywords,
  resolveAnalysisToSvgIds,
  resolveMuscleIds,
} from "../../lib/ces/muscleMapping";

export const STAGES: { id: CesStage; label: string; color: string }[] = [
  { id: "inhibit", label: "억제", color: STAGE_COLORS.inhibit },
  { id: "lengthen", label: "신장", color: STAGE_COLORS.lengthen },
  { id: "activate", label: "활성", color: STAGE_COLORS.activate },
  { id: "integrate", label: "통합", color: STAGE_COLORS.integrate },
];

/**
 * 운동 → BodyAnatomySvg 에 보낼 Flutter SVG ID 배열.
 *
 * [v4 — 2026-05-12] 매칭 우선순위 3단계.
 *
 *   1) `exercise.targetMuscles` 메타 (가장 명시적, 가장 정확)
 *      → 운동 데이터에 직접 박은 한글 목록 → SVG ID
 *   2) 운동 이름에서 muscleMapping.ts 키 매칭
 *      → "대퇴사두근 SMR" → 대퇴사두근만
 *   3) stage 기반 fallback (CES 원리 그대로)
 *      - Inhibit / Lengthen → overactive 만 (풀거나 늘림)
 *      - Activate           → underactive 만 (깨움)
 *      - Integrate          → over + under 전체 (협응)
 *
 *   ⚠️ 매칭 모두 실패하면 빈 배열 → Flutter 측에서 회색 유지 (강제 색칠 X).
 */
export const getTargetMuscleIds = (
  exercise: CesExercise,
  analysis: CesAnalysisResult,
  stage: CesStage,
): string[] => {
  // 1) 명시적 메타 (가장 정확)
  if (exercise.targetMuscles && exercise.targetMuscles.length > 0) {
    return resolveMuscleIds(exercise.targetMuscles);
  }
  // 2) 운동 이름 직접 매칭
  const tokens = extractMuscleKeywords(exercise.name);
  if (tokens.length > 0) {
    return resolveMuscleIds(tokens);
  }
  // 3) stage 기반 fallback — 통합 운동(스쿼트/스텝업/런지 등)
  const raws =
    stage === "activate"
      ? analysis.underactiveMuscles
      : stage === "integrate"
        ? [...analysis.overactiveMuscles, ...analysis.underactiveMuscles]
        : analysis.overactiveMuscles; // inhibit / lengthen
  return resolveAnalysisToSvgIds(raws);
};

/**
 * @deprecated v2 부터 사용 금지. cesRoutineBuilder 호환을 위해 시그니처만 유지.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getTargetMuscles = (_name: string): string[] => [];
