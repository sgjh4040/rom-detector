import React from "react";
import type { Patient } from "../lib/romTypes";
import { getPatientHistory } from "../lib/patientHistory";
import { Settings, Plus } from "lucide-react";

interface PatientSelectorProps {
  patients: Patient[];
  patientId?: string;
  //isManaging: 환자 관리 모드인지 여부
  isManaging: boolean;

  //setIsManaging: 환자 관리 모드 변경
  setIsManaging: (val: boolean) => void;

  //handleSelectPatient: 환자 선택
  handleSelectPatient: (p: Patient) => void;

  //handleDeletePatient: 환자 삭제
  handleDeletePatient: (id: string) => void;

  //handleNewPatient: 새 환자 등록
  handleNewPatient: () => void;

  //isAddingNew: 새 환자 등록 중 — true면 "새 환자 등록 중" 배지 노출
  isAddingNew?: boolean;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  patientId,
  isManaging,
  setIsManaging,
  handleSelectPatient,
  handleDeletePatient,
  handleNewPatient,
  isAddingNew = false,
}) => {
  //환자 목록이 없거나, 지금 새 환자 정보를 입력 중이면 이 컴포넌트는 아예 안 보임
  if (patients.length === 0 && !patientId && !isAddingNew) return null;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <label className="form-label mb-0">환자 관리 및 선택</label>
        <div className="flex gap-2">
          {/* 환자 관리 버튼 */}
          {patients.length > 0 && (
            <button
              type="button"
              className={`btn btn-small flex items-center gap-1 ${isManaging ? "btn-primary" : "btn-outline"}`}
              onClick={() => setIsManaging(!isManaging)}
            >
              {isManaging ? "완료" : <><Settings size={14} /> 관리</>}
            </button>
          )}
          {(patients.length > 0 || patientId) && (
            <button
              type="button"
              className="btn btn-outline btn-small flex items-center gap-1"
              onClick={handleNewPatient}
            >
              <Plus size={14} /> 새 환자
            </button>
          )}
        </div>
      </div>

      {/* 새 환자 등록 중 상태 배지 — 기존 환자 chip과 폼 사이 시각적 맥락 명시 */}
      {isAddingNew && !patientId && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            marginBottom: "12px",
            background: "rgba(92, 107, 192, 0.08)",
            border: "1px dashed rgba(92, 107, 192, 0.35)",
            borderRadius: "12px",
            color: "var(--primary)",
            fontSize: "0.8rem",
            fontWeight: 700,
          }}
        >
          <Plus size={14} />
          <span>새 환자를 등록하는 중이에요</span>
        </div>
      )}

      {patients.length > 0 && !isManaging && (
        <div
          className="flex gap-2 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            paddingTop: "6px", // 위쪽 그림자 공간
            paddingBottom: "6px", // 아래쪽 그림자 공간
            paddingLeft: "4px", // 좌측 그림자 공간
            paddingRight: "4px", // 우측 그림자 공간
            marginTop: "-6px", // 패딩 추가로 인한 밀림 보정
            overflowX: "auto",
          }}
        >
          {patients
            .slice(-5)
            .reverse()
            .map((p) => {
              const history = getPatientHistory(p.id);
              const lastSession = history[0];
              const sublabel = lastSession
                ? `${new Date(lastSession.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}${lastSession.vasScore !== undefined ? ` · VAS ${lastSession.vasScore}` : ""}`
                : "측정 전";
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`btn ${patientId === p.id ? "btn-primary" : "btn-outline"}`}
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: "0.875rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "2px",
                    padding: "0.55rem 0.9rem",
                    minHeight: "auto",
                    lineHeight: 1.2,
                  }}
                  onClick={() => handleSelectPatient(p)}
                >
                  <span style={{ fontWeight: 800 }}>
                    {p.name} ({p.age})
                  </span>
                  <span
                    style={{
                      fontSize: "0.68rem",
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
      )}

      {isManaging && (
        <div
          className="panel"
          style={{
            background: "var(--bg-color)",
            padding: "1rem",
            border: "1px solid #ddd",
          }}
        >
          <div className="flex flex-col gap-2">
            {patients
              .slice()
              .reverse()
              .map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
                >
                  <div
                    onClick={() => {
                      handleSelectPatient(p);
                      setIsManaging(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <strong>{p.name}</strong>{" "}
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.8rem",
                      }}
                    >
                      ({p.age}세)
                    </span>
                  </div>
                  <button
                    className="btn btn-danger btn-small"
                    style={{ padding: "0.2rem 0.4rem", fontSize: "0.75rem" }}
                    onClick={() => handleDeletePatient(p.id)}
                  >
                    삭제
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
