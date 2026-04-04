// CesPlayerController.tsx — B 영역: 카운트다운·진행률·버튼 (PRD 4-0: 200줄 이하)
import React from "react";
import type { CesExerciseStep } from "../../lib/ces/CesPlayerTypes";
import { PHASE_META } from "../../lib/ces/CesPlayerTypes";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

interface CesPlayerControllerProps {
  currentStep: CesExerciseStep;
  nextStep: CesExerciseStep | null;
  countdown: number;
  progress: number;
  stepProgress: number;
  stepIndex: number;
  totalSteps: number;
  isPaused: boolean;
  isFinished: boolean;
  onTogglePause: () => void;
  onExit: () => void;
  onRestart: () => void;
}

const pad = (n: number): string => String(n).padStart(2, "0");

export const CesPlayerController: React.FC<CesPlayerControllerProps> = ({
  currentStep,
  nextStep,
  countdown,
  progress,
  stepIndex,
  totalSteps,
  isPaused,
  isFinished,
  onTogglePause,
  onExit,
  onRestart,
}) => {
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const phase = PHASE_META[currentStep.cesPhase];
  const isWarning = countdown <= 3 && countdown > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* 페이즈 뱃지 */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span
          style={{
            padding: "0.3rem 0.75rem",
            borderRadius: "999px",
            background: phase.color,
            color: "#fff",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.05em",
          }}
        >
          {phase.label}
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--text-secondary)",
            fontWeight: 600,
          }}
        >
          {phase.description}
        </span>
      </div>

      {/* 현재 운동명 */}
      <div>
        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--text-secondary)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.25rem",
          }}
        >
          Step {stepIndex + 1} / {totalSteps}
        </p>
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 900,
            color: "#1C3F6F",
            lineHeight: 1.2,
          }}
        >
          {currentStep.exerciseName}
        </h2>
      </div>

      {/* 카운트다운 타이머 */}
      <div
        style={{
          textAlign: "center",
          padding: "1.5rem",
          background: "rgba(28,63,111,0.05)",
          borderRadius: "16px",
        }}
      >
        <p
          style={{
            fontSize: "4.5rem",
            fontWeight: 900,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            color: isWarning ? "#EF4444" : "#1C3F6F",
            transition: "color 0.3s",
            letterSpacing: "-0.02em",
          }}
        >
          {pad(mins)}:{pad(secs)}
        </p>
        {isWarning && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "#EF4444",
              fontWeight: 800,
              marginTop: "0.5rem",
              animation: "pulse-slow 0.5s infinite",
            }}
          >
            곧 다음 운동으로 전환됩니다!
          </p>
        )}
      </div>

      {/* 전체 진행률 바 */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.4rem",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
            }}
          >
            전체 진행률
          </span>
          <span
            style={{ fontSize: "0.7rem", fontWeight: 800, color: "#1C3F6F" }}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div
          style={{
            height: "6px",
            borderRadius: "999px",
            background: "#eef2f7",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${phase.color}, #1C3F6F)`,
              borderRadius: "999px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* 다음 운동 예고 */}
      {nextStep && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            background: "rgba(28,63,111,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span className="flex items-center" style={{ fontSize: "1rem" }}><SkipForward size={18} /></span>
          <div>
            <p
              style={{
                fontSize: "0.65rem",
                color: "var(--text-secondary)",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              다음
            </p>
            <p
              style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1C3F6F" }}
            >
              {nextStep.exerciseName}
            </p>
          </div>
          <span
            style={{
              marginLeft: "auto",
              padding: "0.2rem 0.5rem",
              borderRadius: "6px",
              background: PHASE_META[nextStep.cesPhase].color,
              color: "#fff",
              fontSize: "0.65rem",
              fontWeight: 800,
            }}
          >
            {PHASE_META[nextStep.cesPhase].label.split(" ")[0]}
          </span>
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {isFinished ? (
          <button
            onClick={onRestart}
            style={{
              flex: 1,
              padding: "0.9rem",
              borderRadius: "10px",
              border: "none",
              background: "#1C3F6F",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={16} /> 다시 시작
          </button>
        ) : (
          <button
            onClick={onTogglePause}
            style={{
              flex: 1,
              padding: "0.9rem",
              borderRadius: "10px",
              border: "none",
              background: isPaused ? "#22C55E" : "#F59E0B",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {isPaused ? <><Play size={16} /> 재개</> : <><Pause size={16} /> 일시정지</>}
          </button>
        )}
        <button
          onClick={onExit}
          style={{
            padding: "0.9rem 1.25rem",
            borderRadius: "10px",
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            color: "#6b7280",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
