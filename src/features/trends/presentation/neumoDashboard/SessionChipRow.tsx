// SessionChipRow.tsx — 회차 선택 가로 스크롤 칩 행 (redesign-spike).
import React from "react";
import type { RomSession } from "../../../../lib/romTypes";
import { cn } from "../../../../lib/cn";

interface SessionChipRowProps {
  sessions: RomSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
}

export const SessionChipRow: React.FC<SessionChipRowProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
}) => (
  <div className="w-full overflow-x-auto no-scrollbar px-2 pb-1">
    <div className="flex gap-2 min-w-max">
      {sessions.map((s, i) => {
        const isActive = selectedSessionId === s.createdAt;
        const dateLabel = new Date(s.createdAt)
          .toLocaleDateString()
          .slice(5)
          .replace(/\.$/, "");
        return (
          <button
            key={s.createdAt}
            type="button"
            onClick={() => onSelectSession(s.createdAt)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-bold transition-colors",
              isActive
                ? "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-background)]"
                : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
            )}
          >
            {sessions.length - i}회차 ({dateLabel})
          </button>
        );
      })}
    </div>
  </div>
);
