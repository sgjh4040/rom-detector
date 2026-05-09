// Result.tsx — ImageAngleMeasurer 의 측정 각도 결과 + 호 반전/저장 버튼 (audit #13).
import React from "react";
import { RotateCcw } from "lucide-react";

interface ResultProps {
  angle: number;
  isInverted: boolean;
  onToggleInversion: () => void;
  onSave: () => void;
}

export const Result: React.FC<ResultProps> = ({
  angle,
  isInverted,
  onToggleInversion,
  onSave,
}) => {
  return (
    <div
      style={{
        marginTop: "1.25rem",
        padding: "1.25rem",
        backgroundColor: "var(--bg)",
        borderRadius: "var(--radius-md)",
        textAlign: "center",
        boxShadow: "var(--shadow-raised)",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}
        >
          측정된 각도
        </span>
        <button
          type="button"
          className={`btn ${isInverted ? "btn-primary" : "btn-outline"}`}
          style={{
            fontSize: "var(--text-xs)",
            padding: "0.25rem 0.75rem",
            height: "auto",
          }}
          onClick={onToggleInversion}
        >
          <RotateCcw size={14} /> 호 반전 {isInverted ? "(외각)" : "(내각)"}
        </button>
      </div>
      <p
        style={{
          fontSize: "var(--text-3xl)",
          fontWeight: 900,
          color: "var(--primary)",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        {angle}°
      </p>
      <button
        type="button"
        className="btn btn-primary btn-large w-full"
        onClick={onSave}
      >
        이 측정값 저장하기
      </button>
    </div>
  );
};
