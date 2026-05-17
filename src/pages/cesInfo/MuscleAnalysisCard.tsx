// MuscleAnalysisCard.tsx — CesInfo 근육 분석 카드 (redesign-spike).
import React from "react";
import { Brain } from "lucide-react";

interface MuscleAnalysisCardProps {
  overactive: string[];
  underactive: string[];
}

const Chip: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span
    className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold"
    style={{
      background: `${color}1f`,
      color,
      border: `1px solid ${color}33`,
    }}
  >
    {label}
  </span>
);

export const MuscleAnalysisCard: React.FC<MuscleAnalysisCardProps> = ({
  overactive,
  underactive,
}) => (
  <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 h-full">
    <h3 className="flex items-center gap-2 text-base font-bold tracking-tight text-[var(--color-foreground)] mb-4">
      <Brain className="size-4 text-[var(--color-muted-foreground)]" />
      근육 분석
    </h3>
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-destructive)] mb-2">
          <span className="size-2 rounded-full bg-[var(--color-destructive)]" />
          과활성 (짧아짐)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {overactive.length === 0 ? (
            <span className="text-xs text-[var(--color-muted-foreground)]">없음</span>
          ) : (
            overactive.map((m) => (
              <Chip key={m} label={m} color="var(--color-destructive)" />
            ))
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[oklch(0.45_0.15_150)] mb-2">
          <span className="size-2 rounded-full bg-[oklch(0.55_0.15_150)]" />
          저활성 (약해짐)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {underactive.length === 0 ? (
            <span className="text-xs text-[var(--color-muted-foreground)]">없음</span>
          ) : (
            underactive.map((m) => (
              <Chip key={m} label={m} color="oklch(0.45 0.15 150)" />
            ))
          )}
        </div>
      </div>
    </div>
  </section>
);
