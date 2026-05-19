// AngleDial.tsx — ROM 측정값을 반원 각도계(goniometer)로 시각화
// 실제 각도가 호의 크기로 보이고, 심각도에 따라 색상이 바뀐다
import React from "react";
import { calculateSeverity } from "../../../lib/romCalculations";
import type { Severity } from "../../../lib/romTypes";
// [audit #37] severity 색상은 lib/severityMeta.ts 단일 진실원에서 import.
import { SEVERITY_COLORS } from "../../../lib/severityMeta";

interface Props {
  value: number;
  maxVal: number;
  normalVal: number;
}

// SVG 반원 기하 — 왼쪽 시작점에서 오른쪽 끝점까지 위로 볼록한 반원
const CX = 110;
const CY = 110;
const R = 90;
const START_X = CX - R; // 20
const START_Y = CY; // 110

// 비율(0~1)을 반원 위 좌표 (theta: 0 → 왼쪽 시작, π → 오른쪽 끝)
const ratioToPoint = (ratio: number): { x: number; y: number } => {
  const theta = Math.PI * Math.min(1, Math.max(0, ratio));
  return {
    x: CX - R * Math.cos(theta),
    y: CY - R * Math.sin(theta),
  };
};

// 반경을 바꿔서 호 안/밖의 점을 구한다 — 호에 수직인 tick 그릴 때 사용
const ratioToPointAtRadius = (
  ratio: number,
  radius: number,
): { x: number; y: number } => {
  const theta = Math.PI * Math.min(1, Math.max(0, ratio));
  return {
    x: CX - radius * Math.cos(theta),
    y: CY - radius * Math.sin(theta),
  };
};

export const AngleDial: React.FC<Props> = ({ value, maxVal, normalVal }) => {
  const ratio = Math.min(1, Math.max(0, value / maxVal));
  const { x: endX, y: endY } = ratioToPoint(ratio);

  const normalRatio = normalVal > 0 ? Math.min(1, normalVal / maxVal) : 0;
  // 호에 수직인 tick — 호 중심(R) 기준으로 안/밖 대칭(R±8)
  const TICK_HALF = 8;
  const normalTickInner =
    normalVal > 0 ? ratioToPointAtRadius(normalRatio, R - TICK_HALF) : null;
  const normalTickOuter =
    normalVal > 0 ? ratioToPointAtRadius(normalRatio, R + TICK_HALF) : null;

  // 측정 전(0)이면 중립 회색, 이후는 심각도 기반 색상
  const severity: Severity | null =
    value > 0 && normalVal > 0 ? calculateSeverity(value, normalVal) : null;
  const color = severity ? SEVERITY_COLORS[severity] : "#CBD5E1";
  const isNormal = severity === "정상";

  return (
    <div className="relative w-full max-w-[300px] min-[481px]:max-w-[360px] mx-auto mt-2 mb-5">
      <svg
        viewBox="0 0 220 130"
        className="w-full h-auto block overflow-visible"
      >
        {/* 배경 반원 (연한 회색) */}
        <path
          d={`M ${START_X} ${START_Y} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          stroke="#E5E7EB"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        {/* 목표 각도 tick — 호에 수직(중심점 방향)으로 그린다 */}
        {normalTickInner && normalTickOuter && (
          <line
            x1={normalTickInner.x}
            y1={normalTickInner.y}
            x2={normalTickOuter.x}
            y2={normalTickOuter.y}
            stroke="var(--color-foreground)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        )}
        {/* 현재 값 호 */}
        {value > 0 && (
          <path
            d={`M ${START_X} ${START_Y} A ${R} ${R} 0 0 1 ${endX} ${endY}`}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            style={{ transition: "stroke 0.25s ease" }}
          />
        )}
        {/* 현재 핸들 */}
        {value > 0 && (
          <circle
            cx={endX}
            cy={endY}
            r="8"
            fill={color}
            stroke="#fff"
            strokeWidth="2.5"
            style={{ transition: "fill 0.25s ease" }}
          />
        )}
      </svg>

      {/* 중앙 숫자 (SVG 밖 오버레이로 배치) */}
      <div className="absolute left-1/2 top-[68%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none leading-none">
        <div
          className="text-[2.2rem] min-[481px]:text-[2.8rem] font-black tabular-nums tracking-[-0.02em] transition-colors duration-[250ms]"
          style={{ color }}
        >
          {value}
          <span className="text-[1.1rem] min-[481px]:text-[1.4rem] text-[var(--text-secondary)] ml-[0.1rem] font-bold">
            °
          </span>
        </div>
        {normalVal > 0 && (
          <div className="mt-[0.35rem] text-xs text-[var(--text-secondary)] font-semibold tracking-wide">
            {isNormal ? (
              <span className="inline-flex items-center gap-[0.3rem] text-[#22C55E] font-extrabold">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: color }}
                />
                정상 범위
              </span>
            ) : (
              <span>목표 {normalVal}°</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
