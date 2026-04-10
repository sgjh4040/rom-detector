import React from 'react';

interface NeumoCircularGaugeProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}

/**
 * 단일 원형 진행률 게이지.
 * - 외곽 글래스 껍데기 없이 SVG 링만 사용한다.
 * - 중앙 숫자는 크게 표시하고 `%` 단위만 부기호로 작게 붙인다.
 * - 링 색상은 인디고→바이올렛 그라디언트로 한 톤을 유지한다.
 */
export const NeumoCircularGauge: React.FC<NeumoCircularGaugeProps> = ({
    percentage,
    size = 220,
    strokeWidth = 14,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: `${size}px`,
                aspectRatio: '1 / 1',
            }}
        >
            <svg
                viewBox={`0 0 ${size} ${size}`}
                width="100%"
                height="100%"
                style={{ transform: 'rotate(-90deg)', display: 'block' }}
            >
                {/* 배경 트랙 */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(92, 107, 192, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* 진행 링 */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#neumo-gauge-gradient)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                <defs>
                    <linearGradient id="neumo-gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>

            {/* 중앙 라벨 — 숫자만 크게, `%`는 작게 */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '2px',
                        color: '#5C6BC0',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                    }}
                >
                    <span style={{ fontSize: 'clamp(2.4rem, 9vw, 3.6rem)' }}>{percentage}</span>
                    <span style={{ fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', fontWeight: 800, opacity: 0.7 }}>%</span>
                </div>
            </div>
        </div>
    );
};
