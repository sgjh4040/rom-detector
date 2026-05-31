// Settings.tsx — 앱 설정 및 데이터 관리 (redesign-spike, Athletic Garmin).
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ConfirmDialog } from "../core/components/ConfirmDialog";
import { clearRomSession } from "../lib/romTypes";
import {
  getPatients,
  getPatientHistory,
  clearAllPatientsAndHistory,
} from "../lib/romData";
import { clearCesHistory } from "../features/session/data/cesTimeTracker";
import {
  parseImportPayload,
  summarizeImport,
  importData,
  type ImportPayload,
} from "../lib/dataImport";
import { AppShell } from "../components/redesign/AppShell";
import { Button } from "../components/redesign/ui/Button";
import { DataManagementCard } from "./settings/DataManagementCard";
import { LicenseCard } from "./settings/LicenseCard";

/** localStorage 환자/히스토리/세션 → JSON 다운로드 */
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
  a.download = `rom-detector-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/** 모든 환자/히스토리/세션/CES 누적시간 제거 */
const deleteAllData = (): void => {
  clearAllPatientsAndHistory();
  clearCesHistory();
  clearRomSession();
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(getPatients());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // 가져오기: 파싱된 payload 를 들고 확인 다이얼로그 → 승인 시 병합 적용
  const [pendingImport, setPendingImport] = useState<ImportPayload | null>(null);

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

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = parseImportPayload(String(reader.result ?? ""));
        setPendingImport(payload);
      } catch (err) {
        alert(err instanceof Error ? err.message : "파일을 읽을 수 없어요.");
      }
    };
    reader.onerror = () => alert("파일을 읽는 중 오류가 발생했어요.");
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;
    const result = importData(pendingImport);
    setPendingImport(null);
    setPatients(getPatients());
    const added = result.patientsAdded + result.patientsUpdated;
    alert(
      `가져오기 완료\n환자 ${added}명 (신규 ${result.patientsAdded} · 갱신 ${result.patientsUpdated})\n` +
        `측정 기록 ${result.sessionsAdded}건 추가 (중복 ${result.sessionsSkipped}건 건너뜀)`,
    );
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
    <AppShell>
      <div className="flex flex-col gap-5">
        {/* 헤더 */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="-ml-2 mb-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="size-4" />
            뒤로가기
          </Button>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
            설정
          </h1>
          <p className="mt-1 text-sm font-medium text-[var(--color-muted-foreground)]">
            데이터 관리 · 라이선스 · 앱 정보
          </p>
        </div>

        <DataManagementCard
          patientCount={patients.length}
          totalHistoryCount={totalHistoryCount}
          isDeleting={isDeleting}
          onExport={handleExport}
          onImportFile={handleImportFile}
          onRequestDeleteAll={handleDeleteAll}
        />

        <LicenseCard />

        {/* 앱 정보 */}
        <div className="mt-2 text-center text-xs text-[var(--color-muted-foreground)]">
          <p>ROM 측정기 및 CES 재활 루틴 앱</p>
          <p className="mt-0.5 font-mono">버전 1.0.0</p>
        </div>
      </div>

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

      <ConfirmDialog
        open={pendingImport !== null}
        title="데이터를 가져올까요?"
        description={
          pendingImport
            ? `환자 ${summarizeImport(pendingImport).patientCount}명, 측정 기록 ${summarizeImport(pendingImport).sessionCount}건을 가져옵니다.\n기존 데이터에 병합되며 같은 기록은 중복 추가되지 않아요.`
            : ""
        }
        confirmLabel="가져오기"
        cancelLabel="취소"
        onConfirm={handleConfirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </AppShell>
  );
};
