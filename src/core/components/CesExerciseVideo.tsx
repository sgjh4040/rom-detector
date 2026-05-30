// CesExerciseVideo.tsx — CES 운동 영상 통합 플레이어 (YouTube ID / R2 mp4 모두 처리).
// [PRD 4-0] 200줄 이하. videoResolver 의 분기 결과를 받아 렌더만 담당.

import React, { useRef, useEffect, useState } from 'react';
import { PlayCircle } from 'lucide-react';

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
    /** true 면 mp4 를 자동 재생하지 않고 첫 프레임 + 큰 재생 버튼 오버레이를 표시.
     *  클릭하면 재생, 일시정지하면 오버레이가 다시 보인다. YouTube 분기는 이미 iframe
     *  자체가 클릭 재생이라 영향 없음. */
    clickToPlay?: boolean;
}

/**
 * 빈 source 면 `YoutubePlayer` 의 플레이스홀더(🎬 + "영상 준비 중")를 그대로 활용.
 * 분기:
 *   - youtube → YoutubePlayer (iframe)
 *   - mp4    → `<video>` 태그 (R2 등 직접 호스팅) + (옵션) 클릭 재생 오버레이
 */
export const CesExerciseVideo: React.FC<Props> = ({
    source,
    title,
    autoPlay = true,
    loop = true,
    muted = true,
    objectFit = 'cover',
    clickToPlay = false,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const resolved = resolveVideoSrc(source);
    const useOverlay = clickToPlay && resolved.kind === 'mp4';
    const [isPlaying, setIsPlaying] = useState(false);

    // mp4 source 변경 시 처음부터 (단, clickToPlay 면 자동 재생 안 함)
    // setIsPlaying 은 비디오 DOM API (load/play) 와 함께 호출되어 외부 상태와 동기화 목적임.
    useEffect(() => {
        if (resolved.kind !== 'mp4' || !videoRef.current) return;
        if (useOverlay) {
            videoRef.current.load(); // 새 source 로드만, play 호출 X
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsPlaying(false);
            return;
        }
        if (autoPlay) {
            videoRef.current.load();
            // 모바일 autoplay 차단 / 새 source load 로 인한 play 중단은 정상 동작.
            // Promise 를 catch 하지 않으면 unhandled rejection 으로 콘솔 오염.
            videoRef.current.play().catch(() => {});
        }
    }, [resolved.kind, resolved.src, autoPlay, useOverlay]);

    if (resolved.kind === 'empty') {
        return <YoutubePlayer youtubeId="" title={title} />;
    }

    if (resolved.kind === 'youtube') {
        return <YoutubePlayer youtubeId={resolved.src} title={title} />;
    }

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) v.play().catch(() => {});
        else v.pause();
    };

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                cursor: useOverlay ? 'pointer' : 'default',
            }}
            onClick={useOverlay ? togglePlay : undefined}
        >
            <video
                ref={videoRef}
                autoPlay={!useOverlay && autoPlay}
                loop={loop}
                muted={useOverlay ? false : muted}
                playsInline
                preload={useOverlay ? 'metadata' : 'auto'}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{ width: '100%', height: '100%', objectFit, display: 'block' }}
            >
                <source src={resolved.src} type="video/mp4" />
            </video>

            {useOverlay && !isPlaying && (
                <div
                    className="group"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.42)',
                        transition: 'background 0.2s',
                    }}
                    aria-hidden="true"
                >
                    <div
                        className="transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-[0_14px_36px_rgba(0,0,0,0.45)]"
                        style={{
                            width: '88px',
                            height: '88px',
                            borderRadius: '50%',
                            background: 'var(--color-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                        }}
                    >
                        <PlayCircle
                            size={56}
                            color="#fff"
                            strokeWidth={1.6}
                            fill="rgba(255,255,255,0.12)"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
