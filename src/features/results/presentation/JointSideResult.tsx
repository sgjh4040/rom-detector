// JointSideResult.tsx — Results 페이지의 (관절 × 방향) 카드 (audit #13).
// 헤더 + N개 movement 행. 단일 movement 행은 MovementResultRow 로 분리됨.
import React from "react";
import { JOINTS, calculateSeverity } from "../../../lib/romData";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { RomSession, Side } from "../../../lib/romData";
import { MovementResultRow } from "./jointSideResult/MovementResultRow";

interface JointSideResultProps {
  session: RomSession;
  jointId: string;
  side: Side;
  firstSession?: RomSession;
  /** 카드 좌측 강조 보더 색상 — 지정 시 카드에 연한 tinted 배경이 깔림 */
  emphasisColor?: string;
}

export const JointSideResult: React.FC<JointSideResultProps> = ({
  session,
  jointId,
  side,
  firstSession,
  emphasisColor,
}) => {
  const joint = JOINTS.find((j) => j.id === jointId);
  if (!joint) return null;

  const sideMeasurements = session.measurements?.[jointId]?.[side] ?? {};
  const firstSideMeasurements =
    firstSession?.measurements?.[jointId]?.[side] ?? {};

  const results = joint.movements.map((m) => {
    const measured = sideMeasurements[m.id] ?? 0;
    const firstMeasured = firstSideMeasurements[m.id];
    const diff = firstMeasured !== undefined ? measured - firstMeasured : null;

    return {
      ...m,
      measured,
      severity: m.isQualitative
        ? measured === 1
          ? ("심각한제한" as const)
          : ("정상" as const)
        : calculateSeverity(measured, m.normalRange),
      diff,
    };
  });
  const hasLimitation = results.some((r) => r.severity !== "정상");

  // 강조 색상은 var(--danger) 또는 var(--warning) 가 들어옴 — 실제 픽스드 값으로 매핑
  // (CSS var + alpha 조합은 인라인 style 에서 동작하지 않아 직접 rgba 사용)
  const emphasisTint =
    emphasisColor === "var(--danger)"
      ? "rgba(239, 68, 68, 0.05)"
      : emphasisColor === "var(--warning)"
        ? "rgba(245, 158, 11, 0.06)"
        : undefined;

  return (
    <div
      className="panel"
      style={{
        marginBottom: "1rem",
        ...(emphasisTint
          ? {
              background: emphasisTint,
            }
          : {}),
      }}
    >
      <div className="panel-header">
        <h3>
          {joint.name}
          {joint.isSymmetric ? "" : ` — ${side}`}
        </h3>
        <span
          className={`badge icon-text icon-text--sm ${hasLimitation ? "badge-warning" : "badge-success"}`}
        >
          {hasLimitation ? (
            <>
              <AlertTriangle size={14} /> 제한 있음
            </>
          ) : (
            <>
              <CheckCircle size={14} /> 정상
            </>
          )}
        </span>
      </div>
      {results.map((res) => (
        <MovementResultRow key={res.id} res={res} />
      ))}
    </div>
  );
};
