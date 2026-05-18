// MovementBar.tsx — Results 페이지 단일 movement 측정 결과 행 (redesign-spike).
// 기존 MovementResultRow + AssessmentBar 를 한 컴포넌트로 통합, 톤만 새로.
import * as React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { Severity } from "../../../lib/romTypes";
import { SEVERITY_COLORS, SEVERITY_SHORT_LABELS } from "../../../lib/severityMeta";

interface MovementBarProps {
  name: string;
  measured: number;
  normalRange: number;
  severity: Severity;
  isQualitative?: boolean;
}

export const MovementBar: React.FC<MovementBarProps> = ({
  name,
  measured,
  normalRange,
  severity,
  isQualitative,
}) => {
  const color = SEVERITY_COLORS[severity];
  const isLimited = severity !== "정상";

  // 정량 측정: 비율 계산
  const ratio =
    normalRange === 0
      ? 1
      : Math.min(Math.max(measured / normalRange, 0), 1);
  const percent = Math.round(ratio * 100);
  const remaining = Math.max(0, normalRange - Math.max(0, measured));

  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-4 py-3 border-b border-[var(--color-border)] last:border-b-0">
      {/* 좌측: 동작명 + 심각도 배지 */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-[var(--color-foreground)] break-keep">
          {name}
        </span>
        <span
          className="inline-flex w-fit items-center rounded-md px-1.5 py-0.5 text-[11px] font-bold"
          style={{
            background: `${color}1f`,
            color,
            border: `1px solid ${color}33`,
          }}
        >
          {SEVERITY_SHORT_LABELS[severity]}
        </span>
      </div>

      {/* 우측: 정성 평가 또는 progress bar */}
      <div className="min-w-0">
        {isQualitative ? (
          <div
            className="flex items-center gap-1.5 text-sm font-bold"
            style={{ color }}
          >
            {measured === 1 ? (
              <>
                <AlertTriangle className="size-4" />
                특이사항 발견
              </>
            ) : (
              <>
                <CheckCircle className="size-4" />
                정상 범위
              </>
            )}
          </div>
        ) : (
          <>
            {/* 라벨 — 0° 와 정상 범위 */}
            <div className="flex justify-between text-xs font-medium text-[var(--color-muted-foreground)] mb-2">
              <span>0°</span>
              <span>정상 {normalRange}°</span>
            </div>

            {/* 트랙 + 바 + 마커 */}
            <div className="relative h-1.5 w-full rounded-full bg-[var(--color-muted)]">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${percent}%`,
                  background: color,
                }}
              />
              {percent > 0 && percent < 100 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full border-2 bg-[var(--color-card)]"
                  style={{
                    left: `${percent}%`,
                    transform: "translate(-50%, -50%)",
                    borderColor: color,
                  }}
                />
              )}
            </div>

            {/* 보조 텍스트 — 측정값 + 진척률 */}
            <div className="mt-1.5 flex items-baseline justify-between">
              <span
                className="font-mono text-base font-bold tabular-nums"
                style={{ color }}
              >
                {measured}°
              </span>
              <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
                {isLimited ? (
                  <>정상 대비 {percent}% · {remaining}° 부족</>
                ) : (
                  <>정상 범위 도달</>
                )}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
