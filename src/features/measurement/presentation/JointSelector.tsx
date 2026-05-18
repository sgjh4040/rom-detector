// JointSelector.tsx — 관절 다중 선택 (redesign-spike).
// 보라 알약 버튼 → 가민 블루 액센트 체크 카드.
import React from "react";
import { Check } from "lucide-react";
import { JOINTS } from "../../../lib/romData";
import { cn } from "../../../lib/cn";

interface JointSelectorProps {
  selectedJointIds: string[];
  toggleJoint: (jointId: string) => void;
}

export const JointSelector: React.FC<JointSelectorProps> = ({
  selectedJointIds,
  toggleJoint,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-baseline justify-between">
      <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
        관절 선택
      </h3>
      <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
        복수 선택 · {selectedJointIds.length}개
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {JOINTS.map((joint) => {
        const selected = selectedJointIds.includes(joint.id);
        return (
          <button
            key={joint.id}
            type="button"
            onClick={() => toggleJoint(joint.id)}
            className={cn(
              "group flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all",
              selected
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-foreground)]"
                : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
            )}
          >
            <span>{joint.name}</span>
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded transition-colors",
                selected
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                  : "border border-[var(--color-border)] bg-transparent",
              )}
            >
              {selected && <Check className="size-3" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
