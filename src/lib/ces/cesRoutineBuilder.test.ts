import { describe, it, expect } from 'vitest';
import {
  buildRoutineFromAnalysis,
  DEFAULT_REST_SECONDS,
  DEFAULT_TRANSITION_SECONDS,
} from './cesRoutineBuilder';
import { exerciseSeconds } from './cesGoalCalculator';
import { ex } from './cesTypes';
import type { CesAnalysisResult } from './cesTypes';

const noTargets = () => [];

const emptyAnalysis = (): CesAnalysisResult => ({
  overactiveMuscles: [],
  underactiveMuscles: [],
  inhibit: [],
  lengthen: [],
  activate: [],
  integrate: [],
});

describe('buildRoutineFromAnalysis — 분할·브레이크', () => {
  it('완전히 빈 분석이면 0 스텝', () => {
    const r = buildRoutineFromAnalysis(emptyAnalysis(), { getTargetMuscles: noTargets });
    expect(r.exercises).toEqual([]);
    expect(r.totalDurationSeconds).toBe(0);
  });

  it('단일 운동 (sets:1) — 1 exercise 스텝, set-rest/transition 없음', () => {
    const analysis = { ...emptyAnalysis(), inhibit: [ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 1 })] };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    expect(r.exercises).toHaveLength(1);
    expect(r.exercises[0].kind).toBe('exercise');
    expect(r.exercises[0].durationSeconds).toBe(30);
    expect(r.totalDurationSeconds).toBe(30);
  });

  it('sets:3 → 3 exercise + 2 set-rest (마지막 세트 뒤엔 휴식 없음)', () => {
    const analysis = { ...emptyAnalysis(), inhibit: [ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 3 })] };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const kinds = r.exercises.map((s) => (s.kind === 'exercise' ? 'E' : (s as { breakKind: string }).breakKind));
    expect(kinds).toEqual(['E', 'set-rest', 'E', 'set-rest', 'E']);
  });

  it('exercise 세트 합 === exerciseSeconds(ex) — 반올림 보정 (remainder 가 첫 세트로)', () => {
    const e = ex('a', 'A', 'd', '', { holdSeconds: 31, sets: 3 }); // 93 / 3 = 31 정수
    const total = exerciseSeconds(e); // 93
    const analysis = { ...emptyAnalysis(), inhibit: [e] };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const exerciseSecondsSum = r.exercises
      .filter((s) => s.kind === 'exercise')
      .reduce((sum, s) => sum + s.durationSeconds, 0);
    expect(exerciseSecondsSum).toBe(total);
  });

  it('나누어 떨어지지 않는 케이스도 합 보존 (첫 세트에 remainder)', () => {
    // hold 10, sets 3 = 30, 30/3=10 정수
    // hold 10, reps 5, sets 2 = 100, 100/2=50 정수
    // 일부러 안 떨어지는 케이스: SECONDS_PER_REP × reps × sets 가 분할로 안 떨어지는 경우
    // sets:7 의 hold:10 → 70/7=10 정수. 만들기 어려움 → 100/3 케이스 = hold 100 sets 3
    const e = ex('a', 'A', 'd', '', { holdSeconds: 100, sets: 3 }); // 300 / 3 = 100 정수
    const analysis = { ...emptyAnalysis(), inhibit: [e] };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const exerciseSecondsSum = r.exercises
      .filter((s) => s.kind === 'exercise')
      .reduce((sum, s) => sum + s.durationSeconds, 0);
    expect(exerciseSecondsSum).toBe(exerciseSeconds(e));
  });

  it('같은 phase 내 운동 사이엔 transition 브레이크 삽입, 마지막 운동 뒤엔 없음', () => {
    const analysis = {
      ...emptyAnalysis(),
      inhibit: [
        ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 1 }),
        ex('b', 'B', 'd', '', { holdSeconds: 30, sets: 1 }),
        ex('c', 'C', 'd', '', { holdSeconds: 30, sets: 1 }),
      ],
    };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const kinds = r.exercises.map((s) =>
      s.kind === 'exercise' ? `E:${s.exerciseName}` : `B:${(s as { breakKind: string }).breakKind}`,
    );
    expect(kinds).toEqual(['E:A', 'B:transition', 'E:B', 'B:transition', 'E:C']);
  });

  it('phase 경계엔 브레이크 없음 (inhibit 마지막 → lengthen 첫 운동 사이)', () => {
    const analysis = {
      ...emptyAnalysis(),
      inhibit: [ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 1 })],
      lengthen: [ex('b', 'B', 'd', '', { holdSeconds: 30, sets: 1 })],
    };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    expect(r.exercises).toHaveLength(2);
    expect(r.exercises[0].kind).toBe('exercise');
    expect(r.exercises[1].kind).toBe('exercise');
  });

  it('빈 phase 는 스킵 (lengthen 만 비어있어도 inhibit·activate·integrate 정상)', () => {
    const analysis = {
      ...emptyAnalysis(),
      inhibit: [ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 1 })],
      lengthen: [],
      activate: [ex('b', 'B', 'd', '', { holdSeconds: 30, sets: 1 })],
    };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const phases = r.exercises.filter((s) => s.kind === 'exercise').map((s) => s.cesPhase);
    expect(phases).toEqual(['Inhibit', 'Activate']);
  });

  it('step 번호가 1 부터 연속 증가', () => {
    const analysis = {
      ...emptyAnalysis(),
      inhibit: [
        ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 2 }),
        ex('b', 'B', 'd', '', { holdSeconds: 30, sets: 1 }),
      ],
    };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const steps = r.exercises.map((s) => s.step);
    // a(sets:2) → E + set-rest + E + transition + b → E = 5 스텝
    expect(steps).toEqual([1, 2, 3, 4, 5]);
    expect(steps[steps.length - 1]).toBe(r.exercises.length);
  });

  it('set-rest 의 durationSeconds 가 DEFAULT_REST_SECONDS (기본 30초)', () => {
    const analysis = { ...emptyAnalysis(), inhibit: [ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 2 })] };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const setRest = r.exercises.find((s) => s.kind === 'break' && (s as { breakKind: string }).breakKind === 'set-rest');
    expect(setRest?.durationSeconds).toBe(DEFAULT_REST_SECONDS);
  });

  it('운동의 restSeconds 가 set-rest 기본값을 override', () => {
    const analysis = { ...emptyAnalysis(), inhibit: [ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 2, restSeconds: 5 })] };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const setRest = r.exercises.find((s) => s.kind === 'break' && (s as { breakKind: string }).breakKind === 'set-rest');
    expect(setRest?.durationSeconds).toBe(5);
  });

  it('transition 의 기본 duration 은 DEFAULT_TRANSITION_SECONDS, options 로 override 가능', () => {
    const analysis = {
      ...emptyAnalysis(),
      inhibit: [
        ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 1 }),
        ex('b', 'B', 'd', '', { holdSeconds: 30, sets: 1 }),
      ],
    };
    const defaultRoutine = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const def = defaultRoutine.exercises.find((s) => s.kind === 'break');
    expect(def?.durationSeconds).toBe(DEFAULT_TRANSITION_SECONDS);

    const overridden = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets, transitionSeconds: 7 });
    const ov = overridden.exercises.find((s) => s.kind === 'break');
    expect(ov?.durationSeconds).toBe(7);
  });

  it('getTargetMuscles 결과가 exercise 스텝의 targetSvgIds 에 그대로 전달', () => {
    const analysis = { ...emptyAnalysis(), inhibit: [ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 1 })] };
    const r = buildRoutineFromAnalysis(analysis, {
      getTargetMuscles: (e, phase) => [`${phase}:${e.name}:m1`, `${phase}:${e.name}:m2`],
    });
    const exerciseStep = r.exercises.find((s) => s.kind === 'exercise');
    expect(exerciseStep?.targetSvgIds).toEqual(['Inhibit:A:m1', 'Inhibit:A:m2']);
  });

  it('totalDurationSeconds === 모든 스텝 durationSeconds 합', () => {
    const analysis = {
      ...emptyAnalysis(),
      inhibit: [ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 2 })],
      activate: [ex('b', 'B', 'd', '', { reps: 10, sets: 3 })],
    };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const sum = r.exercises.reduce((a, s) => a + s.durationSeconds, 0);
    expect(r.totalDurationSeconds).toBe(sum);
  });

  it('Phase 순서가 Inhibit → Lengthen → Activate → Integrate 로 고정', () => {
    const analysis = {
      ...emptyAnalysis(),
      integrate: [ex('i', 'I', 'd', '', { holdSeconds: 30, sets: 1 })],
      activate: [ex('a', 'A', 'd', '', { holdSeconds: 30, sets: 1 })],
      lengthen: [ex('l', 'L', 'd', '', { holdSeconds: 30, sets: 1 })],
      inhibit: [ex('h', 'H', 'd', '', { holdSeconds: 30, sets: 1 })],
    };
    const r = buildRoutineFromAnalysis(analysis, { getTargetMuscles: noTargets });
    const order = r.exercises.filter((s) => s.kind === 'exercise').map((s) => s.cesPhase);
    expect(order).toEqual(['Inhibit', 'Lengthen', 'Activate', 'Integrate']);
  });
});
