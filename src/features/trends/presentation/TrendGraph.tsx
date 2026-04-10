import React, { useState } from 'react';
import '../../../styles/Trends.css';

interface DataPoint {
    label: string;
    value: number;
}

interface TrendGraphProps {
    data: DataPoint[];
    /** Y축 상한 기준 (차트 스케일 계산용) */
    normalRange?: number;
    /** 기준선을 그릴 값 — 지정하지 않으면 normalRange 위치에 그린다.
     *  VAS 처럼 "낮을수록 좋음" 지표는 targetValue={0}을 전달해서 기준선을 하단에 그린다. */
    targetValue?: number;
    unit?: string;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({
    data,
    normalRange = 180,
    targetValue,
    unit = '°',
}) => {
    const referenceValue = targetValue ?? normalRange;
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    if (data.length === 0) return (
        <div className="flex items-center justify-center p-8 opacity-40">데이터가 없습니다.</div>
    );

    const values = data.map(d => d.value);
    const maxVal = Math.max(...values, normalRange);
    const padding = 50;
    const width = 600;
    const height = 240;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const getX = (index: number) => {
        if (data.length <= 1) return padding + chartWidth / 2;
        return padding + (index / (data.length - 1)) * chartWidth;
    };

    const getY = (value: number) => {
        return height - padding - (value / maxVal) * chartHeight;
    };

    const pathData = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' L ');
    const firstPoint = `${getX(0)},${getY(data[0].value)}`;

    // Draw lines only if we have more than 1 point
    const points = data.length > 1 ? `M ${firstPoint} L ${pathData}` : '';

    return (
        <div className="relative w-full neumo-inset rounded-3xl" style={{ minHeight: height, padding: '40px', overflow: 'visible' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                {/* Grid Lines */}
                {[0, 0.5, 1].map(v => (
                    <line
                        key={v}
                        x1={padding}
                        y1={getY(maxVal * v)}
                        x2={width - padding}
                        y2={getY(maxVal * v)}
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity="0.05"
                    />
                ))}

                {/* Main Path */}
                {data.length > 1 && (
                    <path
                        d={points}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0px 4px 6px rgba(109, 93, 252, 0.2))' }}
                    />
                )}

                {/* 기준선 — targetValue (없으면 normalRange) 위치에 dashed line */}
                {referenceValue >= 0 && (
                    <line
                        x1={padding}
                        y1={getY(referenceValue)}
                        x2={width - padding}
                        y2={getY(referenceValue)}
                        stroke="var(--success)"
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        opacity="0.55"
                    />
                )}

                {/* Dots & Tooltips */}
                {data.map((d, i) => {
                    // Assuming data is passed in descending order (newest first), we reverse the mapping logic
                    // OR we can just slice().reverse() if we want strictly oldest to newest left to right.
                    // The user said "1st session starting from left, rightwards 2nd, 3rd".
                    // Let's modify the TrendGraph component to handle the sorting if needed, 
                    // or assume the caller provides it. But safest is to reverse here if '1회차' is at the end.

                    const x = getX(i);
                    const y = getY(d.value);
                    const isHovered = hoveredIdx === i;

                    return (
                        <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
                            {/* Connector line on hover */}
                            {isHovered && (
                                <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                            )}

                            {/* Interactive Bullet */}
                            <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? 8 : 6}
                                fill={isHovered ? 'var(--primary)' : '#ffffff'}
                                stroke="var(--primary)"
                                strokeWidth="3"
                                style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                            />

                            {/* Tooltip Overlay */}
                            {isHovered && (
                                <g>
                                    <rect x={x - 35} y={y - 50} width="70" height="35" rx="10" fill="#ffffff" style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))', border: '1px solid rgba(255,255,255,0.5)' }} />
                                    <text x={x} y={y - 28} textAnchor="middle" fontSize="13" fontWeight="bold" fill="var(--primary)">
                                        {d.value}{unit}
                                    </text>
                                </g>
                            )}

                            {/* X-Axis Label */}
                            <text
                                x={x}
                                y={height - 20}
                                textAnchor="middle"
                                fontSize="11"
                                fill="currentColor"
                                opacity={isHovered ? 1 : 0.6}
                                fontWeight={isHovered ? '800' : '600'}
                            >
                                {d.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
