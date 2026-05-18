// StageTabs.tsx — CesProtocol 4단계 세그먼트 탭 (redesign-spike).
import React from "react";
import type { CesStage } from "../../lib/ces/cesTypes";
import { STAGES } from "./helpers";
import { cn } from "../../lib/cn";

interface StageTabsProps {
  activeStage: CesStage;
  stageCounts: Record<CesStage, number>;
  onSelect: (stage: CesStage) => void;
}

export const StageTabs: React.FC<StageTabsProps> = ({
  activeStage,
  stageCounts,
  onSelect,
}) => (
  <div
    role="tablist"
    className="grid grid-cols-4 gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-1"
  >
    {STAGES.map((s) => {
      const isActive = activeStage === s.id;
      const count = stageCounts[s.id] ?? 0;
      return (
        <button
          key={s.id}
          role="tab"
          aria-selected={isActive}
          onClick={() => onSelect(s.id)}
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-md py-2 transition-all",
            isActive
              ? "bg-[var(--color-card)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              : "hover:bg-[var(--color-card)]/50",
          )}
        >
          <span
            className="text-xs font-bold"
            style={{
              color: isActive ? s.color : "var(--color-muted-foreground)",
            }}
          >
            {s.label}
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold tabular-nums",
              isActive
                ? "text-[var(--color-foreground)]"
                : "text-[var(--color-muted-foreground)]",
            )}
          >
            {count}개
          </span>
        </button>
      );
    })}
  </div>
);
