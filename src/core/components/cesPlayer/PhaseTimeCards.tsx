// PhaseTimeCards.tsx — CesPlayer "누적 운동 시간" 4단계 카드 (redesign-spike).
import React from "react";
import type { CesStage } from "../../../lib/ces/cesTypes";
import { getPhaseSeconds } from "../../../features/session/data/cesTimeTracker";
import { PHASES, fmtMMSS } from "./helpers";
import { cn } from "../../../lib/cn";

interface PhaseTimeCardsProps {
  isPaused: boolean;
  isFinished: boolean;
  isBreak: boolean;
  activeStage: CesStage;
  sessionCreatedAt?: string;
}

export const PhaseTimeCards: React.FC<PhaseTimeCardsProps> = ({
  isPaused,
  isFinished,
  isBreak,
  activeStage,
  sessionCreatedAt,
}) => {
  const [, forceTick] = React.useState(0);
  React.useEffect(() => {
    if (isPaused || isFinished) return;
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [isPaused, isFinished]);

  const phaseSeconds = PHASES.map((p) => ({
    ...p,
    seconds: getPhaseSeconds(p.stage, sessionCreatedAt),
  }));
  const totalSeconds = phaseSeconds.reduce((sum, p) => sum + p.seconds, 0);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <div className="flex items-baseline justify-between mb-2.5">
        <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
          누적 운동 시간
        </span>
        <span className="font-mono text-lg font-extrabold tabular-nums text-[var(--color-foreground)]">
          {fmtMMSS(totalSeconds)}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {phaseSeconds.map((p) => {
          const isActive = !isBreak && p.stage === activeStage;
          return (
            <div
              key={p.stage}
              className={cn(
                "rounded-md border px-2 py-1.5 text-center transition-all",
                isActive
                  ? "border-[1.5px]"
                  : "border-transparent bg-[var(--color-muted)]/50",
              )}
              style={
                isActive
                  ? {
                      background: `${p.color}15`,
                      borderColor: p.color,
                    }
                  : undefined
              }
            >
              <p
                className="text-[10px] font-bold"
                style={{ color: p.color }}
              >
                {p.label}
              </p>
              <p className="font-mono text-sm font-extrabold tabular-nums text-[var(--color-foreground)]">
                {fmtMMSS(p.seconds)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
