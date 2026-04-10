// ────────────────────────────────────────────────────────
// romTypes.ts — 도메인 타입 및 세션 유틸리티
// [PRD 4-0] 200줄 규칙 준수 / [PRD 2-3] any 절대 금지
// ────────────────────────────────────────────────────────

/** 관절 하나의 운동 동작 */
export interface Movement {
    id: string;
    name: string;               // 한국어 표시명 (UI 기본)
    englishName?: string;       // 의학 용어(영문) — 접근성/내보내기용, UI 기본 표시에는 사용하지 않음
    normalRange: number;        // 단위: 도(°)
    isQualitative?: boolean;    // 정성적 측정(Yes/No) 여부
}

/** 관절 */
export interface Joint {
    id: string;
    name: string;               // 한국어 표시명 (UI 기본)
    englishName?: string;       // 의학 용어(영문) — 접근성/내보내기용
    movements: Movement[];
    isSymmetric?: boolean;      // 좌우 구분이 없는 관절(예: 허리) 여부
}

/** ROM 제한 등급 */
export type Severity = '정상' | '경도제한' | '중등도제한' | '심각한제한';

/** 운동 처방 아이템 */
export interface Exercise {
    id: string;
    title: string;
    description: string;
    type: 'stretching' | 'strengthening';
    level?: '초급' | '중급' | '고급';
    imageUrl: string;
}

/** 환자 정보 */
export interface Patient {
    id: string;
    name: string;
    age: number;
    painArea?: string;      // 추가: 통증 부위
    vasScore?: number;     // 추가: 통증 지수 (0-10)
    lastMeasuredAt?: string;
    createdAt: string;
}

// ────────────────────────────────────────────────────────
// 측정 방향 & 세션 타입
// ────────────────────────────────────────────────────────

/** 측정 방향 */
export type Side = '좌측' | '우측';

/**
 * 환자 세션 데이터
 * measurements[jointId][side][movementId] = 각도(°)
 */
export interface RomSession {
    patientId?: string;           // 추가: 환자 고유 ID
    patientName: string;
    patientAge: number;
    painArea?: string;            // 추가: 통증 부위
    vasScore?: number;           // 추가: 통증 지수 (0-10)
    selectedJointIds: string[];   // 선택된 관절 ID 목록 (순서 유지)
    selectedSides: Side[];        // 측정할 방향 목록
    measurements: Record<string, Partial<Record<Side, Record<string, number>>>>;
    createdAt: string;            // 추가: 측정 일시
}

/** 측정 대기열 항목 */
export interface MeasurementQueueItem {
    jointId: string;
    side: Side;
}

/** 순서대로 측정할 (관절 × 방향) 조합 목록 생성
 *  대칭 관절(허리 등)은 방향 상관 없이 단일 항목으로 처리합니다. */
export const getMeasurementQueue = (
    session: RomSession,
    allJoints: Joint[]
): MeasurementQueueItem[] => {
    const queue: MeasurementQueueItem[] = [];
    session.selectedJointIds.forEach((jid) => {
        const joint = allJoints.find((j) => j.id === jid);
        if (joint?.isSymmetric) {
            queue.push({ jointId: jid, side: '좌측' });
        } else {
            session.selectedSides.forEach((side) => {
                queue.push({ jointId: jid, side });
            });
        }
    });
    return queue;
};

/** 현재 항목 기준으로 다음 측정 항목 반환 */
export const getNextMeasurement = (
    session: RomSession,
    allJoints: Joint[],
    currentJointId: string,
    currentSide: Side,
): MeasurementQueueItem | null => {
    const queue = getMeasurementQueue(session, allJoints);
    const idx = queue.findIndex(
        (item) => item.jointId === currentJointId && item.side === currentSide,
    );
    return queue[idx + 1] ?? null;
};

// ────────────────────────────────────────────────────────
// localStorage 유틸리티
// ────────────────────────────────────────────────────────

const SESSION_STORAGE_KEY = 'rom_session'; // [PRD 4-3] 매직 스트링 금지

/** localStorage에서 세션을 안전하게 불러오기 [PRD 3-1] */
export const loadRomSession = (): RomSession | null => {
    try {
        const saved = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!saved) return null;
        const parsed: unknown = JSON.parse(saved);
        if (!isValidRomSession(parsed)) {
            console.error('[ROM] 세션 데이터 형식 오류:', parsed);
            return null;
        }
        return parsed;
    } catch (error) {
        console.error('[ROM] 세션 파싱 실패:', error);
        return null;
    }
};

/** 세션을 localStorage에 안전하게 저장 */
export const saveRomSession = (session: RomSession): void => {
    try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
        console.error('[ROM] 세션 저장 실패:', error);
    }
};

/** 현재 세션만 제거 — 환자/히스토리 데이터는 유지 */
export const clearRomSession = (): void => {
    try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
        console.error('[ROM] 세션 삭제 실패:', error);
    }
};

/** RomSession 타입가드 */
const isValidRomSession = (value: unknown): value is RomSession => {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.patientName === 'string' &&
        typeof v.patientAge === 'number' &&
        Array.isArray(v.selectedJointIds) &&
        Array.isArray(v.selectedSides)
    );
};
