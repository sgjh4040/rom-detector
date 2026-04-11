// ────────────────────────────────────────────────────────
// cesGoalCalculator.ts — CES 운동 처방 → 목표 수행 시간 계산
// [PRD 1] Data layer / [PRD 2-3] any 금지 / [PRD 4-0] 200줄 이하
//
// 설계 원칙:
// - 각 CES 운동 항목(CesExercise)의 sets/reps/holdSeconds 조합에서
//   실제 "몸을 쓰는" 시간만 산출한다. 세트 사이 휴식(rest)은 포함하지 않는다.
// - 휴식은 플레이어 UX에서만 시각적으로 연출되고 누적 시간 집계와는
//   분리해 둬야 "누적 60초 / 목표 60초 = 100%" 처럼 직관적인 의미가 성립한다.
// ────────────────────────────────────────────────────────

import { JOINTS } from '../romData';
import { analyzeMuscles } from '../muscleAnalysis';
import type { RomSession, Side } from '../romTypes';
import type { CesExercise, CesStage } from './cesTypes';

/** rep 1개 실행에 소요되는 기본 초 (concentric ~1.5 + eccentric ~1.5). */
export const SECONDS_PER_REP = 3;

/** holdSeconds/reps 둘 다 지정되지 않은 운동의 폴백 목표 초 */
export const FALLBACK_EXERCISE_SECONDS = 60;

/**
 * 단일 CES 운동의 목표 수행 시간(초)을 계산한다.
 *
 * 계산 규칙:
 * - `holdSeconds` + `reps` + `sets`: 등척성 홀드 반복 → `hold × reps × sets`
 * - `holdSeconds` + `sets`: 스트레칭·SMR → `hold × sets`
 * - `reps` + `sets`: 근력·활성화 → `SECONDS_PER_REP × reps × sets`
 * - 데이터 없음: `FALLBACK_EXERCISE_SECONDS`
 *
 * 세트 사이 휴식은 포함하지 않는다.
 */
export const exerciseSeconds = (ex: CesExercise): number => {
    const sets = ex.sets ?? 1;
    const hold = ex.holdSeconds ?? 0;
    const reps = ex.reps ?? 0;

    if (hold > 0 && reps > 0) return hold * reps * sets;
    if (hold > 0) return hold * sets;
    if (reps > 0) return SECONDS_PER_REP * reps * sets;
    return FALLBACK_EXERCISE_SECONDS;
};

/** 운동 배열의 목표 초 합계 */
export const exerciseListSeconds = (list: CesExercise[]): number =>
    list.reduce((sum, ex) => sum + exerciseSeconds(ex), 0);

/** Stage별 목표 초 + 총합 */
export interface PhaseGoalSeconds {
    inhibit: number;
    lengthen: number;
    activate: number;
    integrate: number;
    total: number;
}

/** 비어 있는 목표값 — 처방이 전혀 없을 때 사용 */
export const EMPTY_PHASE_GOALS: PhaseGoalSeconds = {
    inhibit: 0,
    lengthen: 0,
    activate: 0,
    integrate: 0,
    total: 0,
};

/**
 * 여러 (관절 × 방향) 분석 결과를 합칠 때 중복 운동을 제거한다.
 * `analyzeMuscles`는 호출 단위로만 dedup하므로, 합치는 쪽에서 다시 한 번 걸러야 한다.
 */
const dedupById = (exercises: CesExercise[]): CesExercise[] => {
    const seen = new Set<string>();
    const result: CesExercise[] = [];
    for (const ex of exercises) {
        if (seen.has(ex.id)) continue;
        seen.add(ex.id);
        result.push(ex);
    }
    return result;
};

/**
 * RomSession의 `selectedJointIds × selectedSides` 조합으로 CES 처방을 분석해
 * 각 단계의 목표 수행 시간을 반환한다.
 *
 * - 대칭 관절(허리 등)은 좌측으로만 1회 분석한다.
 * - 동일 운동이 여러 관절/방향에서 중복되면 `dedupById`로 1회만 합산한다.
 * - `selectedSides`가 비어 있으면 분석할 수 없으므로 `EMPTY_PHASE_GOALS` 반환.
 */
export const computePhaseGoals = (session: RomSession): PhaseGoalSeconds => {
    if (session.selectedJointIds.length === 0) return EMPTY_PHASE_GOALS;

    const allInhibit: CesExercise[] = [];
    const allLengthen: CesExercise[] = [];
    const allActivate: CesExercise[] = [];
    const allIntegrate: CesExercise[] = [];

    session.selectedJointIds.forEach((jointId) => {
        const joint = JOINTS.find((j) => j.id === jointId);
        if (!joint) return;

        // 대칭 관절은 좌측 하나로 충분. 그 외엔 세션에 저장된 방향 모두 분석.
        const sidesToAnalyze: Side[] = joint.isSymmetric
            ? ['좌측']
            : session.selectedSides.length > 0
                ? session.selectedSides
                : ['좌측'];

        sidesToAnalyze.forEach((side) => {
            const analysis = analyzeMuscles(session, jointId, side);
            allInhibit.push(...analysis.inhibit);
            allLengthen.push(...analysis.lengthen);
            allActivate.push(...analysis.activate);
            allIntegrate.push(...analysis.integrate);
        });
    });

    const inhibit = exerciseListSeconds(dedupById(allInhibit));
    const lengthen = exerciseListSeconds(dedupById(allLengthen));
    const activate = exerciseListSeconds(dedupById(allActivate));
    const integrate = exerciseListSeconds(dedupById(allIntegrate));

    return {
        inhibit,
        lengthen,
        activate,
        integrate,
        total: inhibit + lengthen + activate + integrate,
    };
};

/** Phase goal 조회 유틸리티 — 타입 안전한 인덱싱 */
export const getPhaseGoal = (
    goals: PhaseGoalSeconds,
    stage: CesStage,
): number => goals[stage];
