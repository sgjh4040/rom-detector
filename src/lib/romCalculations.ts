// ────────────────────────────────────────────────────────
// romCalculations.ts — ROM 분석 알고리즘
// [PRD 4-0] 200줄 규칙: 계산 로직은 이 파일에만 작성
// [PRD 4-3] 매직 넘버 금지 — 임계값은 상수로 선언
// ────────────────────────────────────────────────────────

import type { Severity } from './romTypes';

// ROM 분석 임계값 상수 [PRD 4-3]
const ROM_NORMAL_THRESHOLD = 0.85;    // 정상 범위: 정상값의 85% 이상
const ROM_MILD_THRESHOLD = 0.65;      // 경도제한: 65% 이상
const ROM_MODERATE_THRESHOLD = 0.45;  // 중등도제한: 45% 이상
const ROM_ZERO_TOLERANCE = -5;        // 0° 기준 동작의 정상 허용 오차

/**
 * 측정값과 정상 범위를 비교해 제한 등급을 반환합니다.
 * 레고 비유: 자(ruler)로 재서 어느 칸에 해당하는지 알려주는 함수입니다.
 *
 * @param measured - 실제 측정된 각도(°)
 * @param normal   - 해당 동작의 정상 가동 범위(°)
 */
export const calculateSeverity = (measured: number, normal: number): Severity => {
    // 특수 케이스: 정상 범위가 0°인 동작 (예: 무릎 완전 신전)
    if (normal === 0) {
        return measured >= ROM_ZERO_TOLERANCE ? '정상' : '심각한제한';
    }
    //normal ===0 이면 return 으로가 밑에 코드 실행안되고 끝남 

    const ratio = measured / normal;
    if (ratio >= ROM_NORMAL_THRESHOLD) return '정상';
    if (ratio >= ROM_MILD_THRESHOLD) return '경도제한';
    if (ratio >= ROM_MODERATE_THRESHOLD) return '중등도제한';
    return '심각한제한';
};
