// PlayerHeader.tsx — CesExercisePlayer 의 4행 헤더 (audit #13 분리).
// 1행: 단계 뱃지 + 순번  /  2행: 운동 이름  /  3행: 도구 + 메타  /  4행: 설명.
import React from "react";
import type { CesExercise } from "../../../lib/ces/cesTypes";
import { Wrench } from "lucide-react";
import { STAGE_LABEL_MAP, formatExMeta } from "./helpers";

interface PlayerHeaderProps {
  current: CesExercise;
  stageId: string;
  activeIndex: number;
  total: number;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  current,
  stageId,
  activeIndex,
  total,
}) => {
  const stage = STAGE_LABEL_MAP[stageId] ?? { label: stageId, color: "var(--primary)" };

  return (
    <div className="main-header">
      {/* 1행: 단계 뱃지 + 순번 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <span
          className="phase-badge phase-badge--sm"
          style={{ gap: "5px", background: stage.color }}
        >
          {stage.label}
        </span>
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--text-secondary)",
            opacity: 0.7,
          }}
        >
          {activeIndex + 1} / {total}
        </span>
      </div>

      {/* 2행: 운동 이름 (크게) */}
      <h2
        style={{
          fontSize: "var(--text-xl)",
          fontWeight: 900,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
          marginBottom: "6px",
        }}
      >
        {current.name}
      </h2>

      {/* 3행: 도구 + 시간/세트 메타 (한 줄) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "8px",
        }}
      >
        {current.tools && (
          <span
            className="icon-text icon-text--sm"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              color: "var(--text-secondary)",
            }}
          >
            <Wrench size={13} /> {current.tools}
          </span>
        )}
        {(current.tools && formatExMeta(current)) && (
          <span style={{ color: "var(--text-secondary)", opacity: 0.4 }}>·</span>
        )}
        <span
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 700,
            color: "var(--primary)",
          }}
        >
          {formatExMeta(current)}
        </span>
      </div>

      {/* 4행: 설명 */}
      {current.description && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: "4px",
          }}
        >
          {current.description}
        </p>
      )}
    </div>
  );
};
