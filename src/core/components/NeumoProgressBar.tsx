import React from 'react';

interface NeumoProgressBarProps {
    label: string;
    percentage: number;
    /** 바 채움 색상(단색) — 각 phase마다 다른 색으로 구분 */
    color?: string;
    /** 서브 텍스트 (예: "3:00 / 5:00") — 있으면 라벨 옆에 작게 표시 */
    sublabel?: string;
}

/**
 * 가로 진행률 바 한 줄.
 * - 좌측: 작은 컬러 닷 + 라벨
 * - 중앙: 얇은(8px) 가로 바 (rounded full)
 * - 우측: 퍼센트 숫자 (중간 굵기)
 * 여러 개를 세로로 쌓아 리스트로 사용한다.
 */
export const NeumoProgressBar: React.FC<NeumoProgressBarProps> = ({
    label,
    percentage,
    color = '#6366f1',
    sublabel,
}) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span
                        aria-hidden="true"
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: color,
                            flexShrink: 0,
                        }}
                    />
                    <span
                        style={{
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {label}
                    </span>
                    {sublabel && (
                        <span
                            style={{
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                opacity: 0.7,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {sublabel}
                        </span>
                    )}
                </div>
                <span
                    style={{
                        fontSize: '0.95rem',
                        fontWeight: 900,
                        color: 'var(--text-primary)',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {percentage}%
                </span>
            </div>
            <div
                style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '999px',
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                />
            </div>
        </div>
    );
};
