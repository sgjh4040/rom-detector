// SparklineFooter.tsx — SparklineCard 의 하단 차트 영역 (audit #13).
// 분기: n>=2 → SVG sparkline / n=1 + normalRange → 정상 대비 progress bar / 그 외 → "측정 1회".
import React from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface SparklineFooterProps {
  data: DataPoint[];
  unit: string;
  lowerIsBetter: boolean;
  normalRange?: number;
  /** 델타 색상 (개선/악화/변화없음) — 부모 카드에서 계산해 주입 */
  deltaColor: string;
}

const WIDTH = 140;
const HEIGHT = 36;
const PADDING = 3;

export const SparklineFooter: React.FC<SparklineFooterProps> = ({
  data,
  unit,
  lowerIsBetter,
  normalRange,
  deltaColor,
}) => {
  const hasMultiplePoints = data.length > 1;
  const latestValue = data[data.length - 1].value;

  // n>=2: SVG sparkline 라인
  if (hasMultiplePoints) {
    const values = data.map((d) => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const getX = (i: number): number =>
      PADDING + (i / (data.length - 1)) * (WIDTH - PADDING * 2);
    const getY = (v: number): number =>
      PADDING + (1 - (v - minVal) / range) * (HEIGHT - PADDING * 2);

    const pathD = data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)},${getY(d.value)}`)
      .join(" ");

    return (
      <svg
        width="100%"
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        style={{ display: "block", marginTop: "auto" }}
        aria-hidden="true"
      >
        <path
          d={pathD}
          fill="none"
          stroke={deltaColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d.value)}
            r={i === data.length - 1 ? 2.8 : 1.6}
            fill={deltaColor}
          />
        ))}
      </svg>
    );
  }

  // n=1 + normalRange 있음: 정상 대비 progress bar
  if (normalRange !== undefined) {
    const ratio = lowerIsBetter
      ? (normalRange - latestValue) / normalRange
      : latestValue / normalRange;
    const widthPct = Math.max(0, Math.min(100, ratio * 100));

    return (
      <div
        style={{
          marginTop: "auto",
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 4,
        }}
        aria-hidden="true"
      >
        <div
          style={{
            height: 4,
            borderRadius: 4,
            background: "rgba(0, 0, 0, 0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${widthPct}%`,
              background: "var(--text-primary)",
              opacity: 0.5,
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: "var(--text-2xs)",
            fontWeight: 700,
            color: "var(--text-secondary)",
            opacity: 0.6,
          }}
        >
          정상 {normalRange}
          {unit}
        </div>
      </div>
    );
  }

  // n=1, normalRange 없음: "측정 1회" 안내
  return (
    <div
      style={{
        height: HEIGHT,
        marginTop: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--text-2xs)",
        fontWeight: 700,
        color: "var(--text-secondary)",
        opacity: 0.35,
        letterSpacing: "0.04em",
      }}
      aria-hidden="true"
    >
      측정 1회
    </div>
  );
};
