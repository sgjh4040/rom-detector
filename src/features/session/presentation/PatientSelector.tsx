// PatientSelector.tsx — 환자 선택 + 관리 + 새 환자 버튼 헤더 (audit #13).
// 칩 리스트 / 관리 모드 행은 patientSelector/ 하위로 분리됨.
import React from "react";
import type { Patient } from "../../../lib/romTypes";
import { Settings, Plus } from "lucide-react";
import { PatientChipList } from "./patientSelector/PatientChipList";
import { PatientManagementList } from "./patientSelector/PatientManagementList";

interface PatientSelectorProps {
  patients: Patient[];
  patientId?: string;
  isManaging: boolean;
  setIsManaging: (val: boolean) => void;
  handleSelectPatient: (p: Patient) => void;
  handleDeletePatient: (id: string) => void;
  handleNewPatient: () => void;
  /** 새 환자 등록 중 — true면 "새 환자 등록 중" 배지 노출 */
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
  // 환자 목록이 없거나, 지금 새 환자 정보를 입력 중이면 이 컴포넌트는 아예 안 보임
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
              {isManaging ? (
                "완료"
              ) : (
                <>
                  <Settings size={16} /> 관리
                </>
              )}
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
        <PatientChipList
          patients={patients}
          patientId={patientId}
          onSelectPatient={handleSelectPatient}
        />
      )}

      {/* [audit] 환자 관리 모드 — 좌측 선택 카드 + 우측 빨간 outline 삭제 버튼 */}
      {isManaging && (
        <PatientManagementList
          patients={patients}
          onSelectPatient={handleSelectPatient}
          onDeletePatient={handleDeletePatient}
          onSelectClose={() => setIsManaging(false)}
        />
      )}
    </div>
  );
};
