// SparklineFooter.tsx — SparklineCard 하단 차트 영역 (redesign-spike).
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
  /** 델타 색상 (부모가 계산) */
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

  // n>=2: SVG 라인
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
        className="block mt-auto"
        aria-hidden
      >
        <path
          d={pathD}
          fill="none"
          stroke={deltaColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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

  // n=1 + normalRange: 정상 대비 progress bar
  if (normalRange !== undefined) {
    const ratio = lowerIsBetter
      ? (normalRange - latestValue) / normalRange
      : latestValue / normalRange;
    const widthPct = Math.max(0, Math.min(100, ratio * 100));

    return (
      <div className="mt-auto flex flex-col gap-1" style={{ height: HEIGHT }}>
        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-muted)] mt-auto">
          <div
            className="h-full rounded-full bg-[var(--color-foreground)] opacity-50"
            style={{ width: `${widthPct}%` }}
          />
        </div>
        <div className="flex justify-end text-[10px] font-semibold text-[var(--color-muted-foreground)]">
          정상 {normalRange}
          {unit}
        </div>
      </div>
    );
  }

  // n=1, normalRange 없음
  return (
    <div
      className="mt-auto flex items-center justify-center text-[10px] font-semibold text-[var(--color-muted-foreground)] opacity-60"
      style={{ height: HEIGHT }}
      aria-hidden
    >
      측정 1회
    </div>
  );
};
