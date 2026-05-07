// helpers.ts — CesPlayerController 분리 시 공유 상수/헬퍼 (PRD 4-0 200줄 이하 보조)
import { STAGE_COLORS } from "../../../lib/ces/CesPlayerTypes";
import type { CesStage } from "../../../lib/ces/cesTypes";

export const PHASES: { stage: CesStage; label: string; color: string }[] = [
  { stage: "inhibit", label: "억제", color: STAGE_COLORS.inhibit },
  { stage: "lengthen", label: "신장", color: STAGE_COLORS.lengthen },
  { stage: "activate", label: "활성", color: STAGE_COLORS.activate },
  { stage: "integrate", label: "통합", color: STAGE_COLORS.integrate },
];

export const fmtMMSS = (total: number): string => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const pad = (n: number): string => String(n).padStart(2, "0");
