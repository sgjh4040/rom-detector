// videoResolver.ts — CES 운동 영상 소스 정규화 (audit + R2 마이그레이션).
// 원시 값(youtubeId 자리에 들어가는 string)을 → 종류 + 최종 src 로 분기.

import { VIDEO_BASE_URL } from '../cesConfig';

export type VideoSource =
    | { kind: 'youtube'; src: string }   // YouTube 11자 ID 또는 youtube 절대 URL
    | { kind: 'mp4'; src: string }       // mp4 절대 URL (R2 베이스 + 파일명, 또는 외부 URL)
    | { kind: 'empty'; src: '' };

/**
 * 운동 데이터의 `youtubeId` 필드(legacy 명칭) 값을 분기:
 *   - 빈 문자열 → empty (플레이어 측에서 플레이스홀더 처리)
 *   - http(s):// 시작 → youtu 포함이면 youtube, 아니면 mp4 (절대 URL 그대로)
 *   - 길이 11 + `.` 없음 → YouTube ID
 *   - 그 외 → R2 파일명으로 간주 → `${VIDEO_BASE_URL}/${파일명}`
 */
export const resolveVideoSrc = (raw: string): VideoSource => {
    if (!raw) return { kind: 'empty', src: '' };
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
        return raw.includes('youtu')
            ? { kind: 'youtube', src: raw }
            : { kind: 'mp4', src: raw };
    }
    if (raw.length === 11 && !raw.includes('.')) {
        return { kind: 'youtube', src: raw };
    }
    // R2 파일명 — 공백/한글/특수문자 안전하게 인코딩
    return { kind: 'mp4', src: `${VIDEO_BASE_URL}/${encodeURIComponent(raw)}` };
};

/**
 * ExerciseListItem 썸네일용 — 원시값 → 썸네일 표시 정보.
 * YouTube 는 mqdefault.jpg, mp4 는 `<video preload="metadata">` 의 첫 프레임 사용.
 */
export type ThumbnailSource =
    | { kind: 'youtube-img'; imgSrc: string }
    | { kind: 'mp4-frame'; videoSrc: string }
    | { kind: 'none' };

export const resolveThumbnailSrc = (raw: string): ThumbnailSource => {
    const resolved = resolveVideoSrc(raw);
    if (resolved.kind === 'empty') return { kind: 'none' };
    if (resolved.kind === 'mp4') return { kind: 'mp4-frame', videoSrc: resolved.src };
    // youtube — 절대 URL 이면 ID 추출, 아니면 11자 ID 그대로
    const id = resolved.src.length === 11
        ? resolved.src
        : extractYoutubeId(resolved.src);
    return id
        ? { kind: 'youtube-img', imgSrc: `https://img.youtube.com/vi/${id}/mqdefault.jpg` }
        : { kind: 'none' };
};

/** youtube.com/watch?v=ID, youtu.be/ID, embed/ID 등에서 11자 ID 추출 */
const extractYoutubeId = (url: string): string | null => {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : null;
};
