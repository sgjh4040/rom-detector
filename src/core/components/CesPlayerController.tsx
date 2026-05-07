// CesPlayerController.tsx — B 영역 오케스트레이터 (PRD 4-0: 200줄 이하)
// 헤더/카운트다운/누적시간/진행률/다음예고/액션 sub-component 들을 조립.
import React from "react";
import type { CesPlayerStep } from "../../lib/ces/CesPlayerTypes";
import { PHASE_META, BREAK_META } from "../../lib/ces/CesPlayerTypes";
import type { CesStage } from "../../lib/ces/cesTypes";
import { PlayerHeader } from "./cesPlayer/PlayerHeader";
import { PlayerActions } from "./cesPlayer/PlayerActions";
import { NextStepPreview } from "./cesPlayer/NextStepPreview";
import { ProgressBar } from "./cesPlayer/ProgressBar";
import { CountdownTimer } from "./cesPlayer/CountdownTimer";
import { PhaseTimeCards } from "./cesPlayer/PhaseTimeCards";

interface CesPlayerControllerProps {
  currentStep: CesPlayerStep;
  nextStep: CesPlayerStep | null;
  countdown: number;
  progress: number;
  stepProgress: number;
  stepIndex: number;
  totalSteps: number;
  isPaused: boolean;
  isFinished: boolean;
  sessionCreatedAt?: string;
  allSteps?: CesPlayerStep[];
  onTogglePause: () => void;
  onExit: () => void;
  onRestart: () => void;
  onSkipBreak: () => void;
}

export const CesPlayerController: React.FC<CesPlayerControllerProps> = ({
  currentStep,
  nextStep,
  countdown,
  progress,
  stepIndex,
  isPaused,
  isFinished,
  sessionCreatedAt,
  allSteps,
  onTogglePause,
  onExit,
  onRestart,
  onSkipBreak,
}) => {
  const isBreak = currentStep.kind === "break";
  const phase = PHASE_META[currentStep.cesPhase];
  const breakMeta = isBreak ? BREAK_META[currentStep.breakKind] : null;
  const activeStage = currentStep.cesPhase.toLowerCase() as CesStage;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <PlayerHeader currentStep={currentStep} stepIndex={stepIndex} allSteps={allSteps} />

      <CountdownTimer countdown={countdown} isBreak={isBreak} breakMeta={breakMeta} />

      <PhaseTimeCards
        isPaused={isPaused}
        isFinished={isFinished}
        isBreak={isBreak}
        activeStage={activeStage}
        sessionCreatedAt={sessionCreatedAt}
      />

      <ProgressBar progress={progress} accentColor={phase.color} />

      {!isBreak && nextStep && nextStep.kind === "exercise" && (
        <NextStepPreview nextStep={nextStep} />
      )}

      <PlayerActions
        isFinished={isFinished}
        isBreak={isBreak}
        breakMeta={breakMeta}
        isPaused={isPaused}
        onTogglePause={onTogglePause}
        onExit={onExit}
        onRestart={onRestart}
        onSkipBreak={onSkipBreak}
      />
    </div>
  );
};
