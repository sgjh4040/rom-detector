// MovementTabs.tsx — CesInfo 동작 탭 셀렉터 (redesign-spike).
import React from "react";
import { cn } from "../../lib/cn";

interface MovementOption {
  id: string;
  name: string;
}

interface MovementTabsProps {
  movementIds: string[];
  movements: MovementOption[];
  activeMovement: string;
  onSelect: (id: string) => void;
}

export const MovementTabs: React.FC<MovementTabsProps> = ({
  movementIds,
  movements,
  activeMovement,
  onSelect,
}) => (
  <div className="flex gap-2 flex-wrap" role="tablist">
    {movementIds.map((mId) => {
      const mName = movements.find((m) => m.id === mId)?.name || mId;
      const isActive = activeMovement === mId;
      return (
        <button
          key={mId}
          role="tab"
          aria-selected={isActive}
          onClick={() => onSelect(mId)}
          className={cn(
            "rounded-lg border px-4 py-2 text-sm font-bold transition-colors",
            isActive
              ? "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-background)]"
              : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
          )}
        >
          {mName}
        </button>
      );
    })}
  </div>
);
