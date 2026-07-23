import { describe, it, expect, beforeEach } from 'vitest';
import { parseImportPayload, summarizeImport, importData } from './dataImport';
import { getPatients, getPatientHistory } from './patientHistory';
import type { Patient, RomSession } from './romTypes';

const patient = (id: string, name = '환자'): Patient =>
  ({ id, name, age: 30, createdAt: '2026-01-01T00:00:00Z' } as Patient);

const session = (createdAt: string): RomSession =>
  ({
    patientName: '환자',
    patientAge: 30,
    selectedJointIds: ['shoulder'],
    selectedSides: ['좌측'],
    measurements: {},
    createdAt,
  } as RomSession);

const validRaw = (patients: Patient[], history: Record<string, RomSession[]>) =>
  JSON.stringify({ exportedAt: '2026-06-01T00:00:00.000Z', patients, history });

describe('parseImportPayload', () => {
  it('정상 내보내기 JSON 을 파싱한다', () => {
    const raw = validRaw([patient('p1')], { p1: [session('2026-01-01T00:00:00Z')] });
    const payload = parseImportPayload(raw);
    expect(payload.patients).toHaveLength(1);
    expect(payload.history.p1).toHaveLength(1);
  });

  it('JSON 이 깨지면 throw', () => {
    expect(() => parseImportPayload('{not json')).toThrow();
  });

  it('patients 배열이 없으면 throw', () => {
    expect(() => parseImportPayload(JSON.stringify({ history: {} }))).toThrow();
  });

  it('history 객체가 없으면 throw', () => {
    expect(() => parseImportPayload(JSON.stringify({ patients: [] }))).toThrow();
  });

  it('환자에 id/name 이 없으면 throw', () => {
    expect(() =>
      parseImportPayload(JSON.stringify({ patients: [{ foo: 1 }], history: {} })),
    ).toThrow();
  });

  it('나이가 없는 환자는 throw', () => {
    expect(() =>
      parseImportPayload(
        JSON.stringify({ patients: [{ id: 'p1', name: '환자' }], history: {} }),
      ),
    ).toThrow();
  });

  it('세션 필드명(patientAge)으로 온 나이를 age 로 정규화한다', () => {
    const payload = parseImportPayload(
      JSON.stringify({
        patients: [{ id: 'p1', name: '환자', patientAge: 42 }],
        history: {},
      }),
    );
    expect(payload.patients[0].age).toBe(42);
    expect('patientAge' in payload.patients[0]).toBe(false);
  });
});

describe('summarizeImport', () => {
  it('환자 수와 세션 수를 합산한다', () => {
    const payload = parseImportPayload(
      validRaw([patient('p1'), patient('p2')], {
        p1: [session('a'), session('b')],
        p2: [session('c')],
      }),
    );
    expect(summarizeImport(payload)).toEqual({ patientCount: 2, sessionCount: 3 });
  });
});

describe('importData', () => {
  beforeEach(() => localStorage.clear());

  it('빈 저장소에 신규 환자 + 기록을 추가한다', () => {
    const payload = parseImportPayload(
      validRaw([patient('p1')], { p1: [session('2026-01-01T00:00:00Z')] }),
    );
    const result = importData(payload);
    expect(result.patientsAdded).toBe(1);
    expect(result.patientsUpdated).toBe(0);
    expect(result.sessionsAdded).toBe(1);
    expect(getPatients()).toHaveLength(1);
    expect(getPatientHistory('p1')).toHaveLength(1);
  });

  it('기존 환자는 update 로 카운트하고 기록은 병합한다', () => {
    importData(
      parseImportPayload(validRaw([patient('p1')], { p1: [session('2026-01-01T00:00:00Z')] })),
    );
    const result = importData(
      parseImportPayload(
        validRaw([patient('p1', '수정됨')], {
          p1: [session('2026-01-01T00:00:00Z'), session('2026-02-01T00:00:00Z')],
        }),
      ),
    );
    expect(result.patientsUpdated).toBe(1);
    expect(result.patientsAdded).toBe(0);
    // 같은 createdAt 1건은 dedup, 새 1건만 추가
    expect(result.sessionsAdded).toBe(1);
    expect(result.sessionsSkipped).toBe(1);
    expect(getPatientHistory('p1')).toHaveLength(2);
  });

  it('createdAt 없는 세션은 건너뛴다', () => {
    const payload = {
      patients: [patient('p1')],
      history: { p1: [session('2026-01-01T00:00:00Z'), { foo: 1 } as unknown as RomSession] },
    };
    const result = importData(payload);
    expect(result.sessionsAdded).toBe(1);
    expect(result.sessionsSkipped).toBe(1);
  });
});
