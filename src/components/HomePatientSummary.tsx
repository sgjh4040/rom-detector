// HomePatientSummary.tsx — 홈 요약 카드 아래에 붙는 "최근 측정 요약" 섹션
// 측정 0회: 안내 문구 / 1회: Stat + 관절별 상태 / 2회+: + VAS 추이 스파크라인
import React, { useMemo } from "react";
import {
  getPatientHistory,
  JOINTS,
  calculateSeverity,
} from "../lib/romData";
import type { Severity, Side } from "../lib/romTypes";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

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

// 심각도별 색상 — 빨강=심각, 주황=중등도, 앰버=경도, 그린=정상
const SEVERITY_COLORS: Record<Severity, string> = {
  정상: "#22C55E",
  경도제한: "#F59E0B",
  중등도제한: "#FB923C",
  심각한제한: "#EF4444",
};

const SEVERITY_LABELS: Record<Severity, string> = {
  정상: "정상",
  경도제한: "경도",
  중등도제한: "중등도",
  심각한제한: "심각",
};

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

  // VAS 추이 (측정 2회 이상이면 스파크라인)
  const vasData = useMemo(
    () =>
      history
        .slice()
        .reverse()
        .map((s, i) => ({ session: i + 1, vas: s.vasScore ?? 0 })),
    [history],
  );
  const showVasTrend = vasData.length >= 2;

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

  const vasDelta =
    showVasTrend && vasData.length >= 2
      ? vasData[vasData.length - 1].vas - vasData[0].vas
      : 0;
  const vasTrendLabel =
    vasDelta < 0 ? "개선 중" : vasDelta > 0 ? "악화" : "변화 없음";
  const vasTrendColor =
    vasDelta < 0 ? "#22C55E" : vasDelta > 0 ? "#EF4444" : "#5C6BC0";

  // Y축 동적 도메인 — 변화폭이 작아도 그래프에 뚜렷하게 보이도록
  const vasValues = vasData.map((d) => d.vas);
  const vasMin = vasValues.length ? Math.min(...vasValues) : 0;
  const vasMax = vasValues.length ? Math.max(...vasValues) : 10;
  const vasDomain: [number, number] = [
    Math.max(0, vasMin - 1),
    Math.min(10, vasMax + 1),
  ];
  const gradientId = `vas-trend-gradient-${patientId}`;

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
              <span
                className="joint-row__badge"
                style={{
                  background: `${SEVERITY_COLORS[j.worst]}1F`,
                  color: SEVERITY_COLORS[j.worst],
                }}
              >
                {SEVERITY_LABELS[j.worst]}
              </span>
            </div>
          ))}
        </div>
      )}

      {showVasTrend && (
        <div className="home-summary__trend">
          <div className="trend-header">
            <span>통증 지수 변화</span>
            <span className="trend-header__meta">
              {vasData[0].vas} → {vasData[vasData.length - 1].vas}
              <span
                className="trend-header__delta"
                style={{ color: vasTrendColor }}
              >
                · {vasTrendLabel}
              </span>
            </span>
          </div>
          <ResponsiveContainer width="100%" height={72}>
            <AreaChart
              data={vasData}
              margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={vasTrendColor}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor={vasTrendColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <YAxis hide domain={vasDomain} />
              <Area
                type="monotone"
                dataKey="vas"
                stroke={vasTrendColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={{ r: 3, fill: vasTrendColor, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
