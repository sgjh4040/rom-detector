// PainAssessment.tsx — 통증 부위 + VAS 통증 지수 (redesign-spike).
// 네우몰피즘 제거, 가민 블루 톤 + 깔끔한 슬라이더.
import React from "react";
import { Input } from "../../../components/redesign/ui/Input";

interface PainAssessmentProps {
  painArea: string;
  setPainArea: (val: string) => void;
  vasScore: number;
  setVasScore: (val: number) => void;
}

// VAS 점수에 따른 색상 — 0~3 정상 그린 / 4~6 주황 / 7~10 빨강
const vasColor = (score: number): string => {
  if (score <= 3) return "oklch(0.55 0.15 150)";
  if (score <= 6) return "oklch(0.72 0.16 70)";
  return "var(--color-destructive)";
};

const vasLabel = (score: number): string => {
  if (score === 0) return "통증 없음";
  if (score <= 3) return "경미";
  if (score <= 6) return "중간";
  if (score <= 8) return "심함";
  return "매우 심함";
};

export const PainAssessment: React.FC<PainAssessmentProps> = ({
  painArea,
  setPainArea,
  vasScore,
  setVasScore,
}) => {
  const color = vasColor(vasScore);
  const percent = (vasScore / 10) * 100;

  return (
    <div className="flex flex-col gap-5">
      {/* 통증 부위 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="painArea"
          className="text-sm font-semibold text-[var(--color-foreground)]"
        >
          통증 부위
        </label>
        <Input
          id="painArea"
          type="text"
          placeholder="예: 오른쪽 어깨"
          value={painArea}
          onChange={(e) => setPainArea(e.target.value)}
        />
      </div>

      {/* VAS 통증 지수 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <label className="text-sm font-semibold text-[var(--color-foreground)]">
            통증 지수{" "}
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
              VAS
            </span>
          </label>
          <span className="text-xs font-bold" style={{ color }}>
            {vasLabel(vasScore)}
          </span>
        </div>

        {/* 큰 숫자 표시 */}
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-mono text-5xl font-bold tabular-nums leading-none transition-colors"
            style={{ color }}
          >
            {vasScore}
          </span>
          <span className="text-base font-mono text-[var(--color-muted-foreground)]">
            / 10
          </span>
        </div>

        {/* 슬라이더 */}
        <div className="relative pt-2">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[var(--color-muted)] pointer-events-none">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${percent}%`, background: color }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={vasScore}
            onChange={(e) => setVasScore(parseInt(e.target.value, 10))}
            aria-label="통증 지수"
            className="vas-range relative z-10 w-full appearance-none bg-transparent cursor-pointer"
            style={{ ["--vas-color" as never]: color }}
          />
        </div>

        {/* 라벨 */}
        <div className="flex justify-between text-xs font-medium text-[var(--color-muted-foreground)]">
          <span>없음 0</span>
          <span>중간 5</span>
          <span>극심 10</span>
        </div>
      </div>
    </div>
  );
};
