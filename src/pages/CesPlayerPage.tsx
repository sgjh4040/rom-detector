// CesPlayerPage.tsx — NTC 스타일 CES 플레이어 메인 페이지 (PRD 4-0: 200줄 이하)
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCesPlayer } from "../core/utils/useCesPlayer";
import { CesVideoPlayer } from "../core/components/CesVideoPlayer";
import { CesPlayerController } from "../core/components/CesPlayerController";
import { BodyAnatomySvg } from "../core/components/BodyAnatomySvg";
import { MOCK_ROUTINE, PHASE_META } from "../lib/ces/CesPlayerTypes";
import type { CesRoutine, CesPlayerStep } from "../lib/ces/CesPlayerTypes";
import { PartyPopper, RotateCcw } from "lucide-react";
import { loadRomSession } from "../lib/romTypes";

/* ── 인스타 스토리 바 — 운동 진행률 표시 ─────────────────────── */
/** 운동 스텝만 세그먼트로 표시, phase 색상, 좌/우 탭으로 이동 */
const StoryProgressBar: React.FC<{
  exercises: CesPlayerStep[];
  currentStepIndex: number;
  stepProgress: number;
  onGoToStep: (i: number) => void;
}> = ({ exercises, currentStepIndex, stepProgress, onGoToStep }) => {
  // 운동 스텝만 추출 + 원래 인덱스 보존
  const exerciseEntries = exercises
    .map((step, i) => ({ step, originalIndex: i }))
    .filter((e) => e.step.kind === "exercise");

  // 현재 stepIndex → 운동 기준 인덱스 (break일 때 직전 운동)
  let activeOriginalIndex = currentStepIndex;
  if (exercises[currentStepIndex]?.kind === "break") {
    for (let i = currentStepIndex; i >= 0; i--) {
      if (exercises[i].kind === "exercise") {
        activeOriginalIndex = i;
        break;
      }
    }
  }
  const activeExerciseIdx = exerciseEntries.findIndex(
    (e) => e.originalIndex === activeOriginalIndex,
  );

  // 좌/우 탭 → 이전/다음 운동으로 이동
  const goToPrev = () => {
    const prev = exerciseEntries[activeExerciseIdx - 1];
    if (prev) onGoToStep(prev.originalIndex);
  };
  const goToNext = () => {
    const next = exerciseEntries[activeExerciseIdx + 1];
    if (next) onGoToStep(next.originalIndex);
  };

  return (
    <div className="story-bar-wrap">
      {/* 세그먼트 바 */}
      <div className="story-bar">
        {exerciseEntries.map((entry, i) => {
          const meta =
            PHASE_META[entry.step.cesPhase as keyof typeof PHASE_META];
          const isDone = i < activeExerciseIdx;
          const isActive = i === activeExerciseIdx;
          const isBreakActive = exercises[currentStepIndex]?.kind === "break";
          // 진행률: 완료 100%, 현재 운동은 stepProgress, 나머지 0%
          const fill = isDone
            ? 100
            : isActive
              ? isBreakActive
                ? 100
                : Math.max(2, stepProgress)
              : 0;
          return (
            <div key={entry.originalIndex} className="story-segment">
              <div
                className="story-segment-fill"
                style={{
                  width: `${fill}%`,
                  background: meta.color,
                  opacity: isDone ? 0.7 : 1,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* 좌/우 탭 영역 (투명 오버레이) */}
      <div className="story-tap-zones">
        <button
          className="story-tap-left"
          onClick={goToPrev}
          aria-label="이전 운동"
        />
        <button
          className="story-tap-right"
          onClick={goToNext}
          aria-label="다음 운동"
        />
      </div>
    </div>
  );
};

/** 브레이크 스텝을 건너뛰고 가장 가까운 exercise 스텝을 찾는다 — 근육 하이라이트 유지용 */
const findNearestExerciseStep = (
  steps: CesPlayerStep[],
  currentIndex: number,
): CesPlayerStep | null => {
  // 현재 이후 (다음 운동)
  for (let i = currentIndex; i < steps.length; i++) {
    if (steps[i].kind === "exercise") return steps[i];
  }
  // 없으면 이전 (마지막 운동)
  for (let i = currentIndex; i >= 0; i--) {
    if (steps[i].kind === "exercise") return steps[i];
  }
  return null;
};

export const CesPlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 넘어온 실제 루틴이 있으면 사용, 없으면 데모 루틴 표출
  const customRoutine =
    (location.state?.customRoutine as CesRoutine) || MOCK_ROUTINE;

  // 현재 환자 세션 — 운동 시간을 회차별로 누적 기록하기 위해 createdAt 사용
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
      <div className="ces-player-finish">
        <div className="icon flex justify-center text-primary mb-4">
          <PartyPopper size={64} />
        </div>
        <h1 className="text-3xl font-bold mb-2">운동 완료!</h1>
        <p>루틴을 모두 마쳤습니다.</p>
        <div className="action-bar justify-center mt-6 flex gap-4">
          <button
            onClick={restart}
            className="btn btn-primary flex items-center gap-2"
          >
            <RotateCcw size={18} /> 다시 시작
          </button>
          <button onClick={() => navigate("/ces")} className="btn btn-outline">
            CES 프로토콜로
          </button>
        </div>
      </div>
    );
  }

  const isBreak = currentStep.kind === "break";
  // 브레이크 중에도 해부 SVG 가 비지 않게 가장 가까운 운동의 타겟 근육을 유지
  const anchorExerciseStep = isBreak
    ? findNearestExerciseStep(customRoutine.exercises, stepIndex + 1)
    : currentStep;
  const highlightIds =
    anchorExerciseStep && anchorExerciseStep.kind === "exercise"
      ? anchorExerciseStep.targetSvgIds
      : [];
  const currentPhase = currentStep.cesPhase;

  return (
    <div className="ces-player">
      {/* ── A 영역: 비디오 플레이어 ────────────────────────────── */}
      <div className="ces-player-video">
        <div style={{ width: "100%", maxWidth: "760px" }}>
          <div className="video-header">
            <div className="video-brand">
              {/* <span>● medicalmotion</span> */}
            </div>
            <StoryProgressBar
              exercises={customRoutine.exercises}
              currentStepIndex={stepIndex}
              stepProgress={stepProgress}
              onGoToStep={goToStep}
            />
          </div>

          <CesVideoPlayer
            videoUrl={
              currentStep.kind === "exercise" ? currentStep.videoUrl : ""
            }
            nextVideoUrl={
              nextStep && nextStep.kind === "exercise"
                ? nextStep.videoUrl
                : undefined
            }
            exerciseName={
              currentStep.kind === "exercise"
                ? currentStep.exerciseName
                : "휴식"
            }
            isBreak={isBreak}
            breakKind={
              currentStep.kind === "break" ? currentStep.breakKind : undefined
            }
            upcomingExerciseName={
              currentStep.kind === "break" ? currentStep.toExercise : undefined
            }
          />

          <div className="progress-track">
            <div
              className="progress-bar"
              style={{
                background: PHASE_META[currentPhase].color,
                width: `${stepProgress}%`,
              }}
            />
          </div>
          <div className="progress-meta">
            <p>{isBreak ? "브레이크 진행률" : "현재 스텝 진행률"}</p>
            <span>{Math.round(stepProgress)}%</span>
          </div>
        </div>
      </div>

      {/* ── B 영역: 컨트롤러 ───────────────────────────────────── */}
      <div className="ces-player-ctrl">
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
      </div>

      {/* ── C 영역: 해부 SVG 맵 ───────────────────────────────── */}
      <div className="ces-player-anatomy">
        <p
          style={{
            fontSize: "0.65rem",
            color: "var(--text-secondary)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.5rem",
          }}
        >
          Target Muscles
        </p>
        <BodyAnatomySvg
          highlightIds={highlightIds}
          cesPhase={currentPhase}
          showGroupButtons={false}
        />
      </div>
    </div>
  );
};
