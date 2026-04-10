// Settings.tsx — 앱 설정 및 데이터 관리 화면 (PRD 4-0: 200줄 이하)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Trash2, FileText, Users } from "lucide-react";
import { AppLayout } from "../components/AppLayout";
import { loadRomSession, clearRomSession } from "../lib/romTypes";
import { getPatients, getPatientHistory } from "../lib/romData";

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

/** 모든 환자/히스토리/세션을 localStorage에서 제거 */
const deleteAllData = (): void => {
  const patients = getPatients();
  patients.forEach((p) => {
    localStorage.removeItem(`rom_history_${p.id}`);
  });
  localStorage.removeItem("rom_patients");
  localStorage.removeItem("ces_history_durations");
  clearRomSession();
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const session = loadRomSession();
  const [patients, setPatients] = useState(getPatients());
  const [isDeleting, setIsDeleting] = useState(false);

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
    const ok = confirm(
      `정말 모든 환자 ${patients.length}명과 측정 기록 ${totalHistoryCount}건을 삭제할까요?\n이 작업은 되돌릴 수 없어요.`,
    );
    if (!ok) return;
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
          {/* 상단 헤더 */}
          <div className="settings-header">
            <button onClick={() => navigate("/")} className="btn-back">
              ←
            </button>
            <h1>설정</h1>
          </div>

          {/* 데이터 관리 카드 */}
          <div className="card settings-card">
            <h2 className="flex items-center gap-2">
              <FileText size={20} /> 데이터 관리
            </h2>

            {/* 요약 */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  background: "rgba(92, 107, 192, 0.06)",
                  borderRadius: "12px",
                  border: "1px solid rgba(92, 107, 192, 0.12)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  등록 환자
                </div>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                  }}
                >
                  {patients.length}명
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  background: "rgba(92, 107, 192, 0.06)",
                  borderRadius: "12px",
                  border: "1px solid rgba(92, 107, 192, 0.12)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  측정 기록
                </div>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                  }}
                >
                  {totalHistoryCount}건
                </div>
              </div>
            </div>

            {/* 내보내기 */}
            <button
              type="button"
              className="btn btn-outline w-full flex items-center justify-center gap-2"
              style={{ marginBottom: "10px", padding: "12px" }}
              onClick={handleExport}
            >
              <Download size={18} /> 데이터 내보내기 (JSON)
            </button>

            {/* 전체 삭제 */}
            <button
              type="button"
              className="btn btn-outline w-full flex items-center justify-center gap-2"
              style={{
                padding: "12px",
                color: "var(--danger)",
                borderColor: "rgba(239, 68, 68, 0.3)",
              }}
              onClick={handleDeleteAll}
              disabled={isDeleting}
            >
              <Trash2 size={18} /> 모든 환자 데이터 삭제
            </button>

            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--text-secondary)",
                marginTop: "10px",
                lineHeight: 1.5,
                opacity: 0.75,
              }}
            >
              <Users size={12} style={{ display: "inline", marginRight: "4px" }} />
              환자 정보와 측정 기록은 이 기기에만 저장돼요. 앱을 지우거나 브라우저
              저장소를 비우면 복구할 수 없어요.
            </p>
          </div>

          {/* 오픈소스 라이선스 섹션 */}
          <div className="card settings-card">
            <h2>오픈소스 라이선스</h2>
            <div className="license-info">
              <h3>Human Body Atlas SVGs</h3>
              <p>
                This app uses anatomical SVG graphics provided by
                flutter_body_atlas.
              </p>
              <p>
                <strong>License:</strong> CC BY 4.0
              </p>
              <p>
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  License Link
                </a>
              </p>
              <div className="license-note">
                원본 그래픽은 본 웹 앱의 동적 색상 하이라이트 기능에 맞게
                재조정되었습니다.
              </div>
            </div>
          </div>

          {/* 앱 정보 섹션 */}
          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            <p>ROM 측정기 및 CES 재활 루틴 앱</p>
            <p>버전 1.0.0</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
