import React, { useState } from 'react';

interface Props {
    /** YouTube 영상 ID (youtu.be 또는 youtube.com/watch?v= 뒤의 값) */
    youtubeId: string;
    title?: string;
}

/** 유튜브 플레이어 — youtubeId가 비어있으면 간결한 플레이스홀더 표시 */
export const YoutubePlayer: React.FC<Props> = ({ youtubeId, title }) => {
    const [loaded, setLoaded] = useState(false);

    if (!youtubeId) {
        return (
            <div style={{
                width: '100%',
                aspectRatio: '21/9',
                background: 'linear-gradient(135deg, #f0f2f8 0%, #e8eaf0 100%)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                gap: '0.4rem',
                border: '1px solid rgba(0,0,0,0.04)',
            }}>
                <span style={{ fontSize: '1.5rem', opacity: 0.4 }}>🎬</span>
                <p style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    opacity: 0.5,
                    margin: 0,
                }}>
                    {title || '영상 준비 중'}
                </p>
                <p style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    opacity: 0.35,
                    margin: 0,
                }}>
                    아래 설명을 참고하세요
                </p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', position: 'relative', backgroundColor: '#000' }}>
            {!loaded && (
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'var(--bg-color)',
                }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>로딩 중...</span>
                </div>
            )}
            <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                title={title ?? '운동 영상'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setLoaded(true)}
                style={{ width: '100%', height: '100%', border: 'none' }}
            />
        </div>
    );
};
