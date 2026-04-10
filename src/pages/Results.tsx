import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  JOINTS,
  loadRomSession,
  calculateSeverity,
  //   EXERCISES,
  //   FALLBACK_STRETCHING,
  //   FALLBACK_STRENGTHENING,
  addSessionToHistory,
  getPatientHistory,
  savePatient,
} from "../lib/romData";
// import { ExerciseCard } from "../components/ExerciseCard";
import { JointSideResult } from "../components/JointSideResult";
import { AppLayout } from "../components/AppLayout";
import { TrendingUp, Dumbbell } from "lucide-react";

export const Results: React.FC = () => {
  // 페이지 이동
  const navigate = useNavigate();

  // 현재 측정된 ROM 데이터 불러오기
  const session = useMemo(() => loadRomSession(), []);

  // 환자 정보 저장 및 히스토리 추가
  useEffect(() => {
    if (session && session.patientId) {
      savePatient({
        id: session.patientId,
        name: session.patientName,
        age: session.patientAge,
        painArea: session.painArea,
        vasScore: session.vasScore,
        createdAt: new Date().toISOString(),
      });
      addSessionToHistory(session.patientId, session);
    }
  }, [session]);

  // 세션이 없으면 홈으로 이동
  if (!session) {
    navigate("/");
    return null;
  }

  // 선택된 관절, 방향, 환자 정보
  const {
    selectedJointIds,
    selectedSides,
    patientName,
    patientAge,
    patientId,
  } = session;

  // 환자 히스토리 불러오기
  const history = patientId ? getPatientHistory(patientId) : [];

  // 첫 측정인지 확인
  const firstSession =
    history.length > 0 ? history[history.length - 1] : undefined;

  // 첫 측정인지 확인
  const isFirstTime = history.length <= 1;

  // 제한된 관절 찾기
  // const jointsWithLimitation = selectedJointIds.filter((jid) =>
  //   selectedSides.some((side) => {
  //     const joint = JOINTS.find((j) => j.id === jid);
  //     return joint?.movements.some((m) => {
  //       const measured = session.measurements?.[jid]?.[side]?.[m.id] ?? 0;
  //       const severity = m.isQualitative
  //         ? measured === 1
  //           ? "심각한제한"
  //           : "정상"
  //         : calculateSeverity(measured, m.normalRange);
  //       return severity !== "정상";
  //     });
  //   }),
  // );

  // const exIds =
  //   jointsWithLimitation.length > 0 ? jointsWithLimitation : selectedJointIds;
  // const stretches = exIds.flatMap((id) =>
  //   (EXERCISES[id] ?? []).filter((e) => e.type === "stretching"),
  // );
  // const strength = exIds.flatMap((id) =>
  //   (EXERCISES[id] ?? []).filter((e) => e.type === "strengthening"),
  // );

  // (jointId, side) 조합별 제한/정상 집계 — 정렬 + 요약 + 렌더용
  interface JointSideStat {
    jointId: string;
    side: Side;
    jointName: string;
    limitedCount: number;
    totalCount: number;
    hasSevere: boolean; // 심각한제한 포함 여부
  }

  const jointSideStats: JointSideStat[] = [];
  selectedJointIds.forEach((jid) => {
    const joint = JOINTS.find((j) => j.id === jid);
    if (!joint) return;
    const sidesForThisJoint: Side[] = joint.isSymmetric ? ["좌측"] : selectedSides;
    sidesForThisJoint.forEach((side) => {
      let limited = 0;
      let severe = 0;
      joint.movements.forEach((m) => {
        const measured = session.measurements?.[jid]?.[side]?.[m.id] ?? 0;
        const severity = m.isQualitative
          ? measured === 1
            ? "심각한제한"
            : "정상"
          : calculateSeverity(measured, m.normalRange);
        if (severity !== "정상") limited += 1;
        if (severity === "심각한제한") severe += 1;
      });
      jointSideStats.push({
        jointId: jid,
        side,
        jointName: joint.name,
        limitedCount: limited,
        totalCount: joint.movements.length,
        hasSevere: severe > 0,
      });
    });
  });

  // 제한 개수 내림차순, 동수면 심각한제한 우선
  const sortedJointSideStats = [...jointSideStats].sort((a, b) => {
    if (b.limitedCount !== a.limitedCount) return b.limitedCount - a.limitedCount;
    if (a.hasSevere !== b.hasSevere) return a.hasSevere ? -1 : 1;
    return 0;
  });

  const totalLimited = jointSideStats.reduce((sum, s) => sum + s.limitedCount, 0);
  const totalNormal = jointSideStats.reduce(
    (sum, s) => sum + (s.totalCount - s.limitedCount),
    0,
  );

  // 상단 요약 문장 — 가장 제한이 큰 관절을 우선 강조
  const worst = sortedJointSideStats[0];
  const summarySentence = (() => {
    if (!worst || totalLimited === 0) {
      return "측정 결과 특이 소견이 없어요. 꾸준히 관리해 주세요.";
    }
    const sideLabel = JOINTS.find((j) => j.id === worst.jointId)?.isSymmetric
      ? ""
      : ` ${worst.side}`;
    return `${worst.jointName}${sideLabel}에서 ${worst.limitedCount}개 동작이 제한돼 있어요${
      worst.hasSevere ? " (심각 포함)" : ""
    }.`;
  })();

  return (
    <AppLayout patientId={patientId}>
      <div className="bg-full-viewport page-bg-results">
        <div className="container" style={{ maxWidth: "900px" }}>
        <div className="page-header flex justify-between items-center">
          <div>
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

        <div className="stat-row">
          <div className="stat-card">
            <p className="stat-label">측정 관절</p>
            <p className="stat-value">{selectedJointIds.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">제한 동작</p>
            <p className="stat-value" style={{ color: "var(--danger)" }}>
              {totalLimited}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-label">정상 동작</p>
            <p className="stat-value" style={{ color: "var(--success)" }}>
              {totalNormal}
            </p>
          </div>
        </div>

        {/* 상단 요약 문장 — 숫자만 있는 카드에 맥락을 더한다 */}
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.85rem 1.1rem",
            borderRadius: "14px",
            background:
              totalLimited > 0
                ? "rgba(239, 68, 68, 0.06)"
                : "rgba(34, 197, 94, 0.06)",
            border: `1px solid ${
              totalLimited > 0
                ? "rgba(239, 68, 68, 0.18)"
                : "rgba(34, 197, 94, 0.2)"
            }`,
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.5,
          }}
        >
          {summarySentence}
        </div>

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
              <h3 className="flex items-center gap-2"><TrendingUp size={20} /> 경과 관찰 (초기 대비)</h3>
              <span className="badge badge-primary">
                총 {history.length}회 측정
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", padding: "0 1.25rem 1rem" }}>
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
          {/* <h2 className="mb-4">📋 맞춤 재활 가이드</h2>
          <div className="grid grid-cols-2 gap-4">
            {(stretches.length > 0 ? stretches : [FALLBACK_STRETCHING]).map(
              (ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ),
            )}
          </div>
          <h2 className="mt-6 mb-4">💪 근력 강화 처방</h2>
          <div className="grid grid-cols-2 gap-4">
            {(strength.length > 0 ? strength : [FALLBACK_STRENGTHENING]).map(
              (ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ),
            )}
          </div> */}
          <div className="action-bar">
            <button
              className="btn btn-primary flex items-center justify-center gap-2"
              onClick={() => navigate("/ces")}
            >
              <Dumbbell size={20} /> CES 재활 시작
            </button>
            {/* <button className="btn btn-outline" onClick={() => navigate("/")}>
              🏠 홈으로
            </button> */}
          </div>
        </div>
        </div>
      </div>
    </AppLayout>
  );
};
