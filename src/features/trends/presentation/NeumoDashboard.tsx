import React from 'react';
import { NeumoCircularGauge } from '../../../core/components/NeumoCircularGauge';
import { NeumoProgressBar } from '../../../core/components/NeumoProgressBar';
import { getTotalCompletionPercentage, getPhasePercentage } from '../../session/data/cesTimeTracker';
import type { RomSession } from '../../../lib/romTypes';

interface NeumoDashboardProps {
    sessions: RomSession[];
    selectedSessionId: string | null;
    onSelectSession: (id: string) => void;
}

export const NeumoDashboard: React.FC<NeumoDashboardProps> = ({
    sessions,
    selectedSessionId,
    onSelectSession
}) => {
    const totalProgress = getTotalCompletionPercentage(selectedSessionId || undefined);
    const inhibitPercent = getPhasePercentage('inhibit', selectedSessionId || undefined);
    const lengthenPercent = getPhasePercentage('lengthen', selectedSessionId || undefined);
    const activatePercent = getPhasePercentage('activate', selectedSessionId || undefined);
    const integratePercent = getPhasePercentage('integrate', selectedSessionId || undefined);

    return (
        <div className="flex flex-col items-center" style={{ width: '100%', gap: '32px', padding: '10px 0' }}>
            {/* Session Selector */}
            <div className="w-full no-scrollbar" style={{ overflowX: 'auto', paddingBottom: '32px', paddingLeft: '16px', paddingRight: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', minWidth: 'max-content', padding: '16px 0' }}>
                    {sessions.map((s, i) => (
                        <button
                            key={s.createdAt}
                            className={`neumo-btn ${selectedSessionId === s.createdAt ? 'active' : ''}`}
                            onClick={() => onSelectSession(s.createdAt)}
                            style={{
                                color: selectedSessionId === s.createdAt ? 'var(--neumo-accent)' : 'var(--neumo-text)',
                                minWidth: '140px',
                                padding: '16px 24px',
                                fontSize: '1rem',
                                fontWeight: '800',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                margin: '0 8px'
                            }}
                        >
                            {sessions.length - i}회차 ({new Date(s.createdAt).toLocaleDateString().slice(5).replace(/\.$/, '')})
                        </button>
                    ))}
                    <button
                        className={`neumo-btn ${!selectedSessionId ? 'active' : ''}`}
                        onClick={() => onSelectSession('')}
                        style={{
                            color: !selectedSessionId ? 'var(--neumo-accent)' : 'var(--neumo-text)',
                            minWidth: '140px',
                            padding: '16px 24px',
                            fontSize: '1rem',
                            fontWeight: '800',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            margin: '0 8px'
                        }}
                    >
                        실시간
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-black tracking-tighter opacity-95" style={{ marginBottom: '8px', marginTop: '16px', fontSize: '1.5rem' }}>Statistics</h2>

            <div style={{ padding: '16px 0' }}>
                <NeumoCircularGauge percentage={totalProgress} />
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                width: '100%',
                maxWidth: '1200px',
                flexWrap: 'wrap', // Allow wrapping for mobile
                padding: '16px 8px',
                marginTop: '16px'
            }}>
                <NeumoProgressBar
                    label="Inhibit"
                    percentage={inhibitPercent}
                    gradient="var(--grad-relax)"
                />
                <NeumoProgressBar
                    label="Lengthen"
                    percentage={lengthenPercent}
                    gradient="var(--grad-cardio)"
                />
                <NeumoProgressBar
                    label="Activate"
                    percentage={activatePercent}
                    gradient="var(--grad-strength)"
                />
                <NeumoProgressBar
                    label="Integrate"
                    percentage={integratePercent}
                    gradient="var(--grad-stretch)"
                />
            </div>
        </div>
    );
};
