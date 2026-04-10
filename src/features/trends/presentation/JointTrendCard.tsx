import React, { useState } from 'react';
import type { Joint, RomSession, Side } from '../../../lib/romTypes';
import { TrendGraph } from './TrendGraph';
import { SparklineCard } from './SparklineCard';

interface JointTrendCardProps {
    joint: Joint;
    history: RomSession[];
}

interface MovementSeries {
    key: string;
    movementId: string;
    movementName: string;
    side: Side;
    data: { label: string; value: number }[];
    normalRange: number;
}

const formatDate = (ts: string): string => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}.${d.getDate()}.`;
};

/**
 * 관절별 가동범위 추이 카드.
 * - 확장 시 동작×방향 조합마다 SparklineCard 그리드로 요약
 * - 그리드 카드 클릭 → 아래 인라인 영역에 해당 시리즈의 풀 TrendGraph 노출
 */
export const JointTrendCard: React.FC<JointTrendCardProps> = ({ joint, history }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    // 시계열은 오래된 순 (왼→오 시간 흐름)
    const chronological = [...history].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    // 모든 (동작, 방향) 조합 시리즈 구성
    const allSeries: MovementSeries[] = [];
    joint.movements.forEach((m) => {
        (['좌측', '우측'] as Side[]).forEach((side) => {
            const data = chronological
                .filter((s) => s.measurements?.[joint.id]?.[side]?.[m.id] !== undefined)
                .map((s, idx) => ({
                    label: `${idx + 1}회 (${formatDate(s.createdAt)})`,
                    value: s.measurements[joint.id]?.[side]?.[m.id] || 0,
                }));
            if (data.length > 0) {
                allSeries.push({
                    key: `${m.id}-${side}`,
                    movementId: m.id,
                    movementName: m.name,
                    side,
                    data,
                    normalRange: m.normalRange,
                });
            }
        });
    });

    if (allSeries.length === 0) return null;

    // 좌/우 양쪽 데이터 있으면 sublabel에 방향 표시
    const hasLeft = allSeries.some((s) => s.side === '좌측');
    const hasRight = allSeries.some((s) => s.side === '우측');
    const isBilateral = hasLeft && hasRight;

    const currentKey = selectedKey ?? allSeries[0].key;
    const currentSeries = allSeries.find((s) => s.key === currentKey) ?? allSeries[0];

    return (
        <div
            className="neumo-card mb-6"
            style={{
                borderRadius: '20px',
                padding: '16px',
                overflow: 'visible',
                border: '1px solid rgba(255, 255, 255, 0.7)',
            }}
        >
            {/* 헤더 (접기/펼치기 토글) */}
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ marginBottom: isExpanded ? '20px' : '0', padding: '4px' }}
            >
                <h3
                    className="text-xl font-black opacity-95"
                    style={{ letterSpacing: '-0.02em' }}
                >
                    {joint.name} 가동범위 추이
                </h3>
                <span
                    className={`text-lg transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    style={{ opacity: 0.6 }}
                >
                    ▼
                </span>
            </div>

            {isExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* 요약 sparkline 그리드 — 반응형 2열/3열은 Trends.css 에서 제어 */}
                    <div className="sparkline-grid">
                        {allSeries.map((s) => (
                            <SparklineCard
                                key={s.key}
                                label={s.movementName}
                                sublabel={isBilateral ? s.side : undefined}
                                data={s.data}
                                unit="°"
                                isActive={s.key === currentKey}
                                onClick={() => setSelectedKey(s.key)}
                            />
                        ))}
                    </div>

                    {/* 선택된 시리즈의 풀 차트 (인라인 확장) */}
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.55)',
                            borderRadius: '18px',
                            padding: '14px 4px 6px',
                            border: '1px solid rgba(0, 0, 0, 0.04)',
                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                padding: '6px 16px 10px',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {currentSeries.movementName}
                                {isBilateral ? ` · ${currentSeries.side}` : ''}
                            </span>
                            <span
                                style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    color: 'var(--text-secondary)',
                                    opacity: 0.7,
                                }}
                            >
                                정상 {currentSeries.normalRange}°
                            </span>
                        </div>
                        <TrendGraph
                            data={currentSeries.data}
                            normalRange={currentSeries.normalRange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
