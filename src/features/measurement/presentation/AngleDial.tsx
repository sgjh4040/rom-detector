// AngleDial.tsx — ROM 측정값을 반원 각도계(goniometer)로 시각화
// 실제 각도가 호의 크기로 보이고, 심각도에 따라 색상이 바뀐다
import React from "react";
import { calculateSeverity } from "../../../lib/romCalculations";
import type { Severity } from "../../../lib/romTypes";

interface Props {
  value: number;
  maxVal: number;
  normalVal: number;
}

// 심각도별 호 색상
const SEVERITY_COLORS: Record<Severity, string> = {
  정상: "#22C55E",
  경도제한: "#F59E0B",
  중등도제한: "#FB923C",
  심각한제한: "#EF4444",
};

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
    <div className="angle-dial">
      <svg viewBox="0 0 220 130" className="angle-dial__svg">
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
            stroke="#5C6BC0"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
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
      <div className="angle-dial__center">
        <div className="angle-dial__value" style={{ color }}>
          {value}
          <span className="angle-dial__unit">°</span>
        </div>
        {normalVal > 0 && (
          <div className="angle-dial__target">
            {isNormal ? (
              <span className="angle-dial__target--normal">
                <span className="angle-dial__target-dot" style={{ background: color }} />
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
