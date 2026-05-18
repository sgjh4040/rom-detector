import { describe, it, expect } from 'vitest';
import {
  MUSCLE_TO_SVG,
  resolveMuscleIds,
  extractMuscleKeywords,
  resolveAnalysisToSvgIds,
} from './muscleMapping';
import { ALL_CES_DATA } from './index';

describe('MUSCLE_TO_SVG — 매핑 테이블 무결성', () => {
  it('모든 키가 비어있지 않고, 매핑된 SVG ID 배열도 비어있지 않음', () => {
    for (const [key, ids] of Object.entries(MUSCLE_TO_SVG)) {
      expect(key.trim().length, `key '${key}' 비어있음`).toBeGreaterThan(0);
      expect(ids.length, `key '${key}' 의 SVG ID 비어있음`).toBeGreaterThan(0);
    }
  });

  it('SVG ID 명명 규칙: 소문자/숫자/언더스코어 만 사용 (Flutter atlas 와 일치)', () => {
    for (const ids of Object.values(MUSCLE_TO_SVG)) {
      for (const id of ids) {
        expect(id, `'${id}' 명명 규칙 어긋남`).toMatch(/^[a-z0-9_]+$/);
      }
    }
  });

  it('좌·우 쌍 매핑은 _l / _r 모두 갖춤 (한쪽만 빠진 경우 없음)', () => {
    for (const [key, ids] of Object.entries(MUSCLE_TO_SVG)) {
      const leftIds = ids.filter((id) => id.endsWith('_l')).map((id) => id.slice(0, -2));
      const rightIds = ids.filter((id) => id.endsWith('_r')).map((id) => id.slice(0, -2));
      for (const base of leftIds) {
        expect(rightIds, `'${key}' 의 ${base}_l 만 있고 _r 빠짐`).toContain(base);
      }
      for (const base of rightIds) {
        expect(leftIds, `'${key}' 의 ${base}_r 만 있고 _l 빠짐`).toContain(base);
      }
    }
  });
});

describe('resolveMuscleIds', () => {
  it('등록된 근육명은 SVG ID 로 변환', () => {
    const ids = resolveMuscleIds(['대흉근']);
    expect(ids).toEqual(expect.arrayContaining(['pectoralis_major_l', 'pectoralis_major_r']));
  });

  it('미등록 근육명은 빈 배열 추가 없이 무시', () => {
    const ids = resolveMuscleIds(['알수없는근육']);
    expect(ids).toEqual([]);
  });

  it('중복 SVG ID 는 dedup (같은 ID 가 여러 근육에 매핑돼도 1번만)', () => {
    // '소흉근' 과 '대흉근' 모두 pectoralis_major_l/r 로 매핑
    const ids = resolveMuscleIds(['대흉근', '소흉근']);
    const major_l_count = ids.filter((id) => id === 'pectoralis_major_l').length;
    expect(major_l_count).toBe(1);
  });
});

describe('extractMuscleKeywords', () => {
  it('단일 키 포함 시 그 키 반환', () => {
    expect(extractMuscleKeywords('대흉근')).toContain('대흉근');
  });

  it('복합 한글에서 등록된 키워드 모두 추출', () => {
    // '대퇴사두근(대퇴직근 포함)' 같은 복합어
    const tokens = extractMuscleKeywords('대퇴사두근(대퇴직근 포함)');
    // 등록된 키워드가 있다면 둘 다 잡혀야 함
    if (MUSCLE_TO_SVG['대퇴사두근']) expect(tokens).toContain('대퇴사두근');
    if (MUSCLE_TO_SVG['대퇴직근']) expect(tokens).toContain('대퇴직근');
  });

  it('등록되지 않은 단어만 있으면 빈 배열', () => {
    expect(extractMuscleKeywords('XYZ알수없음')).toEqual([]);
  });
});

describe('resolveAnalysisToSvgIds', () => {
  it('복합 한글 배열 → 키워드 분할 → SVG ID 배열 (전체 파이프라인)', () => {
    const ids = resolveAnalysisToSvgIds(['대흉근', '하부승모근']);
    expect(ids).toEqual(expect.arrayContaining(['pectoralis_major_l', 'trapezius_lower_l']));
  });

  it('빈 입력 → 빈 출력', () => {
    expect(resolveAnalysisToSvgIds([])).toEqual([]);
  });
});

describe('CES 데이터 ↔ muscleMapping 정합성', () => {
  // ALL_CES_DATA 의 muscleMap 에 나오는 모든 근육명이 MUSCLE_TO_SVG 에 한 키워드라도 매칭돼야 함.
  // 만약 매칭 없으면 그 근육은 SVG 색칠 안 됨 → audit #19 회귀 위험.
  it('모든 muscleMap 의 근육명이 적어도 1개 키워드와 매칭 (색칠 누락 차단)', () => {
    const unmapped: string[] = [];
    for (const [jointId, data] of Object.entries(ALL_CES_DATA)) {
      for (const [movementId, muscles] of Object.entries(data.muscleMap)) {
        for (const raw of [...muscles.overactive, ...muscles.underactive]) {
          if (extractMuscleKeywords(raw).length === 0) {
            unmapped.push(`${jointId}/${movementId}: "${raw}"`);
          }
        }
      }
    }
    expect(unmapped, `매핑 누락:\n${unmapped.join('\n')}`).toEqual([]);
  });

  // integrate 운동의 targetMuscles (v4 메타) 도 같은 정합성
  it('integrate 의 targetMuscles 도 모두 매칭', () => {
    const unmapped: string[] = [];
    for (const [jointId, data] of Object.entries(ALL_CES_DATA)) {
      for (const ex of data.integrate) {
        if (!ex.targetMuscles) continue;
        for (const raw of ex.targetMuscles) {
          if (extractMuscleKeywords(raw).length === 0) {
            unmapped.push(`${jointId}/${ex.id}: "${raw}"`);
          }
        }
      }
    }
    expect(unmapped, `매핑 누락:\n${unmapped.join('\n')}`).toEqual([]);
  });
});
