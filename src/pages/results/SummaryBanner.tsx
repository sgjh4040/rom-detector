// SummaryBanner.tsx — Results 상단 요약 배너 (제한 동작 N개 / 전 동작 정상).
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface SummaryBannerProps {
  totalLimited: number;
  summarySentence: string;
}

export const SummaryBanner: React.FC<SummaryBannerProps> = ({
  totalLimited,
  summarySentence,
}) => {
  const isLimited = totalLimited > 0;
  const accent = isLimited ? "var(--color-destructive)" : "oklch(0.55 0.15 150)";

  return (
    <div
      className="rounded-xl border-l-4 p-4"
      style={{
        background: `color-mix(in oklch, ${accent} 8%, var(--color-card))`,
        borderLeftColor: accent,
        borderTop: `1px solid color-mix(in oklch, ${accent} 20%, transparent)`,
        borderRight: `1px solid color-mix(in oklch, ${accent} 20%, transparent)`,
        borderBottom: `1px solid color-mix(in oklch, ${accent} 20%, transparent)`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in oklch, ${accent} 18%, transparent)`, color: accent }}
        >
          {isLimited ? <AlertTriangle className="size-5" /> : <CheckCircle className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="text-sm font-bold leading-tight"
            style={{ color: accent }}
          >
            {isLimited
              ? `제한 동작 ${totalLimited}개 발견`
              : "전 동작 정상 범위 도달"}
          </div>
          <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--color-foreground)]">
            {summarySentence}
          </p>
        </div>
      </div>
    </div>
  );
};
