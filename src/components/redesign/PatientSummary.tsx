import * as React from "react";
import { Play, LineChart } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface PatientSummaryProps {
  name: string;
  age?: string;
  painArea?: string;
  vasScore: number;
  historyCount: number;
  lastMeasuredAt?: string;
  onStartMeasurement: () => void;
  onViewTrends: () => void;
}

/**
 * 환자 요약 — Athletic Performance 톤 (Strava/WHOOP 풍, 2026-05-17).
 * - 3개 stat 그리드: VAS / SESSIONS / LAST
 * - 오렌지 액센트 = VAS 숫자, progress bar, primary CTA
 * - 영문 대문자 라벨 + 와이드 트래킹
 * - 매우 굵은 sans + mono tabular nums
 */
const fmtLast = (iso?: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const days = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 30) return `${days}일`;
  return `${Math.floor(days / 30)}달`;
};

const Stat: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: boolean;
}> = ({ label, value, sub, accent }) => (
  <div className="flex flex-col gap-1">
    <div className="text-xs font-semibold text-[var(--color-muted-foreground)]">
      {label}
    </div>
    <div className="flex items-baseline gap-1">
      <span
        className={
          "font-mono text-4xl font-bold tabular-nums leading-none " +
          (accent ? "text-[var(--color-accent)]" : "text-[var(--color-foreground)]")
        }
      >
        {value}
      </span>
      {sub && (
        <span className="text-sm font-mono font-semibold text-[var(--color-muted-foreground)]">
          {sub}
        </span>
      )}
    </div>
  </div>
);

export const PatientSummary: React.FC<PatientSummaryProps> = ({
  name,
  age,
  painArea,
  vasScore,
  historyCount,
  lastMeasuredAt,
  onStartMeasurement,
  onViewTrends,
}) => (
  <Card className="overflow-hidden">
    {/* 헤더 — 환자 이름 강조 */}
    <div className="border-b border-[var(--color-border)] p-5 pb-4">
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-extrabold tracking-tight truncate text-[var(--color-foreground)]">
          {name || "이름 없음"}
        </h2>
        {age && (
          <span className="text-sm font-semibold text-[var(--color-muted-foreground)]">
            {age}세
          </span>
        )}
      </div>
      {painArea && (
        <p className="mt-1 text-sm font-medium text-[var(--color-muted-foreground)]">
          주 호소 · {painArea}
        </p>
      )}
    </div>

    {/* 3-stat 그리드 */}
    <div className="grid grid-cols-3 gap-4 p-5 pt-4">
      <Stat label="VAS 통증" value={vasScore} sub="/ 10" accent />
      <Stat label="측정" value={historyCount} sub="회" />
      <Stat label="최근 측정" value={fmtLast(lastMeasuredAt)} />
    </div>

    {/* VAS progress bar — 오렌지 */}
    <div className="px-5 pb-4">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all"
          style={{ width: `${(vasScore / 10) * 100}%` }}
        />
      </div>
    </div>

    {/* CTA — Primary 는 오렌지 (액션 우선), Secondary 는 outline */}
    <div className="flex gap-2 border-t border-[var(--color-border)] p-3">
      <Button
        onClick={onStartMeasurement}
        className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-accent-foreground)]"
        size="lg"
      >
        <Play className="size-4" />새 측정 시작
      </Button>
      <Button
        onClick={onViewTrends}
        disabled={historyCount === 0}
        variant="outline"
        size="lg"
        className="flex-1"
      >
        <LineChart className="size-4" />
        {historyCount === 0 ? "기록 없음" : "기록 보기"}
      </Button>
    </div>
  </Card>
);
