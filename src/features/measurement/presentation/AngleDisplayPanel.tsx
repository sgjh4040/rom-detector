// AngleDisplayPanel.tsx — 각도계 dial + 슬라이더 (redesign-spike).
import React from "react";
import type { Movement } from "../../../lib/romData";
import { AngleDial } from "./AngleDial";

interface AngleDisplayPanelProps {
  activeMov: Movement | undefined;
  activeVal: number;
  handleChange: (val: number) => void;
}

export const AngleDisplayPanel: React.FC<AngleDisplayPanelProps> = ({
  activeMov,
  activeVal,
  handleChange,
}) => {
  const maxVal = Math.max(180, activeMov?.normalRange ?? 180);
  const normalVal = activeMov?.normalRange ?? 0;
  const isNormal = activeVal >= normalVal && normalVal > 0;
  const trackColor = isNormal ? "oklch(0.55 0.15 150)" : "var(--color-accent)";
  const fillPct = (activeVal / maxVal) * 100;
  const normalPct = (normalVal / maxVal) * 100;

  return (
    <div className="flex flex-col gap-5">
      {/* 제목 + 목표 각도 배지 */}
      <div className="text-center">
        <h2 className="text-lg font-extrabold tracking-tight text-[var(--color-foreground)]">
          {activeMov?.name ?? "동작 선택"}
        </h2>
        <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted-foreground)]">
          <span
            className="size-1.5 rounded-full"
            style={{ background: isNormal ? "oklch(0.55 0.15 150)" : "var(--color-muted-foreground)" }}
          />
          목표 각도 <strong className="text-[var(--color-foreground)]">{normalVal}°</strong>
        </div>
      </div>

      {/* 각도 다이얼 */}
      <AngleDial value={activeVal} maxVal={maxVal} normalVal={normalVal} />

      {/* 슬라이더 — 정상 도달 시 그린, 그 외 가민 블루 */}
      <div className="relative pt-2">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[var(--color-muted)] pointer-events-none">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${fillPct}%`, background: trackColor }}
          />
        </div>
        {/* 목표 마커 */}
        {normalVal > 0 && (
          <div
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-3 w-[2px] bg-[var(--color-foreground)] opacity-50"
            style={{ left: `${normalPct}%` }}
          />
        )}
        <input
          type="range"
          min={0}
          max={maxVal}
          value={activeVal}
          onChange={(e) => handleChange(parseInt(e.target.value, 10) || 0)}
          aria-label="각도"
          className="vas-range relative z-10 w-full appearance-none bg-transparent cursor-pointer"
          style={{ ["--vas-color" as never]: trackColor }}
        />
      </div>
      <div className="flex justify-between text-xs font-medium text-[var(--color-muted-foreground)] -mt-2">
        <span>0°</span>
        <span>{maxVal}°</span>
      </div>
    </div>
  );
};
