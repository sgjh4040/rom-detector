// ────────────────────────────────────────────────────────
// cesTypes.ts — CES 4단계 재활 프로토콜 타입 정의
// [PRD 2-3] any 절대 금지 / [PRD 4-0] 200줄 이하
// ────────────────────────────────────────────────────────

/** CES 운동 처방 항목 */
export interface CesExercise {
    id: string;
    name: string;
    /** 수행 방법 설명 (환자가 이해할 수 있는 쉬운 언어) */
    description: string;
    /** YouTube 영상 ID — 업로드 후 채워넣기. 빈 문자열이면 플레이어 숨김 */
    youtubeId: string;
    tools?: string;       // 예: '폼롤러', '마사지 볼', '탄성 밴드'
    sets?: number;
    reps?: number;
    holdSeconds?: number;
    /** 이 운동의 세트 간 휴식 시간 override (초). 지정하지 않으면 전역 기본값(30초) 사용 */
    restSeconds?: number;
}

/** CES 단계 타입 */
export type CesStage = 'inhibit' | 'lengthen' | 'activate' | 'integrate';

/** 동작별 근육 분류 (과활성 / 약화) */
export interface MovementMuscles {
    /** 짧아진(과활성) 근육 → Stage 1·2 대상 */
    overactive: string[];
    /** 약화(저활성) 근육 → Stage 3 대상 */
    underactive: string[];
}

/** ROM 동작 하나에 대한 1·2·3단계 운동 세트 */
export interface MovementProtocol {
    inhibit: CesExercise[];   // Stage 1: SMR
    lengthen: CesExercise[];  // Stage 2: 스트레칭
    activate: CesExercise[];  // Stage 3: 독립 근력
}

/** 관절 전체 CES 데이터 */
export interface JointCesData {
    /** movementId → 과활성/약화 근육 목록 */
    muscleMap: Record<string, MovementMuscles>;
    /** movementId → 1·2·3단계 운동 */
    protocol: Record<string, MovementProtocol>;
    /** Stage 4: 관절 전체 통합 운동 (공통) */
    integrate: CesExercise[];
}

/** muscleAnalysis.ts에서 반환하는 최종 분석 결과 */
export interface CesAnalysisResult {
    overactiveMuscles: string[];
    underactiveMuscles: string[];
    inhibit: CesExercise[];
    lengthen: CesExercise[];
    activate: CesExercise[];
    integrate: CesExercise[];
}

/** CesExercise 생성 헬퍼 — 중복 코드 제거용 */
export const ex = (
    id: string,
    name: string,
    description: string,
    youtubeId = '',
    extra: Partial<Omit<CesExercise, 'id' | 'name' | 'description' | 'youtubeId'>> = {},
): CesExercise => ({ id, name, description, youtubeId, ...extra });
