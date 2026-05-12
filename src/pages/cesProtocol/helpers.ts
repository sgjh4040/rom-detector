// helpers.ts — CesProtocol 분리 시 공유 상수 (PRD 4-0 200줄 이하 보조)
import { STAGE_COLORS } from "../../lib/ces/CesPlayerTypes";
import type { CesStage, CesAnalysisResult } from "../../lib/ces/cesTypes";
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
 * [v3 — 2026-05-12] 운동 이름 직접 매칭 + stage 기반 fallback.
 *
 *   매칭 우선순위:
 *     1) 운동 이름에서 muscleMapping.ts 의 키와 매칭되는 한글 추출
 *        → 매칭 있으면 그 한글들만 SVG ID 변환 (가장 정확)
 *     2) 매칭 0 → stage 기반 fallback (CES 원리 그대로)
 *        - Inhibit / Lengthen → 과활성 근육 (풀어주거나 늘려줌)
 *        - Activate           → 저활성 근육 (깨움)
 *        - Integrate          → 전체 (over + under, 협응 훈련)
 *
 *   ⚠️ "코어 강제 색칠" fallback 은 v2 부터 제거됨 — 매칭 모두 실패하면 회색 유지.
 */
export const getTargetMuscleIds = (
  exerciseName: string,
  analysis: CesAnalysisResult,
  stage: CesStage,
): string[] => {
  // 1) 운동 이름 직접 매칭 — 가장 정확
  const tokens = extractMuscleKeywords(exerciseName);
  if (tokens.length > 0) {
    return resolveMuscleIds(tokens);
  }
  // 2) stage 기반 fallback — 통합 운동(스쿼트/스텝업/런지 등)
  const raws =
    stage === "activate"
      ? analysis.underactiveMuscles
      : stage === "integrate"
        ? [...analysis.overactiveMuscles, ...analysis.underactiveMuscles]
        : analysis.overactiveMuscles; // inhibit / lengthen
  return resolveAnalysisToSvgIds(raws);
};

/**
 * @deprecated v2 부터 사용 금지 — 운동 이름만 받던 시그니처.
 * cesRoutineBuilder 호환을 위해 빈 배열 반환 — 호출처는 `getTargetMuscleIds(name, analysis, stage)` 로 교체.
 */
export const getTargetMuscles = (_name: string): string[] => [];
