// storageKeys.ts — localStorage 키 단일 진실원 (audit #22)
//
// 모든 lib/ 래퍼는 이 파일의 상수만 사용한다. 컴포넌트/페이지에서 localStorage 를
// 직접 호출하는 것은 PRD 에서 금지 — lib 래퍼를 통하라.
//
// keyspace 변경(스키마 마이그레이션, 멀티 테넌트 prefix 등)이 필요할 때 이 파일만
// 수정하면 모든 사용처가 일관되게 따라간다.

/**
 * 단일 키 정의. 키 값은 외부에 그대로 노출되는 localStorage 식별자.
 *
 * 사용 가이드라인:
 * - CURRENT_SESSION         → lib/romTypes.ts 의 saveRomSession / loadRomSession / clearRomSession
 * - PATIENTS                → lib/patientHistory.ts 의 getPatients / savePatient
 * - CES_HISTORY_DURATIONS   → features/session/data/cesTimeTracker.ts 의 load/save/clearCesHistory
 */
export const STORAGE_KEYS = {
  /** 현재 활성 측정 세션 (RomSession) */
  CURRENT_SESSION: "rom_session",
  /** 환자 목록 (Patient[]) */
  PATIENTS: "rom_patients",
  /** CES 4단계 누적 시간 (CesHistoryMap) */
  CES_HISTORY_DURATIONS: "ces_history_durations",
} as const;

/**
 * 환자별 측정 히스토리 키. patientId 가 keyspace 의 일부라 함수로 캡슐화.
 * 키 prefix(`rom_history_`) 를 변경할 일이 있으면 여기만 수정하면 된다.
 */
export const patientHistoryKey = (patientId: string): string =>
  `rom_history_${patientId}`;
