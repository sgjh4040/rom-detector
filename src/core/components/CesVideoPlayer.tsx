// CesVideoPlayer.tsx — A 영역: 영상 플레이어 (PRD 4-0: 200줄 이하)
// 영상 분기는 CesExerciseVideo 에 위임, 이 파일은 break UI / placeholder / pre-load 만 담당.

import React from 'react';
import { Coffee, ArrowRight } from 'lucide-react';

import { resolveVideoSrc } from '../../lib/ces/videoResolver';
import { CesExerciseVideo } from './CesExerciseVideo';

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

const BreakOverlay: React.FC<{ kind?: 'set-rest' | 'transition'; upcomingName?: string }> = ({
    kind,
    upcomingName,
}) => (
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
            {kind === 'transition' ? (
                <ArrowRight size={36} strokeWidth={2.2} />
            ) : (
                <Coffee size={36} strokeWidth={2.2} />
            )}
        </div>
        <p style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: 0 }}>
            {kind === 'transition' ? '다음 운동 준비' : '세트 간 휴식'}
        </p>
        {upcomingName && (
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
                다음: {upcomingName}
            </p>
        )}
    </div>
);

const EmptyPlaceholder: React.FC<{ exerciseName: string }> = ({ exerciseName }) => (
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
);

export const CesVideoPlayer: React.FC<CesVideoPlayerProps> = ({
    videoUrl,
    nextVideoUrl,
    exerciseName,
    isBreak = false,
    breakKind,
    upcomingExerciseName,
}) => {
    const bgIdx = Math.abs(exerciseName.charCodeAt(0)) % 4;
    const bgColor = isBreak
        ? (breakKind === 'transition' ? '#0e7490' : '#475569')
        : (PLACEHOLDER_COLORS[bgIdx] ?? '#1a1a2e');

    const hasVideo = !isBreak && !!videoUrl;
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
                <BreakOverlay kind={breakKind} upcomingName={upcomingExerciseName} />
            ) : hasVideo ? (
                <CesExerciseVideo source={videoUrl} title={exerciseName} />
            ) : (
                <EmptyPlaceholder exerciseName={exerciseName} />
            )}

            {/* 다음 영상 pre-loading — mp4 만 의미 있음 (YouTube iframe 은 자동 로드 안 됨) */}
            {resolvedNext?.kind === 'mp4' && (
                <video style={{ display: 'none' }} preload="auto" muted>
                    <source src={resolvedNext.src} type="video/mp4" />
                </video>
            )}
        </div>
    );
};
