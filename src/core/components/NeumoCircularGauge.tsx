import React from 'react';

interface NeumoCircularGaugeProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}

export const NeumoCircularGauge: React.FC<NeumoCircularGaugeProps> = ({
    percentage,
    size = 200,
    strokeWidth = 18
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div
                className="flex items-center justify-center relative"
                style={{
                    width: '100%',
                    maxWidth: '220px',
                    minWidth: '120px',
                    aspectRatio: '1 / 1',
                    padding: '8%',
                    background: 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '50%',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                }}
            >
                <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(0,0,0,0.05)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="url(#glass-gradient)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                    <defs>
                        <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5C6BC0" />
                            <stop offset="100%" stopColor="#7986CB" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="font-bold" style={{ color: '#5C6BC0', fontSize: 'clamp(1.2rem, 5vw, 2rem)' }}>{percentage}%</span>
                </div>
            </div>
        </div>
    );
};
