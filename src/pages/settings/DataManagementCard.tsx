// DataManagementCard.tsx — Settings 페이지의 데이터 관리 섹션 (audit #13).
// 등록 환자/측정 기록 건수 + 내보내기/전체삭제 버튼.
import React from "react";
import { Download, Trash2, FileText, Users } from "lucide-react";

interface DataManagementCardProps {
  patientCount: number;
  totalHistoryCount: number;
  isDeleting: boolean;
  onExport: () => void;
  onRequestDeleteAll: () => void;
}

export const DataManagementCard: React.FC<DataManagementCardProps> = ({
  patientCount,
  totalHistoryCount,
  isDeleting,
  onExport,
  onRequestDeleteAll,
}) => {
  return (
    <div className="card settings-card">
      <h2 className="icon-text">
        <FileText size={20} /> 데이터 관리
      </h2>

      {/* 요약 — [audit #18] stat-tile 클래스 */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "12px",
          marginBottom: "16px",
        }}
      >
        <div className="stat-tile">
          <p className="stat-tile__label">등록 환자</p>
          <p className="stat-tile__value">{patientCount}명</p>
        </div>
        <div className="stat-tile">
          <p className="stat-tile__label">측정 기록</p>
          <p className="stat-tile__value">{totalHistoryCount}건</p>
        </div>
      </div>

      {/* 내보내기 */}
      <button
        type="button"
        className="btn btn-outline w-full flex items-center justify-center gap-2"
        style={{ marginBottom: "10px", padding: "12px" }}
        onClick={onExport}
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
        onClick={onRequestDeleteAll}
        disabled={isDeleting}
      >
        <Trash2 size={18} /> 모든 환자 데이터 삭제
      </button>

      <p
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--text-secondary)",
          marginTop: "10px",
          lineHeight: 1.5,
          opacity: 0.75,
        }}
      >
        <Users
          size={12}
          style={{ display: "inline", marginRight: "4px" }}
        />
        환자 정보와 측정 기록은 이 기기에만 저장돼요. 앱을 지우거나 브라우저
        저장소를 비우면 복구할 수 없어요.
      </p>
    </div>
  );
};
