// ProtocolColumn.tsx — CesInfo 우측 inhibit/lengthen/activate 운동 리스트 (redesign-spike).
import React from "react";
import { Wrench, Timer, Repeat, Hash, PlayCircle } from "lucide-react";
import type { CesExercise, MovementProtocol } from "../../lib/ces/cesTypes";
import { STAGE_LABELS } from "./helpers";

const PROTOCOL_STAGES = ["inhibit", "lengthen", "activate"] as const;

interface ProtocolColumnProps {
  protocol: MovementProtocol;
  /** 영상 있는 운동의 재생 버튼 클릭 시 호출 (모달 오픈) */
  onPlayVideo: (ex: CesExercise) => void;
}

const MetaTag: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-foreground)]">
    {icon}
    {children}
  </span>
);

const ExerciseStageItem: React.FC<{
  ex: CesExercise;
  idx: number;
  onPlayVideo: (ex: CesExercise) => void;
}> = ({ ex, idx, onPlayVideo }) => (
  <div className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
    <div className="font-mono text-2xl font-bold text-[var(--color-muted-foreground)] opacity-50 leading-none">
      {idx + 1}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-base font-bold tracking-tight text-[var(--color-foreground)]">
        {ex.name}
      </h4>
      {ex.description && (
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {ex.description}
        </p>
      )}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {ex.tools && (
          <MetaTag icon={<Wrench className="size-3" />}>{ex.tools}</MetaTag>
        )}
        {ex.holdSeconds && (
          <MetaTag icon={<Timer className="size-3" />}>{ex.holdSeconds}초</MetaTag>
        )}
        {ex.sets && (
          <MetaTag icon={<Repeat className="size-3" />}>{ex.sets}세트</MetaTag>
        )}
        {ex.reps && (
          <MetaTag icon={<Hash className="size-3" />}>{ex.reps}회</MetaTag>
        )}
      </div>
    </div>
    {ex.youtubeId && (
      <button
        type="button"
        onClick={() => onPlayVideo(ex)}
        aria-label={`${ex.name} 영상 재생`}
        className="flex size-9 shrink-0 items-center justify-center self-center rounded-full text-[var(--color-destructive)] transition-all hover:scale-110 hover:bg-[var(--color-muted)]"
      >
        <PlayCircle className="size-6" />
      </button>
    )}
  </div>
);

export const ProtocolColumn: React.FC<ProtocolColumnProps> = ({ protocol, onPlayVideo }) => (
  <div className="lg:col-span-8 flex flex-col gap-5">
    {PROTOCOL_STAGES.map((stage) => {
      const meta = STAGE_LABELS[stage];
      return (
        <section
          key={stage}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-base font-bold tracking-tight" style={{ color: meta.color }}>
              <span className="flex size-5 items-center justify-center">{meta.icon}</span>
              {meta.label}
            </h3>
            <span className="text-xs font-bold text-[var(--color-muted-foreground)]">
              {meta.short} 단계
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {protocol[stage].map((ex, idx) => (
              <ExerciseStageItem key={ex.id} ex={ex} idx={idx} onPlayVideo={onPlayVideo} />
            ))}
          </div>
        </section>
      );
    })}
  </div>
);
