// NeumoDashboard.tsx — Trends 대시보드 뷰 (CES 진행률) (redesign-spike).
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
import { Dumbbell } from "lucide-react";
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

  const hasNoCesActivity =
    phaseGoals.total === 0 ||
    (totalProgress === 0 && phaseStats.every((p) => p.percentage === 0));

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <SessionChipRow
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSelectSession={onSelectSession}
      />

      <h2 className="text-base font-bold tracking-tight text-[var(--color-foreground)]">
        CES 진행률
      </h2>

      {hasNoCesActivity ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
            <Dumbbell className="size-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--color-foreground)]">
              아직 CES 재활 기록이 없어요
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              억제 · 신장 · 활성 · 통합 4단계 루틴을 시작하면
              <br />
              진행률이 여기에 쌓여요
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (currentSession) saveRomSession(currentSession);
              navigate("/ces");
            }}
            className="mt-1 flex h-10 items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-bold text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90 transition-colors"
          >
            CES 재활 시작
          </button>
        </div>
      ) : (
        <PhaseProgressGrid
          totalProgress={totalProgress}
          phaseStats={phaseStats}
        />
      )}
    </div>
  );
};
