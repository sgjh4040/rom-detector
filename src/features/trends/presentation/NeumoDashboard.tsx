import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeumoCircularGauge } from '../../../core/components/NeumoCircularGauge';
import { NeumoProgressBar } from '../../../core/components/NeumoProgressBar';
import {
    getTotalCompletionPercentage,
    getPhasePercentage,
    getPhaseSeconds,
} from '../../session/data/cesTimeTracker';
import {
    computePhaseGoals,
    EMPTY_PHASE_GOALS,
} from '../../../lib/ces/cesGoalCalculator';
import type { CesStage } from '../../../lib/ces/cesTypes';
import { STAGE_COLORS } from '../../../lib/ces/CesPlayerTypes';
import type { RomSession } from '../../../lib/romTypes';
import { saveRomSession } from '../../../lib/romTypes';
import { EmptyState } from '../../../core/components/EmptyState';

interface NeumoDashboardProps {
    sessions: RomSession[];
    selectedSessionId: string | null;
    onSelectSession: (id: string) => void;
}

const formatMinSec = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

interface PhaseDef {
    stage: CesStage;
    label: string;
    color: string;
}

// 단계별 색상 — SSOT 인 STAGE_COLORS 에서 가져옴 (Player/Dashboard 일관)
const PHASES: PhaseDef[] = [
    { stage: 'inhibit', label: '억제', color: STAGE_COLORS.inhibit },
    { stage: 'lengthen', label: '신장', color: STAGE_COLORS.lengthen },
    { stage: 'activate', label: '활성', color: STAGE_COLORS.activate },
    { stage: 'integrate', label: '통합', color: STAGE_COLORS.integrate },
];

export const NeumoDashboard: React.FC<NeumoDashboardProps> = ({
    sessions,
    selectedSessionId,
    onSelectSession,
}) => {
    const navigate = useNavigate();
    const sessionKey = selectedSessionId || undefined;

    // 선택된 회차의 RomSession을 찾아서 CES 처방 기반 목표 시간을 계산한다.
    // 처방 자체가 없는 경우(= 전부 정상 측정) EMPTY_PHASE_GOALS 로 폴백된다.
    const currentSession = useMemo(
        () => sessions.find((s) => s.createdAt === selectedSessionId) ?? sessions[0],
        [sessions, selectedSessionId],
    );
    const phaseGoals = useMemo(
        () => (currentSession ? computePhaseGoals(currentSession) : EMPTY_PHASE_GOALS),
        [currentSession],
    );

    const totalProgress = getTotalCompletionPercentage(sessionKey, phaseGoals.total);
    const phaseStats = PHASES.map((p) => ({
        ...p,
        percentage: getPhasePercentage(p.stage, sessionKey, phaseGoals[p.stage]),
        seconds: getPhaseSeconds(p.stage, sessionKey),
        goalSeconds: phaseGoals[p.stage],
    }));

    // CES 재활 진행 기록이 없거나, 처방 자체가 비어 있는 경우 엠프티 카드 노출
    const hasNoCesActivity =
        phaseGoals.total === 0 ||
        (totalProgress === 0 && phaseStats.every((p) => p.percentage === 0));

    return (
        <div
            className="flex flex-col items-center"
            style={{ width: '100%', gap: '24px', padding: '10px 0' }}
        >
            {/* 회차 선택 칩 — 가로 스크롤 (회차 수 많아도 안전) */}
            <div
                className="w-full no-scrollbar session-chip-row"
                style={{
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        minWidth: 'max-content',
                        padding: '4px 0',
                    }}
                >
                    {sessions.map((s, i) => {
                        const isActive = selectedSessionId === s.createdAt;
                        return (
                            <button
                                key={s.createdAt}
                                type="button"
                                className="session-chip"
                                onClick={() => onSelectSession(s.createdAt)}
                                style={{
                                    padding: '8px 14px',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    borderRadius: 'var(--radius-pill)',
                                    border: isActive
                                        ? '1px solid var(--primary)'
                                        : '1px solid rgba(0, 0, 0, 0.08)',
                                    background: isActive
                                        ? 'var(--primary)'
                                        : 'rgba(255, 255, 255, 0.7)',
                                    color: isActive
                                        ? '#ffffff'
                                        : 'var(--text-secondary)',
                                    boxShadow: isActive
                                        ? '0 4px 12px rgba(92, 107, 192, 0.25)'
                                        : '0 1px 2px rgba(0, 0, 0, 0.03)',
                                    cursor: 'pointer',
                                    transition:
                                        'background 0.18s, color 0.18s, box-shadow 0.18s, border-color 0.18s',
                                    fontFamily: 'inherit',
                                }}
                            >
                                {sessions.length - i}회차 (
                                {new Date(s.createdAt)
                                    .toLocaleDateString()
                                    .slice(5)
                                    .replace(/\.$/, '')}
                                )
                            </button>
                        );
                    })}
                </div>
            </div>

            <h2
                className="text-2xl font-black tracking-tighter opacity-95"
                style={{ marginBottom: '4px', marginTop: '8px', fontSize: 'var(--text-xl)' }}
            >
                통계
            </h2>

            {hasNoCesActivity ? (
                <EmptyState
                    size="md"
                    icon={<span style={{ fontSize: '1em' }}>🏃</span>}
                    title="아직 CES 재활 기록이 없어요"
                    description={
                        <>
                            억제 · 신장 · 활성 · 통합 4단계로 구성된
                            <br />
                            재활 루틴을 시작하면 진행률이 여기에 쌓여요.
                        </>
                    }
                    cta={{
                        label: 'CES 재활 시작하기',
                        variant: 'pill',
                        onClick: () => {
                            // 선택된 회차를 active session 으로 지정한 뒤 CES 재활 진입.
                            // 이렇게 해야 updatePhaseDuration 이 현재 선택한 회차 key 에 누적된다.
                            // (그냥 navigate 만 하면 가장 최근 rom_session 으로 누적돼서
                            //  과거 회차를 고르고 재활을 시작해도 누적이 최신 회차로 흘러들어감)
                            if (currentSession) {
                                saveRomSession(currentSession);
                            }
                            navigate('/ces');
                        },
                    }}
                />
            ) : (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '40px',
                        width: '100%',
                        maxWidth: '820px',
                        padding: '8px 12px 24px',
                    }}
                >
                    {/* 좌측(모바일은 상단): 원형 게이지 */}
                    <div
                        style={{
                            flex: '0 1 240px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <NeumoCircularGauge percentage={totalProgress} />
                        <div style={{ textAlign: 'center' }}>
                            <p
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 800,
                                    color: 'var(--text-secondary)',
                                    opacity: 0.75,
                                    letterSpacing: '0.05em',
                                    margin: 0,
                                }}
                            >
                                전체 누적 달성률
                            </p>
                        </div>
                    </div>

                    {/* 우측(모바일은 하단): 4단계 세로 스택 가로 바 */}
                    <div
                        style={{
                            flex: '1 1 320px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '18px',
                            minWidth: '280px',
                        }}
                    >
                        {phaseStats.map((p) => (
                            <NeumoProgressBar
                                key={p.stage}
                                label={p.label}
                                percentage={p.percentage}
                                color={p.color}
                                sublabel={
                                    p.goalSeconds > 0
                                        ? `${formatMinSec(p.seconds)} / ${formatMinSec(p.goalSeconds)}`
                                        : '처방 없음'
                                }
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
