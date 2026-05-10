// PatientManagementList.tsx — 환자 관리 모드의 행 목록 (audit #13).
// 좌측 환자 선택 카드 + 우측 빨간 outline 삭제 버튼 (≥44px 터치 영역).
import React from "react";
import type { Patient } from "../../../../lib/romTypes";
import { Trash2 } from "lucide-react";

interface PatientManagementListProps {
  patients: Patient[];
  onSelectPatient: (p: Patient) => void;
  onDeletePatient: (id: string) => void;
  /** 환자 선택 후 관리 모드를 자동으로 닫고 싶을 때 */
  onSelectClose: () => void;
}

export const PatientManagementList: React.FC<PatientManagementListProps> = ({
  patients,
  onSelectPatient,
  onDeletePatient,
  onSelectClose,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {patients
        .slice()
        .reverse()
        .map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: "0.5rem",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onSelectPatient(p);
                onSelectClose();
              }}
              style={{
                flex: 1,
                minHeight: "44px",
                padding: "0.6rem 0.9rem",
                background: "rgba(255, 255, 255, 0.85)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: "var(--radius-xs)",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              className="patient-mgmt-row__select"
            >
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                {p.name}{" "}
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    fontSize: "var(--text-xs)",
                  }}
                >
                  ({p.age}세)
                </span>
              </span>
              {p.painArea && (
                <span
                  style={{
                    fontSize: "var(--text-2xs)",
                    color: "var(--text-secondary)",
                    opacity: 0.75,
                  }}
                >
                  {p.painArea}
                  {p.vasScore !== undefined && ` · VAS ${p.vasScore}`}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onDeletePatient(p.id)}
              aria-label={`${p.name} 삭제`}
              style={{
                minHeight: "44px",
                minWidth: "44px",
                padding: "0 0.85rem",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--radius-xs)",
                color: "var(--danger)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                transition: "background 0.15s",
              }}
              className="patient-mgmt-row__delete"
            >
              <Trash2 size={15} />
              <span style={{ display: "var(--del-label-display, inline)" }}>
                삭제
              </span>
            </button>
          </div>
        ))}
    </div>
  );
};
