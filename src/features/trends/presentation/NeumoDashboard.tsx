// NeumoDashboard.tsx — Trends 페이지의 CES 진행률 대시보드 (audit #13).
// 회차 칩 / 게이지 + 4단계 바 / 빈 상태를 조합. 세부 시각화는 하위 컴포넌트로 위임.
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTotalCompletionPercentage,
  getPhasePercentage,
  getPhaseSeconds,
} from "../../session/data/cesTimeTracker";
import {
  computePhaseGoals,
  EMPTY_PHASE_GOALS,
} from "../../../lib/ces/cesGoalCalculator";
import type { CesStage } from "../../../lib/ces/cesTypes";
import { STAGE_COLORS } from "../../../lib/ces/CesPlayerTypes";
import type { RomSession } from "../../../lib/romTypes";
import { saveRomSession } from "../../../lib/romTypes";
import { EmptyState } from "../../../core/components/EmptyState";
import { SessionChipRow } from "./neumoDashboard/SessionChipRow";
import { PhaseProgressGrid } from "./neumoDashboard/PhaseProgressGrid";

interface NeumoDashboardProps {
  sessions: RomSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
}

interface PhaseDef {
  stage: CesStage;
  label: string;
  color: string;
}

// 단계별 색상 — SSOT 인 STAGE_COLORS 에서 가져옴 (Player/Dashboard 일관)
const PHASES: PhaseDef[] = [
  { stage: "inhibit", label: "억제", color: STAGE_COLORS.inhibit },
  { stage: "lengthen", label: "신장", color: STAGE_COLORS.lengthen },
  { stage: "activate", label: "활성", color: STAGE_COLORS.activate },
  { stage: "integrate", label: "통합", color: STAGE_COLORS.integrate },
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
      style={{ width: "100%", gap: "24px", padding: "10px 0" }}
    >
      <SessionChipRow
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSelectSession={onSelectSession}
      />

      <h2
        className="text-2xl font-black tracking-tighter opacity-95"
        style={{ marginBottom: "4px", marginTop: "8px", fontSize: "var(--text-xl)" }}
      >
        통계
      </h2>

      {hasNoCesActivity ? (
        <EmptyState
          size="md"
          icon={<span style={{ fontSize: "1em" }}>🏃</span>}
          title="아직 CES 재활 기록이 없어요"
          description={
            <>
              억제 · 신장 · 활성 · 통합 4단계로 구성된
              <br />
              재활 루틴을 시작하면 진행률이 여기에 쌓여요.
            </>
          }
          cta={{
            label: "CES 재활 시작하기",
            variant: "pill",
            onClick: () => {
              // 선택된 회차를 active session 으로 지정한 뒤 CES 재활 진입.
              // 이렇게 해야 updatePhaseDuration 이 현재 선택한 회차 key 에 누적된다.
              if (currentSession) {
                saveRomSession(currentSession);
              }
              navigate("/ces");
            },
          }}
        />
      ) : (
        <PhaseProgressGrid
          totalProgress={totalProgress}
          phaseStats={phaseStats}
        />
      )}
    </div>
  );
};
