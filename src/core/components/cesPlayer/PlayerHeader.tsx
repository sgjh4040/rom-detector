// PlayerHeader.tsx — CesPlayer B영역 상단의 헤더 (페이즈/브레이크 뱃지 + 운동 번호 + 제목)
// 두 분기: break 스텝(브레이크 라벨 + 다음 운동 안내) / exercise 스텝(페이즈 + 운동명).
import React from "react";
import { Coffee, ArrowRight } from "lucide-react";
import { PHASE_META, BREAK_META } from "../../../lib/ces/CesPlayerTypes";
import type { CesPlayerStep } from "../../../lib/ces/CesPlayerTypes";

interface PlayerHeaderProps {
  currentStep: CesPlayerStep;
  stepIndex: number;
  allSteps?: CesPlayerStep[];
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  currentStep,
  stepIndex,
  allSteps,
}) => {
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

  // ── break 분기 ─────────────────────────────────────────────
  if (currentStep.kind === "break") {
    const breakMeta = BREAK_META[currentStep.breakKind];
    const BreakIcon = currentStep.breakKind === "set-rest" ? Coffee : ArrowRight;
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

  // ── exercise 분기 ───────────────────────────────────────────
  const phase = PHASE_META[currentStep.cesPhase];
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
          {currentStep.currentSet &&
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
          {currentStep.exerciseName}
        </h2>
      </div>
    </>
  );
};
