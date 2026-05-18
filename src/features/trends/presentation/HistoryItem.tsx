// HistoryItem.tsx — 평가 히스토리 단일 행 (redesign-spike).
import React from "react";
import { ChevronRight } from "lucide-react";
import type { RomSession } from "../../../lib/romTypes";
import { saveRomSession } from "../../../lib/romTypes";
import { useNavigate } from "react-router-dom";

interface HistoryItemProps {
  session: RomSession;
  index: number;
  total: number;
}

const fmtDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const HistoryItem: React.FC<HistoryItemProps> = ({
  session,
  index,
  total,
}) => {
  const navigate = useNavigate();
  const openDetail = () => {
    saveRomSession(session);
    navigate("/results");
  };
  const round = total - index;

  return (
    <button
      type="button"
      onClick={openDetail}
      className="group flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-left hover:bg-[var(--color-muted)]/60 transition-colors"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted)] text-xs font-bold text-[var(--color-foreground)]">
        {round}회
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-[var(--color-foreground)]">
          {fmtDate(session.createdAt)}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-[var(--color-muted-foreground)]">
          <span>VAS {session.vasScore ?? 0}</span>
          <span className="text-[var(--color-border)]">·</span>
          <span className="truncate">{session.painArea || "부위 미입력"}</span>
        </div>
      </div>
      <ChevronRight className="size-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] transition-colors" />
    </button>
  );
};
