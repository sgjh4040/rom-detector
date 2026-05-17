// DataManagementCard.tsx — Settings 페이지 데이터 관리 섹션 (redesign-spike).
import React from "react";
import { Download, Trash2, FileText } from "lucide-react";

interface DataManagementCardProps {
  patientCount: number;
  totalHistoryCount: number;
  isDeleting: boolean;
  onExport: () => void;
  onRequestDeleteAll: () => void;
}

export const DataManagementCard: React.FC<DataManagementCardProps> = ({
  patientCount,
  totalHistoryCount,
  isDeleting,
  onExport,
  onRequestDeleteAll,
}) => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
    <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-[var(--color-foreground)]">
      <FileText className="size-4 text-[var(--color-muted-foreground)]" />
      데이터 관리
    </h2>

    {/* 요약 stat 타일 */}
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-3">
        <div className="text-xs font-semibold text-[var(--color-muted-foreground)]">
          등록 환자
        </div>
        <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[var(--color-foreground)]">
          {patientCount}
          <span className="ml-0.5 text-sm font-mono text-[var(--color-muted-foreground)]">
            명
          </span>
        </div>
      </div>
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-3">
        <div className="text-xs font-semibold text-[var(--color-muted-foreground)]">
          측정 기록
        </div>
        <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[var(--color-foreground)]">
          {totalHistoryCount}
          <span className="ml-0.5 text-sm font-mono text-[var(--color-muted-foreground)]">
            건
          </span>
        </div>
      </div>
    </div>

    {/* 액션 버튼 */}
    <div className="mt-4 flex flex-col gap-2">
      <button
        type="button"
        onClick={onExport}
        className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
      >
        <Download className="size-4" />
        데이터 내보내기 (JSON)
      </button>
      <button
        type="button"
        onClick={onRequestDeleteAll}
        disabled={isDeleting}
        className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-destructive)]/30 bg-[var(--color-card)] text-sm font-bold text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10 transition-colors disabled:opacity-50"
      >
        <Trash2 className="size-4" />
        모든 환자 데이터 삭제
      </button>
    </div>

    <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
      환자 정보와 측정 기록은 이 기기에만 저장돼요.
      앱을 지우거나 브라우저 저장소를 비우면 복구할 수 없어요.
    </p>
  </div>
);
