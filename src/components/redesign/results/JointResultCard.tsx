// JointResultCard.tsx — 관절 × 방향 결과 카드 (redesign-spike).
import * as React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { MovementBar } from "./MovementBar";
import { JOINTS, calculateSeverity } from "../../../lib/romData";
import type { RomSession, Side } from "../../../lib/romData";
import { cn } from "../../../lib/cn";

interface JointResultCardProps {
  session: RomSession;
  jointId: string;
  side: Side;
  /** 최악 카드면 좌측 액센트 바 표시 */
  emphasis?: "danger" | "warning" | null;
}

export const JointResultCard: React.FC<JointResultCardProps> = ({
  session,
  jointId,
  side,
  emphasis,
}) => {
  const joint = JOINTS.find((j) => j.id === jointId);
  if (!joint) return null;

  const sideMeasurements = session.measurements?.[jointId]?.[side] ?? {};

  const results = joint.movements.map((m) => {
    const measured = sideMeasurements[m.id] ?? 0;
    return {
      ...m,
      measured,
      severity: m.isQualitative
        ? measured === 1
          ? ("심각한제한" as const)
          : ("정상" as const)
        : calculateSeverity(measured, m.normalRange),
    };
  });
  const hasLimitation = results.some((r) => r.severity !== "정상");

  const accentBar =
    emphasis === "danger"
      ? "bg-[var(--color-destructive)]"
      : emphasis === "warning"
        ? "bg-[oklch(0.72_0.16_70)]"
        : null;

  return (
    <Card className="overflow-hidden relative">
      {accentBar && (
        <span
          aria-hidden
          className={cn("absolute left-0 top-0 bottom-0 w-1", accentBar)}
        />
      )}
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
        <h3 className="text-base font-bold tracking-tight text-[var(--color-foreground)]">
          {joint.name}
          {!joint.isSymmetric && (
            <span className="ml-1.5 text-[var(--color-muted-foreground)]">
              · {side}
            </span>
          )}
        </h3>
        {hasLimitation ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-destructive)]/10 px-2 py-0.5 text-xs font-bold text-[var(--color-destructive)]">
            <AlertTriangle className="size-3" />
            제한 있음
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(0.65_0.15_150)]/10 px-2 py-0.5 text-xs font-bold text-[oklch(0.45_0.15_150)]">
            <CheckCircle className="size-3" />
            정상
          </span>
        )}
      </div>

      {/* Movement rows */}
      <div className="px-4">
        {results.map((res) => (
          <MovementBar
            key={res.id}
            name={res.name}
            measured={res.measured}
            normalRange={res.normalRange}
            severity={res.severity}
            isQualitative={res.isQualitative}
          />
        ))}
      </div>
    </Card>
  );
};
