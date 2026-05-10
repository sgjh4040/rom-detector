// SparklineCard.tsx — 관절 동작별 추이를 한 눈에 보여주는 미니 카드.
// 상단: 동작명 + (좌/우) / 중앙: 최신 값 + 델타 / 하단: 차트는 SparklineFooter 가 담당.
// audit #13: 하단 차트 분기 분리.
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SparklineFooter } from "./SparklineFooter";

interface DataPoint {
  label: string;
  value: number;
}

interface SparklineCardProps {
  /** 메인 라벨 — 동작명 (예: "굴곡") */
  label: string;
  /** 보조 라벨 — 좌/우 구분이 필요한 경우 (예: "좌측") */
  sublabel?: string;
  /** 시계열 데이터 (오래된 순) */
  data: DataPoint[];
  /** 단위 (기본 "°") */
  unit?: string;
  /** 하이라이트 상태 (현재 확장 중인 카드) */
  isActive?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** VAS 처럼 값이 낮을수록 좋은 지표 */
  lowerIsBetter?: boolean;
  /** 정상 가동범위 — n=1 일 때 하단 진행률 바 표시에 사용 */
  normalRange?: number;
}

export const SparklineCard: React.FC<SparklineCardProps> = ({
  label,
  sublabel,
  data,
  unit = "°",
  isActive = false,
  onClick,
  lowerIsBetter = false,
  normalRange,
}) => {
  if (data.length === 0) return null;

  const latestValue = data[data.length - 1].value;
  const firstValue = data[0].value;
  const delta = latestValue - firstValue;
  const hasMultiplePoints = data.length > 1;

  // 방향 판정 — lowerIsBetter 인 경우 뒤집힘
  const isImproving =
    hasMultiplePoints && (lowerIsBetter ? delta < 0 : delta > 0);
  const isWorsening =
    hasMultiplePoints && (lowerIsBetter ? delta > 0 : delta < 0);

  const deltaColor = isImproving
    ? "#10b981" // emerald — 개선
    : isWorsening
      ? "#ef4444" // red — 악화
      : "#9ca3af"; // gray — 변화 없음
  const DeltaIcon = isImproving
    ? TrendingUp
    : isWorsening
      ? TrendingDown
      : Minus;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "14px",
        borderRadius: "var(--radius-md)",
        border: isActive
          ? "2px solid var(--primary)"
          : "1px solid rgba(0, 0, 0, 0.06)",
        background: isActive
          ? "rgba(92, 107, 192, 0.08)"
          : "rgba(255, 255, 255, 0.7)",
        boxShadow: isActive
          ? "0 4px 16px rgba(92, 107, 192, 0.15)"
          : "0 1px 3px rgba(0, 0, 0, 0.04)",
        cursor: onClick ? "pointer" : "default",
        textAlign: "left",
        transition: "all 0.2s ease",
        minHeight: "120px",
        fontFamily: "inherit",
      }}
    >
      {/* 라벨 row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 800,
            color: "var(--text-primary)",
          }}
        >
          {label}
        </span>
        {sublabel && (
          <span
            style={{
              fontSize: "var(--text-2xs)",
              fontWeight: 700,
              color: "var(--text-secondary)",
              opacity: 0.7,
            }}
          >
            {sublabel}
          </span>
        )}
      </div>

      {/* 최신 값 (크게) + 델타 뱃지 */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "6px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
          <span
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {latestValue}
          </span>
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--text-secondary)",
              opacity: 0.65,
            }}
          >
            {unit}
          </span>
        </div>

        {hasMultiplePoints && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "var(--text-xs)",
              fontWeight: 800,
              color: deltaColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <DeltaIcon size={13} strokeWidth={2.5} />
            <span>
              {delta > 0 ? "+" : ""}
              {delta}
              {unit}
            </span>
          </div>
        )}
      </div>

      <SparklineFooter
        data={data}
        unit={unit}
        lowerIsBetter={lowerIsBetter}
        normalRange={normalRange}
        deltaColor={deltaColor}
      />
    </button>
  );
};
