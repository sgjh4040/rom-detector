// FastInputControls.tsx — 빠른 입력 (25/50/75/목표치) + 사진 측정 (redesign-spike).
import React, { useState } from "react";
import { Camera, X } from "lucide-react";
import { ImageAngleMeasurer } from "../../../core/components/ImageAngleMeasurer";
import type { Movement } from "../../../lib/romData";
import { cn } from "../../../lib/cn";

interface FastInputControlsProps {
  activeMov: Movement | undefined;
  activeVal: number;
  handleFast: (pct: number) => void;
  handlePhoto: (angle: number) => void;
}

export const FastInputControls: React.FC<FastInputControlsProps> = ({
  activeMov,
  activeVal,
  handleFast,
  handlePhoto,
}) => {
  const [showPhoto, setShowPhoto] = useState(false);
  const maxVal = activeMov?.normalRange ?? 180;
  const isNormalSelected = activeVal === maxVal && activeVal > 0;

  const onPhotoConfirmed = (angle: number) => {
    handlePhoto(angle);
    setShowPhoto(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 빠른 입력 segmented control */}
      <div
        role="radiogroup"
        aria-label="빠른 각도 입력"
        className="grid grid-cols-4 gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-1"
      >
        {[25, 50, 75].map((pct) => {
          const target = Math.round((maxVal * pct) / 100);
          const selected = activeVal === target && activeVal > 0;
          return (
            <button
              key={pct}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => handleFast(pct)}
              className={cn(
                "rounded-md py-1.5 text-sm font-semibold transition-all",
                selected
                  ? "bg-[var(--color-card)] text-[var(--color-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
              )}
            >
              {pct}%
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => handleFast(100)}
          aria-checked={isNormalSelected}
          role="radio"
          className={cn(
            "rounded-md py-1.5 text-sm font-bold transition-all",
            isNormalSelected
              ? "bg-[oklch(0.55_0.15_150)] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
          )}
        >
          목표치
        </button>
      </div>

      {/* 사진 측정 */}
      <button
        type="button"
        onClick={() => setShowPhoto(!showPhoto)}
        className={cn(
          "flex h-10 items-center justify-center gap-1.5 rounded-lg border text-sm font-bold transition-colors",
          showPhoto
            ? "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-background)]"
            : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
        )}
      >
        {showPhoto ? <X className="size-4" /> : <Camera className="size-4" />}
        {showPhoto ? "사진 측정 닫기" : "사진으로 측정하기"}
      </button>
      {!showPhoto && (
        <p className="text-center text-xs font-medium text-[var(--color-muted-foreground)]">
          사진을 올리고 3점을 찍으면 각도가 자동 계산됩니다
        </p>
      )}

      {showPhoto && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-3">
          <ImageAngleMeasurer onAngleConfirmed={onPhotoConfirmed} />
        </div>
      )}
    </div>
  );
};
