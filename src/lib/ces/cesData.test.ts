import { describe, it, expect } from 'vitest';
import { ALL_CES_DATA } from './index';
import type { CesExercise } from './cesTypes';

// 모든 관절의 모든 단계 운동 + integrate 운동을 1차 평탄화한 헬퍼.
// `protocol[movement][stage]` 와 `integrate` 모두 포함.
const allExercises = (): CesExercise[] => {
  const out: CesExercise[] = [];
  for (const data of Object.values(ALL_CES_DATA)) {
    for (const protocol of Object.values(data.protocol)) {
      out.push(...protocol.inhibit, ...protocol.lengthen, ...protocol.activate);
    }
    out.push(...data.integrate);
  }
  return out;
};

describe('CES 데이터 무결성', () => {
  it('ALL_CES_DATA 에 7개 관절이 모두 등록', () => {
    expect(Object.keys(ALL_CES_DATA).sort()).toEqual(
      ['ankle', 'elbow', 'hip', 'knee', 'shoulder', 'waist', 'wrist'].sort(),
    );
  });

  it('모든 운동 ID 가 글로벌하게 유일 (관절 간 충돌 없음)', () => {
    const ids = allExercises().map((e) => e.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  it('모든 운동이 비어있지 않은 name + description 보유', () => {
    const broken = allExercises().filter(
      (e) => !e.name.trim() || !e.description.trim(),
    );
    expect(broken).toEqual([]);
  });

  it('각 관절의 protocol 안의 movement 키는 muscleMap 키와 1:1 일치', () => {
    for (const [jointId, data] of Object.entries(ALL_CES_DATA)) {
      const protocolKeys = Object.keys(data.protocol).sort();
      const muscleKeys = Object.keys(data.muscleMap).sort();
      expect(protocolKeys, `${jointId}: protocol↔muscleMap 키 불일치`).toEqual(muscleKeys);
    }
  });

  it('integrate 가 모든 관절에 최소 1개 이상', () => {
    for (const [jointId, data] of Object.entries(ALL_CES_DATA)) {
      expect(data.integrate.length, `${jointId}: integrate 비어있음`).toBeGreaterThan(0);
    }
  });

  it('knee 운동에 mp4 영상 11개 매핑 (자체 R2 호스팅)', () => {
    const knee = ALL_CES_DATA.knee;
    const kneeProtocolExs: CesExercise[] = [];
    for (const protocol of Object.values(knee.protocol)) {
      kneeProtocolExs.push(...protocol.inhibit, ...protocol.lengthen, ...protocol.activate);
    }
    const withMp4 = kneeProtocolExs.filter((e) => e.youtubeId.endsWith('.mp4'));
    expect(withMp4.length).toBe(11);
    // 파일명 패턴 — 숫자.id.mp4
    for (const ex of withMp4) {
      expect(ex.youtubeId, `${ex.id}: mp4 패턴 어긋남 (${ex.youtubeId})`).toMatch(/^\d+\..*\.mp4$/);
    }
  });

  it('정량 운동(sets+reps+hold) 값들은 모두 양수 (음수/0 데이터 오류 차단)', () => {
    for (const ex of allExercises()) {
      if (ex.sets !== undefined) expect(ex.sets, `${ex.id}.sets`).toBeGreaterThan(0);
      if (ex.reps !== undefined) expect(ex.reps, `${ex.id}.reps`).toBeGreaterThan(0);
      if (ex.holdSeconds !== undefined)
        expect(ex.holdSeconds, `${ex.id}.holdSeconds`).toBeGreaterThan(0);
    }
  });
});
