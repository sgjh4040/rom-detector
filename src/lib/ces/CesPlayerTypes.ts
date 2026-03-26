// CesPlayerTypes.ts — NTC 플레이어 페이로드 타입 + 목(Mock) 데이터 (PRD 4-0: 200줄 이하)

// ── CES 4단계 타입 ──────────────────────────────────────────────────────────
export type CesPhase = 'Inhibit' | 'Lengthen' | 'Activate' | 'Integrate';

// ── 단위 운동 스텝 (PRD 4항 JSON 명세 기반) ─────────────────────────────────
export interface CesExerciseStep {
    step: number;
    exerciseName: string;
    videoUrl: string;
    durationSeconds: number;
    cesPhase: CesPhase;
    /** SVG <path id="..."> 와 매칭되는 근육 ID 목록 */
    targetSvgIds: string[];
}

// ── 전체 루틴 ────────────────────────────────────────────────────────────────
export interface CesRoutine {
    routineId: string;
    totalDurationSeconds: number;
    exercises: CesExerciseStep[];
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

// ── 임시 목(Mock) 루틴 — 백엔드 API 연동 전 사용 ───────────────────────────
export const MOCK_ROUTINE: CesRoutine = {
    routineId: 'routine_ces_demo',
    totalDurationSeconds: 240,
    exercises: [
        {
            step: 1,
            exerciseName: '소흉근 폼롤링',
            videoUrl: '',
            durationSeconds: 40,
            cesPhase: 'Inhibit',
            targetSvgIds: ['소흉근', '대흉근'],
        },
        {
            step: 2,
            exerciseName: '소흉근 문틀 스트레칭',
            videoUrl: '',
            durationSeconds: 30,
            cesPhase: 'Lengthen',
            targetSvgIds: ['소흉근', '전방삼각근'],
        },
        {
            step: 3,
            exerciseName: 'Y자 하부승모근 활성화',
            videoUrl: '',
            durationSeconds: 45,
            cesPhase: 'Activate',
            targetSvgIds: ['승모근', '삼각근'],
        },
        {
            step: 4,
            exerciseName: '케이블 외회전 투 프레스',
            videoUrl: '',
            durationSeconds: 60,
            cesPhase: 'Integrate',
            targetSvgIds: ['삼각근', '대흉근', '승모근', '이두근'],
        },
        {
            step: 5,
            exerciseName: '비복근 폼롤링',
            videoUrl: '',
            durationSeconds: 40,
            cesPhase: 'Inhibit',
            targetSvgIds: ['비복근', '가자미근'],
        },
        {
            step: 6,
            exerciseName: '힙 브릿지',
            videoUrl: '',
            durationSeconds: 45,
            cesPhase: 'Activate',
            targetSvgIds: ['대둔근', '중둔근', '슬굴곡근'],
        },
    ],
};
