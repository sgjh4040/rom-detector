import { describe, it, expect } from 'vitest';
import { analyzeMuscles } from './muscleAnalysis';
import type { RomSession } from './romTypes';

// 어깨를 기준으로 실데이터(romJoints + ces/shoulder) 와 함께 검증.
// shoulder flexion 의 normalRange = 180, muscleMap[flexion]:
//   overactive ['소흉근','전방삼각근','오훼완근']
//   underactive ['하부승모근','전거근','후방삼각근']
const baseSession = (measurements: Record<string, Record<string, Record<string, number>>>): RomSession => ({
  patientId: 'p1',
  patientName: 'X',
  patientAge: 30,
  painArea: '어깨',
  vasScore: 5,
  selectedJointIds: ['shoulder'],
  selectedSides: ['좌측'],
  measurements,
  createdAt: new Date().toISOString(),
});

describe('analyzeMuscles', () => {
  it('알 수 없는 관절 ID 면 빈 결과', () => {
    const s = baseSession({});
    const r = analyzeMuscles(s, 'invalid-joint', '좌측');
    expect(r.overactiveMuscles).toEqual([]);
    expect(r.underactiveMuscles).toEqual([]);
    expect(r.inhibit).toEqual([]);
    expect(r.lengthen).toEqual([]);
    expect(r.activate).toEqual([]);
    expect(r.integrate).toEqual([]);
  });

  it('어깨 굴곡 측정값이 정상(180/180) 이면 운동 없고 근육도 없음', () => {
    const s = baseSession({
      shoulder: { 좌측: { flexion: 180, extension: 60, abduction: 180, adduction: 50, internal_rotation: 70, external_rotation: 90 } },
    });
    const r = analyzeMuscles(s, 'shoulder', '좌측');
    expect(r.overactiveMuscles).toEqual([]);
    expect(r.underactiveMuscles).toEqual([]);
    expect(r.inhibit).toEqual([]);
    expect(r.lengthen).toEqual([]);
    expect(r.activate).toEqual([]);
    // integrate 는 관절 공통 — 어깨 데이터에 sh_int1/sh_int2 가 항상 들어있음
    expect(r.integrate.length).toBeGreaterThan(0);
    expect(r.integrate.map((e) => e.id)).toContain('sh_int1');
  });

  it('어깨 굴곡 90 (중등도제한) 이면 flexion 의 근육 + 운동이 결과에 포함', () => {
    const s = baseSession({
      shoulder: { 좌측: { flexion: 90, extension: 60, abduction: 180, adduction: 50, internal_rotation: 70, external_rotation: 90 } },
    });
    const r = analyzeMuscles(s, 'shoulder', '좌측');
    expect(r.overactiveMuscles).toEqual(expect.arrayContaining(['소흉근', '전방삼각근', '오훼완근']));
    expect(r.underactiveMuscles).toEqual(expect.arrayContaining(['하부승모근', '전거근', '후방삼각근']));
    // flexion 의 inhibit 운동들이 포함됨 (sh_inh_flex* 패턴)
    expect(r.inhibit.some((e) => e.id.startsWith('sh_inh_flex'))).toBe(true);
    expect(r.lengthen.some((e) => e.id.startsWith('sh_len_flex'))).toBe(true);
    expect(r.activate.some((e) => e.id.startsWith('sh_act_flex'))).toBe(true);
  });

  it('측정값 누락(undefined) 이면 0 으로 취급 → 심각한제한 으로 분류', () => {
    const s = baseSession({ shoulder: { 좌측: {} } });
    const r = analyzeMuscles(s, 'shoulder', '좌측');
    // 모든 동작이 0 이라 모두 심각한제한 → 근육·운동 다 들어가야
    expect(r.overactiveMuscles.length).toBeGreaterThan(0);
    expect(r.underactiveMuscles.length).toBeGreaterThan(0);
    expect(r.inhibit.length).toBeGreaterThan(0);
  });

  it('중복 근육·운동은 dedup 처리됨 (같은 ID/name 한 번만)', () => {
    // 굴곡 + 외전 둘 다 제한 → 둘 다 "소흉근" overactive 보유. dedup 으로 1번만 포함
    const s = baseSession({
      shoulder: { 좌측: { flexion: 0, extension: 60, abduction: 0, adduction: 50, internal_rotation: 70, external_rotation: 90 } },
    });
    const r = analyzeMuscles(s, 'shoulder', '좌측');
    const count = r.overactiveMuscles.filter((m) => m === '소흉근').length;
    expect(count).toBe(1);
    // 운동 ID 도 dedup
    const ids = r.inhibit.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
