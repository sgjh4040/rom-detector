import React, { useState } from "react";
import type { CesExercise, CesStage } from "../../lib/ces/cesTypes";
import { YoutubePlayer } from "./YoutubePlayer";
import { CircleSlash, Accessibility, CheckCircle2, Activity, ChevronUp, ChevronDown, Wrench } from "lucide-react";

const STAGE_META: Record<
  CesStage,
  { label: string; color: string; icon: React.ReactNode; bg: string }
> = {
  inhibit: {
    label: "1단계: 억제 (Inhibit)",
    icon: <CircleSlash size={18} color="currentColor" />,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
  },
  lengthen: {
    label: "2단계: 신장 (Lengthen)",
    icon: <Accessibility size={18} color="currentColor" />,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
  },
  activate: {
    label: "3단계: 활성화 (Activate)",
    icon: <CheckCircle2 size={18} color="currentColor" />,
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
  },
  integrate: {
    label: "4단계: 통합 (Integrate)",
    icon: <Activity size={18} color="currentColor" />,
    color: "#4ade80",
    bg: "rgba(74,222,128,0.08)",
  },
};

interface Props {
  stage: CesStage;
  exercises: CesExercise[];
  /** 접기/펼치기 초기 상태 */
  defaultOpen?: boolean;
}

export const CesStageCard: React.FC<Props> = ({
  stage,
  exercises,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeIdx, setActiveIdx] = useState(0);
  const meta = STAGE_META[stage];
  const current = exercises[activeIdx];

  if (exercises.length === 0) return null;

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${meta.color}33`,
        marginBottom: "1.5rem",
      }}
    >
      {/* 헤더 */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          backgroundColor: meta.bg,
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          className="flex items-center gap-2"
          style={{ fontSize: "1.05rem", fontWeight: 700, color: meta.color }}
        >
          {meta.icon} {meta.label}
        </span>
        <span className="flex items-center" style={{ color: meta.color }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: "1.25rem" }}>
          {/* 운동 탭 선택 */}
          {exercises.length > 1 && (
            <div className="flex gap-2 mb-4" style={{ flexWrap: "wrap" }}>
              {exercises.map((ex, i) => (
                <button
                  key={ex.id}
                  type="button"
                  className={`btn ${i === activeIdx ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.8rem", padding: "0.3rem 0.75rem" }}
                  onClick={() => setActiveIdx(i)}
                >
                  {i + 1}. {ex.name}
                </button>
              ))}
            </div>
          )}

          {/* 현재 운동 */}
          {current && (
            <>
              <YoutubePlayer
                youtubeId={current.youtubeId}
                title={current.name}
              />
              <div style={{ marginTop: "1rem" }}>
                <h3 style={{ marginBottom: "0.5rem" }}>{current.name}</h3>
                {current.tools && (
                  <p
                    className="flex items-center gap-1"
                    style={{
                      fontSize: "0.8rem",
                      color: meta.color,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Wrench size={14} /> 준비물: {current.tools}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                  }}
                >
                  {current.description}
                </p>
                <div
                  className="flex gap-3"
                  style={{ marginTop: "0.75rem", fontSize: "0.875rem" }}
                >
                  {current.sets && (
                    <span className="badge badge-success">
                      세트: {current.sets}
                    </span>
                  )}
                  {current.reps && (
                    <span className="badge badge-success">
                      횟수: {current.reps}회
                    </span>
                  )}
                  {current.holdSeconds && (
                    <span className="badge badge-warning">
                      유지: {current.holdSeconds}초
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
