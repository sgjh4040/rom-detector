// JointSidebar.tsx — CesInfo 좌측 관절 사이드바 (redesign-spike).
import React from "react";
import { ChevronRight, X, Play } from "lucide-react";
import { JOINTS } from "../../lib/romData";
import { JOINT_ICONS, UPPER_BODY, LOWER_BODY } from "./helpers";
import { cn } from "../../lib/cn";

interface JointSidebarProps {
  selectedJointId: string;
  onSelect: (jointId: string) => void;
  onStartProtocol: () => void;
  onClose: () => void;
}

const JointButton: React.FC<{
  joint: { id: string; name: string };
  isActive: boolean;
  onSelect: () => void;
}> = ({ joint, isActive, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
      isActive
        ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
        : "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
    )}
  >
    <span
      className={cn(
        "flex size-5 items-center justify-center",
        isActive ? "text-[var(--color-background)]" : "text-[var(--color-muted-foreground)]",
      )}
    >
      {JOINT_ICONS[joint.id]}
    </span>
    {joint.name.split(" (")[0]}
  </button>
);

export const JointSidebar: React.FC<JointSidebarProps> = ({
  selectedJointId,
  onSelect,
  onStartProtocol,
  onClose,
}) => (
  <aside className="flex flex-col gap-4 p-4 lg:h-[calc(100svh-3.5rem)] lg:sticky lg:top-14 lg:overflow-y-auto">
    <div className="flex items-center justify-between">
      <h2 className="text-base font-bold tracking-tight text-[var(--color-foreground)]">
        CES 참고
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="flex size-8 items-center justify-center rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>

    <div>
      <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        상체
      </div>
      <div className="flex flex-col gap-0.5">
        {JOINTS.filter((j) => UPPER_BODY.includes(j.id)).map((j) => (
          <JointButton
            key={j.id}
            joint={j}
            isActive={selectedJointId === j.id}
            onSelect={() => onSelect(j.id)}
          />
        ))}
      </div>
    </div>

    <div>
      <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        하체
      </div>
      <div className="flex flex-col gap-0.5">
        {JOINTS.filter((j) => LOWER_BODY.includes(j.id)).map((j) => (
          <JointButton
            key={j.id}
            joint={j}
            isActive={selectedJointId === j.id}
            onSelect={() => onSelect(j.id)}
          />
        ))}
      </div>
    </div>

    <button
      type="button"
      onClick={onStartProtocol}
      className="mt-auto flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] text-sm font-bold text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90 transition-colors"
    >
      <Play className="size-4" />
      프로토콜 시작
      <ChevronRight className="size-4" />
    </button>
  </aside>
);
