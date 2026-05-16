import * as React from "react";
import { ChevronRight, Trash2 } from "lucide-react";
import type { Patient } from "../../lib/romTypes";
import { cn } from "../../lib/cn";

const fmtDate = (iso?: string): string => {
  if (!iso) return "측정 전";
  const d = new Date(iso);
  const now = new Date();
  const days = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

interface PatientCardProps {
  patient: Patient;
  selected?: boolean;
  managing?: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}

/**
 * 환자 카드 — 차분 톤 리비전 (2026-05-17).
 * 선택 표시는 단일 신호: 좌측 액센트 바 + 아주 미세한 BG. 보더 색 변화·링·배지 모두 제거.
 * 아바타는 항상 muted 회색 — 색 채우기 제거.
 */
export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  selected,
  managing,
  onSelect,
  onDelete,
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-left transition-colors",
      "hover:bg-[var(--color-muted)]/60",
      selected && "bg-[var(--color-muted)]/60",
    )}
  >
    {/* 선택 시 좌측에 굵은 오렌지 바 — Athletic 톤 */}
    {selected && (
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent)]"
      />
    )}
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium",
        "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
      )}
    >
      {patient.name.slice(0, 1) || "?"}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5">
        <span className="truncate text-sm font-bold text-[var(--color-foreground)]">
          {patient.name}
        </span>
        {patient.age != null && (
          <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
            {patient.age}
          </span>
        )}
      </div>
      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        <span>{fmtDate(patient.lastMeasuredAt)}</span>
        {patient.painArea && (
          <>
            <span className="text-[var(--color-border)]">·</span>
            <span className="truncate normal-case tracking-normal font-medium">
              {patient.painArea}
            </span>
          </>
        )}
      </div>
    </div>
    {managing && onDelete ? (
      <span
        role="button"
        tabIndex={0}
        aria-label="환자 삭제"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }
        }}
        className="flex size-8 items-center justify-center rounded-md text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10"
      >
        <Trash2 className="size-4" />
      </span>
    ) : (
      <ChevronRight
        className={cn(
          "size-4 transition-colors",
          selected
            ? "text-[var(--color-foreground)]"
            : "text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]",
        )}
      />
    )}
  </button>
);
