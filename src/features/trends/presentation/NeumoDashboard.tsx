import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const totalProgress = getTotalCompletionPercentage(selectedSessionId || undefined);
    const inhibitPercent = getPhasePercentage('inhibit', selectedSessionId || undefined);
    const lengthenPercent = getPhasePercentage('lengthen', selectedSessionId || undefined);
    const activatePercent = getPhasePercentage('activate', selectedSessionId || undefined);
    const integratePercent = getPhasePercentage('integrate', selectedSessionId || undefined);

    // CES 재활을 아직 한 번도 진행하지 않은 상태 — 0%만 잔뜩 보여주는 대신 안내 카드 노출
    const hasNoCesActivity =
        totalProgress === 0 &&
        inhibitPercent === 0 &&
        lengthenPercent === 0 &&
        activatePercent === 0 &&
        integratePercent === 0;

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
                </div>
            </div>

            <h2 className="text-2xl font-black tracking-tighter opacity-95" style={{ marginBottom: '8px', marginTop: '16px', fontSize: '1.5rem' }}>통계</h2>

            {hasNoCesActivity ? (
                <div
                    style={{
                        width: '100%',
                        maxWidth: '520px',
                        margin: '8px auto 24px',
                        padding: '36px 24px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '2.5rem',
                            lineHeight: 1,
                            opacity: 0.35,
                        }}
                        aria-hidden="true"
                    >
                        🏃
                    </div>
                    <p
                        className="text-lg font-black"
                        style={{ color: 'var(--text-primary)', margin: 0 }}
                    >
                        아직 CES 재활 기록이 없어요
                    </p>
                    <p
                        className="text-sm font-bold"
                        style={{ color: 'var(--text-secondary)', opacity: 0.7, margin: 0, lineHeight: 1.5 }}
                    >
                        억제 · 신장 · 활성 · 통합 4단계로 구성된<br />
                        재활 루틴을 시작하면 진행률이 여기에 쌓여요.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{
                            marginTop: '12px',
                            padding: '12px 28px',
                            borderRadius: '999px',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                        }}
                        onClick={() => navigate('/ces')}
                    >
                        CES 재활 시작하기
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '40px',
                    width: '100%',
                    maxWidth: '900px',
                    marginTop: '16px',
                    padding: '16px 8px'
                }}>
                    {/* 1. 좌측 (또는 상단): 원형 통계 게이지 */}
                    <div className="flex flex-col items-center justify-center" style={{
                        flex: '1 1 40%',
                        minWidth: '200px',
                        marginTop: '10px',
                        paddingBottom: '10px'
                    }}>
                        <NeumoCircularGauge percentage={totalProgress} />
                        <div style={{ marginTop: '24px', textAlign: 'center' }}>
                            <p className="text-xl font-black opacity-80" style={{ letterSpacing: '2px', color: 'var(--text-primary)' }}>전체</p>
                            <p className="text-sm font-bold opacity-50" style={{ color: 'var(--text-secondary)' }}>누적 달성률</p>
                        </div>
                    </div>

                    {/* 2. 우측 (또는 하단): 4개의 세부 막대 바 */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',       // 막대기 사이의 간격
                        flexWrap: 'nowrap', // 막대기 4개는 절대 줄바꿈 되지 않게 강제 결속
                        flex: '1 1 50%',   // 폭의 나머지 반(50%)을 차지하게 함
                        minWidth: '280px'   // 화면이 이보다 더 좁아지면 통째로 밑으로 내려감
                    }}>
                        <NeumoProgressBar label="억제" percentage={inhibitPercent} gradient="var(--grad-relax)" />
                        <NeumoProgressBar label="신장" percentage={lengthenPercent} gradient="var(--grad-cardio)" />
                        <NeumoProgressBar label="활성" percentage={activatePercent} gradient="var(--grad-strength)" />
                        <NeumoProgressBar label="통합" percentage={integratePercent} gradient="var(--grad-stretch)" />
                    </div>
                </div>
            )}
        </div>
    );
};
