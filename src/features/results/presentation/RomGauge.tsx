import React from "react";
import type { Severity } from "../../../lib/romData";

interface RomGaugeProps {
  label: string;
  measured: number;
  normal: number;
  severity: Severity;
}

const severityColorMap: Record<Severity, string> = {
  정상: "var(--success)", // #22C55E
  경도제한: "var(--warning)", // #EAB308
  중등도제한: "var(--warning)",
  심각한제한: "var(--danger)", // #EF4444
};

export const RomGauge: React.FC<RomGaugeProps> = ({
  label,
  measured,
  normal,
  severity,
}) => {
  // Simple SVG semi-circle gauge calculation
  const radius = 60;
  const circumference = radius * Math.PI;
  const displayRatio =
    normal === 0
      ? measured >= -5
        ? 1
        : 0
      : Math.min(Math.max(measured / normal, 0), 1);
  const offset = circumference - displayRatio * circumference;
  const color = severityColorMap[severity];

  return (
    <div
      className="card text-center flex items-center justify-between"
      style={{ padding: "1rem", marginBottom: "1rem" }}
    >
      <div style={{ textAlign: "left", flex: 1 }}>
        <h4 style={{ marginBottom: "0.25rem" }}>{label}</h4>
        <div style={{ display: "flex", gap: "1rem", fontSize: "var(--text-sm)" }}>
          <span className="tabular-nums text-[var(--text-secondary)]">
            정상: {normal}°
          </span>
          <span className="tabular-nums font-bold text-[var(--primary)]">
            측정: {measured}°
          </span>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "120px",
          height: "60px",
          overflow: "hidden",
        }}
      >
        {/* Background Arc */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 140 140"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path
            d="M 20 120 A 50 50 0 0 1 120 120"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>

        {/* Value Arc */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 140 140"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path
            d="M 20 120 A 50 50 0 0 1 120 120"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s ease-out, stroke 0.3s ease",
            }}
          />
        </svg>

        {/* Center Text */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            width: "100%",
            textAlign: "center",
          }}
        >
          <span
            className={`badge ${severity === "정상" ? "badge-success" : severity === "심각한제한" ? "badge-danger" : "badge-warning"}`}
          >
            {severity}
          </span>
        </div>
      </div>
    </div>
  );
};
