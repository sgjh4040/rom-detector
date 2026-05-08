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

/**
 * 카운트다운 경고 임계값 (초). 남은 시간이 이 값 이하 + 0초 초과일 때
 * - CountdownTimer 가 빨간 색 + "곧 다음 운동" 안내 + pulse 애니메이션 발동
 * - useCesPlayer 가 비프(beep) 사운드 1회 재생
 *
 * 두 곳에서 동일 값을 참조해야 시각/청각 경고가 동시에 발화된다.
 * (audit #23 — 매직 넘버 통합)
 */
export const COUNTDOWN_WARNING_SECONDS = 3;
