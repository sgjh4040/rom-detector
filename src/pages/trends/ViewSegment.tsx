// ViewSegment.tsx — 대시보드/상세 차트 뷰 모드 세그먼트 컨트롤 (redesign-spike).
import React from "react";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import { cn } from "../../lib/cn";

export type TrendsViewMode = "dashboard" | "charts";

interface ViewSegmentProps {
  value: TrendsViewMode;
  onChange: (value: TrendsViewMode) => void;
}

export const ViewSegment: React.FC<ViewSegmentProps> = ({ value, onChange }) => {
  const items: Array<{
    key: TrendsViewMode;
    label: string;
    icon: React.ReactNode;
  }> = [
    { key: "charts", label: "상세 차트", icon: <BarChart3 className="size-3.5" /> },
    { key: "dashboard", label: "대시보드", icon: <LayoutDashboard className="size-3.5" /> },
  ];
  return (
    <div
      role="tablist"
      className="inline-flex gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-1"
    >
      {items.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold transition-all",
              active
                ? "bg-[var(--color-card)] text-[var(--color-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
