// ExerciseListItem.tsx — CesExercisePlayer 단일 운동 row (redesign-spike).
import React from "react";
import type { CesExercise } from "../../../lib/ces/cesTypes";
import { PlayCircle } from "lucide-react";
import { formatExMeta } from "./helpers";
import { resolveThumbnailSrc } from "../../../lib/ces/videoResolver";
import { cn } from "../../../lib/cn";

interface ExerciseListItemProps {
  exercise: CesExercise;
  isActive: boolean;
  categoryCode: string;
  onClick: () => void;
}

export const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exercise,
  isActive,
  categoryCode,
  onClick,
}) => {
  const thumbSrc = resolveThumbnailSrc(exercise.youtubeId);
  const hasThumb = thumbSrc.kind !== "none";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all",
        isActive
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
          : "border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-muted)]",
      )}
    >
      {/* 좌측: 썸네일 or 카테고리 닷 */}
      {hasThumb ? (
        <div className="relative h-10 w-[60px] shrink-0 overflow-hidden rounded-md">
          {thumbSrc.kind === "youtube-img" ? (
            <img
              src={thumbSrc.imgSrc}
              alt=""
              className={cn(
                "h-full w-full object-cover transition-opacity",
                isActive ? "opacity-100" : "opacity-75",
              )}
            />
          ) : (
            <video
              src={thumbSrc.videoSrc}
              preload="metadata"
              muted
              playsInline
              className={cn(
                "h-full w-full object-cover pointer-events-none transition-opacity",
                isActive ? "opacity-100" : "opacity-75",
              )}
            />
          )}
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PlayCircle className="size-4 text-white" />
            </div>
          )}
        </div>
      ) : (
        <span
          className={cn(
            "size-2.5 shrink-0 rounded-full ml-0.5 transition-colors",
            isActive
              ? "bg-[var(--color-accent)]"
              : "bg-[var(--color-border)]",
          )}
        />
      )}

      {/* 중앙: 카테고리 코드 + 운동명 + 도구 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "text-[11px] font-bold",
              isActive
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-muted-foreground)]",
            )}
          >
            {categoryCode}
          </span>
          <span
            className={cn(
              "truncate text-sm",
              isActive
                ? "font-bold text-[var(--color-foreground)]"
                : "font-semibold text-[var(--color-foreground)]/80",
            )}
          >
            {exercise.name}
          </span>
        </div>
        {exercise.tools && (
          <div className="text-xs font-medium text-[var(--color-muted-foreground)]">
            {exercise.tools}
          </div>
        )}
      </div>

      {/* 우측: 시간/세트 정보 */}
      <span
        className={cn(
          "shrink-0 whitespace-nowrap text-xs font-bold",
          isActive
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-muted-foreground)]",
        )}
      >
        {formatExMeta(exercise)}
      </span>
    </button>
  );
};
