import { describe, it, expect } from 'vitest';
import {
  exerciseSeconds,
  exerciseListSeconds,
  getPhaseGoal,
  EMPTY_PHASE_GOALS,
  SECONDS_PER_REP,
  FALLBACK_EXERCISE_SECONDS,
} from './cesGoalCalculator';
import { ex } from './cesTypes';
import type { CesExercise } from './cesTypes';

describe('exerciseSeconds — 단일 운동 목표 시간', () => {
  it('hold+reps+sets: hold × reps × sets (등척성 홀드 반복)', () => {
    const e = ex('test1', 'name', 'desc', '', { holdSeconds: 3, reps: 5, sets: 2 });
    expect(exerciseSeconds(e)).toBe(3 * 5 * 2); // 30
  });

  it('hold+sets (reps 없음): hold × sets (스트레칭/SMR 패턴)', () => {
    const e = ex('test2', 'name', 'desc', '', { holdSeconds: 30, sets: 2 });
    expect(exerciseSeconds(e)).toBe(60);
  });

  it('hold 만 (sets 없음): sets 기본 1 → hold × 1', () => {
    const e = ex('test3', 'name', 'desc', '', { holdSeconds: 40 });
    expect(exerciseSeconds(e)).toBe(40);
  });

  it('reps+sets (hold 없음): SECONDS_PER_REP × reps × sets (근력)', () => {
    const e = ex('test4', 'name', 'desc', '', { reps: 12, sets: 3 });
    expect(exerciseSeconds(e)).toBe(SECONDS_PER_REP * 12 * 3); // 108
  });

  it('reps 만 (sets 없음): sets 기본 1', () => {
    const e = ex('test5', 'name', 'desc', '', { reps: 10 });
    expect(exerciseSeconds(e)).toBe(SECONDS_PER_REP * 10); // 30
  });

  it('데이터 없음 (hold·reps 모두 0): FALLBACK 사용', () => {
    const e = ex('test6', 'name', 'desc', '', {});
    expect(exerciseSeconds(e)).toBe(FALLBACK_EXERCISE_SECONDS); // 60
  });

  it('sets 만 있고 hold/reps 모두 0 이면 FALLBACK', () => {
    const e = ex('test7', 'name', 'desc', '', { sets: 3 });
    expect(exerciseSeconds(e)).toBe(FALLBACK_EXERCISE_SECONDS);
  });
});

describe('exerciseListSeconds — 운동 배열 합계', () => {
  it('빈 배열은 0', () => {
    expect(exerciseListSeconds([])).toBe(0);
  });

  it('여러 운동의 시간 합계', () => {
    const list: CesExercise[] = [
      ex('a', 'n', 'd', '', { holdSeconds: 30, sets: 2 }),  // 60
      ex('b', 'n', 'd', '', { reps: 10, sets: 1 }),         // 30
      ex('c', 'n', 'd', '', {}),                            // 60 (fallback)
    ];
    expect(exerciseListSeconds(list)).toBe(60 + 30 + 60);
  });
});

describe('getPhaseGoal — stage 별 목표 조회', () => {
  it('빈 목표값을 stage 별 조회하면 0', () => {
    expect(getPhaseGoal(EMPTY_PHASE_GOALS, 'inhibit')).toBe(0);
    expect(getPhaseGoal(EMPTY_PHASE_GOALS, 'lengthen')).toBe(0);
    expect(getPhaseGoal(EMPTY_PHASE_GOALS, 'activate')).toBe(0);
    expect(getPhaseGoal(EMPTY_PHASE_GOALS, 'integrate')).toBe(0);
  });

  it('지정한 stage 값을 그대로 반환', () => {
    const goals = { inhibit: 120, lengthen: 60, activate: 180, integrate: 30, total: 390 };
    expect(getPhaseGoal(goals, 'inhibit')).toBe(120);
    expect(getPhaseGoal(goals, 'activate')).toBe(180);
  });
});
