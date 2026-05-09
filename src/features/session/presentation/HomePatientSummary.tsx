// HomePatientSummary.tsx — 홈 요약 카드 아래에 붙는 "최근 측정 요약" 섹션
// 측정 0회: 안내 문구 / 1회: Stat + 관절별 상태 / 2회+: + VAS 추이 스파크라인
import React, { useMemo } from "react";
import {
  getPatientHistory,
  JOINTS,
  calculateSeverity,
} from "../../../lib/romData";
import type { Severity, Side } from "../../../lib/romTypes";
import { SEVERITY_COLORS } from "../../../lib/severityMeta";
import { SeverityBadge } from "../../../core/components/SeverityBadge";
import { VasTrendSparkline } from "./VasTrendSparkline";

interface Props {
  patientId: string;
}

interface JointStat {
  jointId: string;
  name: string;
  total: number;
  normal: number;
  limited: number;
  worst: Severity;
}

// [audit #37] SEVERITY_COLORS / SEVERITY_LABELS 는 lib/severityMeta.ts 단일 진실원에서 import.
// 점 시각화(L173-174)는 색상값 직접 사용하므로 SEVERITY_COLORS 만 import,
// 배지 라벨은 SeverityBadge 컴포넌트에 위임.

const worstSeverity = (severities: Severity[]): Severity => {
  if (severities.includes("심각한제한")) return "심각한제한";
  if (severities.includes("중등도제한")) return "중등도제한";
  if (severities.includes("경도제한")) return "경도제한";
  return "정상";
};

export const HomePatientSummary: React.FC<Props> = ({ patientId }) => {
  const history = useMemo(() => getPatientHistory(patientId), [patientId]);
  const latest = history[0];

  const jointStats = useMemo<JointStat[]>(() => {
    if (!latest) return [];
    return latest.selectedJointIds
      .map((jointId): JointStat | null => {
        const joint = JOINTS.find((j) => j.id === jointId);
        if (!joint) return null;
        const measurements = latest.measurements[jointId] || {};
        const severities: Severity[] = [];
        const sides: Side[] = joint.isSymmetric
          ? ["좌측"]
          : latest.selectedSides;
        sides.forEach((side) => {
          const sideData = measurements[side] || {};
          joint.movements.forEach((mov) => {
            const val = sideData[mov.id];
            if (typeof val === "number") {
              severities.push(calculateSeverity(val, mov.normalRange));
            }
          });
        });
        const total = severities.length;
        if (total === 0) return null;
        const normal = severities.filter((s) => s === "정상").length;
        return {
          jointId,
          name: joint.name,
          total,
          normal,
          limited: total - normal,
          worst: worstSeverity(severities),
        };
      })
      .filter((s): s is JointStat => s !== null);
  }, [latest]);

  // 측정 이력 없음 — 온보딩 문구
  if (!latest) {
    return (
      <div className="home-summary home-summary--empty">
        <p>첫 측정을 시작하면 여기에 관절별 상태와 추이가 표시돼요.</p>
      </div>
    );
  }

  const totalJoints = jointStats.length;
  const totalLimited = jointStats.reduce((sum, s) => sum + s.limited, 0);
  const totalNormal = jointStats.reduce((sum, s) => sum + s.normal, 0);

  const latestDate = new Date(latest.createdAt).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  // VAS 추이는 측정 2회 이상일 때만 표시 (차트 내부 가공은 VasTrendSparkline 가 담당)
  const showVasTrend = history.length >= 2;

  return (
    <div className="home-summary">
      <div className="home-summary__header">
        <h3>최근 측정 요약</h3>
        <span className="home-summary__date">{latestDate}</span>
      </div>

      <div className="home-summary__stats">
        <div className="summary-stat">
          <p className="summary-stat__label">측정 관절</p>
          <p className="summary-stat__value">{totalJoints}</p>
        </div>
        <div className="summary-stat">
          <p className="summary-stat__label">제한 동작</p>
          <p className="summary-stat__value summary-stat__value--danger">
            {totalLimited}
          </p>
        </div>
        <div className="summary-stat">
          <p className="summary-stat__label">정상 동작</p>
          <p className="summary-stat__value summary-stat__value--success">
            {totalNormal}
          </p>
        </div>
      </div>

      {jointStats.length > 0 && (
        <div className="home-summary__joints">
          {jointStats.map((j) => (
            <div key={j.jointId} className="joint-row">
              <span className="joint-row__name">{j.name}</span>
              <div className="joint-row__dots">
                {Array.from({ length: j.total }).map((_, i) => (
                  <span
                    key={i}
                    className="joint-row__dot"
                    style={{
                      background:
                        i < j.normal
                          ? SEVERITY_COLORS["정상"]
                          : SEVERITY_COLORS[j.worst],
                    }}
                  />
                ))}
              </div>
              <SeverityBadge severity={j.worst} variant="tint" />
            </div>
          ))}
        </div>
      )}

      {showVasTrend && (
        <VasTrendSparkline history={history} patientId={patientId} />
      )}
    </div>
  );
};
