// JointSideHeader.tsx — CesProtocol 메인 상단의 관절/방향 select + 환자 요약 라벨.
import React from "react";

interface JointSideOption {
  id: string;
  label: string;
}

interface JointSideHeaderProps {
  /** 선택 가능한 관절·방향 목록 */
  jointSideList: JointSideOption[];
  activeJointSide: string;
  onChange: (id: string) => void;
  patientName?: string;
  patientAge?: number;
}

export const JointSideHeader: React.FC<JointSideHeaderProps> = ({
  jointSideList,
  activeJointSide,
  onChange,
  patientName,
  patientAge,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.25rem",
        gap: "12px",
      }}
    >
      <select
        className="form-select"
        style={{
          width: "auto",
          boxShadow: "none",
          fontWeight: 800,
          fontSize: "var(--text-lg)",
          padding: "0.5rem 2rem 0.5rem 0.75rem",
          borderRadius: "var(--radius-xs)",
          border: "1px solid rgba(0,0,0,0.08)",
          background: "rgba(255,255,255,0.7)",
        }}
        value={activeJointSide}
        onChange={(e) => onChange(e.target.value)}
      >
        {jointSideList.map((js) => (
          <option key={js.id} value={js.id}>
            {js.label}
          </option>
        ))}
      </select>
      <span
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          color: "var(--text-secondary)",
          opacity: 0.7,
          whiteSpace: "nowrap",
        }}
      >
        {patientName ?? "환자"}
        {patientAge ? ` · ${patientAge}세` : ""}
      </span>
    </div>
  );
};
