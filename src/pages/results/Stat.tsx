// Stat.tsx — Results 3-Stat 그리드의 단일 stat 셀.
import React from "react";

interface StatProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  valueColor?: string;
}

export const Stat: React.FC<StatProps> = ({ label, value, sub, valueColor }) => (
  <div className="flex flex-col gap-1.5 p-4">
    <div className="text-xs font-semibold text-[var(--color-muted-foreground)]">
      {label}
    </div>
    <div className="flex items-baseline gap-1">
      <span
        className="font-mono text-4xl font-bold tabular-nums leading-none"
        style={{ color: valueColor ?? "var(--color-foreground)" }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-sm font-mono font-semibold text-[var(--color-muted-foreground)]">
          {sub}
        </span>
      )}
    </div>
  </div>
);
