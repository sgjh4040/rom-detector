// helpers.ts — CesExercisePlayer 분리 시 공유 유틸 (audit #13).
// PlayerHeader / ExerciseListItem 둘 다 사용한다.
import type { CesExercise } from "../../../lib/ces/cesTypes";
import { STAGE_COLORS } from "../../../lib/ces/CesPlayerTypes";

/** 단계 ID → 운동 리스트 좌측에 표시되는 한 글자 카테고리 코드. */
export const STAGE_CODE_MAP: Record<string, string> = {
  inhibit: "H",
  lengthen: "L",
  activate: "A",
  integrate: "I",
};

/** 단계 ID → { 표시 라벨, 뱃지 색상 }. 색상은 SSOT(STAGE_COLORS) 에서 가져온다. */
export const STAGE_LABEL_MAP: Record<string, { label: string; color: string }> = {
  inhibit: { label: "억제", color: STAGE_COLORS.inhibit },
  lengthen: { label: "신장", color: STAGE_COLORS.lengthen },
  activate: { label: "활성", color: STAGE_COLORS.activate },
  integrate: { label: "통합", color: STAGE_COLORS.integrate },
};

/** 운동 메타(세트/반복/유지초)를 한 줄 텍스트로. 메타가 없으면 도구 이름으로 fallback. */
export const formatExMeta = (ex: CesExercise): string => {
  const parts: string[] = [];
  if (ex.sets) parts.push(`${ex.sets}세트`);
  if (ex.reps) parts.push(`${ex.reps}회`);
  if (ex.holdSeconds) parts.push(`${ex.holdSeconds}초 유지`);
  return parts.length > 0 ? parts.join(" · ") : ex.tools || "";
};
