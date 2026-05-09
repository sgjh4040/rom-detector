// VasTrendSparkline.tsx — 환자의 VAS 점수 추이 스파크라인 (audit #13).
// HomePatientSummary 카드 안에서 사용. 측정 2회 이상일 때만 노출하는 게 호출 측 책임.
import React, { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import type { RomSession } from "../../../lib/romTypes";

interface VasTrendSparklineProps {
  /** 환자의 측정 히스토리 (newest-first 정렬). 차트는 내부에서 reverse 후 시간순으로 렌더 */
  history: RomSession[];
  /** SVG gradient id 충돌 방지를 위한 환자 식별자 */
  patientId: string;
}

export const VasTrendSparkline: React.FC<VasTrendSparklineProps> = ({
  history,
  patientId,
}) => {
  const vasData = useMemo(
    () =>
      history
        .slice()
        .reverse()
        .map((s, i) => ({ session: i + 1, vas: s.vasScore ?? 0 })),
    [history],
  );

  const vasDelta =
    vasData.length >= 2
      ? vasData[vasData.length - 1].vas - vasData[0].vas
      : 0;
  const vasTrendLabel =
    vasDelta < 0 ? "개선 중" : vasDelta > 0 ? "악화" : "변화 없음";
  const vasTrendColor =
    vasDelta < 0
      ? "var(--success)"
      : vasDelta > 0
        ? "var(--danger)"
        : "var(--primary)";

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
              <stop offset="0%" stopColor={vasTrendColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={vasTrendColor} stopOpacity={0} />
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
  );
};
