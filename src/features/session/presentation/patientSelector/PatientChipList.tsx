// PatientChipList.tsx — 환자 칩 가로 스크롤 리스트 (audit #13).
// 최대 5명만 표시하고 newest-first 정렬. 칩 하단 라벨에 [audit #33] "최근" prefix 사용.
import React from "react";
import type { Patient } from "../../../../lib/romTypes";
import { getPatientHistory } from "../../../../lib/patientHistory";

interface PatientChipListProps {
  patients: Patient[];
  patientId?: string;
  onSelectPatient: (p: Patient) => void;
}

export const PatientChipList: React.FC<PatientChipListProps> = ({
  patients,
  patientId,
  onSelectPatient,
}) => {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      style={{
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        paddingTop: "6px",
        paddingBottom: "6px",
        paddingLeft: "4px",
        paddingRight: "4px",
        marginTop: "-6px",
        overflowX: "auto",
      }}
    >
      {patients
        .slice(-5)
        .reverse()
        .map((p) => {
          const history = getPatientHistory(p.id);
          const lastSession = history[0];
          // [audit #33] "최근" prefix 로 의미 명확화
          const sublabel = lastSession
            ? `최근 ${new Date(lastSession.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}${lastSession.vasScore !== undefined ? ` · VAS ${lastSession.vasScore}` : ""}`
            : "측정 전";
          return (
            <button
              key={p.id}
              type="button"
              className={`btn ${patientId === p.id ? "btn-primary" : "btn-outline"}`}
              style={{
                whiteSpace: "nowrap",
                fontSize: "var(--text-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "2px",
                padding: "0.55rem 0.9rem",
                minHeight: "auto",
                lineHeight: 1.2,
              }}
              onClick={() => onSelectPatient(p)}
            >
              <span style={{ fontWeight: 800 }}>
                {p.name} ({p.age})
              </span>
              <span
                style={{
                  fontSize: "var(--text-2xs)",
                  fontWeight: 600,
                  opacity: 0.75,
                }}
              >
                {sublabel}
              </span>
            </button>
          );
        })}
    </div>
  );
};
