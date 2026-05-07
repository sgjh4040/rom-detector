// CesPlayerController.tsx — B 영역: 카운트다운·진행률·버튼 (PRD 4-0: 200줄 이하)
import React from "react";
import type { CesPlayerStep } from "../../lib/ces/CesPlayerTypes";
import { PHASE_META, BREAK_META } from "../../lib/ces/CesPlayerTypes";
import { Coffee, ArrowRight } from "lucide-react";
import type { CesStage } from "../../lib/ces/cesTypes";
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
  // totalSteps,
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

  // 운동 전용 카운트 (break 제외)
  const exerciseSteps = allSteps
    ? allSteps.filter((s) => s.kind === "exercise")
    : [];
  const totalExerciseCount = exerciseSteps.length;
  // 현재까지 완료 + 진행 중인 운동 번호
  const currentExerciseNum = allSteps
    ? allSteps.slice(0, stepIndex + 1).filter((s) => s.kind === "exercise").length
    : stepIndex + 1;
  // phase별 운동 수
  const phaseCounts = allSteps
    ? (["Inhibit", "Lengthen", "Activate", "Integrate"] as const).reduce(
        (acc, p) => {
          const count = allSteps.filter(
            (s) => s.kind === "exercise" && s.cesPhase === p,
          ).length;
          if (count > 0) acc.push({ phase: p, count });
          return acc;
        },
        [] as { phase: string; count: number }[],
      )
    : [];

  // ── 헤더: 현재 스텝 이름/페이즈 뱃지 ─────────────────────────
  const renderHeader = () => {
    if (isBreak && breakMeta && currentStep.kind === "break") {
      const BreakIcon =
        currentStep.breakKind === "set-rest" ? Coffee : ArrowRight;
      return (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.3rem 0.75rem",
                borderRadius: "var(--radius-pill)",
                background: breakMeta.color,
                color: "#fff",
                fontSize: "var(--text-xs)",
                fontWeight: 800,
                letterSpacing: "0.05em",
              }}
            >
              <BreakIcon size={13} />
              {breakMeta.label}
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-secondary)",
                fontWeight: 600,
              }}
            >
              {breakMeta.description(currentStep)}
            </span>
          </div>
          <div>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-secondary)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.25rem",
              }}
            >
              운동 {currentExerciseNum} / {totalExerciseCount}
            </p>
            <h2
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 900,
                color: breakMeta.color,
                lineHeight: 1.2,
              }}
            >
              {breakMeta.title}
            </h2>
          </div>
        </>
      );
    }
    // exercise 스텝 헤더
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              padding: "0.3rem 0.75rem",
              borderRadius: "var(--radius-pill)",
              background: phase.color,
              color: "#fff",
              fontSize: "var(--text-xs)",
              fontWeight: 800,
              letterSpacing: "0.05em",
            }}
          >
            {phase.label}
          </span>
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-secondary)",
              fontWeight: 600,
            }}
          >
            {phase.description}
          </span>
        </div>
        <div>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-secondary)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              marginBottom: "0.25rem",
            }}
          >
            운동 {currentExerciseNum} / {totalExerciseCount}
            {currentStep.kind === "exercise" &&
              currentStep.currentSet &&
              currentStep.totalSets &&
              currentStep.totalSets > 1 && (
                <>
                  {" · "}세트 {currentStep.currentSet} / {currentStep.totalSets}
                </>
              )}
            {phaseCounts.length > 0 && (
              <span style={{ marginLeft: "0.5rem", opacity: 0.7, fontSize: "var(--text-2xs)" }}>
                ({phaseCounts
                  .map((p) => {
                    const short = PHASE_META[p.phase as keyof typeof PHASE_META].label.split("(")[0].trim();
                    return `${short} ${p.count}`;
                  })
                  .join(" · ")})
              </span>
            )}
          </p>
          <h2
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 900,
              color: "var(--ink-strong)",
              lineHeight: 1.2,
            }}
          >
            {currentStep.kind === "exercise" ? currentStep.exerciseName : ""}
          </h2>
        </div>
      </>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {renderHeader()}

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
