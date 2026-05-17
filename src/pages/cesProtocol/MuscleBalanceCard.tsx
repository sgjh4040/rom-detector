// MuscleBalanceCard.tsx — CesProtocol 메인 하단 근육 밸런스 카드 (redesign-spike).
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface MuscleBalanceCardProps {
  overactiveMuscles: string[];
  underactiveMuscles: string[];
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

export const MuscleBalanceCard: React.FC<MuscleBalanceCardProps> = ({
  overactiveMuscles,
  underactiveMuscles,
}) => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
    <h3 className="text-base font-bold tracking-tight text-[var(--color-foreground)]">
      근육 밸런스
      <span className="ml-1.5 text-xs font-medium text-[var(--color-muted-foreground)]">
        Muscle Balance
      </span>
    </h3>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-destructive)]">
          <AlertTriangle className="size-3.5" />
          과활성 (뭉친 근육)
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {overactiveMuscles.length === 0 ? (
            <span className="text-xs text-[var(--color-muted-foreground)]">
              없음
            </span>
          ) : (
            overactiveMuscles.map((m) => (
              <Chip key={m} label={m} color="var(--color-destructive)" />
            ))
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[oklch(0.45_0.15_150)]">
          <CheckCircle className="size-3.5" />
          저활성 (약한 근육)
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {underactiveMuscles.length === 0 ? (
            <span className="text-xs text-[var(--color-muted-foreground)]">
              없음
            </span>
          ) : (
            underactiveMuscles.map((m) => (
              <Chip key={m} label={m} color="oklch(0.45 0.15 150)" />
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);
