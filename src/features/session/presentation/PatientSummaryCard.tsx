// PatientSummaryCard.tsx — 홈 화면 환자 요약 카드 (audit #13 Phase 1)
//
// 선택된 환자의 메타 정보 + "새 측정 / 기록 보기" CTA + 관절별 요약 라인.
// 이전에는 src/pages/Index.tsx 가 직접 인라인으로 렌더했으나
// PRD §4-0 (200줄) 준수를 위해 분리.
//
// 패턴: controlled component — state 는 부모(Index) 가 유지하고 props 로 받는다.
import React from "react";
import { Play, LineChart } from "lucide-react";
import { HomePatientSummary } from "./HomePatientSummary";

interface PatientSummaryCardProps {
  patientId: string;
  name: string;
  age: string;
  painArea: string;
  vasScore: number;
  historyCount: number;
  lastMeasuredAt?: string;
  onStartMeasurement: () => void;
  onViewTrends: () => void;
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  patientId,
  name,
  age,
  painArea,
  vasScore,
  historyCount,
  lastMeasuredAt,
  onStartMeasurement,
  onViewTrends,
}) => {
  return (
    <div className="patient-summary">
      <div className="patient-summary__info">
        <h2 className="patient-summary__name">
          {name}
          <span className="patient-summary__age"> ({age}세)</span>
        </h2>
        <div className="patient-summary__meta">
          {painArea && <span>{painArea}</span>}
          {painArea && <span className="dot">·</span>}
          <span>VAS {vasScore}</span>
          {historyCount > 0 && (
            <>
              <span className="dot">·</span>
              <span>측정 {historyCount}회</span>
            </>
          )}
        </div>
        {lastMeasuredAt && (
          <p className="patient-summary__last">
            최근 측정:{" "}
            {new Date(lastMeasuredAt).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
      <div className="patient-summary__actions">
        <button
          type="button"
          className="btn btn-primary btn-large"
          onClick={onStartMeasurement}
        >
          <Play size={18} /> 새 측정 시작
        </button>
        <button
          type="button"
          className="btn btn-outline btn-large"
          onClick={onViewTrends}
          disabled={historyCount === 0}
          style={
            historyCount === 0
              ? { opacity: 0.5, cursor: "not-allowed" }
              : undefined
          }
        >
          <LineChart size={18} />
          {historyCount === 0 ? "측정 기록 없음" : "측정 기록 보기"}
        </button>
      </div>
      <HomePatientSummary patientId={patientId} />
    </div>
  );
};
