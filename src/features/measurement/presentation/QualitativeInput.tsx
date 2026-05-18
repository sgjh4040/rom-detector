// QualitativeInput.tsx — 정성 평가 (정상 / 발견) (redesign-spike).
import React from "react";
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "../../../lib/cn";

interface QualitativeInputProps {
  value: number; // 1 = 발견(있음), 0 = 정상(없음)
  onChange: (val: number) => void;
  label: string;
}

export const QualitativeInput: React.FC<QualitativeInputProps> = ({
  value,
  onChange,
  label,
}) => {
  const isNormal = value === 0;
  const isFound = value === 1;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center">
      <h2 className="text-lg font-extrabold tracking-tight text-[var(--color-foreground)]">
        {label}
      </h2>
      <p className="mt-1 text-xs font-medium text-[var(--color-muted-foreground)]">
        정성 평가 — 해당 항목이 관찰되는지
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange(0)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-5 transition-all",
            isNormal
              ? "border-[oklch(0.55_0.15_150)] bg-[oklch(0.55_0.15_150)]/8"
              : "border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-muted)]",
          )}
        >
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-full",
              isNormal
                ? "bg-[oklch(0.55_0.15_150)] text-white"
                : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
            )}
          >
            <Check className="size-5" strokeWidth={3} />
          </span>
          <span className="text-sm font-bold text-[var(--color-foreground)]">
            정상
          </span>
          <span className="text-[11px] text-[var(--color-muted-foreground)]">
            관찰되지 않음
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChange(1)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-5 transition-all",
            isFound
              ? "border-[var(--color-destructive)] bg-[var(--color-destructive)]/8"
              : "border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-muted)]",
          )}
        >
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-full",
              isFound
                ? "bg-[var(--color-destructive)] text-white"
                : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
            )}
          >
            <AlertTriangle className="size-5" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-bold text-[var(--color-foreground)]">
            발견
          </span>
          <span className="text-[11px] text-[var(--color-muted-foreground)]">
            특이사항 관찰됨
          </span>
        </button>
      </div>
    </div>
  );
};
