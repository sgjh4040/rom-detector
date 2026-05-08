// MuscleBalanceCard.tsx — CesProtocol 메인 패널 하단의 과활성/저활성 근육 밸런스 카드.
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface MuscleBalanceCardProps {
  /** 과활성(Overactive) 근육 목록 — 빨간 칩 */
  overactiveMuscles: string[];
  /** 저활성(Underactive) 근육 목록 — 녹색 칩 */
  underactiveMuscles: string[];
}

export const MuscleBalanceCard: React.FC<MuscleBalanceCardProps> = ({
  overactiveMuscles,
  underactiveMuscles,
}) => {
  return (
    <div className="muscle-balance-box">
      <h3
        className="main-title"
        style={{ fontSize: "var(--text-lg)", marginBottom: "1.5rem" }}
      >
        근육 밸런스 (Muscle Balance)
      </h3>
      <div className="balance-grid">
        <div className="balance-card">
          <p
            className="balance-title icon-text icon-text--sm"
            style={{ color: "var(--danger)" }}
          >
            <AlertTriangle size={18} /> 과활성 (뭉친 근육)
          </p>
          <div className="flex flex-wrap gap-2">
            {overactiveMuscles.map((m) => (
              <span
                key={m}
                style={{
                  fontSize: "var(--text-sm)",
                  padding: "0.3rem 0.6rem",
                  background: "rgba(240,62,62,0.1)",
                  color: "var(--danger)",
                  borderRadius: "var(--radius-xs)",
                  fontWeight: 700,
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="balance-card">
          <p
            className="balance-title icon-text icon-text--sm"
            style={{ color: "var(--success)" }}
          >
            <CheckCircle size={18} /> 저활성 (약한 근육)
          </p>
          <div className="flex flex-wrap gap-2">
            {underactiveMuscles.map((m) => (
              <span
                key={m}
                style={{
                  fontSize: "var(--text-sm)",
                  padding: "0.3rem 0.6rem",
                  background: "rgba(46,204,136,0.1)",
                  color: "var(--success)",
                  borderRadius: "var(--radius-xs)",
                  fontWeight: 700,
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
