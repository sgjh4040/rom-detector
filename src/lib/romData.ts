// ────────────────────────────────────────────────────────
// romData.ts — 도메인 진입점 (audit #13: 데이터/타입/계산을 모두 여기서 re-export).
// 정적 데이터: romJoints.ts (관절) / romExercises.ts (운동)
// 타입: romTypes.ts / 계산: romCalculations.ts / 환자 storage: patientHistory.ts
// ────────────────────────────────────────────────────────
import type { RomSession, Side, MeasurementQueueItem } from "./romTypes";
import {
  loadRomSession,
  saveRomSession,
  getMeasurementQueue as getQueueBase,
  getNextMeasurement as getNextBase,
} from "./romTypes";
import { JOINTS } from "./romJoints";

// ── 정적 데이터 ────────────────────────────────────────
export { JOINTS } from "./romJoints";
export {
  EXERCISES,
  FALLBACK_STRETCHING,
  FALLBACK_STRENGTHENING,
} from "./romExercises";

// ── 타입 ───────────────────────────────────────────────
export type {
  Movement,
  Joint,
  Severity,
  Exercise,
  RomSession,
  Side,
  MeasurementQueueItem,
  Patient,
} from "./romTypes";

// ── 세션 / 큐 / 계산 / 환자 storage ─────────────────────
export { loadRomSession, saveRomSession };

/** 순서대로 측정할 (관절 × 방향) 조합 목록 생성 (JOINTS 자동 주입) */
export const getMeasurementQueue = (
  session: RomSession,
): MeasurementQueueItem[] => getQueueBase(session, JOINTS);

/** 현재 항목 기준으로 다음 측정 항목 반환 (JOINTS 자동 주입) */
export const getNextMeasurement = (
  session: RomSession,
  currentJointId: string,
  currentSide: Side,
): MeasurementQueueItem | null =>
  getNextBase(session, JOINTS, currentJointId, currentSide);

export {
  getPatients,
  savePatient,
  deletePatient,
  getPatientHistory,
  addSessionToHistory,
  hasPatientHistory,
  clearAllPatientsAndHistory,
} from "./patientHistory";
export { calculateSeverity } from "./romCalculations";
