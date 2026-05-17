// TrendGraph.tsx — recharts 라인 차트 (redesign-spike, Garmin 톤).
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  label: string;
  value: number;
}

interface TrendGraphProps {
  data: DataPoint[];
  normalRange?: number;
  targetValue?: number;
  unit?: string;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({
  data,
  normalRange = 180,
  targetValue,
  unit = "°",
}) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-[var(--color-muted-foreground)]">
        데이터가 없습니다
      </div>
    );
  }

  const referenceValue = targetValue ?? normalRange;
  const referenceLabel =
    targetValue !== undefined
      ? `목표 ${targetValue}${unit}`
      : `정상 ${normalRange}${unit}`;
  const maxVal = Math.max(...data.map((d) => d.value), normalRange, referenceValue);
  const yMax = Math.ceil(maxVal * 1.1);

  // 한 점만 있을 때는 dot 만 보여줘서 차트 형태 유지
  const isSinglePoint = data.length === 1;

  return (
    <div className="w-full" style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 60, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis
            dataKey="label"
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 11, fontWeight: 600, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
          />
          <YAxis
            stroke="var(--color-muted-foreground)"
            domain={[0, yMax]}
            allowDecimals={false}
            tick={{ fontSize: 11, fontWeight: 600, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            width={42}
          />
          <Tooltip
            cursor={{
              stroke: "var(--color-foreground)",
              strokeWidth: 1,
              strokeDasharray: "2 2",
              opacity: 0.3,
            }}
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--color-foreground)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
            labelStyle={{
              color: "var(--color-muted-foreground)",
              fontWeight: 600,
              fontSize: 11,
              marginBottom: 2,
            }}
            formatter={(value) => [`${value}${unit}`, "값"]}
          />
          <ReferenceLine
            y={referenceValue}
            stroke="var(--color-accent)"
            strokeDasharray="6 6"
            strokeWidth={1.5}
            opacity={0.7}
            label={{
              value: referenceLabel,
              position: "right",
              fill: "var(--color-accent)",
              fontSize: 11,
              fontWeight: 700,
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-foreground)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={{
              fill: "var(--color-card)",
              stroke: "var(--color-foreground)",
              strokeWidth: 2,
              r: isSinglePoint ? 5 : 3.5,
            }}
            activeDot={{
              fill: "var(--color-accent)",
              stroke: "var(--color-accent)",
              strokeWidth: 2,
              r: 5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
