import React, { useEffect, useRef } from "react";
import type { CesExercise } from "../../lib/ces/cesTypes";
import { YoutubePlayer } from "./YoutubePlayer";
import { Wrench, PlayCircle } from "lucide-react";

interface CesExercisePlayerProps {
  exercises: CesExercise[];
  stageId: string;
  activeIndex: number;
  onIndexChange: (idx: number) => void;
}

const STAGE_CODE_MAP: Record<string, string> = {
  inhibit: "H",
  lengthen: "L",
  activate: "A",
  integrate: "I",
};

const formatExMeta = (ex: CesExercise): string => {
  const parts: string[] = [];
  if (ex.sets) parts.push(`${ex.sets}세트`);
  if (ex.reps) parts.push(`${ex.reps}회`);
  if (ex.holdSeconds) parts.push(`${ex.holdSeconds}초 유지`);
  return parts.length > 0 ? parts.join(" · ") : ex.tools || "";
};

export const CesExercisePlayer: React.FC<CesExercisePlayerProps> = ({
  exercises,
  stageId,
  activeIndex,
  onIndexChange,
}) => {
  // 스테이지가 바뀔 때만 인덱스 리셋 (exercises 배열 변경 시 무한 루프 방지)
  const prevStageRef = useRef(stageId);
  useEffect(() => {
    if (prevStageRef.current !== stageId) {
      prevStageRef.current = stageId;
      onIndexChange(0);
    }
  }, [stageId, onIndexChange]);

  if (exercises.length === 0) {
    return (
      <div
        className="flex items-center justify-center font-bold"
        style={{ height: "400px", color: "var(--text-muted)" }}
      >
        해당 단계의 운동이 준비되지 않았습니다.
      </div>
    );
  }

  const current = exercises[activeIndex] || exercises[0];
  const categoryCode = STAGE_CODE_MAP[stageId] || "R";

  // 단계 라벨 매핑
  const stageLabel: Record<string, { label: string; color: string }> = {
    inhibit: { label: "억제", color: "#fbbf24" },
    lengthen: { label: "신장", color: "#60a5fa" },
    activate: { label: "활성", color: "#f87171" },
    integrate: { label: "통합", color: "#4ade80" },
  };
  const stage = stageLabel[stageId] ?? { label: stageId, color: "#6366f1" };

  return (
    <div className="flex flex-col h-full">
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
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "0.25rem 0.7rem",
              borderRadius: "999px",
              background: stage.color,
              color: "#fff",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.03em",
            }}
          >
            {stage.label}
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              opacity: 0.7,
            }}
          >
            {activeIndex + 1} / {exercises.length}
          </span>
        </div>

        {/* 2행: 운동 이름 (크게) */}
        <h2
          style={{
            fontSize: "1.5rem",
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
              className="flex items-center gap-1"
              style={{
                fontSize: "0.8rem",
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
              fontSize: "0.8rem",
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
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "4px",
            }}
          >
            {current.description}
          </p>
        )}
      </div>

      <div
        className="overflow-hidden"
        style={{
          borderRadius: "4px",
          background: "#000",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <YoutubePlayer youtubeId={current.youtubeId} />
      </div>

      {/* 운동 리스트 — 깔끔한 행 스타일. 유튜브 ID 있으면 미니 썸네일, 없으면 카테고리 닷 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginTop: "1.25rem",
        }}
      >
        {exercises.map((ex, idx) => {
          const isActive = idx === activeIndex;
          const hasVideo = !!ex.youtubeId;
          const thumbUrl = hasVideo
            ? `https://img.youtube.com/vi/${ex.youtubeId}/mqdefault.jpg`
            : null;

          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => onIndexChange(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 14px",
                borderRadius: "14px",
                border: isActive
                  ? "2px solid var(--primary)"
                  : "1px solid rgba(0, 0, 0, 0.06)",
                background: isActive
                  ? "rgba(92, 107, 192, 0.08)"
                  : "rgba(255, 255, 255, 0.65)",
                boxShadow: isActive
                  ? "0 4px 14px rgba(92, 107, 192, 0.12)"
                  : "0 1px 3px rgba(0, 0, 0, 0.03)",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
              }}
            >
              {/* 좌측: 썸네일 or 카테고리 닷 */}
              {thumbUrl ? (
                <div
                  style={{
                    width: "56px",
                    height: "38px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <img
                    src={thumbUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: isActive ? 1 : 0.75,
                    }}
                  />
                  {!isActive && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.3)",
                      }}
                    >
                      <PlayCircle size={18} color="white" />
                    </div>
                  )}
                </div>
              ) : (
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: isActive ? "var(--primary)" : "rgba(0,0,0,0.15)",
                    flexShrink: 0,
                    marginLeft: "2px",
                    transition: "background 0.15s",
                  }}
                />
              )}

              {/* 중앙: 운동명 + 도구 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                      opacity: 0.7,
                    }}
                  >
                    {categoryCode}
                  </span>
                  <span
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: isActive ? 800 : 700,
                      color: isActive
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ex.name}
                  </span>
                </div>
                {ex.tools && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      opacity: 0.65,
                    }}
                  >
                    {ex.tools}
                  </span>
                )}
              </div>

              {/* 우측: 시간/세트 정보 */}
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: isActive ? "var(--primary)" : "var(--text-secondary)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {formatExMeta(ex)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
