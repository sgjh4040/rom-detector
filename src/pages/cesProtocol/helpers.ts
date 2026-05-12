// helpers.ts — CesProtocol 분리 시 공유 상수 (PRD 4-0 200줄 이하 보조)
import { STAGE_COLORS } from "../../lib/ces/CesPlayerTypes";
import type { CesStage, CesAnalysisResult } from "../../lib/ces/cesTypes";
import { resolveAnalysisToSvgIds } from "../../lib/ces/muscleMapping";

export const STAGES: { id: CesStage; label: string; color: string }[] = [
  { id: "inhibit", label: "억제", color: STAGE_COLORS.inhibit },
  { id: "lengthen", label: "신장", color: STAGE_COLORS.lengthen },
  { id: "activate", label: "활성", color: STAGE_COLORS.activate },
  { id: "integrate", label: "통합", color: STAGE_COLORS.integrate },
];

/**
 * 분석 결과 → BodyAnatomySvg 에 보낼 Flutter SVG ID 배열.
 *
 * [v2 — 2026-05-12] 운동 이름 키워드 매칭 폐기. 직접적인 분석 결과
 * (`overactiveMuscles + underactiveMuscles`) 를 SSOT 매핑(`muscleMapping.ts`)
 * 으로 변환한다. P0: 무릎 운동 색칠 안 되는 문제 해결.
 *
 * 운동마다 다른 색칠을 원하면 muscleAnalysis 가 movement 단위로 결과를
 * 보존하도록 확장 필요(향후 과제).
 */
export const getTargetMuscleIds = (analysis: CesAnalysisResult): string[] => {
  return resolveAnalysisToSvgIds([
    ...analysis.overactiveMuscles,
    ...analysis.underactiveMuscles,
  ]);
};

/**
 * @deprecated v2 부터 사용 금지 — 운동 이름 매칭 방식.
 * cesRoutineBuilder 호환을 위해 임시 유지 (exerciseName 무시하고
 * 빈 배열 반환). 호출처는 `getTargetMuscleIds(analysis)` 로 교체할 것.
 */
export const getTargetMuscles = (_name: string): string[] => [];
