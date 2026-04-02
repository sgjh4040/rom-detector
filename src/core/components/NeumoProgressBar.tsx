import React from 'react';

interface NeumoProgressBarProps {
    label: string;
    percentage: number;
    gradient?: string;
}

export const NeumoProgressBar: React.FC<NeumoProgressBarProps> = ({
    label,
    percentage,
    gradient = 'linear-gradient(135deg, #5C6BC0, #7986CB)'
}) => {
    return (
        <div className="flex flex-col items-center gap-4" style={{ flex: 1, minWidth: 0, margin: '0 4px' }}>
            <div
                className="relative flex flex-col justify-end overflow-hidden"
                style={{
                    width: '100%',
                    maxWidth: '85px',
                    height: 200,
                    padding: 8,
                    borderRadius: '24px',
                    background: 'rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(255,255,255,0.3)',
                }}
            >
                <div
                    className="w-full rounded-2xl"
                    style={{
                        height: `${percentage}%`,
                        background: gradient,
                        boxShadow: '0 -4px 16px rgba(92, 107, 192, 0.2)',
                        borderRadius: '16px',
                        transition: 'height 0.5s ease-out'
                    }}
                />
            </div>
            <div className="text-center">
                <p className="text-lg font-black opacity-75">{label}</p>
                <p className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{percentage}%</p>
            </div>
        </div>
    );
};
