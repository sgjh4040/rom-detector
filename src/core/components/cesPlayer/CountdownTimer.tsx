// CountdownTimer.tsx — CesPlayer 큰 카운트다운 박스 (mm:ss + 3초 미만 경고)
import React from "react";
import type { BREAK_META } from "../../../lib/ces/CesPlayerTypes";
import { pad, COUNTDOWN_WARNING_SECONDS } from "./helpers";

type BreakMetaValue = (typeof BREAK_META)[keyof typeof BREAK_META];

interface CountdownTimerProps {
  /** 남은 초 (전체) — 컴포넌트 내부에서 mm/ss/warning 파생 */
  countdown: number;
  isBreak: boolean;
  breakMeta: BreakMetaValue | null;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  countdown,
  isBreak,
  breakMeta,
}) => {
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const isWarning = countdown <= COUNTDOWN_WARNING_SECONDS && countdown > 0;

  const bg = isBreak && breakMeta ? breakMeta.bgColor : "rgba(28,63,111,0.05)";
  const color = isWarning
    ? "#f87171"
    : isBreak && breakMeta
      ? breakMeta.color
      : "var(--ink-strong)";

  return (
    <div
      style={{
        textAlign: "center",
        padding: "1.5rem",
        background: bg,
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
          color,
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
  );
};
