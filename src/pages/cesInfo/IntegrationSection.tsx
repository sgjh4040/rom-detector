// IntegrationSection.tsx — CesInfo 통합 운동 (Integration) 섹션 (redesign-spike).
import React from "react";
import { Activity, Repeat, Hash, PlayCircle } from "lucide-react";
import type { CesExercise } from "../../lib/ces/cesTypes";
import { STAGE_LABELS } from "./helpers";

interface IntegrationSectionProps {
  exercises: CesExercise[];
  /** 영상 있는 운동의 재생 버튼 클릭 시 호출 (모달 오픈) */
  onPlayVideo: (ex: CesExercise) => void;
}

export const IntegrationSection: React.FC<IntegrationSectionProps> = ({
  exercises,
  onPlayVideo,
}) => {
  const integrateColor = STAGE_LABELS.integrate.color;
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <h3
        className="flex items-center gap-2 text-base font-bold tracking-tight mb-5"
        style={{ color: integrateColor }}
      >
        <Activity className="size-4" />
        통합 운동 (Integration)
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {exercises.map((ex) => (
          <div
            key={ex.id}
            className="rounded-lg border p-4"
            style={{
              borderColor: `${integrateColor}33`,
              background: `${integrateColor}08`,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-bold text-[var(--color-foreground)]">
                {ex.name}
              </h4>
              {ex.youtubeId && (
                <button
                  type="button"
                  onClick={() => onPlayVideo(ex)}
                  aria-label={`${ex.name} 영상 재생`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--color-destructive)] transition-all hover:scale-110 hover:bg-[var(--color-muted)]"
                >
                  <PlayCircle className="size-5" />
                </button>
              )}
            </div>
            {ex.description && (
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {ex.description}
              </p>
            )}
            <div className="mt-2.5 flex gap-1.5">
              {ex.sets && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-foreground)]">
                  <Repeat className="size-3" />
                  {ex.sets}세트
                </span>
              )}
              {ex.reps && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-foreground)]">
                  <Hash className="size-3" />
                  {ex.reps}회
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
