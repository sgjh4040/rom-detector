// cesTimeTracker.ts — CES 단계별 수행 시간 데이터 관리
// [PRD 4-0] 200줄 이하 / [PRD 2-3] any 금지
import type { CesStage } from '../../../lib/ces/cesTypes';

const STORAGE_KEY = 'ces_history_durations';

/**
 * 한 단계의 기본 목표 시간 (초). 5분 = 300초.
 *
 * ⚠️ [audit #23] 이 값은 **fallback 전용** 이며 정상 흐름에서는 호출되지 않는다.
 * 실제 사용처(NeumoDashboard)에서는 `computePhaseGoals(session)` 으로 처방의
 * 운동 시간 합을 계산해 `phaseGoals[stage]` / `phaseGoals.total` 을 항상
 * 명시적으로 전달한다 — 즉 default value 는 안전망일 뿐.
 *
 * 따라서 이 값을 변경해도 대시보드 진행률은 바뀌지 않으며, 함수 직접 호출 시
 * (테스트/스크립트) 처방이 없을 때만 5분 기준으로 평가된다.
 */
const DEFAULT_GOAL_SECONDS = 300;

export interface PhaseDurations {
    inhibit: number;
    lengthen: number;
    activate: number;
    integrate: number;
    lastUpdated: string;
}

export type CesHistoryMap = Record<string, PhaseDurations>;

export const loadCesHistory = (): CesHistoryMap => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return {};
        return JSON.parse(saved) as CesHistoryMap;
    } catch (e) {
        console.error('Failed to load CES history', e);
        return {};
    }
};

// [PRD 2-3] any 금지
export const saveCesHistory = (history: CesHistoryMap): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('Failed to save CES history', e);
    }
};

/** 4단계 누적 시간 기록을 모두 제거. (Settings 의 "전체 데이터 삭제"용) */
export const clearCesHistory = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear CES history', e);
    }
};

// [PRD 2-3] any 제거: PhaseDurations 의 4 단계 number 키만 안전하게 다루는 헬퍼.
// stage 가 'lastUpdated' 같은 string 키를 받지 않도록 CesStage 로 좁혀 컴파일 타임에 차단한다.
const addStage = (d: PhaseDurations, stage: CesStage, seconds: number): void => {
    d[stage] = d[stage] + seconds;
};
const readStage = (d: PhaseDurations, stage: CesStage): number => d[stage];

export const updatePhaseDuration = (stage: CesStage, additionalSeconds: number, sessionCreatedAt?: string): void => {
    const history = loadCesHistory();
    const key = sessionCreatedAt || 'latest';

    if (!history[key]) {
        history[key] = { inhibit: 0, lengthen: 0, activate: 0, integrate: 0, lastUpdated: new Date().toISOString() };
    }
    addStage(history[key], stage, additionalSeconds);
    history[key].lastUpdated = new Date().toISOString();

    saveCesHistory(history);
};


/**
 * 단계별 누적 시간을 목표 초 대비 퍼센트로 반환한다.
 *
 * @param stage CES 단계
 * @param sessionCreatedAt 세션 ID (createdAt)
 * @param goalSeconds 목표 초 — 생략 시 DEFAULT_GOAL_SECONDS(300) 폴백.
 *                    처방이 비어 있을 때(= 0)는 0%를 반환한다.
 */
export const getPhasePercentage = (
    stage: CesStage,
    sessionCreatedAt?: string,
    goalSeconds: number = DEFAULT_GOAL_SECONDS,
): number => {
    const history = loadCesHistory();
    const key = sessionCreatedAt || 'latest';
    if (!history[key]) return 0;
    if (goalSeconds <= 0) return 0; // 처방이 없으면 퍼센트 정의 불가
    const current = readStage(history[key], stage);
    return Math.min(100, Math.round((current / goalSeconds) * 100));
};

/**
 * 세션의 4단계 누적 시간을 총 목표 대비 퍼센트로 반환한다.
 *
 * @param sessionCreatedAt 세션 ID (createdAt)
 * @param totalGoalSeconds 4단계 전체 합산 목표 초.
 *                         생략 시 `DEFAULT_GOAL_SECONDS * 4`(= 1200초) 폴백.
 *                         처방이 비어 있을 때(= 0)는 0%를 반환한다.
 */
export const getTotalCompletionPercentage = (
    sessionCreatedAt?: string,
    totalGoalSeconds: number = DEFAULT_GOAL_SECONDS * 4,
): number => {
    const history = loadCesHistory();
    const key = sessionCreatedAt || 'latest';
    if (!history[key]) return 0;
    if (totalGoalSeconds <= 0) return 0;
    const d = history[key];
    const totalCurrent = d.inhibit + d.lengthen + d.activate + d.integrate;
    return Math.min(100, Math.round((totalCurrent / totalGoalSeconds) * 100));
};

/** 특정 회차의 단계별 누적 초 단위 시간 (표시용) */
export const getPhaseSeconds = (stage: CesStage, sessionCreatedAt?: string): number => {
    const history = loadCesHistory();
    const key = sessionCreatedAt || 'latest';
    if (!history[key]) return 0;
    return readStage(history[key], stage);
};
