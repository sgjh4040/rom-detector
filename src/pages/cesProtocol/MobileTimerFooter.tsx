// MobileTimerFooter.tsx — 모바일 화면 맨 아래에 sticky 로 따라오는 타이머.
// 옛 디자인에서 누적시간 + 시작/초기화 가 footer fixed 였던 동작을 복원.
import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { formatTime } from "../../core/utils/cesProtocolHelpers";
import { cn } from "../../lib/cn";

interface Props {
  seconds: number;
  timerRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
}

export const MobileTimerFooter: React.FC<Props> = ({
  seconds,
  timerRunning,
  toggleTimer,
  resetTimer,
}) => (
  <footer className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
    <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5">
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          누적
        </span>
        <span className="font-mono text-base font-bold tabular-nums text-[var(--color-foreground)]">
          {formatTime(seconds)}
        </span>
      </div>
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          onClick={toggleTimer}
          className={cn(
            "flex h-10 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-bold transition-colors",
            timerRunning
              ? "bg-[oklch(0.72_0.16_70)] text-white hover:bg-[oklch(0.72_0.16_70)]/90"
              : "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90",
          )}
        >
          {timerRunning ? (
            <>
              <Pause className="size-4" />
              일시정지
            </>
          ) : (
            <>
              <Play className="size-4" />
              시작
            </>
          )}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          aria-label="초기화"
          className="flex h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
    </div>
  </footer>
);
