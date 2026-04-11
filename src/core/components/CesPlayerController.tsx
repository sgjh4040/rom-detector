// CesPlayerController.tsx — B 영역: 카운트다운·진행률·버튼 (PRD 4-0: 200줄 이하)
import React from "react";
import type { CesPlayerStep } from "../../lib/ces/CesPlayerTypes";
import { PHASE_META, BREAK_META } from "../../lib/ces/CesPlayerTypes";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Coffee,
  ArrowRight,
} from "lucide-react";
import { getPhaseSeconds } from "../../features/session/data/cesTimeTracker";
import type { CesStage } from "../../lib/ces/cesTypes";

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
  onTogglePause: () => void;
  onExit: () => void;
  onRestart: () => void;
  onSkipBreak: () => void;
}

const PHASES: { stage: CesStage; label: string; color: string }[] = [
  { stage: "inhibit", label: "Inhibit", color: "#EAB308" },
  { stage: "lengthen", label: "Lengthen", color: "#3B82F6" },
  { stage: "activate", label: "Activate", color: "#EF4444" },
  { stage: "integrate", label: "Integrate", color: "#22C55E" },
];

const fmtMMSS = (total: number): string => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

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
  sessionCreatedAt,
  onTogglePause,
  onExit,
  onRestart,
  onSkipBreak,
}) => {
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const isBreak = currentStep.kind === "break";
  const phase = PHASE_META[currentStep.cesPhase];
  const breakMeta = isBreak ? BREAK_META[currentStep.breakKind] : null;
  const isWarning = countdown <= 3 && countdown > 0;
  const activeStage = currentStep.cesPhase.toLowerCase() as CesStage;

  // 1초마다 리렌더 — localStorage에 쌓이는 누적 시간을 실시간으로 반영
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
                borderRadius: "999px",
                background: breakMeta.color,
                color: "#fff",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
              }}
            >
              <BreakIcon size={13} />
              {breakMeta.label}
            </span>
            <span
              style={{
                fontSize: "0.72rem",
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
            {currentStep.kind === "exercise" &&
              currentStep.currentSet &&
              currentStep.totalSets &&
              currentStep.totalSets > 1 && (
                <>
                  {" · "}세트 {currentStep.currentSet} / {currentStep.totalSets}
                </>
              )}
          </p>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 900,
              color: "#1C3F6F",
              lineHeight: 1.2,
            }}
          >
            {currentStep.kind === "exercise" ? currentStep.exerciseName : ""}
          </h2>
        </div>
      </>
    );
  };

  // 카운트다운 박스 배경 — 브레이크일 땐 breakMeta.bgColor
  const countdownBg = isBreak && breakMeta ? breakMeta.bgColor : "rgba(28,63,111,0.05)";
  const countdownColor = isWarning
    ? "#EF4444"
    : isBreak && breakMeta
      ? breakMeta.color
      : "#1C3F6F";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {renderHeader()}

      {/* 카운트다운 타이머 */}
      <div
        style={{
          textAlign: "center",
          padding: "1.5rem",
          background: countdownBg,
          borderRadius: "16px",
          transition: "background 0.3s",
        }}
      >
        <p
          style={{
            fontSize: "4.5rem",
            fontWeight: 900,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            color: countdownColor,
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
            {isBreak ? "곧 다음 스텝 시작!" : "곧 다음 운동으로 전환됩니다!"}
          </p>
        )}
      </div>

      {/* 누적 운동 시간 — 4단계별 + 합계 (브레이크 포함 안됨) */}
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          borderRadius: "14px",
          border: "1.5px solid #eef2f7",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "0.6rem",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            누적 운동 시간
          </span>
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 900,
              color: "#1C3F6F",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmtMMSS(totalSeconds)}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.5rem",
          }}
        >
          {phaseSeconds.map((p) => {
            const isActive = !isBreak && p.stage === activeStage;
            return (
              <div
                key={p.stage}
                style={{
                  padding: "0.5rem 0.4rem",
                  borderRadius: "8px",
                  background: isActive ? `${p.color}15` : "#f7f9fc",
                  border: isActive
                    ? `1.5px solid ${p.color}`
                    : "1.5px solid transparent",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                <p
                  style={{
                    fontSize: "0.55rem",
                    fontWeight: 800,
                    color: p.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "2px",
                  }}
                >
                  {p.label}
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 900,
                    color: "#1C3F6F",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {fmtMMSS(p.seconds)}
                </p>
              </div>
            );
          })}
        </div>
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

      {/* 다음 운동 예고 — exercise 스텝일 때만 */}
      {!isBreak && nextStep && nextStep.kind === "exercise" && (
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
          <span className="flex items-center" style={{ fontSize: "1rem" }}>
            <SkipForward size={18} />
          </span>
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
        ) : isBreak && breakMeta ? (
          <button
            onClick={onSkipBreak}
            style={{
              flex: 1,
              padding: "0.9rem",
              borderRadius: "10px",
              border: "none",
              background: breakMeta.color,
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <SkipForward size={16} /> 건너뛰기
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
            {isPaused ? (
              <>
                <Play size={16} /> 재개
              </>
            ) : (
              <>
                <Pause size={16} /> 일시정지
              </>
            )}
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
