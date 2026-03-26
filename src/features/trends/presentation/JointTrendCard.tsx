import React, { useState } from 'react';
import type { Joint, RomSession } from '../../../lib/romTypes';
import { TrendGraph } from './TrendGraph';

interface JointTrendCardProps {
    joint: Joint;
    history: RomSession[];
}

export const JointTrendCard: React.FC<JointTrendCardProps> = ({ joint, history }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter relevant data once and ensure chronological order (oldest to newest)
    const movementData = joint.movements.map(movement => {
        const formatDate = (timestamp: string) => {
            const date = new Date(timestamp);
            return `${date.getMonth() + 1}.${date.getDate()}.`;
        };

        const leftPoints = history
            .filter(s => s.measurements?.[joint.id]?.['좌측']?.[movement.id] !== undefined)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((s, idx) => ({
                label: `${idx + 1}회차 (${formatDate(s.createdAt)})`,
                value: s.measurements[joint.id]?.['좌측']?.[movement.id] || 0
            }));

        const rightPoints = history
            .filter(s => s.measurements?.[joint.id]?.['우측']?.[movement.id] !== undefined)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((s, idx) => ({
                label: `${idx + 1}회차 (${formatDate(s.createdAt)})`,
                value: s.measurements[joint.id]?.['우측']?.[movement.id] || 0
            }));

        return { movement, leftPoints, rightPoints };
    }).filter(m => m.leftPoints.length > 0 || m.rightPoints.length > 0);

    if (movementData.length === 0) return null;

    return (
        <div
            className="neumo-card mb-6 transition-all duration-300"
            style={{
                borderRadius: '20px',
                padding: '16px',
                overflow: 'visible',
                border: '1px solid rgba(255, 255, 255, 0.7)'
            }}
        >
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ marginBottom: isExpanded ? '20px' : '0', padding: '4px' }}
            >
                <h3 className="text-xl font-black opacity-95" style={{ letterSpacing: '-0.02em' }}>{joint.name} - 가동범위 추이</h3>
                <span className={`text-lg transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} style={{ opacity: 0.6 }}>▼</span>
            </div>

            {isExpanded && (
                <div className="mt-10 space-y-12 animate-fade-in">
                    {movementData.map(({ movement, leftPoints, rightPoints }) => (
                        <div key={movement.id}>
                            <h4 className="text-sm font-semibold text-secondary mb-4">
                                {movement.name} (정상: {movement.normalRange}°)
                            </h4>

                            {leftPoints.length > 0 && (
                                <div className="mb-6">
                                    <div className="text-xs mb-2 flex justify-between px-1">
                                        <span>좌측 추이</span>
                                        <span className="font-bold text-primary">{leftPoints[leftPoints.length - 1].value}°</span>
                                    </div>
                                    <TrendGraph data={leftPoints} normalRange={movement.normalRange} />
                                </div>
                            )}

                            {rightPoints.length > 0 && (
                                <div>
                                    <div className="text-xs mb-2 flex justify-between px-1">
                                        <span>우측 추이</span>
                                        <span className="font-bold text-secondary">{rightPoints[rightPoints.length - 1].value}°</span>
                                    </div>
                                    <TrendGraph data={rightPoints} normalRange={movement.normalRange} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
