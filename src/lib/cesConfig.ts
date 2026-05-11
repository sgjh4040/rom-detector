// cesConfig.ts — CES (Corrective Exercise Strategy) 의 시간/구성 매직 넘버 SSOT.
// [audit #23] cesTimeTracker.ts 안의 const 를 단일 진실원으로 분리.

/**
 * CES 한 단계(phase)의 기본 목표 시간 (초). 5분 = 300초.
 *
 * ⚠️ 이 값은 **fallback 전용**. 정상 흐름에서는 호출되지 않는다.
 * 실제 사용처(NeumoDashboard)에서는 `computePhaseGoals(session)` 으로 처방의
 * 운동 시간 합을 계산해 `phaseGoals[stage]` / `phaseGoals.total` 을 항상
 * 명시적으로 전달한다 — 즉 default value 는 안전망일 뿐.
 *
 * 따라서 이 값을 변경해도 대시보드 진행률은 바뀌지 않으며, 함수 직접 호출 시
 * (테스트/스크립트) 처방이 없을 때만 5분 기준으로 평가된다.
 */
export const DEFAULT_PHASE_GOAL_SECONDS = 300;

/** CES 4단계(억제/신장/활성/통합) 의 폴백 총 목표 시간 = 단계당 5분 × 4 = 20분 */
export const DEFAULT_TOTAL_GOAL_SECONDS = DEFAULT_PHASE_GOAL_SECONDS * 4;

/**
 * CES 운동 영상 호스팅 베이스 URL (Cloudflare R2)
 *
 * 사용처: `CesVideoPlayer` — 운동 데이터의 `youtubeId` 값이 mp4 파일명이면
 * `${VIDEO_BASE_URL}/${파일명}` 으로 조합해 재생한다.
 *
 * 환경별 분리 필요 시 `.env` 의 `VITE_VIDEO_BASE_URL` 로 옮기기.
 * 베이스 URL 자체는 퍼블릭이라 코드에 박혀도 보안 영향 없음.
 */
export const VIDEO_BASE_URL = 'https://pub-1b5fd3953576465eba5c84f2ce1fe492.r2.dev';
