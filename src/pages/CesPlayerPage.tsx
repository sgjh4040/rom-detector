// CesPlayerPage.tsx — NTC 스타일 CES 가이드 플레이어 (redesign-spike).
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PartyPopper, RotateCcw } from "lucide-react";
import { useCesPlayer } from "../core/utils/useCesPlayer";
import { CesVideoPlayer } from "../core/components/CesVideoPlayer";
import { CesPlayerController } from "../core/components/CesPlayerController";
import { BodyAnatomySvg } from "../core/components/BodyAnatomySvg";
import { MOCK_ROUTINE, PHASE_META } from "../lib/ces/CesPlayerTypes";
import type { CesRoutine } from "../lib/ces/CesPlayerTypes";
import { loadRomSession } from "../lib/romTypes";
import {
  StoryProgressBar,
  findNearestExerciseStep,
} from "./cesPlayerPage/StoryProgressBar";

export const CesPlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const customRoutine =
    (location.state?.customRoutine as CesRoutine) || MOCK_ROUTINE;
  const session = loadRomSession();

  const {
    currentStep,
    nextStep,
    countdown,
    isPaused,
    progress,
    stepProgress,
    stepIndex,
    totalSteps,
    isFinished,
    togglePause,
    goToStep,
    restart,
    skipBreak,
  } = useCesPlayer(customRoutine, session?.createdAt);

  if (isFinished) {
    return (
      <div
        data-redesign="true"
        className="min-h-svh flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)] font-sans p-6 text-center"
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] mb-4">
          <PartyPopper className="size-9" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">운동 완료!</h1>
        <p className="mt-2 text-sm font-medium text-[var(--color-muted-foreground)]">
          루틴을 모두 마쳤습니다.
        </p>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={restart}
            className="flex h-11 items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-5 text-sm font-bold text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90 transition-colors"
          >
            <RotateCcw className="size-4" />
            다시 시작
          </button>
          <button
            type="button"
            onClick={() => navigate("/ces")}
            className="flex h-11 items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-5 text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          >
            CES 프로토콜로
          </button>
        </div>
      </div>
    );
  }

  const isBreak = currentStep.kind === "break";
  const anchorExerciseStep = isBreak
    ? findNearestExerciseStep(customRoutine.exercises, stepIndex + 1)
    : currentStep;
  const highlightIds =
    anchorExerciseStep && anchorExerciseStep.kind === "exercise"
      ? anchorExerciseStep.targetSvgIds
      : [];
  const currentPhase = currentStep.cesPhase;

  return (
    <div
      data-redesign="true"
      className="min-h-svh bg-[var(--color-background)] text-[var(--color-foreground)] font-sans"
    >
      <div className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[1fr_360px_220px] lg:min-h-[640px] lg:items-stretch">
        {/* ── A 영역: 비디오 — 셋(progress + 비디오 + 진행률) 을 그룹으로 묶어 컬럼 가운데 정렬 ── */}
        <section className="flex flex-col gap-3 min-w-0 lg:justify-center">
          <StoryProgressBar
            exercises={customRoutine.exercises}
            currentStepIndex={stepIndex}
            stepProgress={stepProgress}
            onGoToStep={goToStep}
          />
          <CesVideoPlayer
            videoUrl={currentStep.kind === "exercise" ? currentStep.videoUrl : ""}
            nextVideoUrl={
              nextStep && nextStep.kind === "exercise"
                ? nextStep.videoUrl
                : undefined
            }
            exerciseName={
              currentStep.kind === "exercise" ? currentStep.exerciseName : "휴식"
            }
            isBreak={isBreak}
            breakKind={
              currentStep.kind === "break" ? currentStep.breakKind : undefined
            }
            upcomingExerciseName={
              currentStep.kind === "break" ? currentStep.toExercise : undefined
            }
          />
          {/* 현재 스텝 진행률 */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-[var(--color-muted-foreground)] mb-1">
              <span>{isBreak ? "브레이크 진행률" : "현재 스텝 진행률"}</span>
              <span className="font-bold tabular-nums text-[var(--color-foreground)]">
                {Math.round(stepProgress)}%
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  background: PHASE_META[currentPhase].color,
                  width: `${stepProgress}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* ── B 영역: 컨트롤러 — 컬럼 stretch + 콘텐츠 수직 가운데 ── */}
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 lg:flex lg:flex-col lg:justify-center">
          <CesPlayerController
            currentStep={currentStep}
            nextStep={nextStep}
            countdown={countdown}
            progress={progress}
            stepProgress={stepProgress}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            isPaused={isPaused}
            isFinished={isFinished}
            sessionCreatedAt={session?.createdAt}
            allSteps={customRoutine.exercises}
            onTogglePause={togglePause}
            onExit={() => navigate("/ces")}
            onRestart={restart}
            onSkipBreak={skipBreak}
          />
        </section>

        {/* ── C 영역: 해부 SVG — 컬럼 stretch 로 인체 그림 세로 길게 ── */}
        <section className="hidden lg:flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">
            Target Muscles
          </p>
          <div className="flex-1 flex items-center justify-center min-h-0">
            <BodyAnatomySvg
              highlightIds={highlightIds}
              cesPhase={currentPhase}
              showGroupButtons={false}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
