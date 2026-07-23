// dataImport.ts — Settings 데이터 "가져오기" 로직 (내보내기 JSON 의 역방향).
// 기존 데이터를 파괴하지 않고 병합한다: 환자는 id 기준 upsert, 측정 기록은
// createdAt 기준 dedup 후 추가. (복원 / 기기 이전 시나리오 안전)
import type { Patient, RomSession } from './romTypes';
import {
  getPatients,
  savePatient,
  getPatientHistory,
  addSessionToHistory,
} from './patientHistory';

export interface ImportPayload {
  patients: Patient[];
  history: Record<string, RomSession[]>;
}

export interface ImportSummary {
  patientCount: number;
  sessionCount: number;
}

export interface ImportResult {
  patientsAdded: number;
  patientsUpdated: number;
  sessionsAdded: number;
  sessionsSkipped: number;
}

/**
 * 내보내기 JSON 문자열을 파싱·검증한다. 형식이 어긋나면 한국어 메시지로 throw.
 * (내보내기 형식: { exportedAt, patients: Patient[], history: { [id]: RomSession[] } })
 */
export const parseImportPayload = (raw: string): ImportPayload => {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('JSON 파일을 읽을 수 없어요. 내보내기로 받은 파일이 맞는지 확인해 주세요.');
  }
  if (!data || typeof data !== 'object') {
    throw new Error('파일 형식이 올바르지 않아요.');
  }
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.patients)) {
    throw new Error('환자 목록(patients)을 찾을 수 없어요.');
  }
  if (!obj.history || typeof obj.history !== 'object') {
    throw new Error('측정 기록(history)을 찾을 수 없어요.');
  }
  const patients = (obj.patients as unknown[]).map((raw) => {
    const p = raw as Record<string, unknown> | null;
    if (!p || typeof p.id !== 'string' || typeof p.name !== 'string') {
      throw new Error('환자 데이터에 id 또는 name 이 없어요.');
    }
    // age 검증 — 세션 필드명(patientAge)으로 잘못 만든 파일도 age 로 정규화해 받는다.
    // (age 없는 환자가 저장되면 홈에서 카드 선택이 무반응 크래시하던 회귀 방지)
    const age = typeof p.age === 'number' ? p.age : p.patientAge;
    if (typeof age !== 'number' || !Number.isFinite(age)) {
      throw new Error(`환자(${p.name}) 데이터에 나이(age)가 없어요.`);
    }
    const normalized = { ...p, age } as Record<string, unknown>;
    delete normalized.patientAge;
    return normalized as unknown as Patient;
  });
  return {
    patients,
    history: obj.history as Record<string, RomSession[]>,
  };
};

/** 파싱된 payload 의 요약(환자 수 / 유효 세션 수) — 적용 전 확인 다이얼로그용. */
export const summarizeImport = (payload: ImportPayload): ImportSummary => {
  const sessionCount = Object.values(payload.history).reduce(
    (sum, sessions) => sum + (Array.isArray(sessions) ? sessions.length : 0),
    0,
  );
  return { patientCount: payload.patients.length, sessionCount };
};

/** payload 를 localStorage 에 병합 적용. 기존 래퍼(upsert/dedup) 재사용. */
export const importData = (payload: ImportPayload): ImportResult => {
  const existingIds = new Set(getPatients().map((p) => p.id));
  let patientsAdded = 0;
  let patientsUpdated = 0;
  let sessionsAdded = 0;
  let sessionsSkipped = 0;

  for (const patient of payload.patients) {
    if (existingIds.has(patient.id)) patientsUpdated++;
    else patientsAdded++;
    savePatient(patient); // id 기준 upsert
  }

  for (const [patientId, sessions] of Object.entries(payload.history)) {
    if (!Array.isArray(sessions)) continue;
    // createdAt 오름차순으로 적용 → 가장 최신 세션이 마지막에 처리돼
    // 환자 lastMeasuredAt 이 올바르게 최신값으로 남는다.
    const ordered = [...sessions]
      .filter((s) => s && typeof s.createdAt === 'string')
      .sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    const skipped = sessions.length - ordered.length;
    sessionsSkipped += skipped;

    const before = getPatientHistory(patientId).length;
    ordered.forEach((s) => addSessionToHistory(patientId, s)); // createdAt dedup 내장
    const after = getPatientHistory(patientId).length;
    const added = after - before;
    sessionsAdded += added;
    sessionsSkipped += ordered.length - added; // 중복으로 건너뛴 것
  }

  return { patientsAdded, patientsUpdated, sessionsAdded, sessionsSkipped };
};
