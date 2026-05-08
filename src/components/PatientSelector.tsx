import React from "react";
import type { Patient } from "../lib/romTypes";
import { getPatientHistory } from "../lib/patientHistory";
import { Settings, Plus, Trash2 } from "lucide-react";

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
          {/* 환자 관리 버튼 — 탭 타겟 44px 보장 */}
          {patients.length > 0 && (
            <button
              type="button"
              className={`btn btn-small flex items-center gap-1.5 ${isManaging ? "btn-primary" : "btn-outline"}`}
              onClick={() => setIsManaging(!isManaging)}
              style={{
                minHeight: "40px",
                padding: "0.5rem 0.9rem",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
              }}
            >
              {isManaging ? "완료" : <><Settings size={16} /> 관리</>}
            </button>
          )}
          {(patients.length > 0 || patientId) && (
            <button
              type="button"
              className="btn btn-outline btn-small flex items-center gap-1.5"
              onClick={handleNewPatient}
              style={{
                minHeight: "40px",
                padding: "0.5rem 0.9rem",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
              }}
            >
              <Plus size={16} /> 새 환자
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
            borderRadius: "var(--radius-sm)",
            color: "var(--primary)",
            fontSize: "var(--text-sm)",
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
              // [audit #33] 칩의 날짜가 등록일/첫 측정일/최근 측정일 중 무엇인지 모호했음.
              // 다른 페이지(Index 환자 카드, HomePatientSummary)와 동일하게 "최근" prefix 로 의미 명확화.
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
                  onClick={() => handleSelectPatient(p)}
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
      )}

      {/* [audit] 환자 관리 모드 — 행을 명확히 두 영역으로 분리:
          좌측 환자 선택 카드 (button, 호버 효과) + 우측 빨간 outline 삭제 버튼.
          이전엔 한 카드 안에 두 액션이 묶여 "한 버튼"처럼 보이던 문제 해소. */}
      {isManaging && (
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
                    handleSelectPatient(p);
                    setIsManaging(false);
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
                  onClick={() => handleDeletePatient(p.id)}
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
      )}
    </div>
  );
};
