// CesVideoPlayer.tsx — A 영역: 영상 플레이어 (PRD 4-0: 200줄 이하)
import React, { useRef, useEffect } from 'react';
import { Coffee, ArrowRight } from 'lucide-react';

import { VIDEO_BASE_URL } from '../../lib/cesConfig';
import { YoutubePlayer } from './YoutubePlayer';

/**
 * `videoUrl` 값 → 재생 소스 결정
 *  - YouTube ID (11자, `.` 없음, `youtu` 미포함) → YouTube iframe
 *  - mp4 파일명 (예: `36.kn_inh_flex1.mp4`) → `${VIDEO_BASE_URL}/${파일명}`
 *  - 절대 URL (`http://`, `https://`) → 그대로
 *  - 빈 문자열 → 플레이스홀더
 */
const resolveVideoSrc = (raw: string): { kind: 'youtube' | 'mp4' | 'empty'; src: string } => {
    if (!raw) return { kind: 'empty', src: '' };
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
        return raw.includes('youtu') ? { kind: 'youtube', src: raw } : { kind: 'mp4', src: raw };
    }
    if (raw.length === 11 && !raw.includes('.')) return { kind: 'youtube', src: raw };
    return { kind: 'mp4', src: `${VIDEO_BASE_URL}/${raw}` };
};

interface CesVideoPlayerProps {
    videoUrl: string;
    nextVideoUrl?: string;
    exerciseName: string;
    /** 브레이크 스텝일 때 비디오 대신 "잠시 쉬어요" 플레이스홀더 노출 */
    isBreak?: boolean;
    /** 브레이크 서브 타입 — 시각적 구분용 */
    breakKind?: 'set-rest' | 'transition';
    /** 브레이크 이후 수행할 운동명 (준비 플레이스홀더 문구용) */
    upcomingExerciseName?: string;
}

const PLACEHOLDER_COLORS: Record<number, string> = {
    0: '#1a1a2e', 1: '#16213e', 2: '#0f3460', 3: '#533483',
};

export const CesVideoPlayer: React.FC<CesVideoPlayerProps> = ({
    videoUrl,
    nextVideoUrl,
    exerciseName,
    isBreak = false,
    breakKind,
    upcomingExerciseName,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // 영상 URL 변경 시 처음부터 재생 — 브레이크일 땐 건드리지 않는다
    useEffect(() => {
        if (isBreak) return;
        if (videoRef.current && videoUrl) {
            videoRef.current.load();
            void videoRef.current.play();
        }
    }, [videoUrl, isBreak]);

    const bgIdx = Math.abs(exerciseName.charCodeAt(0)) % 4;
    const bgColor = isBreak
        ? (breakKind === 'transition' ? '#0e7490' : '#475569') // cyan-700 / slate-600
        : (PLACEHOLDER_COLORS[bgIdx] ?? '#1a1a2e');

    const resolved = isBreak ? { kind: 'empty' as const, src: '' } : resolveVideoSrc(videoUrl);
    const resolvedNext = !isBreak && nextVideoUrl ? resolveVideoSrc(nextVideoUrl) : null;

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                background: bgColor,
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                aspectRatio: '16/9',
                transition: 'background 0.4s ease',
            }}
        >
            {isBreak ? (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '1rem',
                        color: 'rgba(255,255,255,0.95)',
                    }}
                >
                    <div
                        style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: 'var(--radius-circle)',
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {breakKind === 'transition' ? (
                            <ArrowRight size={36} strokeWidth={2.2} />
                        ) : (
                            <Coffee size={36} strokeWidth={2.2} />
                        )}
                    </div>
                    <p style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: 0 }}>
                        {breakKind === 'transition' ? '다음 운동 준비' : '세트 간 휴식'}
                    </p>
                    {upcomingExerciseName && (
                        <p
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.75)',
                                margin: 0,
                                padding: '0 1rem',
                                textAlign: 'center',
                            }}
                        >
                            다음: {upcomingExerciseName}
                        </p>
                    )}
                </div>
            ) : resolved.kind === 'youtube' ? (
                <YoutubePlayer youtubeId={resolved.src} title={exerciseName} />
            ) : resolved.kind === 'mp4' ? (
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                    <source src={resolved.src} type="video/mp4" />
                </video>
            ) : (
                /* 영상 없을 때 플레이스홀더 */
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '1rem',
                    }}
                >
                    <div style={{ fontSize: '3.5rem' }}>🎬</div>
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontWeight: 700,
                            fontSize: 'var(--text-base)',
                            textAlign: 'center',
                            padding: '0 1rem',
                        }}
                    >
                        {exerciseName}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-xs)' }}>
                        영상 준비 중
                    </p>
                </div>
            )}

            {/* 다음 영상 pre-loading (숨김 video 태그) — mp4만 preload, YouTube은 iframe 이라 의미 없음 */}
            {resolvedNext?.kind === 'mp4' && (
                <video style={{ display: 'none' }} preload="auto" muted>
                    <source src={resolvedNext.src} type="video/mp4" />
                </video>
            )}
        </div>
    );
};
