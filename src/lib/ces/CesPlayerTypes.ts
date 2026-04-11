// CesPlayerTypes.ts — NTC 플레이어 페이로드 타입 + 목(Mock) 데이터 (PRD 4-0: 200줄 이하)

// ── CES 4단계 타입 ──────────────────────────────────────────────────────────
export type CesPhase = 'Inhibit' | 'Lengthen' | 'Activate' | 'Integrate';

// ── 운동 스텝 ─────────────────────────────────────────────────────────────
export interface CesExerciseStep {
    step: number;
    kind: 'exercise';
    exerciseName: string;
    videoUrl: string;
    durationSeconds: number;
    cesPhase: CesPhase;
    /** SVG <path id="..."> 와 매칭되는 근육 ID 목록 */
    targetSvgIds: string[];
    /** 현재 세트 번호 (1-based) — 세트가 1개뿐이거나 정보 없을 때는 생략 */
    currentSet?: number;
    /** 총 세트 수 */
    totalSets?: number;
}

// ── 브레이크 스텝 (세트 간 휴식 / 운동 간 전환) ───────────────────────────
/**
 * 브레이크 타입:
 * - `set-rest`: 같은 운동 내 세트 사이 휴식 (기본 30초)
 * - `transition`: 같은 phase 내 다음 운동으로 넘어가기 전 준비 시간 (기본 15초)
 *
 * 브레이크 스텝은 `updatePhaseDuration` 에 **누적되지 않는다**.
 * 타이머는 돌지만 phase별 누적 시간에는 영향을 주지 않아서 대시보드 목표와
 * 실제 누적이 1:1 로 일치한다.
 */
export type BreakKind = 'set-rest' | 'transition';

export interface CesBreakStep {
    step: number;
    kind: 'break';
    breakKind: BreakKind;
    durationSeconds: number;
    /** 이전 스텝의 phase 를 그대로 물려받아 UI 일관성 유지 */
    cesPhase: CesPhase;
    /** 바로 직전에 끝낸 운동명 */
    fromExercise: string;
    /** 브레이크 이후 수행할 운동명 (같은 운동의 다음 세트 or 다음 운동) */
    toExercise: string;
    /** set-rest 일 때: 몇 세트째 종료 후인지 */
    completedSet?: number;
    /** set-rest 일 때: 총 세트 수 */
    totalSets?: number;
}

/** 플레이어가 실제로 재생하는 스텝 유니온 */
export type CesPlayerStep = CesExerciseStep | CesBreakStep;

// ── 전체 루틴 ────────────────────────────────────────────────────────────────
export interface CesRoutine {
    routineId: string;
    totalDurationSeconds: number;
    exercises: CesPlayerStep[];
}

// ── 페이즈별 시각 메타 ───────────────────────────────────────────────────────
export interface PhaseMeta {
    label: string;
    color: string;
    animation: 'pulse-slow' | 'fade-in' | 'heartbeat' | 'glow';
    description: string;
}

export const PHASE_META: Record<CesPhase, PhaseMeta> = {
    Inhibit: {
        label: '억제 (Inhibit)',
        color: '#EAB308',    // 노란색
        animation: 'pulse-slow',
        description: '과활성 근육 이완 중',
    },
    Lengthen: {
        label: '신장 (Lengthen)',
        color: '#3B82F6',   // 파란색
        animation: 'fade-in',
        description: '짧아진 근육 연장 중',
    },
    Activate: {
        label: '활성화 (Activate)',
        color: '#EF4444',    // 빨간색
        animation: 'heartbeat',
        description: '저활성 근육 강화 중',
    },
    Integrate: {
        label: '통합 (Integrate)',
        color: '#22C55E',    // 초록색
        animation: 'glow',
        description: '전신 협응력 강화 중',
    },
};

// ── 브레이크 스텝 시각 메타 ─────────────────────────────────────────────────
export interface BreakMeta {
    label: string;
    title: string;
    description: (step: CesBreakStep) => string;
    /** 중립 회색 컬러 — phase 컬러와 시각적 대비 */
    color: string;
    bgColor: string;
}

export const BREAK_META: Record<BreakKind, BreakMeta> = {
    'set-rest': {
        label: '휴식',
        title: '잠시 쉬어요',
        description: (step) =>
            step.completedSet && step.totalSets
                ? `${step.completedSet}/${step.totalSets} 세트 완료 — 다음 세트 준비`
                : '다음 세트 준비',
        color: '#64748b',    // slate-500
        bgColor: '#f1f5f9',  // slate-100
    },
    'transition': {
        label: '준비',
        title: '다음 운동 준비',
        description: (step) => `다음: ${step.toExercise}`,
        color: '#0891b2',    // cyan-600
        bgColor: '#ecfeff',  // cyan-50
    },
};

// ── 임시 목(Mock) 루틴 — 백엔드 API 연동 전 사용 ───────────────────────────
export const MOCK_ROUTINE: CesRoutine = {
    routineId: 'routine_ces_demo',
    totalDurationSeconds: 240,
    exercises: [
        {
            step: 1,
            kind: 'exercise',
            exerciseName: '소흉근 폼롤링',
            videoUrl: '',
            durationSeconds: 40,
            cesPhase: 'Inhibit',
            targetSvgIds: ['소흉근', '대흉근'],
        },
        {
            step: 2,
            kind: 'exercise',
            exerciseName: '소흉근 문틀 스트레칭',
            videoUrl: '',
            durationSeconds: 30,
            cesPhase: 'Lengthen',
            targetSvgIds: ['소흉근', '전방삼각근'],
        },
        {
            step: 3,
            kind: 'exercise',
            exerciseName: 'Y자 하부승모근 활성화',
            videoUrl: '',
            durationSeconds: 45,
            cesPhase: 'Activate',
            targetSvgIds: ['승모근', '삼각근'],
        },
        {
            step: 4,
            kind: 'exercise',
            exerciseName: '케이블 외회전 투 프레스',
            videoUrl: '',
            durationSeconds: 60,
            cesPhase: 'Integrate',
            targetSvgIds: ['삼각근', '대흉근', '승모근', '이두근'],
        },
        {
            step: 5,
            kind: 'exercise',
            exerciseName: '비복근 폼롤링',
            videoUrl: '',
            durationSeconds: 40,
            cesPhase: 'Inhibit',
            targetSvgIds: ['비복근', '가자미근'],
        },
        {
            step: 6,
            kind: 'exercise',
            exerciseName: '힙 브릿지',
            videoUrl: '',
            durationSeconds: 45,
            cesPhase: 'Activate',
            targetSvgIds: ['대둔근', '중둔근', '슬굴곡근'],
        },
    ],
};
