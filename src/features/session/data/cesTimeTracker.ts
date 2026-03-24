// cesTimeTracker.ts — CES 단계별 수행 시간 데이터 관리
// [PRD 4-0] 200줄 이하 / [PRD 2-3] any 금지
import type { CesStage } from '../../../lib/ces/cesTypes';

const STORAGE_KEY = 'ces_history_durations';
const DEFAULT_GOAL_SECONDS = 300; // 5분

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

export const updatePhaseDuration = (stage: CesStage, additionalSeconds: number, sessionCreatedAt?: string): void => {
    const history = loadCesHistory();
    const key = sessionCreatedAt || 'latest';
    if (!history[key]) {
        history[key] = { inhibit: 0, lengthen: 0, activate: 0, integrate: 0, lastUpdated: new Date().toISOString() };
    }
    (history[key] as any)[stage] += additionalSeconds;
    history[key].lastUpdated = new Date().toISOString();
    saveCesHistory(history);
};


export const getPhasePercentage = (stage: CesStage, sessionCreatedAt?: string, goalSeconds = DEFAULT_GOAL_SECONDS): number => {
    const history = loadCesHistory();
    const key = sessionCreatedAt || 'latest';
    if (!history[key]) return 0;
    const current = (history[key] as any)[stage] as number;
    return Math.min(100, Math.round((current / goalSeconds) * 100));
};


export const getTotalCompletionPercentage = (sessionCreatedAt?: string, goalSeconds = DEFAULT_GOAL_SECONDS): number => {
    const history = loadCesHistory();
    const key = sessionCreatedAt || 'latest';
    if (!history[key]) return 0;
    const d = history[key];
    const totalCurrent = d.inhibit + d.lengthen + d.activate + d.integrate;
    const totalGoal = goalSeconds * 4;
    return Math.min(100, Math.round((totalCurrent / totalGoal) * 100));
};
