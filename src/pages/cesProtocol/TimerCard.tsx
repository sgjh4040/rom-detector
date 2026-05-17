// TimerCard.tsx — CesProtocol 사이드바 누적 시간 카드 (redesign-spike).
import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { getExMeta, formatTime } from "../../core/utils/cesProtocolHelpers";
import type { CesExercise } from "../../lib/ces/cesTypes";
import { cn } from "../../lib/cn";

interface TimerCardProps {
  seconds: number;
  timerRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  currentEx: CesExercise | undefined;
}

export const TimerCard: React.FC<TimerCardProps> = ({
  seconds,
  timerRunning,
  toggleTimer,
  resetTimer,
  currentEx,
}) => (
  <div className="flex flex-col gap-3">
    <div
      className={cn(
        "rounded-xl border bg-[var(--color-card)] p-4 transition-colors",
        timerRunning
          ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5"
          : "border-[var(--color-border)]",
      )}
    >
      <div className="text-xs font-semibold text-[var(--color-muted-foreground)]">
        누적 운동 시간
      </div>
      <div className="mt-1 font-mono text-3xl font-bold tabular-nums text-[var(--color-foreground)]">
        {formatTime(seconds)}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={toggleTimer}
          className={cn(
            "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md text-sm font-bold transition-colors",
            timerRunning
              ? "bg-[oklch(0.72_0.16_70)] text-white hover:bg-[oklch(0.72_0.16_70)]/90"
              : "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90",
          )}
        >
          {timerRunning ? (
            <>
              <Pause className="size-3.5" />
              일시정지
            </>
          ) : (
            <>
              <Play className="size-3.5" />
              시작
            </>
          )}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
        >
          <RotateCcw className="size-3.5" />
          초기화
        </button>
      </div>
    </div>

    {currentEx && getExMeta(currentEx) && (
      <div className="px-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          현재 운동
        </div>
        <div className="mt-0.5 text-sm font-bold text-[var(--color-accent)]">
          {getExMeta(currentEx)}
        </div>
      </div>
    )}
  </div>
);
