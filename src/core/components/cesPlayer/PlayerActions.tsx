// PlayerActions.tsx — CesPlayer 하단 컨트롤 버튼 (redesign-spike).
import React from "react";
import { Play, Pause, RotateCcw, SkipForward, X } from "lucide-react";
import type { BREAK_META } from "../../../lib/ces/CesPlayerTypes";

type BreakMetaValue = (typeof BREAK_META)[keyof typeof BREAK_META];

interface PlayerActionsProps {
  isFinished: boolean;
  isBreak: boolean;
  breakMeta: BreakMetaValue | null;
  isPaused: boolean;
  onTogglePause: () => void;
  onExit: () => void;
  onRestart: () => void;
  onSkipBreak: () => void;
}

export const PlayerActions: React.FC<PlayerActionsProps> = ({
  isFinished,
  isBreak,
  breakMeta,
  isPaused,
  onTogglePause,
  onExit,
  onRestart,
  onSkipBreak,
}) => {
  const primaryClass =
    "flex h-12 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-bold text-white transition-colors";

  return (
    <div className="flex gap-2">
      {isFinished ? (
        <button
          type="button"
          onClick={onRestart}
          className={primaryClass + " bg-[var(--color-foreground)] hover:bg-[var(--color-foreground)]/85"}
        >
          <RotateCcw className="size-4" />
          다시 시작
        </button>
      ) : isBreak && breakMeta ? (
        <button
          type="button"
          onClick={onSkipBreak}
          className={primaryClass}
          style={{ background: breakMeta.color }}
        >
          <SkipForward className="size-4" />
          건너뛰기
        </button>
      ) : (
        <button
          type="button"
          onClick={onTogglePause}
          className={
            primaryClass +
            (isPaused
              ? " bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90"
              : " bg-[oklch(0.72_0.16_70)] hover:bg-[oklch(0.72_0.16_70)]/90")
          }
        >
          {isPaused ? (
            <>
              <Play className="size-4" />
              재생
            </>
          ) : (
            <>
              <Pause className="size-4" />
              일시정지
            </>
          )}
        </button>
      )}
      <button
        type="button"
        onClick={onExit}
        aria-label="운동 종료"
        title="운동 종료"
        className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
      >
        <X className="size-5" />
      </button>
    </div>
  );
};
