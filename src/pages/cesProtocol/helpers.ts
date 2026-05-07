// helpers.ts — CesProtocol 분리 시 공유 상수 (PRD 4-0 200줄 이하 보조)
import { STAGE_COLORS } from "../../lib/ces/CesPlayerTypes";
import type { CesStage } from "../../lib/ces/cesTypes";

export const STAGES: { id: CesStage; label: string; color: string }[] = [
  { id: "inhibit", label: "억제", color: STAGE_COLORS.inhibit },
  { id: "lengthen", label: "신장", color: STAGE_COLORS.lengthen },
  { id: "activate", label: "활성", color: STAGE_COLORS.activate },
  { id: "integrate", label: "통합", color: STAGE_COLORS.integrate },
];

/**
 * 운동 이름에서 매칭 가능한 한국어 근육 키워드 (BodyAnatomySvg highlightIds 매핑용).
 * 새 운동 추가 시 키워드 누락 → 기본값 "코어" 로 fallback.
 */
export const MUSCLE_KEYWORDS: readonly string[] = [
  "소흉근",
  "대흉근",
  "전방삼각근",
  "광배근",
  "상부승모근",
  "견갑거근",
  "극하근",
  "견갑하근",
  "하부승모근",
  "전경골근",
  "비복근",
  "가자미근",
  "후경골근",
  "비골근",
  "대둔근",
  "중둔근",
  "복횡근",
  "코어",
  "전거근",
  "Y자",
  "T자",
  "케이블",
  "흉추",
  "삼각근",
  "장요근",
];

export const getTargetMuscles = (name: string): string[] => {
  const found = MUSCLE_KEYWORDS.filter((k) => name.includes(k));
  return found.length > 0 ? found : ["코어"]; // fallback
};
