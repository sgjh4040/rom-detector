// ────────────────────────────────────────────────────────
// cesRoutineBuilder.ts — CES 분석 결과 → 플레이어 루틴 변환
// [PRD 1] Data layer / [PRD 2-3] any 금지 / [PRD 4-0] 200줄 이하
//
// 설계 원칙 (Stage 2):
// 1. 각 운동을 세트 단위로 분할한다. 예) hold 30, sets 2 → "세트 1" 30초 +
//    "세트 2" 30초 두 개의 exercise 스텝.
// 2. 같은 운동의 세트 사이에는 `set-rest` 브레이크(기본 30초)를 삽입한다.
//    단 마지막 세트 뒤에는 삽입하지 않는다.
// 3. 같은 phase 내에서 운동이 바뀔 때는 `transition` 브레이크(기본 15초)를
//    삽입한다. phase 가 바뀌는 경계에는 브레이크를 넣지 않는다.
// 4. 분할 시 반올림으로 합이 어긋나지 않도록 첫 세트에 remainder 를 몰아준다.
//    (세트 스텝의 durationSeconds 합 === exerciseSeconds(ex))
// 5. 브레이크 스텝은 플레이어 UI 에만 반영되고, updatePhaseDuration 으로는
//    누적되지 않는다 (useCesPlayer 에서 kind 체크). 따라서 플레이어를 풀로
//    재생하면 대시보드의 phase 목표와 1:1 로 일치한다.
// ────────────────────────────────────────────────────────

import { exerciseSeconds } from './cesGoalCalculator';
import type {
    CesPlayerStep,
    CesExerciseStep,
    CesBreakStep,
    CesRoutine,
    CesPhase,
} from './CesPlayerTypes';
import type { CesAnalysisResult, CesExercise } from './cesTypes';

/** 세트 간 기본 휴식 시간 (초) — 근지구력/재활 영역 표준 */
export const DEFAULT_REST_SECONDS = 30;

/** 운동 간 기본 전환 시간 (초) */
export const DEFAULT_TRANSITION_SECONDS = 15;

/** 타겟 근육 ID 조회 함수 시그니처 — UI 쪽에서 주입 */
export type GetTargetMuscles = (exerciseName: string) => string[];

/**
 * 한 운동을 세트 단위 exercise 스텝 + 사이 set-rest 브레이크로 분할.
 * 반올림 보정: 첫 세트에 remainder 를 더해 합이 정확히 exerciseSeconds(ex) 가 되게 한다.
 */
const expandExerciseIntoSteps = (
    ex: CesExercise,
    phase: CesPhase,
    startStepCount: number,
    getTargetMuscles: GetTargetMuscles,
): CesPlayerStep[] => {
    const steps: CesPlayerStep[] = [];
    const sets = ex.sets ?? 1;
    const fullSeconds = exerciseSeconds(ex);

    // sets === 0 방어 (데이터 오류 대응)
    const safeSets = Math.max(1, sets);
    const baseSetSeconds = Math.floor(fullSeconds / safeSets);
    const remainder = fullSeconds - baseSetSeconds * safeSets;

    let stepCount = startStepCount;
    const targetSvgIds = getTargetMuscles(ex.name);
    const restSec = ex.restSeconds ?? DEFAULT_REST_SECONDS;

    for (let s = 1; s <= safeSets; s++) {
        const setDuration = s === 1 ? baseSetSeconds + remainder : baseSetSeconds;
        const exerciseStep: CesExerciseStep = {
            step: ++stepCount,
            kind: 'exercise',
            exerciseName: ex.name,
            videoUrl: ex.youtubeId || '',
            durationSeconds: setDuration,
            cesPhase: phase,
            targetSvgIds,
            currentSet: s,
            totalSets: safeSets,
        };
        steps.push(exerciseStep);

        // 마지막 세트가 아니면 set-rest 브레이크 삽입
        if (s < safeSets) {
            const restStep: CesBreakStep = {
                step: ++stepCount,
                kind: 'break',
                breakKind: 'set-rest',
                durationSeconds: restSec,
                cesPhase: phase,
                fromExercise: ex.name,
                toExercise: ex.name, // 같은 운동의 다음 세트
                completedSet: s,
                totalSets: safeSets,
            };
            steps.push(restStep);
        }
    }

    return steps;
};

/**
 * 하나의 phase 에 해당하는 운동 목록을 expansion 하고,
 * 운동 사이에는 transition 브레이크를 삽입해서 스텝 배열을 반환한다.
 */
const buildPhaseSteps = (
    exercises: CesExercise[],
    phase: CesPhase,
    startStepCount: number,
    transitionSeconds: number,
    getTargetMuscles: GetTargetMuscles,
): CesPlayerStep[] => {
    const steps: CesPlayerStep[] = [];
    let stepCount = startStepCount;

    exercises.forEach((ex, idx) => {
        const exerciseSteps = expandExerciseIntoSteps(
            ex,
            phase,
            stepCount,
            getTargetMuscles,
        );
        steps.push(...exerciseSteps);
        stepCount += exerciseSteps.length;

        // 이 phase 에 더 남은 운동이 있으면 transition 브레이크 삽입
        const isLastExerciseInPhase = idx === exercises.length - 1;
        if (!isLastExerciseInPhase) {
            const nextExercise = exercises[idx + 1];
            const transitionStep: CesBreakStep = {
                step: ++stepCount,
                kind: 'break',
                breakKind: 'transition',
                durationSeconds: transitionSeconds,
                cesPhase: phase,
                fromExercise: ex.name,
                toExercise: nextExercise.name,
            };
            steps.push(transitionStep);
        }
    });

    return steps;
};

export interface BuildRoutineOptions {
    getTargetMuscles: GetTargetMuscles;
    restSeconds?: number;
    transitionSeconds?: number;
}

/**
 * CES 분석 결과를 플레이어 루틴으로 변환한다.
 *
 * Phase 순서: Inhibit → Lengthen → Activate → Integrate.
 * Phase 경계에는 브레이크를 넣지 않는다 (phase 전환 자체가 충분한 심리적 구분).
 */
export const buildRoutineFromAnalysis = (
    analysis: CesAnalysisResult,
    options: BuildRoutineOptions,
): CesRoutine => {
    const {
        getTargetMuscles,
        restSeconds: _restUnused = DEFAULT_REST_SECONDS, // reserved for future opts
        transitionSeconds = DEFAULT_TRANSITION_SECONDS,
    } = options;
    void _restUnused; // 각 운동이 자체 restSeconds 필드로 override 가능 (expandExerciseIntoSteps 내부)

    const phaseGroups: Array<[CesExercise[], CesPhase]> = [
        [analysis.inhibit, 'Inhibit'],
        [analysis.lengthen, 'Lengthen'],
        [analysis.activate, 'Activate'],
        [analysis.integrate, 'Integrate'],
    ];

    const allSteps: CesPlayerStep[] = [];
    let stepCount = 0;

    for (const [exercises, phase] of phaseGroups) {
        if (exercises.length === 0) continue;
        const phaseSteps = buildPhaseSteps(
            exercises,
            phase,
            stepCount,
            transitionSeconds,
            getTargetMuscles,
        );
        allSteps.push(...phaseSteps);
        stepCount += phaseSteps.length;
    }

    const totalDurationSeconds = allSteps.reduce(
        (sum, s) => sum + s.durationSeconds,
        0,
    );

    return {
        routineId: `routine_${Date.now()}`,
        totalDurationSeconds,
        exercises: allSteps,
    };
};
