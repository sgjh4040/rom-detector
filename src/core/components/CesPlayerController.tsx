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
import { PHASES, fmtMMSS, pad } from "./cesPlayer/helpers";

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
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const isBreak = currentStep.kind === "break";
  const phase = PHASE_META[currentStep.cesPhase];
  const breakMeta = isBreak ? BREAK_META[currentStep.breakKind] : null;
  const isWarning = countdown <= 3 && countdown > 0;
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

  // 카운트다운 박스 배경 — 브레이크일 땐 breakMeta.bgColor
  const countdownBg = isBreak && breakMeta ? breakMeta.bgColor : "rgba(28,63,111,0.05)";
  const countdownColor = isWarning
    ? "#f87171"
    : isBreak && breakMeta
      ? breakMeta.color
      : "var(--ink-strong)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {renderHeader()}

      {/* 카운트다운 타이머 */}
      <div
        style={{
          textAlign: "center",
          padding: "1.5rem",
          background: countdownBg,
          borderRadius: "var(--radius-md)",
          transition: "background 0.3s",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-display)",
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
              fontSize: "var(--text-sm)",
              color: "#f87171",
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
          borderRadius: "var(--radius-md)",
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
              fontSize: "var(--text-xs)",
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
              fontSize: "var(--text-lg)",
              fontWeight: 900,
              color: "var(--ink-strong)",
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
                  borderRadius: "var(--radius-xs)",
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
                    fontSize: "var(--text-2xs)",
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
                    fontSize: "var(--text-sm)",
                    fontWeight: 900,
                    color: "var(--ink-strong)",
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
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--text-secondary)",
            }}
          >
            전체 진행률
          </span>
          <span
            style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--ink-strong)" }}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div
          style={{
            height: "6px",
            borderRadius: "var(--radius-pill)",
            background: "#eef2f7",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${phase.color}, var(--ink-strong))`,
              borderRadius: "var(--radius-pill)",
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
            borderRadius: "var(--radius-xs)",
            background: "rgba(28,63,111,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span className="flex items-center" style={{ fontSize: "var(--text-base)" }}>
            <SkipForward size={18} />
          </span>
          <div>
            <p
              style={{
                fontSize: "var(--text-2xs)",
                color: "var(--text-secondary)",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              다음
            </p>
            <p
              style={{ fontSize: "var(--text-sm)", fontWeight: 800, color: "var(--ink-strong)" }}
            >
              {nextStep.exerciseName}
            </p>
          </div>
          <span
            style={{
              marginLeft: "auto",
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-xs)",
              background: PHASE_META[nextStep.cesPhase].color,
              color: "#fff",
              fontSize: "var(--text-2xs)",
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
              borderRadius: "var(--radius-xs)",
              border: "none",
              background: "var(--ink-strong)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "var(--text-sm)",
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
              borderRadius: "var(--radius-xs)",
              border: "none",
              background: breakMeta.color,
              color: "#fff",
              fontWeight: 800,
              fontSize: "var(--text-sm)",
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
              borderRadius: "var(--radius-xs)",
              border: "none",
              background: isPaused ? "#4ade80" : "var(--warning)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "var(--text-sm)",
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
            borderRadius: "var(--radius-xs)",
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            color: "#6b7280",
            fontWeight: 800,
            fontSize: "var(--text-sm)",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
