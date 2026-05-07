// PhaseTimeCards.tsx — CesPlayer 의 "누적 운동 시간" 카드 (4단계 + 합계)
// 1초마다 자체 리렌더로 localStorage 의 cesTimeTracker 값을 실시간 반영.
import React from "react";
import type { CesStage } from "../../../lib/ces/cesTypes";
import { getPhaseSeconds } from "../../../features/session/data/cesTimeTracker";
import { PHASES, fmtMMSS } from "./helpers";

interface PhaseTimeCardsProps {
  /** 일시정지 중이면 tick 중단 */
  isPaused: boolean;
  /** 종료 후엔 tick 중단 */
  isFinished: boolean;
  /** break 스텝일 땐 active 강조 끔 */
  isBreak: boolean;
  /** 현재 활성 phase ('inhibit' | 'lengthen' | 'activate' | 'integrate') */
  activeStage: CesStage;
  /** localStorage 키 분리에 쓰이는 세션 생성 시각 */
  sessionCreatedAt?: string;
}

export const PhaseTimeCards: React.FC<PhaseTimeCardsProps> = ({
  isPaused,
  isFinished,
  isBreak,
  activeStage,
  sessionCreatedAt,
}) => {
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

  return (
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
  );
};
