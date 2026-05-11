// CesExerciseVideo.tsx — CES 운동 영상 통합 플레이어 (YouTube ID / R2 mp4 모두 처리).
// [PRD 4-0] 200줄 이하. videoResolver 의 분기 결과를 받아 렌더만 담당.

import React, { useRef, useEffect } from 'react';

import { resolveVideoSrc } from '../../lib/ces/videoResolver';
import { YoutubePlayer } from './YoutubePlayer';

interface Props {
    /** 운동 데이터의 `youtubeId` 자리 값 — YouTube ID, mp4 파일명, 절대 URL 모두 허용 */
    source: string;
    /** 영상 제목 (a11y / placeholder 문구용) */
    title?: string;
    /** mp4 옵션 — 기본값은 운동 자동 재생 / 루프 / 무음 */
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    objectFit?: 'cover' | 'contain';
}

/**
 * 빈 source 면 `YoutubePlayer` 의 플레이스홀더(🎬 + "영상 준비 중")를 그대로 활용.
 * 분기:
 *   - youtube → YoutubePlayer (iframe)
 *   - mp4    → `<video>` 태그 (R2 등 직접 호스팅)
 */
export const CesExerciseVideo: React.FC<Props> = ({
    source,
    title,
    autoPlay = true,
    loop = true,
    muted = true,
    objectFit = 'cover',
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const resolved = resolveVideoSrc(source);

    // mp4 source 변경 시 처음부터 재생
    useEffect(() => {
        if (resolved.kind === 'mp4' && videoRef.current && autoPlay) {
            videoRef.current.load();
            void videoRef.current.play();
        }
    }, [resolved.kind, resolved.src, autoPlay]);

    if (resolved.kind === 'empty') {
        return <YoutubePlayer youtubeId="" title={title} />;
    }

    if (resolved.kind === 'youtube') {
        return <YoutubePlayer youtubeId={resolved.src} title={title} />;
    }

    return (
        <video
            ref={videoRef}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            style={{ width: '100%', height: '100%', objectFit }}
        >
            <source src={resolved.src} type="video/mp4" />
        </video>
    );
};
