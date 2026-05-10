// MovementResultRow.tsx — JointSideResult 의 단일 movement 행 (audit #13).
// 좌측: 이름 + SeverityBadge / 우측: 정성 평가 또는 정량 progress bar.
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { SEVERITY_COLORS } from "../../../../lib/severityMeta";
import { SeverityBadge } from "../../../../core/components/SeverityBadge";
import type { Severity } from "../../../../lib/romTypes";
import { AssessmentBar } from "./AssessmentBar";

interface MovementResult {
  id: string;
  name: string;
  measured: number;
  severity: Severity;
  normalRange: number;
  isQualitative?: boolean;
}

interface MovementResultRowProps {
  res: MovementResult;
}

const severityBgColor = (s: string) =>
  SEVERITY_COLORS[s as keyof typeof SEVERITY_COLORS] ?? "#9CA3AF";

export const MovementResultRow: React.FC<MovementResultRowProps> = ({
  res,
}) => {
  return (
    <div
      className="file-item"
      style={{
        cursor: "default",
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1.25rem",
        background: "var(--surface)",
        boxShadow: "var(--neumo-shadow-small)",
        borderRadius: "var(--radius-md)",
        marginBottom: "1rem",
        border: "1px solid rgba(255,255,255,0.5)",
      }}
    >
      {/* 좌측: 이름 및 뱃지 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flexShrink: 0,
          width: "130px",
        }}
      >
        <p
          className="file-name"
          style={{
            fontWeight: 800,
            fontSize: "var(--text-sm)",
            color: "var(--text-primary)",
            wordBreak: "keep-all",
          }}
        >
          {res.name}
        </p>
        <div>
          <SeverityBadge severity={res.severity} variant="fill" />
        </div>
      </div>

      {/* 우측: 리니어 프로그레스 바 (또는 정성 평가) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          paddingRight: "0.5rem",
        }}
      >
        {res.isQualitative ? (
          <div
            className="icon-text icon-text--sm"
            style={{
              fontSize: "var(--text-base)",
              fontWeight: 800,
              color: severityBgColor(res.severity),
            }}
          >
            {res.measured === 1 ? (
              <>
                <AlertTriangle size={16} /> 특이사항 (문제 발견됨)
              </>
            ) : (
              <>
                <CheckCircle size={16} /> 정상 범위
              </>
            )}
          </div>
        ) : (
          <AssessmentBar
            measured={res.measured}
            normalRange={res.normalRange}
            severity={res.severity}
          />
        )}
      </div>
    </div>
  );
};
