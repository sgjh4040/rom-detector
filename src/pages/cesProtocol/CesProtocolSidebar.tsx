// CesProtocolSidebar.tsx — 데스크톱(lg+) 전용 좌측 사이드바.
// 인체 도해 + 타이머 + 4단계 탭 + CTA 묶음.
import React from "react";
import { BodyAnatomySvg } from "../../core/components/BodyAnatomySvg";
import { TimerCard } from "./TimerCard";
import type { CesStage } from "../../lib/ces/cesTypes";
import type { CesPhase } from "../../lib/ces/CesPlayerTypes";

interface CesProtocolSidebarProps {
  targetMuscles: string[];
  activeStage: CesStage;
  seconds: number;
  timerRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  stageTabsNode: React.ReactNode;
  ctaButtonsNode: React.ReactNode;
}

export const CesProtocolSidebar: React.FC<CesProtocolSidebarProps> = ({
  targetMuscles,
  activeStage,
  seconds,
  timerRunning,
  toggleTimer,
  resetTimer,
  stageTabsNode,
  ctaButtonsNode,
}) => (
  <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-[72px] lg:self-start lg:max-h-[calc(100vh-88px)] lg:overflow-y-auto lg:pr-1">
    <div className="flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-3 h-[300px]">
      <BodyAnatomySvg
        highlightIds={targetMuscles}
        cesPhase={
          (activeStage.charAt(0).toUpperCase() + activeStage.slice(1)) as CesPhase
        }
      />
    </div>

    <TimerCard
      seconds={seconds}
      timerRunning={timerRunning}
      toggleTimer={toggleTimer}
      resetTimer={resetTimer}
    />

    {stageTabsNode}
    {ctaButtonsNode}
  </aside>
);
