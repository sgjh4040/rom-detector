// CountdownTimer.tsx — CesPlayer 큰 카운트다운 박스 (redesign-spike).
import React from "react";
import type { BREAK_META } from "../../../lib/ces/CesPlayerTypes";
import { pad, COUNTDOWN_WARNING_SECONDS } from "./helpers";

type BreakMetaValue = (typeof BREAK_META)[keyof typeof BREAK_META];

interface CountdownTimerProps {
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

  const bg = isBreak && breakMeta ? breakMeta.bgColor : "var(--color-muted)";
  const color = isWarning
    ? "var(--color-destructive)"
    : isBreak && breakMeta
      ? breakMeta.color
      : "var(--color-foreground)";

  return (
    <div
      className="rounded-xl p-6 text-center transition-colors"
      style={{ background: bg }}
    >
      <p
        className="font-mono text-6xl font-extrabold leading-none tabular-nums tracking-tight transition-colors"
        style={{ color }}
      >
        {pad(mins)}:{pad(secs)}
      </p>
      {isWarning && (
        <p className="mt-2 text-sm font-bold text-[var(--color-destructive)]">
          {isBreak ? "곧 다음 스텝 시작!" : "곧 다음 운동으로 전환됩니다!"}
        </p>
      )}
    </div>
  );
};
