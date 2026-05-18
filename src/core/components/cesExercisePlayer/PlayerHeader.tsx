// PlayerHeader.tsx — CesExercisePlayer 헤더 (redesign-spike).
import React from "react";
import type { CesExercise } from "../../../lib/ces/cesTypes";
import { Wrench } from "lucide-react";
import { STAGE_LABEL_MAP, formatExMeta } from "./helpers";

interface PlayerHeaderProps {
  current: CesExercise;
  stageId: string;
  activeIndex: number;
  total: number;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  current,
  stageId,
  activeIndex,
  total,
}) => {
  const stage =
    STAGE_LABEL_MAP[stageId] ?? { label: stageId, color: "var(--color-foreground)" };
  const meta = formatExMeta(current);

  return (
    <div className="mb-4">
      {/* 1행: 단계 뱃지 + 순번 */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold text-white"
          style={{ background: stage.color }}
        >
          {stage.label}
        </span>
        <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
          {activeIndex + 1} / {total}
        </span>
      </div>

      {/* 2행: 운동 이름 (크게) */}
      <h2 className="text-xl font-extrabold tracking-tight text-[var(--color-foreground)] leading-snug mb-1.5">
        {current.name}
      </h2>

      {/* 3행: 도구 + 시간/세트 메타 */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold mb-1.5">
        {current.tools && (
          <span className="inline-flex items-center gap-1 text-[var(--color-muted-foreground)]">
            <Wrench className="size-3.5" />
            {current.tools}
          </span>
        )}
        {current.tools && meta && (
          <span className="text-[var(--color-border)]">·</span>
        )}
        {meta && (
          <span className="text-[var(--color-accent)]">{meta}</span>
        )}
      </div>

      {/* 4행: 설명 */}
      {current.description && (
        <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {current.description}
        </p>
      )}
    </div>
  );
};
