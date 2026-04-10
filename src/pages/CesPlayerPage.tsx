// CesPlayerPage.tsx — NTC 스타일 CES 플레이어 메인 페이지 (PRD 4-0: 200줄 이하)
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCesPlayer } from "../core/utils/useCesPlayer";
import { CesVideoPlayer } from "../core/components/CesVideoPlayer";
import { CesPlayerController } from "../core/components/CesPlayerController";
import { BodyAnatomySvg } from "../core/components/BodyAnatomySvg";
import { MOCK_ROUTINE, PHASE_META } from "../lib/ces/CesPlayerTypes";
import type { CesRoutine } from "../lib/ces/CesPlayerTypes";
import { PartyPopper, RotateCcw } from "lucide-react";
import { loadRomSession } from "../lib/romTypes";

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

  return (
    <div className="ces-player">
      {/* ── A 영역: 비디오 플레이어 ────────────────────────────── */}
      <div className="ces-player-video">
        <div style={{ width: "100%", maxWidth: "760px" }}>
          <div className="video-header">
            <div className="video-brand">
              <span>● medicalmotion</span>
            </div>
            <div className="step-dots">
              {customRoutine.exercises.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  className={`step-dot ${i === stepIndex ? "is-active" : ""}`}
                  style={{
                    width: i === stepIndex ? "24px" : "8px",
                    background:
                      i === stepIndex
                        ? PHASE_META[customRoutine.exercises[i].cesPhase].color
                        : i < stepIndex
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </div>

          <CesVideoPlayer
            videoUrl={currentStep.videoUrl}
            nextVideoUrl={nextStep?.videoUrl}
            exerciseName={currentStep.exerciseName}
          />

          <div className="progress-track">
            <div
              className="progress-bar"
              style={{
                background: PHASE_META[currentStep.cesPhase].color,
                width: `${stepProgress}%`,
              }}
            />
          </div>
          <div className="progress-meta">
            <p>현재 스텝 진행률</p>
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
          onTogglePause={togglePause}
          onExit={() => navigate("/ces")}
          onRestart={restart}
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
          highlightIds={currentStep.targetSvgIds}
          cesPhase={currentStep.cesPhase}
          showGroupButtons={false}
        />
      </div>
    </div>
  );
};
