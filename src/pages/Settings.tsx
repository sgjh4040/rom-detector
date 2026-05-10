// Settings.tsx — 앱 설정 및 데이터 관리 화면 (PRD 4-0: 200줄 이하)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../core/components/AppLayout";
import { ConfirmDialog } from "../core/components/ConfirmDialog";
import { loadRomSession, clearRomSession } from "../lib/romTypes";
import {
  getPatients,
  getPatientHistory,
  clearAllPatientsAndHistory,
} from "../lib/romData";
import { clearCesHistory } from "../features/session/data/cesTimeTracker";
import { DataManagementCard } from "./settings/DataManagementCard";
import { LicenseCard } from "./settings/LicenseCard";

/** 현재 localStorage의 환자/히스토리/세션을 JSON으로 묶어 파일로 다운로드 */
const exportAllData = (): void => {
  const patients = getPatients();
  const historyByPatient: Record<string, unknown> = {};
  patients.forEach((p) => {
    historyByPatient[p.id] = getPatientHistory(p.id);
  });
  const payload = {
    exportedAt: new Date().toISOString(),
    patients,
    history: historyByPatient,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `rom-detector-export-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/** 모든 환자/히스토리/세션/CES 누적시간을 localStorage에서 제거.
 *  매직 스트링/직접 접근 금지 — lib 래퍼만 사용. */
const deleteAllData = (): void => {
  clearAllPatientsAndHistory();
  clearCesHistory();
  clearRomSession();
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const session = loadRomSession();
  const [patients, setPatients] = useState(getPatients());
  const [isDeleting, setIsDeleting] = useState(false);
  // [audit #24] native confirm 대신 ConfirmDialog 사용
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const totalHistoryCount = patients.reduce(
    (sum, p) => sum + getPatientHistory(p.id).length,
    0,
  );

  const handleExport = () => {
    if (patients.length === 0) {
      alert("내보낼 환자 데이터가 없어요.");
      return;
    }
    exportAllData();
  };

  const handleDeleteAll = () => {
    if (patients.length === 0) {
      alert("삭제할 데이터가 없어요.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleConfirmDeleteAll = () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    deleteAllData();
    setPatients([]);
    setIsDeleting(false);
    alert("모든 데이터가 삭제됐어요.");
    navigate("/");
  };

  return (
    <AppLayout patientId={session?.patientId}>
      <div className="bg-full-viewport page-bg-settings">
        <div className="container">
          {/* 상단 헤더 — Trends/Results 와 동일한 .page-header 패턴 (audit #38) */}
          <div
            className="page-header"
            style={{ paddingTop: "20px", marginBottom: "20px" }}
          >
            <button
              type="button"
              className="btn btn-outline btn-small btn-back-text mb-3"
              onClick={() => navigate(-1)}
            >
              ← 뒤로가기
            </button>
            <h1
              className="text-3xl font-black tracking-tighter opacity-90"
              style={{ fontSize: "var(--text-2xl)", marginBottom: "4px" }}
            >
              설정
            </h1>
            <p className="opacity-70 text-base font-bold">
              데이터 관리 · 라이선스 · 앱 정보
            </p>
          </div>

          <DataManagementCard
            patientCount={patients.length}
            totalHistoryCount={totalHistoryCount}
            isDeleting={isDeleting}
            onExport={handleExport}
            onRequestDeleteAll={handleDeleteAll}
          />

          <LicenseCard />

          {/* 앱 정보 섹션 */}
          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
            }}
          >
            <p>ROM 측정기 및 CES 재활 루틴 앱</p>
            <p>버전 1.0.0</p>
          </div>
        </div>
      </div>

      {/* [audit #24] 전체 데이터 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="모든 데이터를 삭제할까요?"
        description={`환자 ${patients.length}명과 측정 기록 ${totalHistoryCount}건이 사라집니다.\n이 작업은 되돌릴 수 없어요.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        onConfirm={handleConfirmDeleteAll}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </AppLayout>
  );
};
