// Results.tsx — 측정 결과 평가 리포트 페이지 (audit #13: 통계 가공 분리).
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadRomSession,
  addSessionToHistory,
  getPatientHistory,
  getPatients,
  savePatient,
} from "../lib/romData";
import { JointSideResult } from "../features/results/presentation/JointSideResult";
import { AppLayout } from "../core/components/AppLayout";
import { EmptyState } from "../core/components/EmptyState";
import { TrendingUp, Dumbbell, FileSearch } from "lucide-react";
import { computeResultsSummary } from "./results/resultsSummary";
import { StatRow } from "./results/StatRow";

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const session = useMemo(() => loadRomSession(), []);

  // 환자 정보 upsert + 히스토리 추가.
  // F2 수정 (2026-05-09):
  //  - 기존 환자가 있으면 createdAt(등록일) / lastMeasuredAt 을 **보존**한다.
  //  - painArea 는 측정 폼 빈 값으로 진입한 경우 기존 값을 유지.
  //  - vasScore 는 통증 0 이 의도된 입력일 수 있어 그대로 반영.
  //  - lastMeasuredAt 은 직후 addSessionToHistory 가 idempotent 하게 갱신.
  useEffect(() => {
    if (!session?.patientId) return;
    const existing = getPatients().find((p) => p.id === session.patientId);
    savePatient({
      id: session.patientId,
      name: session.patientName,
      age: session.patientAge,
      painArea: session.painArea || existing?.painArea || "",
      vasScore: session.vasScore,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      lastMeasuredAt: existing?.lastMeasuredAt,
    });
    addSessionToHistory(session.patientId, session);
  }, [session]);

  // 세션이 없으면 안내 후 사용자가 직접 이동 (audit #21, F1 동일 패턴)
  if (!session) {
    return (
      <EmptyState
        size="md"
        fullScreen
        icon={<FileSearch size={48} strokeWidth={1.8} />}
        title="측정 세션이 없어요"
        description="새 측정을 시작하면 결과 리포트가 여기에 표시됩니다."
        cta={{
          label: "홈으로 돌아가기",
          variant: "pill",
          onClick: () => navigate("/"),
        }}
      />
    );
  }

  const {
    selectedJointIds,
    patientName,
    patientAge,
    patientId,
  } = session;

  // 환자 히스토리 + 첫 측정 (변화량 계산용)
  const history = patientId ? getPatientHistory(patientId) : [];
  const firstSession =
    history.length > 0 ? history[history.length - 1] : undefined;
  const isFirstTime = history.length <= 1;

  const {
    sortedJointSideStats,
    totalLimited,
    totalNormal,
    summarySentence,
  } = computeResultsSummary(session);

  return (
    <AppLayout patientId={patientId}>
      <div className="bg-full-viewport page-bg-results">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="page-header flex justify-between items-center">
            <div>
              <button
                type="button"
                className="btn btn-outline btn-small btn-back-text mb-3"
                onClick={() => navigate(-1)}
              >
                ← 뒤로가기
              </button>
              <h1>평가 리포트 대시보드</h1>
              <p>
                {patientName} ({patientAge}세){" "}
                {session.painArea && `| ${session.painArea}`}{" "}
                {session.vasScore !== undefined && `| VAS: ${session.vasScore}`}
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => window.print()}>
              리포트 인쇄
            </button>
          </div>

          <StatRow
            jointCount={selectedJointIds.length}
            totalLimited={totalLimited}
            totalNormal={totalNormal}
            summarySentence={summarySentence}
          />

          {!isFirstTime && (
            <div
              className="panel clickable mt-4"
              onClick={() => navigate(`/trends?patientId=${patientId}`)}
              style={{
                border: "1px solid var(--primary)",
                background: "var(--bg-color)",
                cursor: "pointer",
              }}
            >
              <div className="panel-header">
                <h3 className="icon-text">
                  <TrendingUp size={20} /> 경과 관찰 (초기 대비)
                </h3>
                <span className="badge badge-primary">
                  총 {history.length}회 측정
                </span>
              </div>
              <p style={{ fontSize: "var(--text-sm)", padding: "0 1.25rem 1rem" }}>
                첫 측정 대비 변화량 확인 (클릭 시 추이 분석)
              </p>
            </div>
          )}

          <div className="dashboard-layout single-col mt-6">
            {sortedJointSideStats.map((stat, idx) => {
              // 가장 제한이 큰 첫 카드에만 강조 — 심각한제한 포함 시 danger, 아니면 warning
              const isWorst = idx === 0 && stat.limitedCount > 0;
              const emphasisColor = isWorst
                ? stat.hasSevere
                  ? "var(--danger)"
                  : "var(--warning)"
                : undefined;
              return (
                <JointSideResult
                  key={`${stat.jointId}-${stat.side}`}
                  session={session}
                  jointId={stat.jointId}
                  side={stat.side}
                  firstSession={firstSession}
                  emphasisColor={emphasisColor}
                />
              );
            })}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <div className="action-bar">
              <button
                className="btn btn-primary flex items-center justify-center gap-2"
                onClick={() => navigate("/ces")}
              >
                <Dumbbell size={20} /> CES 재활 시작
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
